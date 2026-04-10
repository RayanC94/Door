#!/usr/bin/env python3

from __future__ import annotations

import argparse
import struct
import zlib
from collections import deque
from pathlib import Path


PNG_SIGNATURE = b"\x89PNG\r\n\x1a\n"


def read_png(path: Path) -> tuple[int, int, bytearray]:
    data = path.read_bytes()
    if data[:8] != PNG_SIGNATURE:
        raise ValueError(f"{path} is not a PNG file")

    width = height = None
    bit_depth = color_type = interlace = None
    chunks: list[tuple[bytes, bytes]] = []
    cursor = 8

    while cursor < len(data):
        length = struct.unpack(">I", data[cursor : cursor + 4])[0]
        chunk_type = data[cursor + 4 : cursor + 8]
        chunk_data = data[cursor + 8 : cursor + 8 + length]
        chunks.append((chunk_type, chunk_data))
        cursor += length + 12
        if chunk_type == b"IEND":
            break

    idat = bytearray()
    for chunk_type, chunk_data in chunks:
        if chunk_type == b"IHDR":
            width, height, bit_depth, color_type, _, _, interlace = struct.unpack(
                ">IIBBBBB", chunk_data
            )
        elif chunk_type == b"IDAT":
            idat.extend(chunk_data)

    if None in {width, height, bit_depth, color_type, interlace}:
        raise ValueError(f"{path} is missing required PNG chunks")
    if bit_depth != 8 or color_type != 6 or interlace != 0:
        raise ValueError(
            f"{path} must be 8-bit RGBA without interlacing (got bit depth {bit_depth}, color type {color_type}, interlace {interlace})"
        )

    raw = zlib.decompress(bytes(idat))
    stride = width * 4
    pixels = bytearray(width * height * 4)
    source = 0
    previous = bytes(stride)

    for row in range(height):
        filter_type = raw[source]
        source += 1
        filtered = raw[source : source + stride]
        source += stride

        current = bytearray(stride)
        if filter_type == 0:
            current[:] = filtered
        elif filter_type == 1:
            for index in range(stride):
                left = current[index - 4] if index >= 4 else 0
                current[index] = (filtered[index] + left) & 0xFF
        elif filter_type == 2:
            for index in range(stride):
                current[index] = (filtered[index] + previous[index]) & 0xFF
        elif filter_type == 3:
            for index in range(stride):
                left = current[index - 4] if index >= 4 else 0
                up = previous[index]
                current[index] = (filtered[index] + ((left + up) // 2)) & 0xFF
        elif filter_type == 4:
            for index in range(stride):
                left = current[index - 4] if index >= 4 else 0
                up = previous[index]
                up_left = previous[index - 4] if index >= 4 else 0
                predictor = paeth(left, up, up_left)
                current[index] = (filtered[index] + predictor) & 0xFF
        else:
            raise ValueError(f"{path} uses unsupported PNG filter type {filter_type}")

        start = row * stride
        pixels[start : start + stride] = current
        previous = bytes(current)

    return width, height, pixels


def write_png(path: Path, width: int, height: int, pixels: bytearray) -> None:
    stride = width * 4
    raw = bytearray()
    for row in range(height):
        raw.append(0)
        start = row * stride
        raw.extend(pixels[start : start + stride])

    compressed = zlib.compress(bytes(raw), level=9)
    ihdr = struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0)
    chunks = [
        build_chunk(b"IHDR", ihdr),
        build_chunk(b"IDAT", compressed),
        build_chunk(b"IEND", b""),
    ]
    path.write_bytes(PNG_SIGNATURE + b"".join(chunks))


def paeth(a: int, b: int, c: int) -> int:
    predictor = a + b - c
    pa = abs(predictor - a)
    pb = abs(predictor - b)
    pc = abs(predictor - c)
    if pa <= pb and pa <= pc:
        return a
    if pb <= pc:
        return b
    return c


def build_chunk(chunk_type: bytes, payload: bytes) -> bytes:
    crc = zlib.crc32(chunk_type)
    crc = zlib.crc32(payload, crc)
    return (
        struct.pack(">I", len(payload))
        + chunk_type
        + payload
        + struct.pack(">I", crc & 0xFFFFFFFF)
    )


def pixel_at(pixels: bytearray, width: int, x: int, y: int) -> tuple[int, int, int, int]:
    index = (y * width + x) * 4
    return tuple(pixels[index : index + 4])  # type: ignore[return-value]


def set_alpha(pixels: bytearray, width: int, x: int, y: int, alpha: int) -> None:
    index = (y * width + x) * 4 + 3
    pixels[index] = max(0, min(255, alpha))


def is_seed(pixel: tuple[int, int, int, int]) -> bool:
    r, g, b, a = pixel
    return a > 0 and min(r, g, b) >= 248 and max(r, g, b) - min(r, g, b) <= 18


def is_background(pixel: tuple[int, int, int, int]) -> bool:
    r, g, b, a = pixel
    return a > 0 and min(r, g, b) >= 236 and max(r, g, b) - min(r, g, b) <= 22


def soften_alpha(pixel: tuple[int, int, int, int]) -> int | None:
    r, g, b, a = pixel
    if a == 0:
        return None
    if min(r, g, b) < 205 or max(r, g, b) - min(r, g, b) > 30:
        return None
    whiteness = (r + g + b) / 3
    if whiteness < 205:
        return None
    fade = min(1.0, max(0.0, (whiteness - 205) / 50))
    return int(a * (1.0 - fade * 0.92))


def remove_background(width: int, height: int, pixels: bytearray) -> bytearray:
    background = [False] * (width * height)
    queue: deque[tuple[int, int]] = deque()

    def enqueue(x: int, y: int) -> None:
        idx = y * width + x
        if background[idx]:
            return
        pixel = pixel_at(pixels, width, x, y)
        if is_seed(pixel):
            background[idx] = True
            queue.append((x, y))

    for x in range(width):
        enqueue(x, 0)
        enqueue(x, height - 1)
    for y in range(height):
        enqueue(0, y)
        enqueue(width - 1, y)

    while queue:
        x, y = queue.popleft()
        for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
            if nx < 0 or ny < 0 or nx >= width or ny >= height:
                continue
            idx = ny * width + nx
            if background[idx]:
                continue
            pixel = pixel_at(pixels, width, nx, ny)
            if is_background(pixel):
                background[idx] = True
                queue.append((nx, ny))

    output = bytearray(pixels)
    for y in range(height):
        for x in range(width):
            idx = y * width + x
            if background[idx]:
                set_alpha(output, width, x, y, 0)

    for y in range(height):
        for x in range(width):
            idx = y * width + x
            if background[idx]:
                continue
            adjacent_background = False
            for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
                if nx < 0 or ny < 0 or nx >= width or ny >= height:
                    continue
                if background[ny * width + nx]:
                    adjacent_background = True
                    break
            if not adjacent_background:
                continue
            pixel = pixel_at(output, width, x, y)
            softened = soften_alpha(pixel)
            if softened is not None:
                set_alpha(output, width, x, y, softened)

    return output


def process_image(source: Path, destination: Path) -> None:
    width, height, pixels = read_png(source)
    cleaned = remove_background(width, height, pixels)
    write_png(destination, width, height, cleaned)


def main() -> None:
    parser = argparse.ArgumentParser(description="Remove near-white backgrounds from PNG assets.")
    parser.add_argument("inputs", nargs="+", help="Input PNG files")
    parser.add_argument("--output-dir", required=True, help="Directory for processed PNG files")
    args = parser.parse_args()

    output_dir = Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    for input_path in args.inputs:
        source = Path(input_path)
        destination = output_dir / source.name
        process_image(source, destination)
        print(f"Processed {source} -> {destination}")


if __name__ == "__main__":
    main()
