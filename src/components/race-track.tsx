"use client";

import type { RaceEntry } from "@/lib/race-service";

type RaceTrackProps = {
  entries: RaceEntry[];
  userProgress: number;
  elapsedSeconds: number;
  personalBestWpm: number;
  userWpm: number;
  totalCharacters: number;
};

function getRaceProgress(wpm: number, elapsedSeconds: number, totalCharacters: number): number {
  if (totalCharacters <= 0) return 0;
  return Math.min(100, Math.round((wpm * elapsedSeconds * 5 * 100) / 60 / totalCharacters));
}

export function RaceTrack({
  entries,
  userProgress,
  elapsedSeconds,
  personalBestWpm,
  userWpm,
  totalCharacters,
}: RaceTrackProps) {
  const lanes = [
    { label: "You", wpm: userWpm, progress: userProgress, isYou: true },
    ...(personalBestWpm > 0
      ? [
          {
            label: "Personal best",
            wpm: personalBestWpm,
            progress: getRaceProgress(personalBestWpm, elapsedSeconds, totalCharacters),
            isYou: false,
          },
        ]
      : []),
    ...entries.slice(0, 3).map((entry) => ({
      label: entry.alias,
      wpm: entry.wpm,
      progress: getRaceProgress(entry.wpm, elapsedSeconds, totalCharacters),
      isYou: false,
    })),
  ];

  return (
    <section className="surface-card mb-4 p-4 sm:p-5" aria-labelledby="race-track-title">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="eyebrow text-primary">Ghost race</p>
          <h2 id="race-track-title" className="mt-1 text-sm font-semibold">Your pace, in motion</h2>
        </div>
        <span className="text-xs tabular-nums text-muted-foreground">{userWpm} WPM</span>
      </div>
      <ol className="mt-4 space-y-3">
        {lanes.map((lane, index) => (
          <li key={`${lane.label}-${index}`}>
            <div className="mb-1.5 flex items-center justify-between gap-2 text-[10px]">
              <span className={`truncate font-semibold ${lane.isYou ? "text-primary" : ""}`}>
                {lane.label}
              </span>
              <span className="shrink-0 tabular-nums text-muted-foreground">{lane.wpm} WPM</span>
            </div>
            <div
              className="race-track"
              role="progressbar"
              aria-label={`${lane.label} race progress`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={lane.progress}
            >
              <span
                className={`race-track-runner ${lane.isYou ? "race-track-runner-you" : ""}`}
                style={{ left: `${lane.progress}%` }}
                aria-hidden="true"
              >
                {lane.isYou ? "●" : "◆"}
              </span>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-[10px] leading-5 text-muted-foreground">
        Other racers&apos; progress is estimated from their server-computed pace; race timing is measured on your device.
      </p>
    </section>
  );
}
