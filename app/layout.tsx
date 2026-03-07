import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (

    <html lang="en">

      <body className="bg-[#0b0b0b] text-white antialiased">

        <AuthProvider>

          <div className="flex h-screen overflow-hidden">

            {/* Sidebar */}

            <Sidebar />

            {/* Main */}

            <div className="flex-1 flex flex-col">

              <Navbar />

              {/* Page content */}

              <main className="
                flex-1
                overflow-y-auto
                px-6
                md:px-10
                lg:px-14
                py-8
                max-w-[1800px]
                mx-auto
                w-full
                animate-fade
              ">

                {children}

              </main>

            </div>

          </div>

        </AuthProvider>

      </body>

    </html>

  );

}