import { MapPin, Phone, Mail, Clock3 } from "lucide-react";
import FormContactCompnent from "./form.contact.component";

export default function InfosContactComponent() {
  const infos = [
    {
      icon: MapPin,
      label: "Adresse",
      value: "123 avenue de la Brasserie, 19100 Brive-la-Gaillarde",
    },
    {
      icon: Phone,
      label: "Téléphone",
      value: "05 00 00 00 00",
      href: "tel:0500000000",
    },
    {
      icon: Mail,
      label: "Email",
      value: "contact@alassiette.fr",
      href: "mailto:contact@alassiette.fr",
    },
  ];

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
    <section className="w-full bg-[#eeebe6] px-4 py-[110px] text-[#111111] desktop:px-[90px]">
      <div className="mx-auto max-w-[1600px]">
        <div className="mx-auto max-w-[1380px]">
          {/* HEADER */}
          <div className="mx-auto max-w-[760px] text-center">
            <p className="mb-5 text-[14px] font-light uppercase tracking-[0.42em] text-[#b48a45] desktop:text-[16px]">
              Informations
            </p>

            <h2 className="yeseva-one-regular text-[34px] uppercase leading-[1.05] tracking-[-0.04em] desktop:text-[54px]">
              Toutes nos coordonnées
            </h2>

            <p className="mx-auto mt-6 max-w-[620px] text-[17px] font-light leading-[1.85] text-black/60 desktop:text-[18px]">
              Retrouvez facilement notre adresse, nos horaires et nos moyens de
              contact pour organiser votre venue ou nous écrire directement.
            </p>
          </div>

          {/* CONTENT */}
          <div className="mt-16 flex gap-8 desktop:mt-20 desktop:gap-10">
            {/* LEFT */}
            <FormContactCompnent/>

            {/* RIGHT */}
            <div className="border border-[#b48a45]/20 bg-[#022401] p-8 desktop:p-12 w-full">
              <div className="flex items-center gap-3">
                <Clock3 size={18} strokeWidth={1.5} className="text-[#b48a45]" />
                <p className="text-[13px] font-medium uppercase tracking-[0.32em] text-[#b48a45]">
                  Horaires d’ouverture
                </p>
              </div>

              <div className="mt-10">
                {schedules.map((item) => (
                  <div
                    key={item.day}
                    className="flex items-center justify-between gap-6 border-b border-[#eeebe6]/20 py-4 last:border-b-0"
                  >
                    <p className="text-[18px] font-light text-[#eeebe6]">
                      {item.day}
                    </p>

                    <p
                      className={`text-right text-[16px] font-light ${
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

              <div className="mt-10 border-t border-[#b48a45]/15 pt-8">
                <p className="text-[14px] uppercase tracking-[0.28em] text-[#b48a45]">
                  Réservation & demandes
                </p>

                <p className="mt-4 max-w-[520px] text-[17px] font-light leading-[1.85] text-[#eeebe6]">
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