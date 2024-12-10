"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Coffee, Search, ShoppingCart, Heart, User, Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      isScrolled ? 'bg-[#6F4E37]/90 backdrop-blur-sm shadow-md' : 'bg-[#6F4E37]'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Coffee className="h-6 w-6 text-[#F5E7D3]" />
            <span className="text-xl font-bold text-[#F5E7D3]">MochaBrew</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6 flex-1 justify-center">
            <Link href="/products" className="text-[#F5E7D3] hover:text-[#D2B48C] transition-colors">
              Products
            </Link>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6F4E37]" />
              <Input
                type="search"
                placeholder="Search brews..."
                className="pl-10 bg-[#F5E7D3] text-[#6F4E37] placeholder-[#6F4E37]/70 border-[#D2B48C] focus:border-[#A67B5B] focus:ring-[#A67B5B]"
              />
            </div>
          </nav>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="text-[#F5E7D3] hover:text-[#D2B48C]">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-[#F5E7D3] hover:text-[#D2B48C]">
              <ShoppingCart className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-[#F5E7D3] hover:text-[#D2B48C]">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-[#F5E7D3] text-[#6F4E37]">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="text-[#F5E7D3] hover:text-[#D2B48C]"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

