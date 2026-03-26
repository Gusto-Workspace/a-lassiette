import { useEffect, useState } from "react";
import Image from "next/image";
import { Play, X } from "lucide-react";

export default function VideoBannerHomeComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <section className="relative w-full">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group relative block h-[350px] tablet:h-[650px] w-full overflow-hidden"
          aria-label="Lire la vidéo"
        >
          <Image
            src="/img/video-banner/1.png"
            alt="Présentation du restaurant"
            fill
            className="object-cover transition duration-700 group-hover:scale-[1.03]"
            priority={false}
          />

          <div className="absolute inset-0 bg-black/40 transition duration-500 group-hover:bg-black/30" />

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-[116px] w-[116px] items-center justify-center rounded-full border border-white/90 bg-white/5 backdrop-blur-[2px] transition duration-300 group-hover:scale-105">
              <Play
                size={30}
                strokeWidth={1.8}
                className="ml-1 fill-white text-white"
              />
            </div>
          </div>
        </button>
      </section>

      {isOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 px-6 py-10"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative w-full max-w-[1200px]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute -top-14 right-0 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
              aria-label="Fermer la vidéo"
            >
              <X size={20} strokeWidth={1.8} />
            </button>

            <div className="flex justify-center">
              <div className="max-h-[85vh] w-auto overflow-hidden bg-black shadow-2xl">
                <video
                  className="h-full w-auto max-h-[85vh]"
                  src="/img/video-banner/video.mp4"
                  controls
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
