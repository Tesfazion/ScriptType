export type Verse = {
  id: string;
  reference: string;
  text: string;
  theme: string;
  provenance: string;
  reviewStatus: "approved-demo";
};

const provenance =
  "King James Version (1769 edition); public-domain text in the United States. Verify local rights and audio rights before production distribution.";

export const verses: Verse[] = [
  {
    id: "john-1-1",
    reference: "John 1:1",
    text: "In the beginning was the Word, and the Word was with God, and the Word was God.",
    theme: "Beginnings",
    provenance,
    reviewStatus: "approved-demo",
  },
  {
    id: "psalm-119-105",
    reference: "Psalm 119:105",
    text: "Thy word is a lamp unto my feet, and a light unto my path.",
    theme: "Guidance",
    provenance,
    reviewStatus: "approved-demo",
  },
  {
    id: "philippians-4-13",
    reference: "Philippians 4:13",
    text: "I can do all things through Christ which strengtheneth me.",
    theme: "Strength",
    provenance,
    reviewStatus: "approved-demo",
  },
  {
    id: "proverbs-3-5-6",
    reference: "Proverbs 3:5–6",
    text: "Trust in the LORD with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths.",
    theme: "Trust",
    provenance,
    reviewStatus: "approved-demo",
  },
  {
    id: "romans-8-28",
    reference: "Romans 8:28",
    text: "And we know that all things work together for good to them that love God, to them who are the called according to his purpose.",
    theme: "Hope",
    provenance,
    reviewStatus: "approved-demo",
  },
  {
    id: "psalm-23-1",
    reference: "Psalm 23:1",
    text: "The LORD is my shepherd; I shall not want.",
    theme: "Care",
    provenance,
    reviewStatus: "approved-demo",
  },
  {
    id: "matthew-5-16",
    reference: "Matthew 5:16",
    text: "Let your light so shine before men, that they may see your good works, and glorify your Father which is in heaven.",
    theme: "Purpose",
    provenance,
    reviewStatus: "approved-demo",
  },
  {
    id: "isaiah-40-31",
    reference: "Isaiah 40:31",
    text: "But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.",
    theme: "Renewal",
    provenance,
    reviewStatus: "approved-demo",
  },
  {
    id: "genesis-1-1",
    reference: "Genesis 1:1",
    text: "In the beginning God created the heaven and the earth.",
    theme: "Creation",
    provenance,
    reviewStatus: "approved-demo",
  },
  {
    id: "psalm-119-11",
    reference: "Psalm 119:11",
    text: "Thy word have I hid in mine heart, that I might not sin against thee.",
    theme: "Memorization",
    provenance,
    reviewStatus: "approved-demo",
  },
  {
    id: "psalm-46-1",
    reference: "Psalm 46:1",
    text: "God is our refuge and strength, a very present help in trouble.",
    theme: "Refuge",
    provenance,
    reviewStatus: "approved-demo",
  },
  {
    id: "proverbs-3-5",
    reference: "Proverbs 3:5",
    text: "Trust in the LORD with all thine heart; and lean not unto thine own understanding.",
    theme: "Trust",
    provenance,
    reviewStatus: "approved-demo",
  },
  {
    id: "matthew-11-28",
    reference: "Matthew 11:28",
    text: "Come unto me, all ye that labour and are heavy laden, and I will give you rest.",
    theme: "Rest",
    provenance,
    reviewStatus: "approved-demo",
  },
  {
    id: "john-14-6",
    reference: "John 14:6",
    text: "I am the way, the truth, and the life: no man cometh unto the Father, but by me.",
    theme: "Truth",
    provenance,
    reviewStatus: "approved-demo",
  },
  {
    id: "colossians-3-2",
    reference: "Colossians 3:2",
    text: "Set your affection on things above, not on things on the earth.",
    theme: "Focus",
    provenance,
    reviewStatus: "approved-demo",
  },
  {
    id: "romans-10-17",
    reference: "Romans 10:17",
    text: "So then faith cometh by hearing, and hearing by the word of God.",
    theme: "Faith",
    provenance,
    reviewStatus: "approved-demo",
  },
  {
    id: "hebrews-11-1",
    reference: "Hebrews 11:1",
    text: "Now faith is the substance of things hoped for, the evidence of things not seen.",
    theme: "Faith",
    provenance,
    reviewStatus: "approved-demo",
  },
  {
    id: "psalm-23-4",
    reference: "Psalm 23:4",
    text: "Yea, though I walk through the valley of the shadow of death, I will fear no evil.",
    theme: "Comfort",
    provenance,
    reviewStatus: "approved-demo",
  },
  {
    id: "psalm-139-14",
    reference: "Psalm 139:14",
    text: "I will praise thee; for I am fearfully and wonderfully made: marvellous are thy works; and that my soul knoweth right well.",
    theme: "Identity",
    provenance,
    reviewStatus: "approved-demo",
  },
];

export function getVerse(verseId: string): Verse | undefined {
  return verses.find((verse) => verse.id === verseId);
}
