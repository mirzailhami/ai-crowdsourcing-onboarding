// frontend/app/layout.tsx
import type React from "react";
import "@/app/globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "CrowdLaunch - AI-Assisted Challenge Onboarding",
  description: "Launch your innovation challenge with confidence using our AI-powered assistant",
};

// Server-side wrapper to apply default theme statically
const ThemeWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html lang="en" className="light" style={{ colorScheme: "light" }}>
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeWrapper>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
        suppressHydrationWarning
      >
        {children}
      </ThemeProvider>
    </ThemeWrapper>
  );
}