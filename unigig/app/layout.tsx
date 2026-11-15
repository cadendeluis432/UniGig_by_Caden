import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./context/CartContext"; // ADDED CART PROVIDER IMPORT

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Updated the title and description for your app!
export const metadata: Metadata = {
  title: "UniGig | Your campus. Your opportunities.",
  description: "A student-only marketplace and services platform.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* WRAPPED CHILDREN IN CART PROVIDER */}
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}