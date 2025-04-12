import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState('EN')

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value)
    // Future: Add i18n language switch here
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-background)] text-[var(--color-text)]">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container flex items-center justify-between py-4 px-4">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="MYKS Logo" width={40} height={40} />
            <h1 className="text-xl font-bold text-[var(--color-primary)] tracking-tight">MYKS</h1>
          </div>

          <div className="flex items-center gap-6">
            <nav className="hidden md:flex gap-6 text-sm font-medium">
              <Link href="/" className="hover:text-[var(--color-accent)] transition">Home</Link>
              <Link href="/token" className="hover:text-[var(--color-accent)] transition">Token Sale</Link>
              <Link href="/profit" className="hover:text-[var(--color-accent)] transition">Profit Sharing</Link>
              <Link href="/contact" className="hover:text-[var(--color-accent)] transition">Contact</Link>
            </nav>

            {/* Language Selector */}
            <select
              value={language}
              onChange={handleLanguageChange}
              className="text-sm border border-gray-300 rounded px-2 py-1 bg-white shadow-sm"
            >
              <option value="EN">EN</option>
              <option value="ID">ID</option>
              <option value="CN">CN</option>
              <option value="AR">AR</option>
            </select>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-300 text-center text-sm text-gray-600 py-6 mt-12">
        <div className="container px-4">
          <p>&copy; {new Date().getFullYear()} MYKS Global. All rights reserved.</p>
          <p>Powered by Blockchain | Designed for Global Investors</p>
        </div>
      </footer>
    </div>
  )
}

export default Layout