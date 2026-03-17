import { useState, useContext } from "react";

// I18N
import { useTranslation } from "next-i18next";

// CONTEXT
import { GlobalContext } from "@/contexts/global.context";

// REACT HOOK FORM
import { useForm } from "react-hook-form";

// LUCIDE
import { Loader2, Check, Mail, Phone, User, MessageSquare } from "lucide-react";

export default function FormContactCompnent() {
  const { t } = useTranslation("contact");
  const { restaurantContext } = useContext(GlobalContext);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  async function onSubmit(data) {
    setIsSubmitting(true);

    // try {
    //   const response = await fetch("/api/contact-form-email", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       ...data,
    //       restaurantName: restaurantContext?.name || "",
    //     }),
    //   });

    //   if (response.ok) {
    //     setIsSubmitted(true);
    //     reset();
    //   } else {
    //     console.error("Réponse du serveur: erreur", response);
    //   }
    // } catch (error) {
    //   console.error("Erreur lors de l'envoi de la requête:", error);
    // } finally {
    //   setIsSubmitting(false);
    // }
  }

  return (
    <section className="w-full bg-[#eeebe6] text-[#111111] ">
      <div className="border border-[#b48a45]/20 bg-white/60 p-8 backdrop-blur-[2px] desktop:p-12 w-full h-full">
        {isSubmitted ? (
          <div className="flex min-h-[520px] flex-col items-center justify-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#b48a45]/25 text-[#b48a45]">
              <Check size={28} strokeWidth={1.7} />
            </div>

            <h3 className="yeseva-one-regular mt-8 text-[30px] uppercase leading-[1.1] desktop:text-[42px]">
              Message envoyé
            </h3>

            <p className="mt-5 max-w-[520px] text-[17px] font-light leading-[1.85] text-black/60">
              Merci pour votre message. Nous reviendrons vers vous dès que
              possible.
            </p>

            <button
              type="button"
              onClick={() => setIsSubmitted(false)}
              className="mt-10 flex h-[52px] min-w-[230px] items-center justify-center bg-[#bb924b] px-8 text-[14px] font-medium uppercase tracking-[0.28em] text-white transition hover:opacity-90"
            >
              Envoyer un autre message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6 desktop:grid-cols-2">
              <div>
                <label className="mb-3 block text-[13px] uppercase tracking-[0.28em] text-[#b48a45]">
                  Nom complet *
                </label>

                <div className="relative">
                  <User
                    size={17}
                    strokeWidth={1.5}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-black/35"
                  />

                  <input
                    type="text"
                    placeholder="Votre nom"
                    className="h-[58px] w-full border border-black/10 bg-white px-12 text-[16px] font-light text-black outline-none transition placeholder:text-black/30 focus:border-[#b48a45]/50"
                    {...register("fullName", {
                      required: "Veuillez renseigner votre nom.",
                    })}
                  />
                </div>

                {errors.fullName && (
                  <p className="mt-2 text-[14px] text-[#a14646]">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-3 block text-[13px] uppercase tracking-[0.28em] text-[#b48a45]">
                  Email *
                </label>

                <div className="relative">
                  <Mail
                    size={17}
                    strokeWidth={1.5}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-black/35"
                  />

                  <input
                    type="email"
                    placeholder="Votre email"
                    className="h-[58px] w-full border border-black/10 bg-white px-12 text-[16px] font-light text-black outline-none transition placeholder:text-black/30 focus:border-[#b48a45]/50"
                    {...register("email", {
                      required: "Veuillez renseigner votre email.",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Veuillez saisir un email valide.",
                      },
                    })}
                  />
                </div>

                {errors.email && (
                  <p className="mt-2 text-[14px] text-[#a14646]">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-6 desktop:grid-cols-2">
              <div>
                <label className="mb-3 block text-[13px] uppercase tracking-[0.28em] text-[#b48a45]">
                  Téléphone
                </label>

                <div className="relative">
                  <Phone
                    size={17}
                    strokeWidth={1.5}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-black/35"
                  />

                  <input
                    type="text"
                    placeholder="Votre téléphone"
                    className="h-[58px] w-full border border-black/10 bg-white px-12 text-[16px] font-light text-black outline-none transition placeholder:text-black/30 focus:border-[#b48a45]/50"
                    {...register("phone")}
                  />
                </div>
              </div>

              <div>
                <label className="mb-3 block text-[13px] uppercase tracking-[0.28em] text-[#b48a45]">
                  Sujet *
                </label>

                <input
                  type="text"
                  placeholder="Objet de votre message"
                  className="h-[58px] w-full border border-black/10 bg-white px-5 text-[16px] font-light text-black outline-none transition placeholder:text-black/30 focus:border-[#b48a45]/50"
                  {...register("subject", {
                    required: "Veuillez renseigner un sujet.",
                  })}
                />

                {errors.subject && (
                  <p className="mt-2 text-[14px] text-[#a14646]">
                    {errors.subject.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="mb-3 block text-[13px] uppercase tracking-[0.28em] text-[#b48a45]">
                Message *
              </label>

              <div className="relative">
                <MessageSquare
                  size={17}
                  strokeWidth={1.5}
                  className="pointer-events-none absolute left-4 top-5 text-black/35"
                />

                <textarea
                  rows={8}
                  placeholder="Votre message..."
                  className="w-full resize-none border border-black/10 bg-white px-12 py-4 text-[16px] font-light leading-[1.8] text-black outline-none transition placeholder:text-black/30 focus:border-[#b48a45]/50"
                  {...register("message", {
                    required: "Veuillez écrire votre message.",
                  })}
                />
              </div>

              {errors.message && (
                <p className="mt-2 text-[14px] text-[#a14646]">
                  {errors.message.message}
                </p>
              )}
            </div>

            <div className="flex flex-col items-start gap-4 pt-2">
              <p className="max-w-[520px] text-[14px] font-light leading-[1.8] text-black/45">
                En envoyant ce formulaire, vous acceptez d’être recontacté dans
                le cadre de votre demande.
              </p>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex h-[54px] min-w-[230px] items-center justify-center gap-3 bg-[#bb924b] px-8 text-[14px] font-medium uppercase tracking-[0.28em] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Envoi...
                  </>
                ) : (
                  <>
                    Envoyer
                    <span className="text-[10px] opacity-80">◆</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
