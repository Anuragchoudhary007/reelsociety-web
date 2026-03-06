"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const links = [
    { name: "Dashboard", href: "/" },
    { name: "Watchlist", href: "/watchlist" },
    { name: "Lists", href: "/lists" },
    { name: "Diary", href: "/diary" },
    { name: "Community", href: "/community" },
    { name: "Friends", href: "/friends" },
    { name: "Profile", href: "/profile" },
  ];

  return (
    <aside className="w-64 bg-[#0b0b0b] border-r border-white/10 p-6 flex flex-col justify-between h-screen sticky top-0">
      <div>
        <h1 className="text-2xl font-bold mb-10 text-white tracking-tight">
          ReelSociety
        </h1>

        <nav className="space-y-2">
          {links.map((link) => {
            const isActive = pathname === link.href;
            
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-white text-black font-medium"
                    : "hover:bg-white/10 text-gray-400 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pt-6 border-t border-white/5 space-y-3">
        {!user ? (
          <Link href="/login" className="block">
            <button className="w-full px-4 py-2 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition">
              Login
            </button>
          </Link>
        ) : (
          <button
            onClick={() => signOut(auth)}
            className="w-full px-4 py-2 bg-red-600/10 text-red-500 font-medium rounded-lg hover:bg-red-600 hover:text-white transition duration-200"
          >
            Logout
          </button>
        )}
      </div>
    </aside>
  );
}