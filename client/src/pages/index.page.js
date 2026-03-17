import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

// I18N
import { i18n } from "next-i18next";
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

export default function HomePage(props) {
  const title = "A l'Assiette";
  const description =
    "La Coquille est un restaurant gastronomique à Concarneau en Bretagne dans le Finistère. Le restaurant est situé sur les quais en face de la Ville Close.";

  return (
    <>
      <Head>
        <title>{title}</title>

        {/* <>
          {description && <meta name="description" content={description} />}
          {title && <meta property="og:title" content={title} />}
          {description && (
            <meta property="og:description" content={description} />
          )}
          <meta
            property="og:url"
            content="https://www.lacoquille-concarneau.fr/"
          />
          <meta property="og:type" content="website" />
          <meta property="og:image" content="/img/1.jpg" />
          <meta property="og:image:width" content="1920" />
          <meta property="og:image:height" content="1080" />
        </> */}
      </Head>

      <div className="relative">
        {/* <NavComponent/> */}

        <div>
          <HeroHomeComponent />
          <SpecialtiesHomeComponent />
          <VideoBannerHomeComponent/>
          <TimelineHomeComponent/>
          <MenuInspiredHomeComponent/>
          <ExperienceHomeComponent/>
          <FooterComponent />
        </div>
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
