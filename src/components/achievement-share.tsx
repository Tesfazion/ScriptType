"use client";

import { Check, Copy, Share2 } from "lucide-react";
import { useState } from "react";

type AchievementShareProps = {
  name: string;
  description: string;
};

export function AchievementShare({
  name,
  description,
}: AchievementShareProps) {
  const [copied, setCopied] = useState(false);
  const shareText = `I earned the ${name} badge on ScriptType: ${description}`;
  const shareUrl =
    typeof window === "undefined"
      ? "http://127.0.0.1:3646/"
      : window.location.origin;

  async function shareAchievement() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${name} · ScriptType`,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch {
        return;
      }
    }

    await copyAchievement();
  }

  async function copyAchievement() {
    try {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={shareAchievement}
        className="grid size-8 place-items-center rounded-full text-[#7a641f] transition hover:bg-[#eedda9] dark:text-[#f2c46f] dark:hover:bg-[#493a22]"
        aria-label={`Share ${name} achievement`}
        title={`Share ${name}`}
      >
        <Share2 size={13} aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={copyAchievement}
        className="grid size-8 place-items-center rounded-full text-[#7a641f] transition hover:bg-[#eedda9] dark:text-[#f2c46f] dark:hover:bg-[#493a22]"
        aria-label={`Copy ${name} achievement`}
        title={copied ? "Copied" : "Copy share text"}
      >
        {copied ? (
          <Check size={13} aria-hidden="true" />
        ) : (
          <Copy size={13} aria-hidden="true" />
        )}
      </button>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`}
        target="_blank"
        rel="noreferrer"
        className="grid size-8 place-items-center rounded-full text-[#7a641f] transition hover:bg-[#eedda9] dark:text-[#f2c46f] dark:hover:bg-[#493a22]"
        aria-label={`Share ${name} on X`}
        title="Share on X"
      >
        <span className="text-[11px] font-bold">X</span>
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`}
        target="_blank"
        rel="noreferrer"
        className="grid size-8 place-items-center rounded-full text-[#7a641f] transition hover:bg-[#eedda9] dark:text-[#f2c46f] dark:hover:bg-[#493a22]"
        aria-label={`Share ${name} on Facebook`}
        title="Share on Facebook"
      >
        <span className="text-[11px] font-bold">f</span>
      </a>
    </div>
  );
}
