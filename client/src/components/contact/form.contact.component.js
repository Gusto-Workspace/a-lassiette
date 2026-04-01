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
  const restaurantData = restaurantContext?.restaurantData;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  async function onSubmit(data) {
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/contact-form-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.fullName,
          email: data.email,
          phone: data.phone,
          subject: data.subject,
          message: data.message,
          restaurantName: restaurantData?.name || "",
          restaurantEmail: restaurantData?.email || "",
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'envoi du formulaire.");
      }

      setIsSubmitted(true);
      reset();
    } catch (error) {
      console.error("Erreur lors de l'envoi du formulaire:", error);
      setSubmitError(
        "Une erreur est survenue. Veuillez réessayer ou nous contacter par téléphone.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="w-full bg-[#eeebe6] text-[#111111]">
      <div className="h-full w-full border border-[#b48a45]/20 bg-white/60 p-5 backdrop-blur-[2px] tablet:p-8 desktop:p-12">
        {isSubmitted ? (
          <div className="flex min-h-[420px] flex-col items-center justify-center text-center tablet:min-h-[520px]">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#b48a45]/25 text-[#b48a45] tablet:h-16 tablet:w-16">
              <Check
                size={26}
                strokeWidth={1.7}
                className="tablet:h-7 tablet:w-7"
              />
            </div>

            <h3 className="yeseva-one-regular mt-6 text-[24px] uppercase leading-[1.1] tablet:mt-8 tablet:text-[30px] desktop:text-[42px]">
              Message envoyé
            </h3>

            <p className="mt-4 max-w-[520px] text-[15px] font-light leading-[1.8] text-black/60 tablet:mt-5 tablet:text-[16px] desktop:text-[17px]">
              Merci pour votre message. Nous reviendrons vers vous dès que
              possible.
            </p>

            <button
              type="button"
              onClick={() => setIsSubmitted(false)}
              className="mt-8 flex h-[50px] min-w-[210px] items-center justify-center bg-[#bb924b] px-6 text-[12px] font-medium uppercase tracking-[0.22em] text-white transition hover:opacity-90 tablet:mt-10 tablet:h-[52px] tablet:min-w-[230px] tablet:px-8 tablet:text-[14px] tablet:tracking-[0.28em]"
            >
              Envoyer un autre message
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5 tablet:space-y-6"
          >
            {submitError ? (
              <div className="border border-[#a14646]/20 bg-[#a14646]/5 px-4 py-3 text-[14px] font-light leading-[1.7] text-[#8f3939] tablet:text-[15px]">
                {submitError}
              </div>
            ) : null}

            <div className="grid gap-5 tablet:gap-6 desktop:grid-cols-2">
              <div>
                <label className="mb-3 block text-[11px] uppercase tracking-[0.22em] text-[#b48a45] tablet:text-[13px] tablet:tracking-[0.28em]">
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
                    className="h-[54px] w-full border border-black/10 bg-white px-11 text-[15px] font-light text-black outline-none transition placeholder:text-black/30 focus:border-[#b48a45]/50 tablet:h-[58px] tablet:px-12 tablet:text-[16px]"
                    {...register("fullName", {
                      required: "Veuillez renseigner votre nom.",
                    })}
                  />
                </div>

                {errors.fullName && (
                  <p className="mt-2 text-[13px] text-[#a14646] tablet:text-[14px]">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-3 block text-[11px] uppercase tracking-[0.22em] text-[#b48a45] tablet:text-[13px] tablet:tracking-[0.28em]">
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
                    className="h-[54px] w-full border border-black/10 bg-white px-11 text-[15px] font-light text-black outline-none transition placeholder:text-black/30 focus:border-[#b48a45]/50 tablet:h-[58px] tablet:px-12 tablet:text-[16px]"
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
                  <p className="mt-2 text-[13px] text-[#a14646] tablet:text-[14px]">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-5 tablet:gap-6 desktop:grid-cols-2">
              <div>
                <label className="mb-3 block text-[11px] uppercase tracking-[0.22em] text-[#b48a45] tablet:text-[13px] tablet:tracking-[0.28em]">
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
                    className="h-[54px] w-full border border-black/10 bg-white px-11 text-[15px] font-light text-black outline-none transition placeholder:text-black/30 focus:border-[#b48a45]/50 tablet:h-[58px] tablet:px-12 tablet:text-[16px]"
                    {...register("phone")}
                  />
                </div>
              </div>

              <div>
                <label className="mb-3 block text-[11px] uppercase tracking-[0.22em] text-[#b48a45] tablet:text-[13px] tablet:tracking-[0.28em]">
                  Sujet *
                </label>

                <input
                  type="text"
                  placeholder="Objet de votre message"
                  className="h-[54px] w-full border border-black/10 bg-white px-4 text-[15px] font-light text-black outline-none transition placeholder:text-black/30 focus:border-[#b48a45]/50 tablet:h-[58px] tablet:px-5 tablet:text-[16px]"
                  {...register("subject", {
                    required: "Veuillez renseigner un sujet.",
                  })}
                />

                {errors.subject && (
                  <p className="mt-2 text-[13px] text-[#a14646] tablet:text-[14px]">
                    {errors.subject.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="mb-3 block text-[11px] uppercase tracking-[0.22em] text-[#b48a45] tablet:text-[13px] tablet:tracking-[0.28em]">
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
                  className="w-full resize-none border border-black/10 bg-white px-11 py-4 text-[15px] font-light leading-[1.8] text-black outline-none transition placeholder:text-black/30 focus:border-[#b48a45]/50 tablet:px-12 tablet:text-[16px]"
                  {...register("message", {
                    required: "Veuillez écrire votre message.",
                  })}
                />
              </div>

              {errors.message && (
                <p className="mt-2 text-[13px] text-[#a14646] tablet:text-[14px]">
                  {errors.message.message}
                </p>
              )}
            </div>

            <div className="flex flex-col items-start gap-4 pt-1 tablet:pt-2">
              <p className="max-w-[520px] text-[13px] font-light leading-[1.75] text-black/45 tablet:text-[14px] tablet:leading-[1.8]">
                En envoyant ce formulaire, vous acceptez d’être recontacté dans
                le cadre de votre demande.
              </p>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex h-[50px] min-w-[210px] items-center justify-center gap-3 bg-[#bb924b] px-6 text-[12px] font-medium uppercase tracking-[0.22em] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70 tablet:h-[54px] tablet:min-w-[230px] tablet:px-8 tablet:text-[14px] tablet:tracking-[0.28em]"
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
