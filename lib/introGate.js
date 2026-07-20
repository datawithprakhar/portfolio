/**
 * The hero entrance must not start behind the preloader — otherwise the whole
 * timeline plays out unseen and the curtain lifts on a finished frame.
 *
 * The preloader calls `releaseIntro()` at the end of its exit; the hero
 * subscribes with `whenIntroReady()`. Late subscribers fire immediately, so
 * hot reloads and remounts still behave.
 */

let released = false;
const listeners = new Set();

export function releaseIntro() {
  if (released) return;
  released = true;
  listeners.forEach((listener) => listener());
  listeners.clear();
}

export function whenIntroReady(listener) {
  if (released) {
    listener();
    return () => {};
  }
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function isIntroReleased() {
  return released;
}
