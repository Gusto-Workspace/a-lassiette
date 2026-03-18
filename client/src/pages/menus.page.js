import Head from "next/head";
import { useEffect, useRef, useState } from "react";

// I18N
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// COMPONENTS
import NavComponent from "@/components/_shared/nav/nav.component";
import FooterComponent from "@/components/_shared/footer/footer.component";
import BannerComponent from "@/components/_shared/banner/banner.component";
import ListMenusComponent from "@/components/menus/list.menus.component";

export default function MenusPage(props) {
  const heroRef = useRef(null);
  const [showScrolledNav, setShowScrolledNav] = useState(false);

  useEffect(() => {
    const heroEl = heroRef.current;
    if (!heroEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowScrolledNav(entry.intersectionRatio <= 0.1);
      },
      {
        threshold: [0, 0.05, 0.1, 0.25, 0.5, 0.75, 1],
      },
    );

    observer.observe(heroEl);

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Head>
        <title>Carte & Menus - A l'Assiette</title>
      </Head>

      <div className="relative">
        <NavComponent
          isVisible={!showScrolledNav}
          scrolled={false}
          logoSrc="/img/logo.png"
        />

        <NavComponent
          isVisible={showScrolledNav}
          scrolled={true}
          logoSrc="/img/logo.png"
        />

        <div ref={heroRef}>
          <BannerComponent
            title="Carte & Menus"
            imgUrl="menu-inspired/2.jpg"
            opacity={true}
          />
        </div>

        <ListMenusComponent />

        <FooterComponent />
      </div>
    </>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "menus"])),
    },
  };
}
