"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Link from "next/link";

export default function LoginPage() {

  const router = useRouter();

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [error,setError] = useState("");
  const [showPassword,setShowPassword] = useState(false);
  const [loading,setLoading] = useState(false);

  const handleLogin = async () => {

    setError("");
    setLoading(true);

    try {

      await signInWithEmailAndPassword(auth,email,password);
      router.push("/");

    } catch {

      setError("Invalid email or password");

    }

    setLoading(false);

  };

  return (

    <div className="min-h-screen flex items-center justify-center relative text-white">

      {/* Background */}

      <div className="absolute inset-0">

        <img
          src="https://image.tmdb.org/t/p/original/5YZbUmjbMa3ClvSW1Wj3D6XGolb.jpg"
          className="w-full h-full object-cover opacity-20"
        />

        <div className="absolute inset-0 bg-black/70"/>

      </div>

      {/* Login Card */}

      <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-2xl shadow-xl">

        <h1 className="text-2xl mb-6 font-semibold text-center">
          Login to ReelSociety
        </h1>

        {/* Avatar preview */}

        {email && (

          <div className="flex justify-center mb-6">

            <img
              src={`https://api.dicebear.com/7.x/bottts/svg?seed=${email}`}
              className="w-16 h-16 rounded-full bg-zinc-800"
            />

          </div>

        )}

        <div className="space-y-4">

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 bg-black border border-white/20 rounded-md focus:outline-none focus:border-red-700 transition"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
          />

          {/* Password */}

          <div className="relative">

            <input
              type={showPassword ? "text":"password"}
              placeholder="Password"
              className="w-full p-3 bg-black border border-white/20 rounded-md focus:outline-none focus:border-red-700 transition"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
            />

            <button
              type="button"
              onClick={()=>setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-sm text-gray-400 hover:text-white"
            >
              {showPassword ? "Hide":"Show"}
            </button>

          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-red-700 hover:bg-red-600 p-3 rounded-md transition font-medium"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="text-center text-sm text-gray-400">
            Don't have an account?{" "}
            <Link href="/register" className="text-red-500 hover:underline">
              Register
            </Link>
          </div>

        </div>

      </div>

    </div>

  );
}