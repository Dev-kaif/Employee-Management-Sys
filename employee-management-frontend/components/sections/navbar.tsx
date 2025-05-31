"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "motion/react" 
import { Menu, X } from "lucide-react"
import Button from "@/components/ui/button"
import Logo from "@/components/ui/logo"

interface NavbarProps {
  isLoggedIn: boolean;
  userRole: string | null; // userRole is accepted but not directly used for this specific change
}

export default function Navbar({ isLoggedIn, userRole }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { name: "Features", href: "#features" },
    { name: "Dashboard", href: "#dashboard" },
    { name: "Pricing", href: "#pricing" },
    { name: "Testimonials", href: "#testimonials" },
  ]

  const handleLogin = () => router.push("/login")
  const handleSignup = () => router.push("/signup")
  const handleDashboardRedirect = () => {
    if(userRole=="admin"){
      router.push('/adminDashboard');
    }else{
      router.push('/employeeDashboard');
    }
  } 

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-4" : "bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <Logo />

          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-[#374151] hover:text-[#2563EB] font-medium transition-colors"
              >
                {item.name}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <button className="bg-purple-500 text-white h-full w-fit rounded-md px-4 py-2" onClick={handleDashboardRedirect}>
                Go to Dashboard
              </button>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={handleLogin}>
                  Log in
                </Button>
                <Button size="sm" onClick={handleSignup}>
                  Sign up
                </Button>
              </>
            )}
          </div>

          <button className="md:hidden text-[#111827]" onClick={() => setMobileMenuOpen(true)}>
            <Menu size={24} />
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-white md:hidden"
          >
            <div className="flex flex-col h-full p-6">
              <div className="flex justify-between items-center mb-10">
                <Logo />
                <button className="text-[#111827]" onClick={() => setMobileMenuOpen(false)}>
                  <X size={24} />
                </button>
              </div>

              <nav className="flex flex-col space-y-6 text-lg">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-[#374151] hover:text-[#2563EB] font-medium transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
              </nav>

              <div className="mt-auto flex flex-col space-y-4 pt-6">
                {isLoggedIn ? (
                  <Button fullWidth onClick={() => { handleDashboardRedirect(); setMobileMenuOpen(false); }}>
                    Dashboard
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" fullWidth onClick={() => { handleLogin(); setMobileMenuOpen(false); }}>
                      Log in
                    </Button>
                    <Button fullWidth onClick={() => { handleSignup(); setMobileMenuOpen(false); }}>
                      Sign up
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}