import { useEffect, useLayoutEffect } from "react";

/**
 * useLayoutEffect warns during server rendering. Client components are still
 * rendered on the server in the App Router, so fall back to useEffect there.
 */
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default useIsomorphicLayoutEffect;
