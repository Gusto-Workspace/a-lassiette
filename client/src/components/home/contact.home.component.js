import { Send } from "lucide-react";

export default function ContactHomeComponent() {
  return (
    <section className="w-full bg-[#eeebe6] px-[90px] py-[110px] text-[#111111]">
      <div className="mx-auto max-w-[1600px]">
        <div className="mx-auto grid max-w-[1380px] items-center">
          {/* LEFT */}
          <div className="flex flex-col items-center text-center">
            <h2 className="yeseva-one-regular text-[28px] uppercase leading-[1.1] tracking-[-0.04em] text-[#111111]">
              Contactez-nous
            </h2>

            <p className="mt-8 max-w-[560px] text-[18px] font-light leading-[1.75] text-black/60 text-balance">
              Pour toute demande particulière, privatisation ou réservation de
              groupe, notre équipe se tient à votre disposition afin de répondre
              à vos toutes vos questions.
            </p>

            <button
              type="button"
              className="flex gap-2 items-center mt-10 border-b border-[#b48a45] pb-[3px] text-[14px] font-medium uppercase tracking-[0.32em] text-[#b48a45] transition hover:opacity-70"
            >
              Envoyer un message
              <Send size={24} strokeWidth={1.4} className="-mt-2" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
