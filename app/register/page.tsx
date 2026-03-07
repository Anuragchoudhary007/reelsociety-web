"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { doc,setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";

export default function RegisterPage() {

  const router = useRouter();

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [username,setUsername] = useState("");
  const [showPassword,setShowPassword] = useState(false);
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState("");

  const handleRegister = async () => {

    setLoading(true);
    setError("");

    try {

      const userCred = await createUserWithEmailAndPassword(
        auth,email,password
      );

      const user = userCred.user;

      await setDoc(doc(db,"users",user.uid),{
        email,
        username,
        usernameLowercase: username.toLowerCase(),
        createdAt: new Date(),
        photoURL: "",
        bio: ""
      });

      router.push("/");

    } catch(err:any){

      setError(err.message);

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

      {/* Register Card */}

      <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-2xl shadow-xl">

        <h1 className="text-2xl mb-6 text-center font-semibold">
          Create Account
        </h1>

        {/* Avatar preview */}

        {username && (

          <div className="flex justify-center mb-6">

            <img
              src={`https://api.dicebear.com/7.x/bottts/svg?seed=${username}`}
              className="w-16 h-16 rounded-full bg-zinc-800"
            />

          </div>

        )}

        <input
          placeholder="Username"
          className="w-full mb-4 p-3 bg-black border border-white/20 rounded-md"
          value={username}
          onChange={(e)=>setUsername(e.target.value)}
        />

        <input
          placeholder="Email"
          className="w-full mb-4 p-3 bg-black border border-white/20 rounded-md"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />

        <div className="relative mb-4">

          <input
            type={showPassword ? "text":"password"}
            placeholder="Password"
            className="w-full p-3 bg-black border border-white/20 rounded-md"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
          />

          <button
            type="button"
            onClick={()=>setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-sm text-gray-400"
          >
            {showPassword ? "Hide":"Show"}
          </button>

        </div>

        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}

        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full bg-red-700 hover:bg-red-600 p-3 rounded-md transition"
        >
          {loading ? "Creating account..." : "Register"}
        </button>

        <div className="text-center mt-4 text-sm text-gray-400">

          Already have an account?{" "}

          <Link href="/login" className="text-red-500 hover:underline">
            Login
          </Link>

        </div>

      </div>

    </div>

  );
}