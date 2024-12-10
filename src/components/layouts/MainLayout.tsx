import { Header } from '../Header'
import { Footer } from '../Footer'

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-[#F5E7D3]">
        {children}
      </main>
      <Footer />
    </div>
  )
}
