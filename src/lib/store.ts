import { useSyncExternalStore } from "react";

export interface AnswerRecord {
  choice: number;
  correct: boolean;
  attempts: number;
  at: number;
}

export interface RevealRecord {
  answer?: boolean;
  solution?: boolean;
}

export interface ProgressState {
  answers: Record<string, AnswerRecord>;
  reveals: Record<string, RevealRecord>;
}

const STORAGE_KEY = "ales-pratik:progress:v1";

const emptyState = (): ProgressState => ({ answers: {}, reveals: {} });

function load(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw) as Partial<ProgressState>;
    return {
      answers: parsed.answers && typeof parsed.answers === "object" ? parsed.answers : {},
      reveals: parsed.reveals && typeof parsed.reveals === "object" ? parsed.reveals : {},
    };
  } catch {
    return emptyState();
  }
}

let state: ProgressState = load();
const listeners = new Set<() => void>();

function commit(next: ProgressState) {
  state = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* depolama kapalı olabilir, uygulama çalışmaya devam eder */
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): ProgressState {
  return state;
}

export function recordAnswer(questionId: string, choice: number, correct: boolean): void {
  const previous = state.answers[questionId];
  commit({
    ...state,
    answers: {
      ...state.answers,
      [questionId]: {
        choice,
        correct,
        attempts: (previous?.attempts ?? 0) + 1,
        at: Date.now(),
      },
    },
  });
}

export function revealQuestion(questionId: string, kind: "answer" | "solution"): void {
  const previous = state.reveals[questionId] ?? {};
  if (previous[kind]) return;
  commit({
    ...state,
    reveals: { ...state.reveals, [questionId]: { ...previous, [kind]: true } },
  });
}

export function resetProgress(): void {
  commit(emptyState());
}

export function useProgress(): ProgressState {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export interface Score {
  solved: number;
  correct: number;
  wrong: number;
  accuracy: number;
}
export function scoreOf(list: { id: string }[], progress: ProgressState): Score {
  let solved = 0;
  let correct = 0;
  for (const item of list) {
    const record = progress.answers[item.id];
    if (!record) continue;
    solved += 1;
    if (record.correct) correct += 1;
  }
  return {
    solved,
    correct,
    wrong: solved - correct,
    accuracy: solved === 0 ? 0 : Math.round((correct / solved) * 100),
  };
}

const THEME_KEY = "ales-pratik:theme";
export type Theme = "light" | "dark";

export function readTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    /* yoksay */
  }
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    /* yoksay */
  }
}
