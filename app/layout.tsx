import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Space_Grotesk } from "next/font/google"
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import { Poppins } from "next/font/google";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins", // optional for tailwind integration
});
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
})


export const metadata: Metadata = {
  title: "DeFIR",
  description: "Decentralized Police Application",
};

export default function RootLayout({
  
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  

  return (
    <html lang="en" suppressHydrationWarning className={poppins.variable}>
      <body className={`${spaceGrotesk.variable} font-sans`}>

        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <Navbar />
          {children}
          <Footer/>
        </ThemeProvider>
   
      </body>
    </html>
  )
}
