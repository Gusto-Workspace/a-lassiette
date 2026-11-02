const { i18n } = require("./next-i18next.config");

module.exports = {
  reactStrictMode: false,
  pageExtensions: ["api.js", "page.js"],
  i18n,
  async redirects() {
    // Preserve public URLs for the replaced photos; social metadata keeps its JPEGs.
    const photos = {
      "/img/hero/3.jpg": "/img/hero/3-2880.webp",
      "/img/experience/4.jpg": "/img/hero/3-2880.webp",
      "/img/experience/2.webp": "/img/experience/2-1080.webp",
      "/img/experience/terrasse.png": "/img/experience/terrasse-984.webp",
      "/img/menu-inspired/1.png": "/img/menu-inspired/1-1184.webp",
      "/img/specialities/1.jpg": "/img/specialities/1-1080.webp",
      "/img/specialities/2.jpg": "/img/specialities/2-1080.webp",
      "/img/video-banner/1.png": "/img/video-banner/1-1536.webp",
    };
    return Object.entries(photos).map(([source, destination]) => ({ source, destination, permanent: true }));
  },
  async headers() {
    return [
      {
        source: "/menus",
        has: [{ type: "query", key: "gustoPrint", value: "1" }],
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors https://www.gusto-manager.com;",
          },
        ],
      },
    ];
  },
};
