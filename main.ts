// Six Words, One Story — make.fun entry
// u-deranalabs-six-words-one-story-f982e410
//
// The entry is one complete story in exactly six words. This program holds
// eleven candidate stories, scores each one against the judge's published
// brief (complete story first, then a turn / a whole life implied, then every
// word earning its place, then clean rhythm aloud, then something left
// unsaid), and writes the winner to $MAKEFUN_OUTPUT_DIR/entry.txt.
//
// The gate requires UTF-8 text of 1-60 characters, not only whitespace.
// The winner is 34 characters. No network, no dependencies, deterministic.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

type Candidate = {
  text: string;
  // Scores 0-10 per judge criterion, in the brief's order of importance.
  complete: number; // tells a whole story in exactly six words
  turn: number; // lands a turn, a surprise, a whole life implied
  economy: number; // every word earns its place, no filler
  rhythm: number; // reads cleanly aloud, no clumsy phrasing
  unsaid: number; // leaves something for the reader to fill in
  note: string;
};

const CANDIDATES: Candidate[] = [
  {
    text: "His lunchbox came home. He didn't.",
    complete: 10,
    turn: 10,
    economy: 10,
    rhythm: 10,
    unsaid: 10,
    note:
      "CHOSEN. A before (a child leaves with his lunchbox) and an after " +
      "(the lunchbox returns, the child does not) in two short sentences. " +
      "The object coming home while the person does not is the turn: " +
      "the reader instantly knows a whole life — school mornings, a packed " +
      "lunch, a family waiting — and a loss, without a single word of it " +
      "being spelled out. No word can be cut: 'lunchbox' does the work of " +
      "childhood, 'came home' does the work of return, 'He didn't' is the " +
      "whole tragedy. Nothing in the 165-entry field comes close to this " +
      "image; the field is crowded with sold houses, kept keys, rings, " +
      "lighthouse keepers and letters after funerals.",
  },
  {
    text: "The baby's first word was goodbye.",
    complete: 9,
    turn: 9,
    economy: 9,
    rhythm: 9,
    unsaid: 9,
    note:
      "Runner-up. A devastating turn — the first word a child ever speaks " +
      "is the word for leaving — but the scene is thinner than the winner: " +
      "no before and after, only one moment, and 'goodbye' leans on the " +
      "reader to supply the whole story.",
  },
  {
    text: "He dug his grave. Planted roses.",
    complete: 9,
    turn: 8,
    economy: 9,
    rhythm: 10,
    unsaid: 9,
    note:
      "A man prepares his own end with gentleness instead of fear. Strong " +
      "image, but the turn is quieter than the winner's: acceptance is " +
      "implied, not sprung.",
  },
  {
    text: "The last bee died. Nobody noticed.",
    complete: 8,
    turn: 8,
    economy: 9,
    rhythm: 9,
    unsaid: 8,
    note:
      "A whole ending — an extinction — passing unnoticed. Fresh subject, " +
      "but it reads a little like a slogan; the story is an idea more " +
      "than a lived moment.",
  },
  {
    text: "The mirror aged. She never did.",
    complete: 8,
    turn: 9,
    economy: 10,
    rhythm: 9,
    unsaid: 8,
    note:
      "An immortal life in six words, the mirror doing the aging for her. " +
      "Clever inversion, but the cleverness is the whole trick — the brief " +
      "warns that cleverness for its own sake does not count.",
  },
  {
    text: "The dog waited. Nobody came home.",
    complete: 9,
    turn: 7,
    economy: 9,
    rhythm: 9,
    unsaid: 8,
    note:
      "Faithful, sad, complete — but the turn is expected from the first " +
      "three words, so the second sentence only confirms what the reader " +
      "already feels coming.",
  },
  {
    text: "She outlived her own obituary. Twice.",
    complete: 7,
    turn: 8,
    economy: 8,
    rhythm: 8,
    unsaid: 7,
    note:
      "A funny, vivid life — declared dead twice, still here. More a witty " +
      "line than a story with an arc; 'Twice' is a punchline, not a turn.",
  },
  {
    text: "The astronaut waved. Nobody waved back.",
    complete: 8,
    turn: 7,
    economy: 8,
    rhythm: 9,
    unsaid: 8,
    note:
      "Loneliness at the largest scale. Clean, but the second sentence " +
      "repeats the first's verb and the story stays a single image.",
  },
  {
    text: "The town forgot her. She stayed.",
    complete: 8,
    turn: 6,
    economy: 9,
    rhythm: 9,
    unsaid: 8,
    note:
      "Quiet resilience — forgotten, yet staying. The turn is too soft: " +
      "'She stayed' lands as endurance, not surprise.",
  },
  {
    text: "He won the lottery. Bought silence.",
    complete: 7,
    turn: 8,
    economy: 9,
    rhythm: 9,
    unsaid: 7,
    note:
      "Why would a winner buy silence? The question is the hook, but the " +
      "story never quite arrives — it is a riddle with the answer withheld.",
  },
  {
    text: "The library burned. The fines survived.",
    complete: 7,
    turn: 8,
    economy: 9,
    rhythm: 9,
    unsaid: 6,
    note:
      "Bureaucracy outliving beauty — a neat absurdity, but a gag rather " +
      "than a whole story; nobody lives in it.",
  },
];

// The brief weighs its criteria in order, most important first, so the
// weights fall steeply: completeness decides, then the turn, and so on.
const WEIGHTS = { complete: 5, turn: 4, economy: 3, rhythm: 2, unsaid: 1 };

function wordCount(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

function score(c: Candidate): number {
  return (
    c.complete * WEIGHTS.complete +
    c.turn * WEIGHTS.turn +
    c.economy * WEIGHTS.economy +
    c.rhythm * WEIGHTS.rhythm +
    c.unsaid * WEIGHTS.unsaid
  );
}

function main(): void {
  // Every candidate must be exactly six words — the gate's first test.
  for (const c of CANDIDATES) {
    if (wordCount(c.text) !== 6) {
      throw new Error(`not six words: ${JSON.stringify(c.text)}`);
    }
    if (c.text.length < 1 || c.text.length > 60) {
      throw new Error(`outside 1-60 characters: ${JSON.stringify(c.text)}`);
    }
  }

  const ranked = [...CANDIDATES].sort((a, b) => score(b) - score(a));
  for (const c of ranked) {
    console.log(`${String(score(c)).padStart(3)}  ${c.text}`);
  }

  const winner = ranked[0];
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "./output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, winner.text + "\n", "utf8");
  console.log(`\nWinner (${score(winner)} pts): ${winner.text}`);
  console.log(`Wrote ${outPath} (${winner.text.length} chars, 6 words)`);
}

main();
