import { useEffect, useLayoutEffect, useRef } from "react";

// I18N
import { useTranslation } from "next-i18next";

// GSAP
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function BannerComponent(props) {
  const { t } = useTranslation("");
  const sectionRef = useRef(null);
  const bgRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current || !bgRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(bgRef.current, {
        y: 180,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      ScrollTrigger.refresh();
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="py-24 desktop:py-0 desktop:h-[45vw] px-4 flex flex-col justify-center text-center items-center gap-6 text-extraWhite relative overflow-hidden"
    >
      <div
        ref={bgRef}
        className="absolute left-0 top-[-180px] w-full h-[calc(100%+360px)]"
        style={{
          backgroundImage: `url('/img/${props.imgUrl}')`,
          backgroundSize: "cover",
          backgroundPosition: "center left",
          willChange: "transform",
          transform: "translate3d(0, -180px, 0)",
        }}
      />

      <div
        className={`${
          !props.opacity
            ? "absolute inset-0 bg-black opacity-30 pointer-events-none desktop:hidden"
            : "absolute inset-0 bg-black opacity-30 pointer-events-none"
        }`}
      />

      <h1 className="text-4xl desktop:text-6xl uppercase z-10 yeseva-one-regular text-balance">
        {t(props.title)}
      </h1>
    </div>
  );
}