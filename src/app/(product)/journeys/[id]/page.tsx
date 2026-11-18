import { notFound } from "next/navigation";
import { JourneyDetail } from "@/components/journey-detail";
import { journeys } from "@/data/journeys";

export default async function JourneyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const journey = journeys.find((item) => item.id === id);
  if (!journey) notFound();

  return <JourneyDetail journey={journey} />;
}
