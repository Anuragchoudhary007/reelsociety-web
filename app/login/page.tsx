"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Link from "next/link";
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(true);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (err: any) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/5 p-8 rounded-xl border border-white/10">
        <h1 className="text-2xl mb-6 font-semibold text-center">
          Login to ReelSociety
        </h1>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 bg-black border border-white/20 rounded-md focus:outline-none focus:border-red-700 transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full p-3 bg-black border border-white/20 rounded-md focus:outline-none focus:border-red-700 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-sm text-gray-400 hover:text-white transition"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
<div className="text-center mt-4 text-sm text-gray-400">
  Don't have an account?{" "}
  <Link href="/register" className="text-red-500 hover:underline">
    Register
  </Link>
</div>
          <button
            onClick={handleLogin}
            className="w-full bg-red-700 hover:bg-red-600 p-3 rounded-md transition font-medium"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}