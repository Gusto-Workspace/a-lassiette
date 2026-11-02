import Head from "next/head";
import NextImage from "next/image";

// Prepared photographs are served directly; logos and other images remain with Next.
const photos = {
  "/img/hero/1.jpg": ["/img/hero/1", [800, 1600, 2880], "100vw"],
  "/img/hero/2.jpg": ["/img/hero/2", [800, 1600, 2880], "100vw"],
  "/img/hero/3.jpg": ["/img/hero/3", [800, 1600, 2880], "100vw"],
  // This file was byte-identical to hero/3.jpg.
  "/img/experience/4.jpg": ["/img/hero/3", [800, 1600, 2880], "(max-width: 767px) 82vw, (max-width: 1023px) 75vw, 62vw"],
  "/img/experience/2.webp": ["/img/experience/2", [480, 960, 1080], "(max-width: 767px) 80vw, (max-width: 1023px) 500px, 35vw"],
  "/img/experience/terrasse.png": ["/img/experience/terrasse", [480, 800, 984], "(max-width: 767px) 52vw, (max-width: 1023px) 42vw, 35vw"],
  "/img/menu-inspired/1.png": ["/img/menu-inspired/1", [480, 960, 1184], "(max-width: 767px) 90vw, 470px"],
  "/img/specialities/1.jpg": ["/img/specialities/1", [480, 960, 1080], "(max-width: 767px) 68vw, (max-width: 1023px) 422px, 40vw"],
  "/img/specialities/2.jpg": ["/img/specialities/2", [480, 960, 1080], "(max-width: 767px) 62vw, (max-width: 1023px) 385px, 34vw"],
  "/img/video-banner/1.png": ["/img/video-banner/1", [480, 960, 1536], "100vw"],
};

export default function StaticPhoto({ src, alt, fill, priority, loading, sizes, style, ...props }) {
  const photo = photos[src];
  if (!photo) return <NextImage src={src} alt={alt} fill={fill} priority={priority} loading={loading} sizes={sizes} style={style} {...props} />;
  const [prefix, widths, defaultSizes] = photo;
  const imageSizes = sizes || defaultSizes;
  const srcSet = widths.map((width) => `${prefix}-${width}.webp ${width}w`).join(", ");
  return <>
    {priority && <Head><link rel="preload" as="image" imageSrcSet={srcSet} imageSizes={imageSizes} fetchPriority="high" /></Head>}
    <img {...props} src={`${prefix}-${widths[widths.length - 1]}.webp`} srcSet={srcSet} sizes={imageSizes} alt={alt}
      loading={priority ? "eager" : loading || "lazy"} fetchPriority={priority ? "high" : undefined} decoding="async"
      style={fill ? { position: "absolute", height: "100%", width: "100%", inset: 0, color: "transparent", ...style } : style} />
  </>;
}
