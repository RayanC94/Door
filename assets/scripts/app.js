const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
const $ = (selector, scope = document) => scope.querySelector(selector);

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initReveal();
  initFaq();
  initCompatibilityQuiz();

  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());
});

function initNav() {
  const toggle = $("[data-nav-toggle]");
  const nav = $("[data-nav]");

  if (!toggle || !nav) return;

  const closeMenu = () => {
    document.body.classList.remove("menu-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => {
    const isOpen = document.body.classList.toggle("menu-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  $$("a", nav).forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 860) closeMenu();
  });
}

function initReveal() {
  const nodes = $$("[data-reveal]");
  if (!nodes.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -5% 0px" }
  );

  nodes.forEach((node) => observer.observe(node));
}

function initFaq() {
  $$("[data-faq-item]").forEach((item) => {
    const button = $("[data-faq-button]", item);
    const panel = $("[data-faq-panel]", item);
    if (!button || !panel) return;

    button.addEventListener("click", () => {
      const isOpen = item.classList.toggle("is-open");
      button.setAttribute("aria-expanded", String(isOpen));
      panel.style.maxHeight = isOpen ? `${panel.scrollHeight}px` : "0px";
    });
  });
}

function initCompatibilityQuiz() {
  const quiz = $("[data-compatibility-quiz]");
  if (!quiz) return;

  const steps = $$("[data-step]", quiz);
  const prevButton = $("[data-quiz-prev]", quiz);
  const nextButton = $("[data-quiz-next]", quiz);
  const progressFill = $("[data-quiz-fill]", quiz);
  const currentStep = $("[data-quiz-current]", quiz);
  const totalSteps = $("[data-quiz-total]", quiz);
  const rangeInput = $("[data-range-input]", quiz);
  const rangeValue = $("[data-range-value]", quiz);
  const hintTitle = $("[data-quiz-hint-title]", quiz);
  const hintText = $("[data-quiz-hint-text]", quiz);
  const resultPanel = $("[data-quiz-result]", quiz);
  const resultVisual = $("[data-result-image]", quiz);
  const resultPack = $("[data-result-pack]", quiz);
  const resultPrice = $("[data-result-price]", quiz);
  const resultProduct = $("[data-result-product]", quiz);
  const resultLockBody = $("[data-result-lock-body]", quiz);
  const resultSummary = $("[data-result-summary]", quiz);
  const resultReasons = $("[data-result-reasons]", quiz);
  const resultTech = $("[data-result-tech]", quiz);

  const hints = [
    {
      title: "Pourquoi le type de porte compte",
      text: "Une porte blindée ou multipoints ne s’équipe pas comme une porte d’appartement standard. C’est ce qui détermine le lock body et le niveau de serrure."
    },
    {
      title: "Serrure actuelle",
      text: "Le standard européen 85 couvre la majorité des appartements français. Les multipoints et anciens verrous demandent une vérification plus spécifique."
    },
    {
      title: "Épaisseur de porte",
      text: "Les modèles DigitalDoor couvrent une plage large, de 40 à 120 mm. Cette mesure oriente surtout le kit d’adaptation et le montage."
    },
    {
      title: "Connexion et automatisation",
      text: "Le Wi-Fi sert à piloter à distance, à voir les alertes et à connecter TTLock ou Tuya à tes plateformes de réservation."
    },
    {
      title: "Volume à équiper",
      text: "Plus le parc est grand, plus il faut privilégier un pack robuste, des supports plus longs et une logique de déploiement standardisée."
    },
    {
      title: "Plateformes",
      text: "Airbnb seul reste simple. Dès qu’il y a plusieurs canaux ou un PMS, on privilégie une config plus riche pour éviter les manipulations manuelles."
    }
  ];

  const products = {
    starter: {
      pack: "Pack Starter",
      product: "DigitalDoor ACCESS · KK-0102",
      price: "299 €",
      image: "assets/images/102.png",
      summary:
        "Le bon choix pour démarrer sur une porte standard avec une automatisation simple et fiable.",
      reasons: [
        "Volume réduit à équiper, donc pack d’entrée pertinent.",
        "Fonctions essentielles : code, empreinte, badge, clé de secours et mots de passe temporaires.",
        "Parfait pour un studio, un T2 ou une première location saisonnière."
      ],
      tech: "Installation technicien + lock body inclus + automatisation de base + support 3 mois."
    },
    business: {
      pack: "Pack Business",
      product: "DigitalDoor PRO Camera · KK-0104",
      price: "449 €",
      image: "assets/images/104-camera.png",
      summary:
        "Le best-seller pour les hôtes qui veulent un contrôle visuel, plus de flexibilité et une meilleure marge de sécurité.",
      reasons: [
        "Recommandé dès qu’il y a plusieurs logements, plusieurs plateformes ou un besoin de suivi renforcé.",
        "Caméra judas HD et reconnaissance faciale 3D sur la version mise en avant.",
        "Très bon équilibre entre sécurité, confort voyageur et budget."
      ],
      tech: "Installation technicien + codes prestataires + automatisation avancée + support 6 mois."
    },
    enterprise: {
      pack: "Pack Enterprise",
      product: "DigitalDoor FORTRESS · KK-0113",
      price: "699 €",
      image: "assets/images/113.png",
      summary:
        "Le bon niveau pour les parcs plus importants, les portes exigeantes et les propriétaires qui veulent le moins de friction possible.",
      reasons: [
        "Full automatique : la porte se déverrouille sans manipulation de poignée.",
        "Double batterie, caméra HD et capacité renforcée pour une exploitation intensive.",
        "Particulièrement adapté aux investisseurs, conciergeries et logements premium."
      ],
      tech: "Dashboard multi-biens + maintenance annuelle + support 12 mois + autonomie renforcée."
    }
  };

  let index = 0;

  totalSteps.textContent = String(steps.length);

  if (rangeInput && rangeValue) {
    rangeValue.textContent = rangeInput.value;
    rangeInput.addEventListener("input", () => {
      rangeValue.textContent = rangeInput.value;
    });
  }

  $$("input", quiz).forEach((input) => {
    input.addEventListener("change", () => updateControls());
  });

  prevButton?.addEventListener("click", () => {
    if (index === 0) return;
    index -= 1;
    renderStep();
  });

  nextButton?.addEventListener("click", () => {
    if (!isStepValid(steps[index])) return;

    if (index === steps.length - 1) {
      renderResult();
      return;
    }

    index += 1;
    renderStep();
  });

  renderStep();

  function renderStep() {
    steps.forEach((step, stepIndex) => {
      const panel = step.matches(".quiz-step") ? step : $(".quiz-step", step) || step;
      panel.classList.toggle("is-active", stepIndex === index);
    });

    currentStep.textContent = String(index + 1);
    progressFill.style.width = `${((index + 1) / steps.length) * 100}%`;
    prevButton.disabled = index === 0;
    nextButton.textContent = index === steps.length - 1 ? "Voir la recommandation" : "Continuer";

    const hint = hints[index];
    if (hintTitle) hintTitle.textContent = hint.title;
    if (hintText) hintText.textContent = hint.text;

    updateControls();
  }

  function updateControls() {
    nextButton.disabled = !isStepValid(steps[index]);
  }

  function isStepValid(step) {
    if (!step) return false;

    const field = step.getAttribute("data-field");
    if (!field) return true;

    if (field === "thickness") return Boolean(rangeInput?.value);

    return Boolean($(`input[name="${field}"]:checked`, step));
  }

  function valueOf(name) {
    if (name === "thickness") return Number(rangeInput?.value || 45);
    return quiz.querySelector(`input[name="${name}"]:checked`)?.value || "";
  }

  function renderResult() {
    const answers = {
      doorType: valueOf("doorType"),
      lockType: valueOf("lockType"),
      thickness: valueOf("thickness"),
      wifi: valueOf("wifi"),
      doors: valueOf("doors"),
      platforms: valueOf("platforms")
    };

    const lockBody = recommendLockBody(answers);
    const packKey = recommendPack(answers);
    const product = products[packKey];

    resultPanel.hidden = false;
    resultVisual.src = product.image;
    resultVisual.alt = product.product;
    resultPack.textContent = product.pack;
    resultPrice.textContent = product.price;
    resultProduct.textContent = product.product;
    resultLockBody.textContent = `${lockBody.series} · réf. ${lockBody.ref}`;
    resultSummary.textContent = `${product.summary} ${lockBody.summary}`;
    resultTech.textContent = product.tech;

    resultReasons.innerHTML = product.reasons
      .map((reason) => `<li>${reason}</li>`)
      .join("");

    resultPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function recommendPack(answers) {
    if (answers.doors === "11+" || answers.doors === "6-10") return "enterprise";
    if (answers.doorType === "blindee" || answers.lockType === "multipoints") return "enterprise";
    if (answers.thickness >= 80) return "enterprise";
    if (answers.doors === "2-5") return "business";
    if (answers.platforms === "plusieurs" || answers.platforms === "autre") return "business";
    if (answers.lockType === "unknown" || answers.wifi === "unknown") return "business";
    return "starter";
  }

  function recommendLockBody(answers) {
    if (answers.doorType === "alu-vitree") {
      return {
        series: "Série 50",
        ref: "1435",
        summary: "La porte fine ou vitrée demande un mécanisme plus compact que le standard appartement."
      };
    }

    if (answers.doorType === "pvc") {
      return {
        series: "Série 50",
        ref: "1430",
        summary: "Le format compact Série 50 est le plus cohérent pour une menuiserie PVC ou alu fine."
      };
    }

    if (answers.lockType === "verrou") {
      return {
        series: "Série 72",
        ref: "1437",
        summary: "Le standard 72 est préférable sur les portes anciennes ou les configurations secondaires."
      };
    }

    if (answers.lockType === "multipoints") {
      const heavy = answers.doorType === "blindee" || answers.thickness >= 78;
      return {
        series: "Série 6068",
        ref: heavy ? "1402" : "1401",
        summary:
          "La présence d’une serrure multipoints oriente vers un lock body 6068, plus adapté aux portes épaisses ou renforcées."
      };
    }

    if (answers.doorType === "blindee" || answers.thickness >= 78) {
      return {
        series: "Série 6068",
        ref: "1402",
        summary: "L’épaisseur et le niveau de sécurité orientent vers une version renforcée compatible porte blindée."
      };
    }

    return {
      series: "Série 85",
      ref: "1407",
      summary: "C’est le standard recommandé pour la majorité des portes d’appartement françaises."
    };
  }
}
