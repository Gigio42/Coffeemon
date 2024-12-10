import Link from 'next/link'
import { Coffee } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-[#6F4E37] text-[#F5E7D3]">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link href="/" className="flex items-center space-x-2">
              <Coffee className="h-6 w-6" />
              <span className="text-xl font-bold">MochaBrew</span>
            </Link>
            <p className="mt-2">Brewing happiness, one cup at a time.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="hover:text-[#D2B48C] transition-colors">About Us</Link></li>
              <li><Link href="/products" className="hover:text-[#D2B48C] transition-colors">Our Products</Link></li>
              <li><Link href="/blog" className="hover:text-[#D2B48C] transition-colors">Blog</Link></li>
              <li><Link href="/contact" className="hover:text-[#D2B48C] transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-[#D2B48C] transition-colors">Facebook</a></li>
              <li><a href="#" className="hover:text-[#D2B48C] transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-[#D2B48C] transition-colors">Twitter</a></li>
              <li><a href="#" className="hover:text-[#D2B48C] transition-colors">LinkedIn</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-[#A67B5B] text-center">
          <p>&copy; {new Date().getFullYear()} MochaBrew. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

