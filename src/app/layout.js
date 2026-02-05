import { Roboto, Roboto_Slab } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-sans",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
})

const robotoSlab = Roboto_Slab({
  variable: "--font-slab",
  subsets: ["latin"],
})

export const metadata = {
  title: "",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} ${robotoSlab.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}
