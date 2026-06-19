import SeoHeadComponent from "@/components/_shared/seo/seo-head.component";
import WaitlistOfferReservationsComponent from "@/components/reservations/waitlist-offer.reservations.component";

export default function ReservationWaitlistOfferPage({ token }) {
  return (
    <>
      <SeoHeadComponent
        title="Liste d’attente - À l'Assiette"
        description="Répondez à une proposition de place pour votre réservation À l’Assiette."
        path={token ? `/reservations/waitlist-offer/${token}` : "/reservations"}
        image="/img/reservations/2.jpg"
        noIndex={true}
      />

      <WaitlistOfferReservationsComponent
        token={token}
        apiBaseUrl={process.env.NEXT_PUBLIC_API_URL}
      />
    </>
  );
}

export async function getServerSideProps(context) {
  const { token } = context.params;

  return {
    props: {
      token: token || null,
    },
  };
}
