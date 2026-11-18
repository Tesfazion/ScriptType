export type TypingLesson = {
  id: string;
  title: string;
  focus: string;
  text: string;
  estimatedMinutes: number;
  accuracyToUnlock: number;
  coachKey: string;
  coachingTip: string;
};

export type TypingStage = {
  id: string;
  number: number;
  title: string;
  description: string;
  lesson: TypingLesson;
};

export type TypingFinger =
  | "Left pinky"
  | "Left ring finger"
  | "Left middle finger"
  | "Left index finger"
  | "Right index finger"
  | "Right middle finger"
  | "Right ring finger"
  | "Right pinky"
  | "Thumbs";

export type KeyboardGuidance = {
  finger: TypingFinger;
  hand: "left" | "right" | "both";
  zone: string;
  key: string;
};

const ACCURACY_TO_UNLOCK = 90;

export const typingStages: TypingStage[] = [
  {
    id: "keyboard-introduction",
    number: 1,
    title: "Keyboard introduction",
    description: "Meet the key groups, discover the home row markers, and set up comfortably.",
    lesson: {
      id: "keyboard-introduction-lesson",
      title: "A map of keys",
      focus: "Keyboard zones and posture",
      text: "Sit comfortably, relax your shoulders, and keep your wrists level. Find the letter keys, number row, and space bar.",
      estimatedMinutes: 2,
      accuracyToUnlock: ACCURACY_TO_UNLOCK,
      coachKey: "F",
      coachingTip: "Sit upright, relax your shoulders, and keep your wrists floating comfortably above the keyboard.",
    },
  },
  {
    id: "home-row",
    number: 2,
    title: "Home row",
    description: "Rest your fingers on A S D F and J K L ; and return after every reach.",
    lesson: {
      id: "home-row-lesson",
      title: "Find your home row",
      focus: "A S D F · J K L ;",
      text: "asdf jkl; asdf jkl; fall ask flask; sad lads; all ask a salad.",
      estimatedMinutes: 3,
      accuracyToUnlock: ACCURACY_TO_UNLOCK,
      coachKey: "F",
      coachingTip: "Let your index fingers rest on F and J; the raised marks help you find home without looking.",
    },
  },
  {
    id: "finger-positioning",
    number: 3,
    title: "Finger placement",
    description: "Learn which finger owns each zone and return to the home row after each reach.",
    lesson: {
      id: "finger-positioning-lesson",
      title: "One finger at a time",
      focus: "Finger ownership and relaxed reaches",
      text: "Each finger has a home key and a small zone to reach. Move only the finger you need, then return to home row.",
      estimatedMinutes: 3,
      accuracyToUnlock: ACCURACY_TO_UNLOCK,
      coachKey: "J",
      coachingTip: "Keep both hands relaxed and let each finger return to its home key after a reach.",
    },
  },
  {
    id: "left-hand-practice",
    number: 4,
    title: "Left hand",
    description: "Build confidence across the left-side keys while your right hand stays relaxed.",
    lesson: {
      id: "left-hand-practice-lesson",
      title: "Left-side reaches",
      focus: "Q W E R T · A S D F · Z X C V",
      text: "qwer asdf zxcv; read a craft, write a verse, and start a fresh task.",
      estimatedMinutes: 3,
      accuracyToUnlock: ACCURACY_TO_UNLOCK,
      coachKey: "F",
      coachingTip: "Use your left hand for keys through T, G, and B; keep your right hand ready on its home row.",
    },
  },
  {
    id: "right-hand-practice",
    number: 5,
    title: "Right hand",
    description: "Practice right-side reaches, then return each finger to its home key.",
    lesson: {
      id: "right-hand-practice-lesson",
      title: "Right-side reaches",
      focus: "Y U I O P · H J K L ; · N M",
      text: "yuiop hjkl nm; join your rhythm, keep your hands calm, and type one more line.",
      estimatedMinutes: 3,
      accuracyToUnlock: ACCURACY_TO_UNLOCK,
      coachKey: "J",
      coachingTip: "Use your right hand for Y, H, and N and the keys farther right; return to J K L ; afterward.",
    },
  },
  {
    id: "top-row",
    number: 6,
    title: "Top row",
    description: "Reach upward from home row with the finger assigned to each key.",
    lesson: {
      id: "top-row-lesson",
      title: "Reach to the top row",
      focus: "Q W E R T · Y U I O P",
      text: "qwert yuiop quiet power; type every letter with a light reach and return.",
      estimatedMinutes: 3,
      accuracyToUnlock: ACCURACY_TO_UNLOCK,
      coachKey: "E",
      coachingTip: "Reach upward with the assigned finger, keep your wrist still, and return to home row.",
    },
  },
  {
    id: "bottom-row",
    number: 7,
    title: "Bottom row",
    description: "Reach down gently, keeping your wrists relaxed and your hands balanced.",
    lesson: {
      id: "bottom-row-lesson",
      title: "Reach to the bottom row",
      focus: "Z X C V · B N M",
      text: "zxcv bnm; move each finger down gently, then return to the home row.",
      estimatedMinutes: 3,
      accuracyToUnlock: ACCURACY_TO_UNLOCK,
      coachKey: "C",
      coachingTip: "Reach down with one finger without dropping or twisting your wrist.",
    },
  },
  {
    id: "common-letters",
    number: 8,
    title: "Common letters",
    description: "Practice frequent letter patterns with consistent finger movement.",
    lesson: {
      id: "common-letters-lesson",
      title: "Letters in everyday words",
      focus: "E T A O I N S H R",
      text: "there are many ways to share an idea; start with steady hands and clear words.",
      estimatedMinutes: 3,
      accuracyToUnlock: ACCURACY_TO_UNLOCK,
      coachKey: "T",
      coachingTip: "Let your fingers move independently; avoid stretching one finger across another finger's zone.",
    },
  },
  {
    id: "common-words",
    number: 9,
    title: "Common words",
    description: "Connect familiar letter patterns into a smooth, dependable rhythm.",
    lesson: {
      id: "common-words-lesson",
      title: "Everyday words",
      focus: "Useful word patterns",
      text: "People work together to make good ideas clear, useful, and easy to share.",
      estimatedMinutes: 3,
      accuracyToUnlock: ACCURACY_TO_UNLOCK,
      coachKey: "E",
      coachingTip: "Look ahead to the next word while keeping your hands light and accurate.",
    },
  },
  {
    id: "sentences",
    number: 10,
    title: "Sentences",
    description: "Bring spaces, capitals, and punctuation into your steady typing rhythm.",
    lesson: {
      id: "sentences-lesson",
      title: "A complete thought",
      focus: "Spacing and punctuation",
      text: "A calm pace builds confidence. Can you finish this sentence with care?",
      estimatedMinutes: 3,
      accuracyToUnlock: ACCURACY_TO_UNLOCK,
      coachKey: "A",
      coachingTip: "Use the opposite pinky for Shift when possible, and release it before the next key.",
    },
  },
  {
    id: "paragraphs",
    number: 11,
    title: "Paragraphs",
    description: "Keep your posture and accuracy steady through longer pieces of writing.",
    lesson: {
      id: "paragraphs-lesson",
      title: "A longer passage",
      focus: "Endurance and line breaks",
      text: "Good typing is built one thoughtful line at a time. Stay relaxed, let your eyes move ahead, and pause when your hands need a moment. A comfortable rhythm makes longer passages feel easier to manage.",
      estimatedMinutes: 4,
      accuracyToUnlock: ACCURACY_TO_UNLOCK,
      coachKey: "G",
      coachingTip: "Keep a comfortable pace across each line; take a short pause rather than tightening your hands.",
    },
  },
  {
    id: "coding-symbols",
    number: 12,
    title: "Coding symbols",
    description: "Practice the punctuation and paired symbols used in code and markup.",
    lesson: {
      id: "coding-symbols-lesson",
      title: "Symbols in pairs",
      focus: "() [] {} ; : = +",
      text: "let total = (first + second); if (total > 0) { print(total); }",
      estimatedMinutes: 4,
      accuracyToUnlock: ACCURACY_TO_UNLOCK,
      coachKey: "{",
      coachingTip: "On a US layout, symbols use Shift with their paired key; keep both hands relaxed.",
    },
  },
  {
    id: "developer-typing",
    number: 13,
    title: "Developer typing",
    description: "Build accuracy across identifiers, operators, and readable code snippets.",
    lesson: {
      id: "developer-typing-lesson",
      title: "A small function",
      focus: "Code, identifiers, and operators",
      text: "const greet = (name) => { return `Hello, ${name}!`; };",
      estimatedMinutes: 4,
      accuracyToUnlock: ACCURACY_TO_UNLOCK,
      coachKey: "(",
      coachingTip: "Use the key for the symbol, not a neighboring letter; accuracy is more useful than rushing.",
    },
  },
  {
    id: "speed-building",
    number: 14,
    title: "Speed building",
    description: "Increase pace gradually without sacrificing accuracy or comfort.",
    lesson: {
      id: "speed-building-lesson",
      title: "Find a steady speed",
      focus: "A smooth, repeatable pace",
      text: "Keep a smooth rhythm and let each accurate word lead naturally into the next.",
      estimatedMinutes: 4,
      accuracyToUnlock: ACCURACY_TO_UNLOCK,
      coachKey: "O",
      coachingTip: "Build speed only while your accuracy stays comfortable; there is no benefit in rushing through errors.",
    },
  },
  {
    id: "advanced-fluency",
    number: 15,
    title: "Advanced fluency",
    description: "Bring accuracy, endurance, and a dependable pace together.",
    lesson: {
      id: "advanced-fluency-lesson",
      title: "Confident fluency",
      focus: "Accuracy, rhythm, and endurance",
      text: "I have completed the review and added clear notes for the next steps. Thank you for your thoughtful collaboration.",
      estimatedMinutes: 5,
      accuracyToUnlock: ACCURACY_TO_UNLOCK,
      coachKey: "N",
      coachingTip: "Stay relaxed and consistent; fluency comes from dependable movement, not force.",
    },
  },
];

const LEGACY_STAGE_IDS: Record<string, string> = {
  "basic-words": "common-letters",
  "real-world-typing": "paragraphs",
  "coding-practice": "coding-symbols",
  "speed-drills": "speed-building",
  "accuracy-drills": "advanced-fluency",
  "professional-practice": "advanced-fluency",
};

const SHIFTED_KEY_BASES: Record<string, string> = {
  "!": "1",
  "@": "2",
  "#": "3",
  "$": "4",
  "%": "5",
  "^": "6",
  "&": "7",
  "*": "8",
  "(": "9",
  ")": "0",
  "_": "-",
  "+": "=",
  "{": "[",
  "}": "]",
  "|": "\\",
  ":": ";",
  '"': "'",
  "<": ",",
  ">": ".",
  "?": "/",
  "~": "`",
};

const FINGER_ZONES: Array<{ keys: string; finger: TypingFinger; hand: KeyboardGuidance["hand"]; zone: string }> = [
  { keys: "1qaz`", finger: "Left pinky", hand: "left", zone: "Left outer zone" },
  { keys: "2wsx", finger: "Left ring finger", hand: "left", zone: "Left ring zone" },
  { keys: "3edc", finger: "Left middle finger", hand: "left", zone: "Left middle zone" },
  { keys: "4rfv5tgb", finger: "Left index finger", hand: "left", zone: "Left index zone" },
  { keys: "6yhn7ujm", finger: "Right index finger", hand: "right", zone: "Right index zone" },
  { keys: "8ik,", finger: "Right middle finger", hand: "right", zone: "Right middle zone" },
  { keys: "9ol.", finger: "Right ring finger", hand: "right", zone: "Right ring zone" },
  { keys: "0p;/-=[]'\\", finger: "Right pinky", hand: "right", zone: "Right outer zone" },
];

export function normalizeCompletedStageIds(stageIds: string[]): string[] {
  const validIds = new Set(typingStages.map((stage) => stage.id));
  return Array.from(
    new Set(
      stageIds
        .map((stageId) => LEGACY_STAGE_IDS[stageId] ?? stageId)
        .filter((stageId) => validIds.has(stageId)),
    ),
  );
}

export function getKeyboardGuidance(character: string): KeyboardGuidance {
  if (character === " ") {
    return { finger: "Thumbs", hand: "both", zone: "Space bar", key: "Space" };
  }

  const key = (SHIFTED_KEY_BASES[character] ?? character).toLowerCase();
  const assignment = FINGER_ZONES.find((zone) => zone.keys.includes(key));
  if (!assignment) {
    return {
      finger: "Right pinky",
      hand: "right",
      zone: "Right outer zone",
      key: character.toUpperCase(),
    };
  }

  return {
    finger: assignment.finger,
    hand: assignment.hand,
    zone: assignment.zone,
    key: key.toUpperCase(),
  };
}
