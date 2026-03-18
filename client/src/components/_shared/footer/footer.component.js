import Image from "next/image";
export default function FooterHomeComponent() {
  return (
    <footer className="relative w-full overflow-hidden bg-[#022401] px-[90px] py-[45px] text-white">
      <div className="mx-auto flex min-h-[620px] max-w-[1600px] flex-col">
        {/* CENTER CONTENT */}
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <div className="mb-8 rounded-full">
            <Image
              src="/img/logo.png"
              alt="Badge À l'Assiette"
              width={88}
              height={88}
              className="object-contain rounded-full"
            />
          </div>
          <h2 className="yeseva-one-regular text-[76px] leading-none tracking-[-0.05em] text-white">
            À l’Assiette
          </h2>
          <p className="mt-8 max-w-[720px] text-[20px] font-extralight leading-[1.8] text-white/72">
            Brasserie conviviale à Brive-la-Gaillarde, À l’Assiette vous
            accueille autour d’une cuisine généreuse, de saison et pleine de
            gourmandise, dans un cadre chaleureux pensé pour chaque moment de
            partage.
          </p>
          <div className="mt-12 flex items-center gap-14">
            <a
              href="#"
              className="text-[15px] font-medium uppercase tracking-[0.34em] text-[#b48a45] transition hover:opacity-70"
            >
              Facebook
            </a>
            <a
              href="#"
              className="text-[15px] font-medium uppercase tracking-[0.34em] text-[#b48a45] transition hover:opacity-70"
            >
              Instagram
            </a>
            <a
              href="/contact"
              className="text-[15px] font-medium uppercase tracking-[0.34em] text-[#b48a45] transition hover:opacity-70"
            >
              Contact
            </a>
          </div>
        </div>
        {/* BOTTOM BAR */}
        <div className="mt-16 flex items-end justify-between text-[16px] font-light text-white/58">
          <p>© {new Date().getFullYear()} À l’Assiette</p>
          <p>Tous droits réservés</p>
        </div>
      </div>
    </footer>
  );
}
