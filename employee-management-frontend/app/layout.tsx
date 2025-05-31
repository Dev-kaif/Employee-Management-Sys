// app/layout.tsx or app/(yourLayout)/layout.tsx

import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "EmpManage - Employee Management System",
  description: "Streamline your HR operations with our comprehensive employee management solution",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
          {children}
          <Toaster />
      </body>
    </html>
  )
}
