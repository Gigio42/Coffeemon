import Link from "next/link";
import { ShoppingCart, Coffee, Menu } from "lucide-react";
import CoffeemonCard from "./CoffeemonCard";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-brown-900 text-cream-100 shadow-md z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button className="lg:hidden">
            <Menu size={24} />
          </button>
          <Link href="/" className="flex items-center space-x-2">
            <Coffee size={24} />
            <span className="text-xl font-bold">Coffee Haven</span>
          </Link>
        </div>
        <nav className="hidden lg:flex space-x-4">
          <Link href="/shop" className="hover:text-brown-300">
            Shop
          </Link>
          <Link href="/about" className="hover:text-brown-300">
            About
          </Link>
          <Link href="/contact" className="hover:text-brown-300">
            Contact
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <Link href="/cart" className="hover:text-brown-300">
            <ShoppingCart size={24} />
          </Link>
          <div className="hidden lg:block">
            <CoffeemonCard />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
