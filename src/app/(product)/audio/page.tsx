import { ChallengeRunner } from "@/components/challenge-runner";
import { getVerse } from "@/data/verses";

export default async function AudioPage({
  searchParams,
}: {
  searchParams: Promise<{ verse?: string }>;
}) {
  const { verse } = await searchParams;
  const initialVerseId = verse && getVerse(verse) ? verse : undefined;
  return <ChallengeRunner initialMode="audio" initialVerseId={initialVerseId} />;
}
