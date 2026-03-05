"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    const userCred = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCred.user;

    await setDoc(doc(db, "users", user.uid), {
      email,
      username,
      usernameLowercase: username.toLowerCase(),
      createdAt: new Date(),
      photoURL: "",
      bio: ""
    });

    router.push("/");
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">

      <div className="w-full max-w-md bg-white/5 p-8 rounded-xl border border-white/10">

        <h1 className="text-2xl mb-6 text-center">
          Create Account
        </h1>

        <input
          placeholder="Username"
          className="w-full mb-4 p-3 bg-black border border-white/20 rounded-md"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          placeholder="Email"
          className="w-full mb-4 p-3 bg-black border border-white/20 rounded-md"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full p-3 bg-black border border-white/20 rounded-md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-sm text-gray-400"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <button
          onClick={handleRegister}
          className="w-full bg-red-700 p-3 rounded-md"
        >
          Register
        </button>

      </div>
    </div>
  );
}