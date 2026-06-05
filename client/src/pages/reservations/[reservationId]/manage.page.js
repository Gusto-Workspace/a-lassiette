import ManageReservationsComponent from "@/components/reservations/manage.reservations.component";
import SeoHeadComponent from "@/components/_shared/seo/seo-head.component";

export default function ReservationManagePage({ reservationId }) {
  return (
    <>
      <SeoHeadComponent
        title="Annuler ma réservation - À l'Assiette"
        description="Consultez votre réservation À l’Assiette et annulez-la en ligne si nécessaire."
        path={
          reservationId
            ? `/reservations/${reservationId}/manage`
            : "/reservations"
        }
        image="/img/reservations/2.jpg"
        noIndex={true}
      />

      <ManageReservationsComponent
        reservationId={reservationId}
        apiBaseUrl={process.env.NEXT_PUBLIC_API_URL}
      />
    </>
  );
}

export async function getServerSideProps(context) {
  const { reservationId } = context.params;

  return {
    props: {
      reservationId: reservationId || null,
    },
  };
}
