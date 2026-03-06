"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function Sidebar(){

  const pathname = usePathname();

  const links = [
    {name:"Dashboard",href:"/"},
    {name:"Watchlist",href:"/watchlist"},
    {name:"Lists",href:"/lists"},
    {name:"Community",href:"/community"},
    {name:"News",href:"/feed"},
    {name:"Profile",href:"/profile"},
  ];

  return(

    <aside className="w-64 bg-[#0b0b0b] border-r border-white/10 p-6 flex flex-col justify-between">

      {/* Logo */}

      <div>

        <h1 className="text-2xl font-bold mb-10 text-red-500">
          ReelSociety
        </h1>

        <nav className="space-y-2">

          {links.map(link=>(

            <Link
              key={link.href}
              href={link.href}
              className={`block px-4 py-2 rounded-lg transition text-sm
              ${
                pathname===link.href
                ? "bg-white text-black font-medium"
                : "hover:bg-white/10 text-gray-300"
              }`}
            >
              {link.name}
            </Link>

          ))}

        </nav>

      </div>


      {/* Logout */}

      <button
        onClick={()=>signOut(auth)}
        className="mt-10 px-4 py-2 bg-red-600 rounded-lg hover:bg-red-500 text-sm"
      >
        Logout
      </button>

    </aside>

  )

}