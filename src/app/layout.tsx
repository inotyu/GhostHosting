import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GhostHosting - Sistema de Hospedagem de Arquivos",
  description: "Sistema de hospedagem de arquivos com Supabase",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
