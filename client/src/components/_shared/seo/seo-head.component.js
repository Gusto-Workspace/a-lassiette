import Head from "next/head";

const DEFAULT_SITE_NAME = "À l'Assiette";
const DEFAULT_SITE_URL = "https://www.alassiettebrive.com";
const DEFAULT_IMAGE = "/img/hero/1.jpg";

function normalizeBaseUrl(value) {
  const sanitizedValue = String(value || "")
    .trim()
    .replace(/^['"]|['"]$/g, "")
    .replace(/\s+/g, "");

  if (!sanitizedValue) {
    return DEFAULT_SITE_URL;
  }

  return sanitizedValue.replace(/\/+$/, "");
}

function buildAbsoluteUrl(baseUrl, path) {
  if (!path) {
    return baseUrl;
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export default function SeoHead({
  title,
  description,
  path = "/",
  image = DEFAULT_IMAGE,
  type = "website",
  noIndex = false,
}) {
  const baseUrl = normalizeBaseUrl(
    process.env.NEXT_PUBLIC_BASE_URL || DEFAULT_SITE_URL,
  );
  const canonicalUrl = buildAbsoluteUrl(baseUrl, path);
  const imageUrl = buildAbsoluteUrl(baseUrl, image);
  const robots = noIndex
    ? "noindex, nofollow"
    : "index, follow, max-image-preview:large";

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="robots" content={robots} />
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:site_name" content={DEFAULT_SITE_NAME} />
      <meta property="og:locale" content="fr_FR" />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:alt" content={title} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </Head>
  );
}
