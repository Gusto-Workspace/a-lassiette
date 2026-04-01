import Head from "next/head";
import { useEffect, useRef, useState, useContext } from "react";

// I18N
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// COMPONENTS
import NavComponent from "@/components/_shared/nav/nav.component";
import FooterComponent from "@/components/_shared/footer/footer.component";
import BannerComponent from "@/components/_shared/banner/banner.component";

// CONTEXT
import { GlobalContext } from "@/contexts/global.context";

export default function NewsPage(props) {
  const { t } = useTranslation("");
  const { restaurantContext } = useContext(GlobalContext);
  const title = "Actualités - A L'Assiette Brive";
  const description = "";


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
        <title>{title}</title>
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
            title="Actualités"
            imgUrl="reservations/2.jpg"
            opacity={true}
          />
        </div>

       

        <FooterComponent />
      </div>
    </>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "about"])),
    },
  };
}
