import Image from "next/image";

export default function ExperienceHomeComponent() {
  return (
    <section className="w-full bg-[#ffffff] pt-20 text-[#111111] tablet:pt-24 desktop:pt-[110px] ultraWild:pt-[140px]">
      <div className="block pb-[90px] desktop:hidden relative mx-auto w-full max-w-[430px] tablet:max-w-[620px] desktop:mx-0 desktop:w-[58%] desktop:max-w-none ultraWild:w-[60%]">
        <div className="relative h-[420px] w-full tablet:h-[520px] desktop:h-[560px] ultraWild:h-[620px]">
          {/* BIG RIGHT IMAGE */}
          <div className="absolute right-0 top-0 h-[300px] w-[68%] overflow-hidden tablet:h-[400px] desktop:h-[500px] ultraWild:h-[620px]">
            <Image
              src="/img/experience/1.jpg"
              alt="dish"
              fill
              className="object-cover"
            />
          </div>

          {/* LEFT OVERLAY IMAGE */}
          <div className="absolute bottom-0 left-0 z-20 h-[220px] w-[62%] overflow-hidden bg-[#f3f3f3] tablet:h-[300px] desktop:-bottom-[15px] desktop:left-auto desktop:right-[240px] desktop:h-[360px] desktop:w-[55%] ultraWild:bottom-[40px] ultraWild:right-[240px] ultraWild:h-[430px] ultraWild:w-[430px]">
            <Image
              src="/img/experience/2.webp"
              alt="Table view"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1600px] px-5 tablet:px-8 desktop:px-[90px]">
        {/* CONTENT */}
        <div className="relative">
          <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-12 desktop:flex-row desktop:items-center desktop:justify-between desktop:gap-10 ultraWild:max-w-[1360px]">
            {/* TEXT */}
            <div className="w-full max-w-[700px] desktop:w-[36%] desktop:max-w-[520px] ultraWild:w-[530px]">
              <h3 className="yeseva-one-regular text-[24px] uppercase leading-[1.1] tracking-[-0.04em] tablet:text-[28px] desktop:text-[30px] ultraWild:text-[32px]">
                Le goût du détail, au cœur de chaque assiette
              </h3>

              <p className="mt-6 text-[15px] font-light leading-[1.75] text-black/55 tablet:text-[16px] desktop:text-[17px] ultraWild:text-[18px]">
                Ici, chaque service est pensé comme un moment à part. Les gestes
                sont précis, les cuissons maîtrisées, et chaque assiette est
                dressée avec attention pour révéler pleinement les saveurs.
              </p>

              <p className="mt-2 text-[15px] font-light leading-[1.75] text-black/55 tablet:text-[16px] desktop:text-[17px] ultraWild:text-[18px]">
                Entre simplicité assumée et exigence constante, la cuisine
                s’exprime avec justesse, offrant une expérience sincère, où le
                plaisir passe avant tout.
              </p>

              <p className="mt-2 text-[15px] font-light leading-[1.75] text-black/55 tablet:text-[16px] desktop:text-[17px] ultraWild:text-[18px]">
                Un lieu où l’on revient autant pour la qualité des plats que
                pour l’atmosphère chaleureuse qui accompagne chaque moment passé
                à table.
              </p>

              <div className="mt-10 flex justify-center tablet:mt-12 desktop:mt-14">
                <Image
                  src="/img/logo.png"
                  alt="Signature"
                  width={120}
                  height={120}
                  className="rounded-full opacity-90 tablet:h-[110px] tablet:w-[110px] desktop:h-[120px] desktop:w-[120px]"
                />
              </div>
            </div>

            {/* IMAGES */}
            <div className="hidden desktop:block relative mx-auto w-full max-w-[430px] tablet:max-w-[620px] desktop:mx-0 desktop:w-[58%] desktop:max-w-none ultraWild:w-[60%]">
              <div className="relative h-[420px] w-full tablet:h-[520px] desktop:h-[560px] ultraWild:h-[620px]">
                {/* BIG RIGHT IMAGE */}
                <div className="absolute right-0 top-0 h-[300px] w-[68%] overflow-hidden tablet:h-[400px] desktop:h-[500px] ultraWild:h-[620px]">
                  <Image
                    src="/img/experience/1.jpg"
                    alt="dish"
                    fill
                    className="object-cover"
                  />
                </div>

                {/* LEFT OVERLAY IMAGE */}
                <div className="absolute bottom-0 left-0 z-20 h-[220px] w-[62%] overflow-hidden bg-[#f3f3f3] tablet:h-[300px] desktop:-bottom-[15px] desktop:left-auto desktop:right-[240px] desktop:h-[360px] desktop:w-[55%] ultraWild:bottom-[40px] ultraWild:right-[240px] ultraWild:h-[430px] ultraWild:w-[430px]">
                  <Image
                    src="/img/experience/2.webp"
                    alt="Table view"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT VISUALS */}
      <div className="relative mt-20 h-[520px] w-full tablet:mt-28 tablet:h-[620px] desktop:mt-36 desktop:h-[700px] ultraWild:mt-48 ultraWild:h-[760px]">
        {/* BIG IMAGE */}
        <div className="absolute right-0 top-0 h-[360px] w-[82vw] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.08)] tablet:h-[460px] tablet:w-[75vw] desktop:h-[560px] desktop:w-[62vw] ultraWild:h-[620px] ultraWild:w-[60vw]">
          <Image
            src="/img/experience/4.jpg"
            alt="Salle du restaurant"
            fill
            className="object-cover"
          />
        </div>

        {/* SMALL OVERLAY IMAGE */}
        <div className="absolute left-0 top-[180px] z-20 h-[260px] w-[52vw] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.12)] tablet:top-[220px] tablet:h-[360px] tablet:w-[42vw] desktop:-top-[40px] desktop:h-[520px] desktop:w-[34vw] ultraWild:-top-[60px] ultraWild:h-[620px] ultraWild:w-[35vw]">
          <Image
            src="/img/experience/3.jpg"
            alt="Cocktail signature"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
