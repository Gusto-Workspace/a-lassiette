import Image from "next/image";
import gsap from "gsap";
import { useEffect, useRef } from "react";

export default function SpecialtiesHomeComponent() {
  const sectionRef = useRef(null);
  const primaryImageRef = useRef(null);
  const secondaryImageRef = useRef(null);

  useEffect(() => {
    let ctx;

    const init = async () => {
      if (!sectionRef.current || typeof window === "undefined") return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const { ScrollTrigger } = await import("gsap/dist/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        if (primaryImageRef.current) {
          gsap.fromTo(
            primaryImageRef.current,
            {
              yPercent: -10,
            },
            {
              yPercent: 10,
              ease: "none",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.1,
              },
            },
          );
        }

        if (secondaryImageRef.current) {
          gsap.fromTo(
            secondaryImageRef.current,
            {
              yPercent: 15,
            },
            {
              yPercent: -15,
              ease: "none",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.25,
              },
            },
          );
        }
      }, sectionRef);
    };

    init();

    return () => {
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full bg-white px-5 py-20 text-[#111111] tablet:px-8 tablet:py-24 desktop:px-[90px] desktop:py-[110px] ultraWild:px-[90px] ultraWild:py-[140px]"
    >
      <div className="mx-auto max-w-[1600px]">
        {/* TITLE */}
        <div className="mx-auto max-w-[980px] text-center">
          <h2 className="yeseva-one-regular text-[30px] uppercase leading-[1.08] tracking-[-0.04em] tablet:text-[40px] desktop:text-[44px] ultraWild:text-[50px]">
            Une cuisine généreuse,
            <br />
            faite maison et de saison
          </h2>
        </div>

        {/* CONTENT */}
        <div className="relative mt-16 tablet:mt-20 desktop:mt-[100px] ultraWild:mt-[120px]">
          <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-12 desktop:flex-row desktop:items-center desktop:justify-between desktop:gap-10 ultraWild:max-w-[1360px]">
            {/* IMAGES */}
            <div className="relative mx-auto w-full max-w-[430px] tablet:max-w-[620px] desktop:mx-0 desktop:w-[58%] desktop:max-w-none ultraWild:w-[60%]">
              <div className="relative h-[420px] w-full tablet:h-[520px] desktop:h-[560px] ultraWild:h-[620px]">
                {/* LEFT IMAGE */}
                <div
                  ref={primaryImageRef}
                  className="absolute left-0 top-0 h-[300px] w-[68%] overflow-hidden will-change-transform tablet:h-[400px] desktop:h-[500px] ultraWild:h-[620px]"
                >
                  <Image
                    src="/img/specialities/1.jpg"
                    alt="Table view"
                    fill
                    className="object-cover"
                  />
                </div>

                {/* CENTER / OVERLAY IMAGE */}
                <div
                  ref={secondaryImageRef}
                  className="absolute bottom-0 right-0 z-20 h-[220px] w-[62%] overflow-hidden will-change-transform tablet:h-[300px] desktop:-bottom-[15px] desktop:right-12 desktop:h-[360px] desktop:w-[55%] ultraWild:bottom-[40px] ultraWild:h-[430px] ultraWild:w-[430px]"
                >
                  <Image
                    src="/img/specialities/2.jpg"
                    alt="Cocktail"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            {/* TEXT */}
            <div className="w-full max-w-[700px] desktop:w-[36%] desktop:max-w-[520px] ultraWild:w-[530px]">
              <p className="mb-5 text-[13px] font-light uppercase tracking-[0.28em] text-[#b48a45] tablet:text-[14px] desktop:text-[16px] desktop:tracking-[0.38em]">
                Notre cuisine
              </p>

              <h3 className="yeseva-one-regular text-[24px] uppercase leading-[1.1] tracking-[-0.04em] tablet:text-[28px] desktop:text-[30px] ultraWild:text-[32px]">
                Une expérience gourmande à partager à chaque instant
              </h3>

              <p className="mt-6 text-[15px] font-light leading-[1.75] text-black/55 tablet:text-[16px] desktop:mt-8 desktop:text-[17px] ultraWild:text-[18px]">
                À l’Assiette, chaque plat est préparé avec soin à partir de
                produits frais et de saison. La cuisine met à l’honneur une
                brasserie conviviale, mêlant tradition et créativité, avec des
                recettes simples, maîtrisées et toujours gourmandes. Situé à
                l’entrée ouest de Brive-la-Gaillarde, l’établissement propose
                une cuisine accessible et authentique, idéale pour un déjeuner
                rapide comme pour un moment plus détendu entre amis ou en
                famille.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
