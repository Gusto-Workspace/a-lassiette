import { useEffect, useRef, useState } from "react";

// I18N
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// COMPONENTS
import NavComponent from "@/components/_shared/nav/nav.component";
import FooterComponent from "@/components/_shared/footer/footer.component";
import MapContactComponent from "@/components/contact/map.contact.component";
import InfosContactComponent from "@/components/contact/infos.contact.component";
import BannerComponent from "@/components/_shared/banner/banner.component";
import SeoHeadComponent from "@/components/_shared/seo/seo-head.component";

export default function ContactPage() {
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
      <SeoHeadComponent
        title="Contact - À l'Assiette"
        description="Contactez À l’Assiette à Brive-la-Gaillarde pour une réservation, une demande d’information ou un message."
        path="/contact"
        image="/img/contact/1.jpg"
      />

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
            title="Nous contacter"
            imgUrl="contact/1.jpg"
            opacity={true}
          />
        </div>

        <MapContactComponent />
        <InfosContactComponent />
        <FooterComponent />
      </div>
    </>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
