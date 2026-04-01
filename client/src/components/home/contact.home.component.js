import Link from "next/link";
import { Send } from "lucide-react";

export default function ContactHomeComponent() {
  return (
    <section className="w-full bg-[#eeebe6] px-5 py-20 text-[#111111] tablet:px-8 tablet:py-24 desktop:px-[90px] desktop:py-[110px] ultraWild:py-[140px]">
      <div className="mx-auto max-w-[1600px]">
        <div className="mx-auto grid max-w-[1380px] items-center">
          {/* LEFT */}
          <div className="flex flex-col items-center text-center">
            <h2 className="yeseva-one-regular text-[24px] uppercase leading-[1.1] tracking-[-0.04em] text-[#111111] tablet:text-[26px] desktop:text-[28px]">
              Contactez-nous
            </h2>

            <p className="mt-6 max-w-[560px] text-[15px] font-light leading-[1.75] text-balance text-black/60 tablet:mt-7 tablet:text-[16px] desktop:mt-8 desktop:text-[18px]">
              Pour toute demande particulière, privatisation ou réservation de
              groupe, notre équipe se tient à votre disposition afin de répondre
              à vos toutes vos questions.
            </p>

            <Link
              href="/contact"
              className="mt-8 flex items-center gap-2 border-b border-[#b48a45] pb-[3px] text-[12px] font-medium uppercase tracking-[0.24em] text-[#b48a45] transition hover:opacity-70 tablet:mt-9 tablet:text-[13px] tablet:tracking-[0.28em] desktop:mt-10 desktop:text-[14px] desktop:tracking-[0.32em]"
            >
              <span>Envoyer un message</span>
              <Send
                size={22}
                strokeWidth={1.4}
                className="-mt-1 tablet:h-[23px] tablet:w-[23px] desktop:-mt-2 desktop:h-6 desktop:w-6"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
