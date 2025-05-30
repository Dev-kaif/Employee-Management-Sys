"use client"

import { motion } from "motion/react"
import Logo from "@/components/ui/logo"
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  const footerLinks = [
    {
      title: "Product",
      links: [
        { name: "Features", href: "#features" },
        { name: "Pricing", href: "#pricing" },
        { name: "Integrations", href: "#" },
        { name: "Updates", href: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About", href: "#" },
        { name: "Blog", href: "#" },
        { name: "Careers", href: "#" },
        { name: "Press", href: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Documentation", href: "#" },
        { name: "Help Center", href: "#" },
        { name: "Community", href: "#" },
        { name: "Webinars", href: "#" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy", href: "#" },
        { name: "Terms", href: "#" },
        { name: "Security", href: "#" },
        { name: "Compliance", href: "#" },
      ],
    },
  ]

  const contactInfo = [
    { icon: <Mail size={16} />, text: "contact@empmanage.com" },
    { icon: <Phone size={16} />, text: "+1 (555) 123-4567" },
    {
      icon: <MapPin size={16} />,
      text: "123 Business Ave, San Francisco, CA",
    },
  ]

  const socialLinks = [
    { icon: <Facebook size={20} />, href: "#" },
    { icon: <Twitter size={20} />, href: "#" },
    { icon: <Instagram size={20} />, href: "#" },
    { icon: <Linkedin size={20} />, href: "#" },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <footer className="bg-white border-t border-[#E5E7EB] pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8"
        >
          <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
            <Logo />
            <p className="text-[#374151] max-w-xs">
              Streamline your workforce management with our comprehensive employee management solution.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="w-10 h-10 rounded-full bg-[#F9FAFB] flex items-center justify-center text-[#374151] hover:bg-[#2563EB] hover:text-white transition-colors"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </motion.div>

          {footerLinks.map((section, index) => (
            <motion.div key={index} variants={itemVariants} className="space-y-4">
              <h3 className="font-semibold text-[#111827]">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a href={link.href} className="text-[#374151] hover:text-[#2563EB] transition-colors">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-16 pt-8 border-t border-[#E5E7EB]"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <motion.div variants={itemVariants}>
              <p className="text-[#9CA3AF] text-sm">© {new Date().getFullYear()} EmpManage. All rights reserved.</p>
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6"
            >
              {contactInfo.map((item, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm text-[#374151]">
                  <span className="text-[#9CA3AF]">{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
