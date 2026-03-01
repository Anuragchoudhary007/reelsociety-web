"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      Welcome, {user.email}
    </div>
  );
}