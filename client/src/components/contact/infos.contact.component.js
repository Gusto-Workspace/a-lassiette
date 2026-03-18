import { Clock3 } from "lucide-react";
import FormContactCompnent from "./form.contact.component";

export default function InfosContactComponent() {
  const schedules = [
    { day: "Lundi", hours: "12:00 – 14:00" },
    { day: "Mardi", hours: "12:00 – 14:00 • 19:00 – 22:00" },
    { day: "Mercredi", hours: "12:00 – 14:00 • 19:00 – 22:00" },
    { day: "Jeudi", hours: "12:00 – 14:00 • 19:00 – 22:00" },
    { day: "Vendredi", hours: "12:00 – 14:00 • 19:00 – 22:30" },
    { day: "Samedi", hours: "12:00 – 14:00 • 19:00 – 22:30" },
    { day: "Dimanche", hours: "Fermé" },
  ];

  return (
    <section className="w-full bg-[#eeebe6] px-5 py-20 text-[#111111] tablet:px-8 tablet:py-24 desktop:px-[90px] desktop:py-[110px]">
      <div className="mx-auto max-w-[1600px]">
        <div className="mx-auto max-w-[1380px]">
          {/* HEADER */}
          <div className="mx-auto max-w-[760px] text-center">
            <p className="mb-4 text-[12px] font-light uppercase tracking-[0.28em] text-[#b48a45] tablet:mb-5 tablet:text-[14px] tablet:tracking-[0.42em] desktop:text-[16px]">
              Informations
            </p>

            <h2 className="yeseva-one-regular text-[28px] uppercase leading-[1.08] tracking-[-0.04em] tablet:text-[40px] desktop:text-[54px]">
              Toutes nos coordonnées
            </h2>

            <p className="mx-auto mt-5 max-w-[620px] text-[15px] font-light leading-[1.8] text-black/60 tablet:mt-6 tablet:text-[17px] tablet:leading-[1.85] desktop:text-[18px]">
              Retrouvez facilement notre adresse, nos horaires et nos moyens de
              contact pour organiser votre venue ou nous écrire directement.
            </p>
          </div>

          {/* CONTENT */}
          <div className="mt-12 grid gap-6 tablet:mt-14 tablet:gap-8 desktop:mt-20 desktop:grid-cols-[1fr_1fr] desktop:gap-10">
            {/* LEFT */}
            <FormContactCompnent />

            {/* RIGHT */}
            <div className="w-full border border-[#b48a45]/20 bg-[#022401] p-5 tablet:p-8 desktop:p-12">
              <div className="flex items-center gap-3">
                <Clock3
                  size={18}
                  strokeWidth={1.5}
                  className="text-[#b48a45]"
                />
                <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[#b48a45] tablet:text-[13px] tablet:tracking-[0.32em]">
                  Horaires d’ouverture
                </p>
              </div>

              <div className="mt-8 tablet:mt-10">
                {schedules.map((item) => (
                  <div
                    key={item.day}
                    className="flex flex-col gap-1 border-b border-[#eeebe6]/20 py-4 last:border-b-0 tablet:flex-row tablet:items-center tablet:justify-between tablet:gap-6"
                  >
                    <p className="text-[16px] font-light text-[#eeebe6] tablet:text-[18px]">
                      {item.day}
                    </p>

                    <p
                      className={`text-left text-[14px] font-light tablet:text-right tablet:text-[16px] ${
                        item.hours === "Fermé"
                          ? "text-[#eeebe6]/40"
                          : "text-[#eeebe6]"
                      }`}
                    >
                      {item.hours}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 border-t border-[#b48a45]/15 pt-6 tablet:mt-10 tablet:pt-8">
                <p className="text-[12px] uppercase tracking-[0.22em] text-[#b48a45] tablet:text-[14px] tablet:tracking-[0.28em]">
                  Réservation & demandes
                </p>

                <p className="mt-4 max-w-[520px] text-[15px] font-light leading-[1.8] text-[#eeebe6] tablet:text-[17px] tablet:leading-[1.85]">
                  Pour toute réservation de groupe, privatisation ou demande
                  particulière, nous vous invitons à nous contacter directement
                  par téléphone ou via le formulaire.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
