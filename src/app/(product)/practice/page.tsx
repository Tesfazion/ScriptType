import { Suspense } from "react";
import Link from "next/link";
import { Brain, Code2, Keyboard, Gauge, Target, Trophy, Zap } from "lucide-react";
import { ChallengeRoute } from "@/components/challenge-route";

export default function PracticePage() {
  return (
    <div className="space-y-5">
      <div className="surface-card p-4 sm:p-5">
        <p className="eyebrow">Practice modes</p>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-5">
          {[
            { label: "Beginner", icon: Keyboard, href: "/trainer" },
            { label: "Guided", icon: Gauge, href: "/trainer" },
            { label: "Classic", icon: Keyboard, href: "/practice", active: true },
            { label: "Accuracy", icon: Target, href: "/practice?mode=accuracy" },
            { label: "Speed", icon: Zap, href: "/practice?mode=speed" },
            { label: "Coding", icon: Code2, href: "/practice?stage=coding-symbols" },
            { label: "Race", icon: Trophy, href: "/practice?mode=race" },
            { label: "Challenge", icon: Trophy, href: "/practice?mode=challenge" },
            { label: "Zen mode", icon: Brain, href: "/memory" },
          ].map(({ label, icon: Icon, href, active }) => (
            <Link
              key={label}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`flex min-h-12 items-center gap-2 rounded-control border px-3 text-xs font-semibold transition ${
                active ? "border-primary bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground"
              }`}
            >
              <Icon size={15} aria-hidden="true" />
              {label}
            </Link>
          ))}
        </div>
      </div>
      <Suspense fallback={<div className="min-h-[28rem]" aria-busy="true" />}>
        <ChallengeRoute initialMode="typing" />
      </Suspense>
    </div>
  );
}
