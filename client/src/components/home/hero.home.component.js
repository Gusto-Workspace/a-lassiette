import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState, useEffect, useContext } from "react";
import BookingBarComponent from "@/components/reservations/booking-bar.component";
import { GlobalContext } from "@/contexts/global.context";

const images = ["/img/hero/1.jpg", "/img/hero/2.jpg", "/img/hero/3.jpg"];

export default function HeroSectionHomeComponent() {
  const { restaurantContext } = useContext(GlobalContext);
  const [current, setCurrent] = useState(0);
  const [introVisible, setIntroVisible] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setIntroVisible(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  function getIntroClassNames(
    delayClassName,
    hiddenTransformClassName = "translate-y-7",
    visibleTransformClassName = "translate-y-0",
  ) {
    return `${introVisible ? `${visibleTransformClassName} opacity-100` : `${hiddenTransformClassName} opacity-0`} transform-gpu transition-all duration-[850ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${delayClassName} motion-reduce:translate-x-0 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none`;
  }

  return (
    <section className="relative min-h-[760px] w-full overflow-hidden bg-[#022401] text-white tablet:min-h-[860px] desktop:h-screen desktop:min-h-[930px]">
      <div className="relative h-full min-h-[760px] w-full tablet:min-h-[860px] desktop:min-h-[900px]">
        {/* IMAGE */}
        <div className="absolute inset-0 overflow-hidden desktop:left-[30%] desktop:top-[102px] desktop:h-[695px] desktop:w-full ultraWild:left-[30%]">
          {images.map((src, index) => (
            <Image
              key={index}
              src={src}
              alt=""
              fill
              priority
              className={`object-cover transition-opacity duration-[1200ms] ease-in-out ${
                index === current ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}

          {/* overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/35 to-black/65 desktop:bg-gradient-to-r desktop:from-black/60 desktop:via-black/20 desktop:to-transparent" />
        </div>

        {/* LEFT ARROW */}
        <button
          type="button"
          aria-label="Previous slide"
          className="absolute left-[58px] top-[452px] z-20 hidden items-center text-[#b48a45] desktop:flex"
          onClick={() =>
            setCurrent((prev) => (prev - 1 + images.length) % images.length)
          }
        >
          <ArrowLeft size={28} strokeWidth={1.2} />
        </button>

        {/* RIGHT ARROW */}
        <button
          type="button"
          aria-label="Next slide"
          className="absolute right-[58px] top-[452px] z-20 hidden items-center text-[#b48a45] desktop:flex"
          onClick={() => setCurrent((prev) => (prev + 1) % images.length)}
        >
          <ArrowRight size={28} strokeWidth={1.2} />
        </button>

        {/* TEXT BLOCK */}
        <div className="absolute left-0 top-[110px] z-20 w-full px-5 tablet:top-[130px] tablet:px-8 desktop:left-[142px] desktop:top-[272px] desktop:w-[720px] desktop:px-0">
          <p
            className={`${getIntroClassNames("delay-[80ms]", "-translate-x-8", "translate-x-0")} mb-4 text-[11px] uppercase tracking-[0.28em] text-white tablet:mb-5 tablet:text-[13px] tablet:tracking-[0.34em] desktop:mb-7 desktop:text-[16px] desktop:tracking-[0.42em]`}
          >
            Brasserie Brive-la-Gaillarde
          </p>

          <h1
            className={`${getIntroClassNames("delay-[180ms]", "-translate-x-10", "translate-x-0")} yeseva-one-regular max-w-[320px] text-[44px] leading-[0.95] tracking-[-0.04em] text-white tablet:max-w-[520px] tablet:text-[64px] desktop:max-w-none desktop:text-[88px] desktop:leading-[0.92]`}
          >
            A l&apos;Assiette
          </h1>

          <p
            className={`${getIntroClassNames("delay-[280ms]", "-translate-x-12", "translate-x-0")} mt-5 max-w-[92%] text-[16px] font-extralight leading-[1.6] text-white/75 tablet:mt-6 tablet:max-w-[620px] tablet:text-[19px] desktop:mt-8 desktop:text-[23px] desktop:leading-[1.55] desktop:text-white/58`}
          >
            Véritable havre de paix, la brasserie à l&apos;assiette vous attend
            du lundi au samedi. Située à l&apos;entrée de la zone ouest de
            Brive-la-Gaillarde, à 3 minutes de la sortie autoroutière n°51.
          </p>
        </div>

        <BookingBarComponent
          restaurant={restaurantContext.restaurantData}
          className={`${getIntroClassNames("delay-[420ms]", "translate-y-10")}`}
        />
      </div>
    </section>
  );
}
