"use client";

import * as React from "react";
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
  useTheme,
} from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const { setTheme, resolvedTheme } = useTheme();

  // Delay theme application until client is ready
  React.useEffect(() => {
    // Ensure theme matches the SSR default after hydration
    if (resolvedTheme !== "light") {
      setTheme("light");
    }
  }, [resolvedTheme, setTheme]);

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}