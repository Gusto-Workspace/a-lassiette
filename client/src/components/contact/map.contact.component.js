import { MapPin, Phone, Mail, Clock3 } from "lucide-react";

export default function MapContactComponent() {
  const infos = [
    {
      icon: MapPin,
      label: "Adresse",
      value: "53 Av. Jean Charles Rivet Espace Migot, 19100 Brive-la-Gaillarde",
    },
    {
      icon: Phone,
      label: "Téléphone",
      value: "05 55 86 18 95",
      href: "tel:0555861895",
    },
    {
      icon: Mail,
      label: "Email",
      value: "contact@alassiette.fr",
      href: "mailto:contact@alassiette.fr",
    },
  ];

  return (
    <section className="bg-white px-6 py-20 desktop:px-12">
      <div className="mx-auto max-w-[1200px] grid gap-12 desktop:grid-cols-2 desktop:items-start">
        {/* INFOS CONTACT */}
        <div className="border border-[#b48a45]/20 bg-white/60 p-8 backdrop-blur-[2px] desktop:p-12">
          <div className="flex items-center gap-3">
            <div className="h-px w-12 bg-[#b48a45]" />
            <p className="text-[13px] font-medium uppercase tracking-[0.32em] text-[#b48a45]">
              Nous joindre
            </p>
          </div>

          <div className="mt-10 space-y-4">
            {infos.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="flex items-start gap-4 pb-8 last:border-b-0 last:pb-0"
                >
                  <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#b48a45]/25 text-[#b48a45]">
                    <Icon size={19} strokeWidth={1.5} />
                  </div>

                  <div>
                    <p className="text-[13px] uppercase tracking-[0.28em] text-[#b48a45]">
                      {item.label}
                    </p>

                    {item.href ? (
                      <a
                        href={item.href}
                        className="mt-3 inline-block text-[19px] font-light leading-[1.7] text-black/75 transition hover:text-[#b48a45]"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="mt-3 text-[19px] font-light leading-[1.7] text-black/75">
                        {item.value}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* MAP */}
        <div className="relative h-full w-full overflow-hidden rounded-[6px] border border-black/5 shadow-sm">
          <iframe
            title="map"
            src="https://www.google.com/maps?q=a l'assiette brive&output=embed"
            className="h-full w-full border-0"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
