//src/app/layout.tsx//

import { AuthProvider } from "@/context/AuthContext";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import "./styles/globals.css"; // ✅ Caminho correto

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DDM Sistema",
  description: "Sistema de gestão editorial",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" data-scroll-behavior="smooth">
      <body className={inter.className}>
        <Providers>
          <AuthProvider>{children}</AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
