
import type { Metadata } from "next";
import "./globals.css";
import LayoutWrapper from "@/components/Layout/LayoutWrapper";
import { CategoryProvider } from "@/store/CategoryContext";
import ToasterProvider from "@/components/ToasterProvider";


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
        <CategoryProvider>
          <LayoutWrapper>
            {children}
            <ToasterProvider />
          </LayoutWrapper>
        </CategoryProvider>
      </body>
    </html>
  );
}