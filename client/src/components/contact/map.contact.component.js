import { useContext } from "react";
import { MapPin, Phone, Mail } from "lucide-react";
import { GlobalContext } from "@/contexts/global.context";
import {
  buildContactInfos,
  getMapEmbedSrc,
} from "../../_assets/utils/contact.utils";

export default function MapContactComponent() {
  const { restaurantContext } = useContext(GlobalContext);
  const restaurantData = restaurantContext?.restaurantData;
  const dataLoading = restaurantContext?.dataLoading;
  const infos = buildContactInfos(restaurantData);
  const mapSrc = getMapEmbedSrc(restaurantData);
  const iconByKey = {
    address: MapPin,
    phone: Phone,
    email: Mail,
  };

  return (
    <section className="bg-white px-5 py-16 tablet:px-8 tablet:py-20 desktop:px-[90px] desktop:py-[110px]">
      <div className="mx-auto grid max-w-[1380px] gap-8 desktop:grid-cols-2 desktop:items-stretch desktop:gap-10">
        {/* INFOS CONTACT */}
        <div className="border border-[#b48a45]/20 bg-white/60 p-5 backdrop-blur-[2px] tablet:p-8 desktop:p-12">
          <div className="flex items-center gap-3">
            <div className="h-px w-10 bg-[#b48a45] tablet:w-12" />
            <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[#b48a45] tablet:text-[13px] tablet:tracking-[0.32em]">
              Nous joindre
            </p>
          </div>

          <div className="mt-8 space-y-6 tablet:mt-10 tablet:space-y-4">
            {dataLoading
              ? ["Adresse", "Téléphone", "Email"].map((label) => (
                  <div
                    key={label}
                    className="flex items-start gap-4 pb-6 last:border-b-0 last:pb-0 tablet:pb-8"
                  >
                    <div className="mt-1 h-10 w-10 shrink-0 animate-pulse rounded-full bg-[#b48a45]/10 tablet:h-11 tablet:w-11" />

                    <div className="min-w-0 flex-1">
                      <div className="h-3 w-24 animate-pulse rounded bg-[#b48a45]/12" />
                      <div className="mt-4 h-5 w-full max-w-[320px] animate-pulse rounded bg-black/8 tablet:h-6" />
                    </div>
                  </div>
                ))
              : infos.map((item) => {
                  const Icon = iconByKey[item.key] || MapPin;

                  return (
                    <div
                      key={item.label}
                      className="flex items-start gap-4 pb-6 last:border-b-0 last:pb-0 tablet:pb-8"
                    >
                      <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#b48a45]/25 text-[#b48a45] tablet:h-11 tablet:w-11">
                        <Icon
                          size={18}
                          strokeWidth={1.5}
                          className="tablet:h-[19px] tablet:w-[19px]"
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="text-[11px] uppercase tracking-[0.22em] text-[#b48a45] tablet:text-[13px] tablet:tracking-[0.28em]">
                          {item.label}
                        </p>

                        {item.href ? (
                          <a
                            href={item.href}
                            className="mt-3 inline-block break-words text-[16px] font-light leading-[1.7] text-black/75 transition hover:text-[#b48a45] tablet:text-[19px]"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="mt-3 break-words text-[16px] font-light leading-[1.7] text-black/75 tablet:text-[19px]">
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
        <div className="relative h-[320px] w-full overflow-hidden rounded-[6px] border border-black/5 shadow-sm tablet:h-[420px] desktop:h-full desktop:min-h-[520px]">
          {dataLoading ? (
            <div className="absolute inset-0 animate-pulse bg-[#eeebe6]" />
          ) : mapSrc ? (
            <iframe
              title="map"
              src={mapSrc}
              className="h-full w-full border-0"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-[#f7f4ef] px-6 text-center text-[15px] font-light text-black/45 tablet:text-[17px]">
              -
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
