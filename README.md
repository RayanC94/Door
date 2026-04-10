# Door

Site statique DigitalDoor pour présentation, prise de contact et préqualification de porte.

## Contenu

- `index.html` : page d'accueil
- `serrures.html` : catalogue produits
- `packs.html` : packs, installation, abonnements
- `compatibilite.html` : quiz interactif
- `merci.html` : confirmation après envoi du formulaire
- `assets/styles/styles.css` : styles partagés
- `assets/scripts/app.js` : interactions front

## Formulaire

Le formulaire de contact de la home est configuré pour **Netlify Forms** :

- `name="contact"`
- `method="POST"`
- `data-netlify="true"`
- `netlify-honeypot="bot-field"`
- redirection vers `merci.html`

Une fois le repo connecté à Netlify, les soumissions remonteront dans l'onglet **Forms**.

## Déploiement Netlify

Réglages simples :

- Build command : vide
- Publish directory : `.`

Le fichier `netlify.toml` pointe déjà vers la racine du projet.
