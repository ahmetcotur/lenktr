import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

const SITE_URL = "https://lenk.tr";

export default function SEO({
  title = "LENK.TR | Bağlantı yönetimi ve bio sayfaları",
  description = "Kısa bağlantılarını oluştur, bio sayfanı düzenle ve tıklama istatistiklerini tek yerden takip et.",
  image = "/og-image.png",
  url = "/",
  type = "website",
  keywords,
  noIndex = false,
  structuredData,
}) {
  const { i18n } = useTranslation();
  const language = i18n.language?.startsWith("en") ? "en_US" : "tr_TR";
  const canonical = new URL(url, SITE_URL).href;
  const socialImage = new URL(image, SITE_URL).href;
  const graph = structuredData
    ? Array.isArray(structuredData)
      ? structuredData
      : [structuredData]
    : null;

  return (
    <Helmet>
      <html lang={language === "tr_TR" ? "tr" : "en"} />
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large"} />
      <link rel="canonical" href={canonical} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={socialImage} />
      <meta property="og:image:alt" content="LENK.TR — bağlantı yönetimi ve bio sayfaları" />
      <meta property="og:site_name" content="LENK.TR" />
      <meta property="og:locale" content={language} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={socialImage} />
      {graph && (
        <script type="application/ld+json">{JSON.stringify({ "@context": "https://schema.org", "@graph": graph })}</script>
      )}
    </Helmet>
  );
}
