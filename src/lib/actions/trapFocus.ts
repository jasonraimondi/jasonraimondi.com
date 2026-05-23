import type { Action } from "svelte/action";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Confines keyboard focus to `node` while it is mounted, moves focus into it on
 * mount, and restores focus to the previously focused element on destroy.
 * Intended for modal dialogs.
 */
export const trapFocus: Action<HTMLElement> = node => {
  const previouslyFocused = document.activeElement as HTMLElement | null;

  const focusable = () => Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE));

  function handleKeydown(event: KeyboardEvent) {
    if (event.key !== "Tab") return;
    const items = focusable();
    if (items.length === 0) return;

    const first = items[0];
    const last = items[items.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  (focusable()[0] ?? node).focus();
  node.addEventListener("keydown", handleKeydown);

  return {
    destroy() {
      node.removeEventListener("keydown", handleKeydown);
      previouslyFocused?.focus();
    },
  };
};
