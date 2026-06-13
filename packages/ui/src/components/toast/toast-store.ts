// Dependency-free toast store + imperative API. The Toaster subscribes via
// useSyncExternalStore; call sites trigger toasts with the exported `toast` helper.

export type ToastVariant = 'success' | 'error' | 'info' | 'warning';

export interface ToastOptions {
  description?: string;
  /** Auto-dismiss delay in ms. Defaults to 4500. */
  duration?: number;
}

export interface ToastEntry {
  id: number;
  variant: ToastVariant;
  title: string;
  description?: string;
  duration: number;
  /** Set while the exit transition plays, before the entry is removed. */
  closing: boolean;
}

const DEFAULT_DURATION = 4500;
/** Time the exit transition is allowed to play before the entry is dropped. */
const EXIT_TRANSITION_MS = 220;

let entries: ToastEntry[] = [];
let idCounter = 0;
const listeners = new Set<() => void>();
const dismissTimers = new Map<number, ReturnType<typeof setTimeout>>();

function emit(): void {
  for (const listener of listeners) listener();
}

function clearTimer(id: number): void {
  const timer = dismissTimers.get(id);
  if (timer) {
    clearTimeout(timer);
    dismissTimers.delete(id);
  }
}

/** Begin the exit transition, then remove the entry once it has played. */
function dismiss(id: number): void {
  clearTimer(id);
  let found = false;
  entries = entries.map((entry) => {
    if (entry.id !== id) return entry;
    found = true;
    return { ...entry, closing: true };
  });
  if (!found) return;
  emit();
  setTimeout(() => {
    entries = entries.filter((entry) => entry.id !== id);
    emit();
  }, EXIT_TRANSITION_MS);
}

function add(variant: ToastVariant, title: string, options?: ToastOptions): number {
  const id = ++idCounter;
  const duration = options?.duration ?? DEFAULT_DURATION;
  entries = [...entries, { id, variant, title, description: options?.description, duration, closing: false }];
  emit();
  if (duration !== Infinity) {
    dismissTimers.set(id, setTimeout(() => dismiss(id), duration));
  }
  return id;
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getToasts(): ToastEntry[] {
  return entries;
}

interface ToastApi {
  (title: string, options?: ToastOptions): number;
  success: (title: string, options?: ToastOptions) => number;
  error: (title: string, options?: ToastOptions) => number;
  info: (title: string, options?: ToastOptions) => number;
  warning: (title: string, options?: ToastOptions) => number;
  dismiss: (id: number) => void;
}

export const toast: ToastApi = Object.assign(
  (title: string, options?: ToastOptions) => add('info', title, options),
  {
    success: (title: string, options?: ToastOptions) => add('success', title, options),
    error: (title: string, options?: ToastOptions) => add('error', title, options),
    info: (title: string, options?: ToastOptions) => add('info', title, options),
    warning: (title: string, options?: ToastOptions) => add('warning', title, options),
    dismiss,
  },
);
