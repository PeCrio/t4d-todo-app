
import type { Metadata } from "next";
import "./globals.css";
import LayoutWrapper from "@/components/Layout/LayoutWrapper";
import ToasterProvider from "@/components/ToasterProvider";
import { CombinedProviders } from "@/components/provider/CombinedProvider";


export const metadata: Metadata = {
  title: "VERS Todo App",
  description: "VERS Todo app helps you manage your activities and keep track of every subtasks to help you get things done like a winner.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased relative h-screen flex flex-col lg:flex-row`}>
        <CombinedProviders>
          <LayoutWrapper>
            {children}
            <ToasterProvider />
          </LayoutWrapper>
        </CombinedProviders>
      </body>
    </html>
  );
}