// Génère les visuels du README de profil, dans l'ambiance de beebopcity.com.
// Les textes, les prix et les couleurs sont dans ce fichier : on modifie, puis `npm run build`.
// Sortie : assets/*.webp (README) et assets/avatar*.jpg (photo de profil).
import { createRequire } from 'node:module';
import { readFileSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const sharp = require('sharp');

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const out = resolve(process.argv[2] || resolve(root, 'assets'));
mkdirSync(out, { recursive: true });

const font = (f) => pathToFileURL(resolve(root, 'node_modules/@fontsource-variable/plus-jakarta-sans/files', f)).href;
const img = (f) => pathToFileURL(resolve(here, 'img', f)).href;
const icon = (name) =>
  readFileSync(resolve(root, 'node_modules/lucide-static/icons', `${name}.svg`), 'utf8')
    .replace(/<!--.*?-->/gs, '')
    .replace(/class="[^"]*"/, '');

// ---------- Contenu (repris de beebopcity.com) ----------
const familles = [
  {
    id: 'creer', nom: 'Créer', icone: 'app-window', couleur: 'var(--vert)', fond: 'var(--vert-pastel)',
    texte: 'Un site vitrine, une boutique en ligne ou une application, construits pour vous.',
    services: ['Site internet vitrine', 'Site e-commerce', 'Création d’application'],
    prix: 'Dès 699 € HTVA',
  },
  {
    id: 'se-former', nom: 'Se former', icone: 'presentation', couleur: 'var(--ocre)', fond: 'var(--jaune-pastel)',
    texte: 'Des formations courtes pour apprendre à faire vous-même.',
    services: ['Créer son site internet avec l’IA', 'L’IA au quotidien pour les PME', 'Automatiser ses tâches sans coder'],
    prix: 'Dès 349 € HTVA par personne',
  },
  {
    id: 'ameliorer', nom: 'Améliorer', icone: 'wrench', couleur: 'var(--lavande)', fond: 'var(--lavande-pastel)',
    texte: 'Votre site existe déjà : nous trouvons ce qui cloche et nous le réparons.',
    services: ['Audit du site', 'Correction du site', 'Consultance en informatique'],
    prix: 'Au forfait ou à la journée',
  },
  {
    id: 'automatiser', nom: 'Automatiser', icone: 'workflow', couleur: 'var(--brique)', fond: 'var(--brique-pastel)',
    texte: 'Les tâches qui reviennent sans cesse, et les e-mails qui devraient partir tout seuls.',
    services: ['Création de flows IA', 'Marketing automation'],
    prix: 'Au forfait ou à la journée',
  },
];

const realisations = [
  { id: 'greenside-garden', nom: 'GreenSide Garden', texte: 'Entretien et aménagement d’espaces verts, à Chastre.' },
  { id: 'thybati', nom: 'Thybati', texte: 'Construction et rénovation de maisons en Brabant wallon.' },
  { id: 'labographie', nom: 'Labographie', texte: 'Boutique en ligne d’impression photo : plexiglas, alu, toile, cadres.' },
  { id: 'kazidomi', nom: 'Kazidomi', texte: 'Magasin bio en ligne belge : alimentation, cosmétiques et maison.' },
];

const produits = [
  { id: 'belltime', nom: 'BellTime', statut: 'En service dans des écoles secondaires', texte: 'Les horaires, les présences et la communication d’une école, au même endroit.' },
  { id: 'interactive-pitlane', nom: 'Interactive Pitlane', statut: 'Publié sur le Google Play Store', texte: 'Des micro-jeux de sport automobile : réflexes, timing et classements.' },
  { id: 'tinned', nom: 'Tinned', statut: 'En ligne', texte: 'Notre place de marché pour boutiques et créateurs indépendants, construite sur une API sur mesure.' },
];

// ---------- Gabarits ----------
const fleche = icon('arrow-right');

const carteFamille = (f) => `
<div class="shot carte" data-name="card-${f.id}" style="--c:${f.couleur};--f:${f.fond}">
  <div class="tuile">${icon(f.icone)}</div>
  <h3>${f.nom}</h3>
  <p class="desc">${f.texte}</p>
  <ul>${f.services.map((s) => `<li>${s}</li>`).join('')}</ul>
  <div class="pied"><strong>${f.prix}</strong><span class="rond">${fleche}</span></div>
</div>`;

const tuileReal = (r) => `
<div class="shot vignette" data-name="real-${r.id}">
  <div class="capture"><img src="${img(r.id + '.jpg')}" alt=""></div>
  <h4>${r.nom}</h4>
  <p>${r.texte}</p>
</div>`;

const tuileProduit = (p) => `
<div class="shot vignette produit" data-name="proj-${p.id}">
  <div class="capture"><img src="${img(p.id + '.jpg')}" alt=""></div>
  <h4>${p.nom}</h4>
  <p>${p.texte}</p>
  <span class="statut">${p.statut}</span>
</div>`;

const html = `<!doctype html>
<html lang="fr"><head><meta charset="utf-8">
<style>
@font-face { font-family: "Plus Jakarta Sans"; font-weight: 200 800; font-style: normal;
  src: url("${font('plus-jakarta-sans-latin-wght-normal.woff2')}") format("woff2");
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; }
@font-face { font-family: "Plus Jakarta Sans"; font-weight: 200 800; font-style: normal;
  src: url("${font('plus-jakarta-sans-latin-ext-wght-normal.woff2')}") format("woff2");
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+1E00-1E9F, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF; }
:root {
  --blanc:#ffffff; --encre:#101713; --gris:#5d6760; --gris-fonce:#3f4a42; --doux:#f3f5f1;
  --vert:#2f5d4a; --vert-pastel:#d9f0e2; --lavande:#4f568c; --lavande-pastel:#e3e5fb;
  --brique:#9c4a2f; --brique-pastel:#fbe2d6; --jaune:#f4d35e; --ocre:#7a5b0e; --jaune-pastel:#fbefc6;
  --nuit:#15231c;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { background: transparent; }
body { font-family: "Plus Jakarta Sans", sans-serif; color: var(--encre); padding: 40px; display: flex; flex-wrap: wrap; gap: 40px; align-items: flex-start; -webkit-font-smoothing: antialiased; }

/* Panneau sombre : même recette que le hero du site */
.panneau { position: relative; overflow: hidden; color: #fff; background:
  radial-gradient(55% 70% at 12% 15%, rgb(47,115,88) 0%, transparent 60%),
  radial-gradient(50% 60% at 88% 10%, rgb(90,97,168) 0%, transparent 60%),
  radial-gradient(55% 60% at 75% 100%, rgb(169,90,58) 0%, transparent 55%),
  var(--nuit); }
.panneau > * { position: relative; }

.hero { width: 1280px; height: 520px; border-radius: 40px; padding: 46px 72px; }
.hero .haut { display: flex; align-items: center; justify-content: space-between; }
.hero .logo { width: 204px; display: block; }
.hero .site { font-size: 20px; font-weight: 600; letter-spacing: -.01em; padding: 9px 20px 10px; border-radius: 999px; background: rgba(255,255,255,.1); box-shadow: inset 0 0 0 1px rgba(255,255,255,.2); }
.etiquette { display: inline-block; margin-top: 38px; background: var(--jaune); color: var(--encre); font-weight: 700; font-size: 20px; letter-spacing: -.01em; padding: 7px 16px 8px; border-radius: 999px; transform: rotate(-2deg); transform-origin: left center; }
.hero h1 { margin-top: 16px; font-size: 74px; line-height: 1.2; font-weight: 800; letter-spacing: -.05em; white-space: nowrap; }
.sur { display: inline-block; padding: 1px 16px 9px; border-radius: 16px; line-height: 1; }
.sur.v { background: var(--vert-pastel); color: var(--vert); transform: rotate(-2deg); margin-left: -6px; }
.sur.l { background: var(--lavande-pastel); color: var(--lavande); transform: rotate(1.5deg); margin: 0 0 0 4px; }
.pastilles { position: absolute !important; right: 76px; top: 168px; display: flex; flex-direction: column; align-items: flex-end; gap: 24px; }
.pastilles span { font-weight: 800; font-size: 38px; letter-spacing: -.04em; padding: 8px 24px 12px; border-radius: 18px; line-height: 1.1; box-shadow: 0 18px 40px rgba(0,0,0,.22); }
.pastilles span:nth-child(1) { background: var(--vert-pastel); color: var(--vert); transform: rotate(-3deg) translateX(-34px); }
.pastilles span:nth-child(2) { background: var(--jaune-pastel); color: var(--ocre); transform: rotate(2.5deg); }
.pastilles span:nth-child(3) { background: var(--lavande-pastel); color: var(--lavande); transform: rotate(-2deg) translateX(-52px); }
.pastilles span:nth-child(4) { background: var(--brique-pastel); color: var(--brique); transform: rotate(3deg) translate(-8px, 6px); }

/* Cartes familles */
.carte { width: 628px; height: 452px; border-radius: 30px; background: var(--f); padding: 34px 36px 32px; display: flex; flex-direction: column; }
.tuile { width: 58px; height: 58px; border-radius: 16px; background: var(--c); color: #fff; display: grid; place-items: center; }
.tuile svg { width: 30px; height: 30px; stroke-width: 1.9; }
.carte h3 { margin-top: 20px; font-size: 44px; line-height: 1.05; font-weight: 800; letter-spacing: -.045em; }
.carte .desc { text-wrap: balance; margin-top: 10px; font-size: 21.5px; line-height: 1.4; color: var(--gris-fonce); letter-spacing: -.01em; }
.carte ul { list-style: none; margin-top: 16px; }
.carte li { position: relative; font-size: 21.5px; line-height: 1.5; font-weight: 700; letter-spacing: -.015em; padding-left: 22px; }
.carte li::before { content: ""; position: absolute; left: 0; top: .62em; width: 10px; height: 10px; border-radius: 50%; background: var(--c); }
.pied { margin-top: auto; display: flex; align-items: center; justify-content: space-between; border-top: 1.5px solid color-mix(in srgb, var(--c) 22%, transparent); padding-top: 16px; }
.pied strong { font-size: 23px; font-weight: 800; letter-spacing: -.02em; }
.rond { width: 50px; height: 50px; border-radius: 50%; background: var(--encre); color: #fff; display: grid; place-items: center; }
.rond svg { width: 24px; height: 24px; stroke-width: 2.2; }

/* Vignettes réalisations et produits */
.vignette { width: 628px; border-radius: 30px; background: var(--doux); padding: 16px 16px 26px; }
.capture { border-radius: 18px; overflow: hidden; aspect-ratio: 16 / 10; background: #dfe3dc; box-shadow: 0 0 0 1.5px rgba(16,23,19,.08); }
.capture img { width: 100%; height: 100%; object-fit: cover; object-position: top center; display: block; }
.vignette h4 { margin: 20px 12px 0; font-size: 31px; font-weight: 800; letter-spacing: -.04em; line-height: 1.1; }
.vignette p { text-wrap: balance; min-height: 60px; margin: 6px 12px 0; font-size: 21.5px; line-height: 1.4; color: var(--gris-fonce); letter-spacing: -.01em; }
.produit { width: 414px; height: 478px; padding: 14px 14px 22px; display: flex; flex-direction: column; }
.produit h4 { margin: 18px 10px 0; font-size: 30px; }
.produit p { margin: 6px 10px 0; font-size: 20.5px; min-height: 0; text-wrap: pretty; }
.produit .statut { margin: auto 10px 0; padding-left: 20px; position: relative; color: var(--vert); font-weight: 700; font-size: 18.5px; letter-spacing: -.01em; line-height: 1.3; }
.produit .statut::before { content: ""; position: absolute; left: 0; top: .42em; width: 10px; height: 10px; border-radius: 50%; background: var(--vert); }

/* Bandeau de contact */
.cta { width: 1280px; height: 300px; border-radius: 40px; padding: 0 72px; display: flex; align-items: center; justify-content: space-between; gap: 40px; }
.cta h2 { font-size: 58px; font-weight: 800; letter-spacing: -.05em; line-height: 1.05; }
.cta p { text-wrap: balance; margin-top: 14px; font-size: 23px; line-height: 1.4; color: rgba(255,255,255,.84); max-width: 640px; letter-spacing: -.01em; }
.bouton { flex: none; display: inline-flex; align-items: center; gap: 16px; background: #fff; color: var(--encre); font-weight: 700; font-size: 23px; letter-spacing: -.02em; padding: 12px 14px 12px 28px; border-radius: 999px; box-shadow: 0 18px 40px rgba(0,0,0,.25); }
.bouton .rond { background: var(--jaune); color: var(--encre); width: 46px; height: 46px; }

/* Avatars (GitHub les affiche dans un cercle) */
.avatar { width: 1000px; height: 1000px; display: grid; place-items: center; background:
  radial-gradient(52% 52% at 20% 22%, rgb(47,115,88) 0%, transparent 62%),
  radial-gradient(48% 48% at 82% 20%, rgb(90,97,168) 0%, transparent 62%),
  radial-gradient(52% 48% at 66% 90%, rgb(169,90,58) 0%, transparent 58%),
  var(--nuit); }
.avatar img { width: 690px; display: block; }
.avatar.b img { width: 400px; }
</style></head>
<body>

<div class="shot panneau hero" data-name="hero">
  <div class="haut"><img class="logo" src="${img('logo-clair.svg')}" alt=""><span class="site">Chastre, Brabant wallon · beebopcity.com</span></div>
  <div><span class="etiquette">Agence web et IA à Chastre</span></div>
  <h1>Votre site internet,<br><span class="sur v">construit pour vous</span><br>ou <span class="sur l">avec vous</span>.</h1>
  <div class="pastilles"><span>Créer</span><span>Se former</span><span>Améliorer</span><span>Automatiser</span></div>
</div>

${familles.map(carteFamille).join('\n')}
${realisations.map(tuileReal).join('\n')}
${produits.map(tuileProduit).join('\n')}

<div class="shot panneau cta" data-name="cta">
  <div>
    <h2>Parlons de votre projet</h2>
    <p>Un appel gratuit de 30 minutes, sans engagement. Vous repartez avec nos conseils, même si vous ne travaillez pas avec nous.</p>
  </div>
  <span class="bouton">Réserver un appel gratuit de 30 min <span class="rond">${fleche}</span></span>
</div>

<div class="shot panneau avatar" data-name="avatar"><img src="${img('logo-clair.svg')}" alt=""></div>
<div class="shot panneau avatar b" data-name="avatar-b"><img src="${img('logo-b.png')}" alt=""></div>

</body></html>`;

const DERNIER_DE_RANGEE = new Set(['card-se-former', 'card-automatiser', 'real-thybati', 'real-kazidomi', 'proj-tinned']);
const planche = resolve(root, '.planche.html');
writeFileSync(planche, html);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1500, height: 1200 }, deviceScaleFactor: 2 });
await page.goto(pathToFileURL(planche).href);
await page.evaluate(() => document.fonts.ready);
const police = await page.evaluate(() => document.fonts.check('800 40px "Plus Jakarta Sans"'));
if (!police) throw new Error('Police Plus Jakarta Sans non chargée');
for (const el of await page.locator('.shot').all()) {
  const name = await el.getAttribute('data-name');
  const png = await el.screenshot({ omitBackground: true });
  const box = await el.boundingBox();
  let fichier;
  if (name.startsWith('avatar')) {
    // GitHub limite la photo de profil à 1 Mo : JPEG 1000 px.
    fichier = `${name}.jpg`;
    await sharp(png).resize(1000, 1000).flatten({ background: '#15231c' }).jpeg({ quality: 93, chromaSubsampling: '4:4:4' }).toFile(resolve(out, fichier));
  } else {
    fichier = `${name}.webp`;
    // Les vignettes se posent côte à côte sans espace dans le README : la gouttière (24 px)
    // est ajoutée ici, à droite de chaque vignette sauf la dernière de sa rangée.
    const gouttiere = /^(card|real|proj)-/.test(name) && !DERNIER_DE_RANGEE.has(name) ? 48 : 0;
    await sharp(png)
      .extend({ right: gouttiere, background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .webp({ quality: 90, alphaQuality: 100, effort: 6 })
      .toFile(resolve(out, fichier));
  }
  console.log(fichier, Math.round(box.width) + 'x' + Math.round(box.height));
}
await browser.close();
rmSync(planche);
