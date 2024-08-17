import "~/styles/globals.css";

import { Inter as FontSans } from "next/font/google";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import { HydrateClient } from "~/trpc/server";
import { Providers } from "./_components/Providers";
import { Header } from "./_components/Header";
import { Toaster } from "sonner";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Open Banking POC",
  description: "POC application for integrating an open banking API.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fontSans.variable}`}>
      <body>
        <Providers>
          <TRPCReactProvider>
            <HydrateClient>
              <div className="flex min-h-screen w-full flex-col">
                <Toaster />
                <Header />
                {children}
              </div>
            </HydrateClient>
          </TRPCReactProvider>
        </Providers>
      </body>
    </html>
  );
}
