import Head from "next/head";
import { useEffect, useRef, useState } from "react";

// I18N
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// COMPONENTS
import HeroHomeComponent from "@/components/home/hero.home.component";
import NavComponent from "@/components/_shared/nav/nav.component";
import FooterComponent from "@/components/_shared/footer/footer.component";
import SpecialtiesHomeComponent from "@/components/home/specialities.home.component";
import VideoBannerHomeComponent from "@/components/home/video-banner.home.component";
import TimelineHomeComponent from "@/components/home/timeline.home.component";
import MenuInspiredHomeComponent from "@/components/home/menu-inspired.home.component";
import ExperienceHomeComponent from "@/components/home/experience.home.component";
import TestimonialsHomeComponent from "@/components/home/testimonials.home.component";
import ContactHomeComponent from "@/components/home/contact.home.component";

export default function HomePage() {
  const title = "A l'Assiette";
  const heroRef = useRef(null);

  const [showScrolledNav, setShowScrolledNav] = useState(false);

  useEffect(() => {
    const heroEl = heroRef.current;
    if (!heroEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // quand le hero est visible à moins de 5%
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
          scrolled
          logoSrc="/img/logo.png"
        />

        <div ref={heroRef}>
          <HeroHomeComponent />
        </div>

        <SpecialtiesHomeComponent />
        <VideoBannerHomeComponent />
        <TimelineHomeComponent />
        <MenuInspiredHomeComponent />
        <ExperienceHomeComponent />
        <TestimonialsHomeComponent />
        <ContactHomeComponent />
        <FooterComponent />
      </div>
    </>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "index"])),
    },
  };
}