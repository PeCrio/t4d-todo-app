
import type { Metadata } from "next";
import "./globals.css";
import ToasterProvider from "@/components/provider/ToasterProvider";
import { CombinedProviders } from "@/components/provider/CombinedProvider";
import LayoutWrapper from "@/components/Layout/LayoutWrapper";


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