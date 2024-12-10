'use client'

import { FiSun, FiMoon } from 'react-icons/fi'
import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import Image from "next/image"

import "@theme-toggles/react/css/Within.css"

export default function ThemeSwitch() {
    const [mounted, setMounted] = useState(false)
    const { setTheme, resolvedTheme } = useTheme()
    
    useEffect(() => setMounted(true), [])
    
    if (!mounted) return (
        <div className="flex items-center justify-center w-8 h-8">
            <Image
                src="/images/loading.svg"
                alt="Loading"
                width={32}
                height={32}
            />
        </div>
    )
    
    if (resolvedTheme === "dark") {
        return <FiSun onClick={() => setTheme("light")} className="w-8 h-8 cursor-pointer" />
    }

    if (resolvedTheme === "light") {
        return <FiMoon onClick={() => setTheme("dark")} className="w-8 h-8 cursor-pointer" />
    }
}