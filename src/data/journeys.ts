export type Journey = {
  id: string;
  title: string;
  subtitle: string;
  lengthLabel: string;
  category: string;
  color: "violet" | "green" | "gold";
  verseIds: string[];
  premium?: boolean;
};

export const journeys: Journey[] = [
  {
    id: "gospel-of-john",
    title: "The Gospel of John",
    subtitle: "Meet Jesus through the story of the Word made flesh.",
    lengthLabel: "3-step preview",
    category: "GOSPELS",
    color: "violet",
    verseIds: ["john-1-1", "matthew-5-16", "psalm-23-1"],
  },
  {
    id: "psalms-for-the-soul",
    title: "Psalms for the Soul",
    subtitle: "A steadier rhythm for finding words in every season.",
    lengthLabel: "3-step preview",
    category: "WISDOM",
    color: "green",
    verseIds: ["psalm-119-105", "psalm-23-1", "isaiah-40-31"],
  },
  {
    id: "proverbs-31",
    title: "31 Days in Proverbs",
    subtitle: "One small practice in wisdom, every day.",
    lengthLabel: "3-step preview",
    category: "WISDOM",
    color: "gold",
    verseIds: ["proverbs-3-5-6", "philippians-4-13", "matthew-5-16"],
  },
  {
    id: "new-testament-path",
    title: "New Testament Path",
    subtitle: "A guided overview of the life and teaching of Jesus.",
    lengthLabel: "3-step preview",
    category: "READING PLAN",
    color: "violet",
    verseIds: ["john-1-1", "philippians-4-13", "romans-8-28"],
    premium: true,
  },
  {
    id: "bible-in-a-year",
    title: "Bible in a Year",
    subtitle: "A structured reading rhythm with a verse to remember.",
    lengthLabel: "3-step preview",
    category: "READING PLAN",
    color: "green",
    verseIds: ["psalm-119-105", "proverbs-3-5-6", "romans-8-28"],
    premium: true,
  },
];

export const achievements = [
  { id: "first-verse", name: "First Light", description: "Complete your first verse.", icon: "sparkles" },
  { id: "seven-day-streak", name: "A Week in the Word", description: "Practice on 7 consecutive days.", icon: "flame" },
  { id: "thirty-day-streak", name: "Steady Heart", description: "Practice on 30 consecutive days.", icon: "flame" },
  { id: "hundred-verses", name: "Word by Word", description: "Type 100 verses.", icon: "book-open" },
  { id: "thousand-verses", name: "Scripture Keeper", description: "Type 1,000 verses.", icon: "book-open" },
  { id: "memory-champion", name: "Held in the Heart", description: "Recall a verse with 90% accuracy.", icon: "brain" },
  { id: "perfect-accuracy", name: "Steady Hands", description: "Complete a verse with 100% accuracy.", icon: "sparkles" },
];
