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
      <body className="bg-black text-white">

        <AuthProvider>

          <div className="flex h-screen overflow-hidden">

            <Sidebar />

            <div className="flex-1 flex flex-col">

              <Navbar />

              <main className="flex-1 overflow-y-auto px-10 py-8 max-w-[1600px] mx-auto w-full">

                {children}

              </main>

            </div>

          </div>

        </AuthProvider>

      </body>
    </html>
  );
}