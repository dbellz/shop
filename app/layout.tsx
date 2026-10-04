import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import { Header } from "@/components/Header";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Threadline – Round neck tops, sweatshirts & snapback caps",
  description: "Everyday essentials: round neck tops, sweatshirts and snapback caps.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-zinc-900">
        <CartProvider>
          <Header />
          <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-8">{children}</main>
          <footer className="border-t border-zinc-200 py-6 text-center text-sm text-zinc-500">
            © {new Date().getFullYear()} Threadline. Free shipping over $75.
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
