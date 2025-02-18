import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Providers from "@/components/providers";
import { ThemeProvider } from "@/components/theme-provider";
import { CreateDecoration } from "@/components/create-decoration/create-decoration";
import { UserLocation } from "@/components/user-location";
import "mapbox-gl/dist/mapbox-gl.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Christmas Lights App",
  description: "Create and discover amazing Christmas decorations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${nunito.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            {children}
            <CreateDecoration />
          </Providers>
          <UserLocation />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
