"use client";

import {
  getKeyboardGuidance,
  type TypingFinger,
} from "../../shared/typing-curriculum";

const KEY_ROWS = [
  { className: "pl-0", keys: ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "⌫"] },
  { className: "pl-3", keys: ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\"] },
  { className: "pl-5", keys: ["A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'", "↵"] },
  { className: "pl-8", keys: ["Z", "X", "C", "V", "B", "N", "M", ",", ".", "/"] },
];

const HAND_FINGERS: Array<{ name: TypingFinger; label: string }> = [
  { name: "Left pinky", label: "Pinky" },
  { name: "Left ring finger", label: "Ring" },
  { name: "Left middle finger", label: "Middle" },
  { name: "Left index finger", label: "Index" },
  { name: "Thumbs", label: "Thumb" },
];

function HandGuide({
  hand,
  activeFinger,
}: {
  hand: "left" | "right";
  activeFinger: TypingFinger;
}) {
  const fingers =
    hand === "left"
      ? HAND_FINGERS
      : HAND_FINGERS.map(({ name, label }) => ({
          name:
            name === "Left pinky"
              ? "Right pinky"
              : name === "Left ring finger"
                ? "Right ring finger"
                : name === "Left middle finger"
                  ? "Right middle finger"
                  : name === "Left index finger"
                    ? "Right index finger"
                    : name,
          label,
        }));

  return (
    <figure className="min-w-0">
      <figcaption className="text-center text-[10px] font-semibold text-muted-foreground">
        {hand === "left" ? "Left hand" : "Right hand"}
      </figcaption>
      <div
        className={`hand-illustration mt-2 ${hand === "right" ? "hand-illustration-right" : ""}`}
        role="img"
        aria-label={`${hand} hand finger guide${fingers.some((finger) => finger.name === activeFinger) ? `; ${activeFinger} highlighted` : ""}`}
      >
        <div className="hand-fingers" aria-hidden="true">
          {fingers.map(({ name, label }) => (
            <div key={label} className="hand-finger-wrap">
              <span
                className={`hand-finger ${activeFinger === name ? "hand-finger-active" : ""}`}
              />
              <span className="hand-finger-label">{label}</span>
            </div>
          ))}
        </div>
        <span className="hand-palm" aria-hidden="true" />
      </div>
    </figure>
  );
}

export function KeyboardCoach({
  targetCharacter,
  coachingTip,
}: {
  targetCharacter: string;
  coachingTip: string;
}) {
  const guidance = getKeyboardGuidance(targetCharacter);
  const isTarget = (key: string) =>
    targetCharacter !== " " &&
    key.toLocaleLowerCase() === guidance.key.toLocaleLowerCase();

  return (
    <aside
      className="surface-muted mt-5 overflow-hidden rounded-panel p-4 sm:p-5"
      aria-label="Keyboard and hand guidance"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="eyebrow text-primary">Your next key</p>
          <p className="mt-1 text-sm font-semibold">
            {targetCharacter === " " ? "Space bar" : `"${targetCharacter}"`} · {guidance.finger}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {guidance.zone} · {guidance.hand === "both" ? "Use either thumb" : `Move your ${guidance.hand} hand`}
          </p>
        </div>
        <span className="grid size-11 shrink-0 place-items-center rounded-control bg-primary text-base font-semibold text-primary-foreground">
          {targetCharacter === " " ? "␣" : targetCharacter.toUpperCase()}
        </span>
      </div>

      <div className="mt-4 overflow-x-auto pb-2" tabIndex={0} aria-label="Keyboard diagram; scroll horizontally to view all keys">
        <div className="min-w-[30rem] space-y-1.5" role="img" aria-label={`QWERTY keyboard with ${guidance.key} highlighted`}>
          {KEY_ROWS.map((row) => (
            <div key={row.keys.join(" ")} className={`flex gap-1 ${row.className}`}>
              {row.keys.map((key) => (
                <kbd
                  key={key}
                  className={`relative grid h-7 min-w-7 flex-1 place-items-center rounded-md border bg-card text-[9px] font-medium text-muted-foreground ${
                    isTarget(key)
                      ? "border-primary bg-primary text-primary-foreground shadow-sm"
                      : ""
                  }`}
                >
                  {key}
                  {(key === "F" || key === "J") && (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0.5 h-px w-2 bg-current opacity-50"
                    />
                  )}
                </kbd>
              ))}
            </div>
          ))}
          <div className="flex justify-center pt-1">
            <kbd
              className={`grid h-7 w-2/5 place-items-center rounded-md border bg-card text-[9px] font-medium text-muted-foreground ${
                targetCharacter === " " ? "border-primary bg-primary text-primary-foreground" : ""
              }`}
            >
              space
            </kbd>
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-4 border-t pt-3 hidden lg:block">
        <HandGuide hand="left" activeFinger={guidance.finger} />
        <HandGuide hand="right" activeFinger={guidance.finger} />
      </div>
      <p className="mt-3 text-xs leading-5 text-muted-foreground">{coachingTip}</p>
    </aside>
  );
}
