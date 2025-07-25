import type { Metadata } from "next";
import { Bricolage_Grotesque, Fira_Code } from "next/font/google";
import "./globals.css";
// import Sidebar from "../components/Sidebar";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

const firacode = Fira_Code({
  variable: "--font-firacode",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "reqres.studio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{
            __html: `
              if (typeof global === 'undefined') {
                var global = globalThis;
              }
            `
          }} />
      </head>
      <body
        className={`${bricolage.variable} ${firacode.variable} antialiased h-screen overflow-hidden`}
      >
        <div className="flex">
          {/* <Sidebar /> */}
          <div className="overflow-y-scroll grow">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
