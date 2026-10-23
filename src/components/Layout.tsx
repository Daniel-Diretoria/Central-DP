/* Layout Component - Global container for Central Diretoria Promoções
   Full-screen container with centered content and subtle version footer */
import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F5F7FA] text-[#1A2430]">
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      <footer className="py-3 px-4 text-center text-xs text-[#5A6B7B] bg-[#F5F7FA] border-t border-[#D8E0E8]/40 select-none">
        © 2025 Central Diretoria Promoções — v1.0.0
      </footer>
    </div>
  )
}
