import type { Metadata } from "next";
import "./globals.css";

import { Toaster as SonnarToaster } from "@/components/ui/sonner";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { ThemeProvider } from "@/providers/theme-provider";
import { UserProvider } from "@/providers/user-type-provider";

export const metadata: Metadata = {
  title: "Stress Management App",
  description:
    "A gamified approach to stress management that helps people by grouping them with people that can help them with a flavour of AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html lang="en" suppressHydrationWarning>
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <UserProvider>
              <div className="transition-all transition-duration-300">
                {children}
              </div>
            </UserProvider>
            <SonnarToaster position="bottom-right" />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
