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
    { name: "Community", href: "/community" },
    { name: "Friends", href: "/friends" },
    { name: "Profile", href: "/profile" },
  ];

  return (

    <aside className="w-64 bg-[#0b0b0b] border-r border-white/10 p-6 flex flex-col justify-between">

      <div>

        <h1 className="text-2xl font-bold mb-10 text-white">
          ReelSociety
        </h1>

        <nav className="space-y-2">

          {links.map((link) => (

            <Link
              key={link.href}
              href={link.href}
              className={`block px-4 py-2 rounded-lg transition
              ${
                pathname === link.href
                  ? "bg-white text-black"
                  : "hover:bg-white/10 text-gray-300"
              }`}
            >
              {link.name}
            </Link>

          ))}

        </nav>

      </div>


      {/* AUTH AREA */}

      <div className="space-y-3">

        {!user && (

          <Link href="/login">
            <button className="w-full px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500">
              Login
            </button>
          </Link>

        )}

        {user && (

          <button
            onClick={() => signOut(auth)}
            className="w-full px-4 py-2 bg-red-600 rounded-lg hover:bg-red-500"
          >
            Logout
          </button>

        )}

      </div>

    </aside>

  );

}