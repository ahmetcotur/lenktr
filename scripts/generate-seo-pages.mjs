import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const template = await readFile(path.join(root, "dist/index.html"), "utf8");
const site = "https://lenk.tr";
const image = `${site}/og-image.png`;
const pages = {
  pricing: ["LENK.TR fiyatlandırma", "Kısa bağlantılarını yönet, bio sayfanı oluştur ve tıklama istatistiklerini takip et."],
  about: ["Hakkımızda | LENK.TR", "LENK.TR, bağlantılarını düzenlemen, bio sayfanı yayımlaman ve tıklama istatistiklerini takip etmen için tasarlanmış bir platformdur."],
  contact: ["İletişim | LENK.TR", "LENK.TR ekibine ürün ve hesap desteği için iletişim formundan ulaşın."],
  terms: ["Kullanım şartları | LENK.TR", "LENK.TR platformunun kullanım şartları ve kullanıcı sorumlulukları."],
  privacy: ["Gizlilik politikası | LENK.TR", "LENK.TR hesap, bağlantı ve kullanım verilerini nasıl işler ve korur."],
  security: ["Güvenlik | LENK.TR", "LENK.TR hesap güvenliği, veri koruma ve hizmet altyapısı hakkında bilgi."],
  login: ["Giriş yap | LENK.TR", "LENK.TR hesabınıza giriş yapın.", true],
  register: ["Hesap oluştur | LENK.TR", "LENK.TR hesabınızı oluşturun.", true],
  "forgot-password": ["Şifre sıfırlama | LENK.TR", "LENK.TR hesabınızın şifresini sıfırlayın.", true],
  account: ["Hesap işlemi | LENK.TR", "LENK.TR hesap doğrulama ve şifre işlemleri.", true],
  upgrade: ["Planı yükselt | LENK.TR", "LENK.TR hesabınızın planını yönetin.", true],
  admin: ["Yönetim paneli | LENK.TR", "LENK.TR yönetim paneli.", true],
};
const escapeAttribute = (value) => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");
function replaceMeta(html, expression, replacement) {
  return html.replace(expression, replacement);
}
for (const [route, [title, description, noIndex = false]] of Object.entries(pages)) {
  const url = `${site}/${route}`;
  let html = template;
  html = replaceMeta(html, /<title>.*?<\/title>/, `<title>${escapeAttribute(title)}</title>`);
  html = replaceMeta(html, /<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${escapeAttribute(description)}" />`);
  html = replaceMeta(html, /<meta name="robots" content="[^"]*" \/>/, `<meta name="robots" content="${noIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large"}" />`);
  html = replaceMeta(html, /<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${url}" />`);
  html = replaceMeta(html, /<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${url}" />`);
  html = replaceMeta(html, /<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${escapeAttribute(title)}" />`);
  html = replaceMeta(html, /<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${escapeAttribute(description)}" />`);
  html = replaceMeta(html, /<meta property="og:image" content="[^"]*" \/>/, `<meta property="og:image" content="${image}" />`);
  html = replaceMeta(html, /<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${escapeAttribute(title)}" />`);
  html = replaceMeta(html, /<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${escapeAttribute(description)}" />`);
  html = replaceMeta(html, /<meta name="twitter:image" content="[^"]*" \/>/, `<meta name="twitter:image" content="${image}" />`);
  html = html.replace(/\s*<script type="application\/ld\+json">[\s\S]*?<\/script>/, "");
  if (!noIndex) {
    const pageSchema = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": title,
      "description": description,
      "url": url,
      "inLanguage": "tr-TR",
      "isPartOf": { "@type": "WebSite", "name": "LENK.TR", "url": `${site}/` },
      "publisher": { "@type": "Organization", "name": "LENK.TR", "url": `${site}/`, "logo": `${site}/logo-mark-512.png` },
    };
    const safeSchema = JSON.stringify(pageSchema).replaceAll("<", "\\u003c");
    html = html.replace("</head>", `<script type="application/ld+json">${safeSchema}</script>\n  </head>`);
  }
  const folder = path.join(root, "dist", route);
  await mkdir(folder, { recursive: true });
  await writeFile(path.join(folder, "index.html"), html);
}
