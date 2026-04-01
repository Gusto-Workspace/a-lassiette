import Link from "next/link";
import Image from "next/image";
import { useContext } from "react";
import { GlobalContext } from "@/contexts/global.context";

function normalizeExternalHref(value) {
  const href = String(value || "").trim();

  if (!href) {
    return "";
  }

  if (/^(https?:)?\/\//i.test(href) || href.startsWith("mailto:")) {
    return href;
  }

  return `https://${href}`;
}

export default function FooterHomeComponent() {
  const { restaurantContext } = useContext(GlobalContext);
  const socialMedia = restaurantContext?.restaurantData?.social_media || {};
  const socialLinks = [
    { label: "Facebook", href: normalizeExternalHref(socialMedia?.facebook) },
    { label: "Instagram", href: normalizeExternalHref(socialMedia?.instagram) },
    { label: "LinkedIn", href: normalizeExternalHref(socialMedia?.linkedIn) },
    { label: "YouTube", href: normalizeExternalHref(socialMedia?.youtube) },
    { label: "Twitter", href: normalizeExternalHref(socialMedia?.twitter) },
  ].filter((item) => item.href);

  return (
    <footer className="relative w-full overflow-hidden bg-[#022401] px-5 py-16 text-white tablet:px-8 tablet:py-20 desktop:px-[90px] desktop:py-[45px]">
      <div className="mx-auto flex min-h-[520px] max-w-[1600px] flex-col tablet:min-h-[560px] desktop:min-h-[620px]">
        {/* CENTER CONTENT */}
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <div className="mb-6 rounded-full tablet:mb-7 desktop:mb-8">
            <Image
              src="/img/logo.png"
              alt="Badge À l'Assiette"
              width={88}
              height={88}
              className="h-[68px] w-[68px] rounded-full object-contain tablet:h-[78px] tablet:w-[78px] desktop:h-[88px] desktop:w-[88px]"
            />
          </div>

          <h2 className="yeseva-one-regular text-[42px] leading-none tracking-[-0.05em] text-white tablet:text-[56px] desktop:text-[76px]">
            À l’Assiette
          </h2>

          <p className="mt-6 max-w-[720px] text-[15px] font-extralight leading-[1.8] text-white/72 tablet:mt-7 tablet:text-[17px] desktop:mt-8 desktop:text-[20px]">
            Brasserie conviviale à Brive-la-Gaillarde, À l’Assiette vous
            accueille autour d’une cuisine généreuse, de saison et pleine de
            gourmandise, dans un cadre chaleureux pensé pour chaque moment de
            partage.
          </p>

          <div className="mt-10 flex flex-col items-center gap-5 tablet:mt-11 tablet:flex-row tablet:gap-10 desktop:mt-12 desktop:gap-14">
            {socialLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="text-[12px] font-medium uppercase tracking-[0.24em] text-[#b48a45] transition hover:opacity-70 tablet:text-[13px] tablet:tracking-[0.28em] desktop:text-[15px] desktop:tracking-[0.34em]"
              >
                {item.label}
              </a>
            ))}

            <Link
              href="/contact"
              className="text-[12px] font-medium uppercase tracking-[0.24em] text-[#b48a45] transition hover:opacity-70 tablet:text-[13px] tablet:tracking-[0.28em] desktop:text-[15px] desktop:tracking-[0.34em]"
            >
              Contact
            </Link>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="mt-12 flex flex-col items-center justify-between gap-2 text-center text-[13px] font-light text-white/58 tablet:mt-14 tablet:text-[14px] desktop:mt-16 desktop:flex-row desktop:items-end desktop:gap-0 desktop:text-[16px] desktop:text-left">
          <div className="flex gap-2">
            <p>© {new Date().getFullYear()} À l’Assiette</p>
            <p>• Tous droits réservés</p>
            <a
              href="https://gusto-manager.com"
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-white"
            >
              • Propulsé par Gusto Manager
            </a>
          </div>
          <div className="flex flex-col items-center gap-2 tablet:flex-row tablet:flex-wrap tablet:justify-center tablet:gap-4 desktop:justify-end">
            <Link href="/legales" className="transition hover:text-white">
              Mentions légales
            </Link>
            <Link href="/policy" className="transition hover:text-white">
              Politique de confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
