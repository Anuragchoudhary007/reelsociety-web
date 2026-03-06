"use client";

import { useAuth } from "@/context/AuthContext";
import { db, auth } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function ProfilePage() {

  const { user } = useAuth();
  const storage = getStorage();

  const [profile,setProfile] = useState<any>(null)
  const [bio,setBio] = useState("")

  useEffect(()=>{

    if(!user) return

    async function load(){

      const ref = doc(db,"users",user.uid)
      const snap = await getDoc(ref)

      const data = snap.data()

      setProfile(data)
      setBio(data?.bio || "")

    }

    load()

  },[user])

  async function saveBio(){

    if(!user) return

    const ref = doc(db,"users",user.uid)

    await updateDoc(ref,{
      bio
    })

  }

  async function logout(){

    await signOut(auth)

  }

  async function uploadProfilePic(file:any){

    if(!user || !file) return

    const storageRef = ref(storage,`profilePictures/${user.uid}.jpg`)

    await uploadBytes(storageRef,file)

    const url = await getDownloadURL(storageRef)

    await updateDoc(doc(db,"users",user.uid),{
      photoURL:url
    })

    setProfile((prev:any)=>({
      ...prev,
      photoURL:url
    }))
  }

  if(!profile) return <div className="p-10 text-white">Loading...</div>

  return(

    <div className="p-10 text-white max-w-3xl">

      <h1 className="text-3xl mb-6">Profile</h1>

      {/* PROFILE IMAGE */}

      <img
        src={profile.photoURL || "/avatar.png"}
        className="w-24 h-24 rounded-full mb-4"
      />

      <input
        type="file"
        onChange={(e)=>uploadProfilePic(e.target.files?.[0])}
        className="mb-6"
      />

      {/* USERNAME */}

      <p className="mb-2">
        Username: {profile.username}
      </p>

      <p className="mb-6">
        Email: {profile.email}
      </p>

      {/* BIO */}

      <div className="mb-6">

        <p className="mb-2">Bio</p>

        <textarea
          value={bio}
          onChange={(e)=>setBio(e.target.value)}
          className="bg-gray-900 w-full p-3"
        />

        <button
          onClick={saveBio}
          className="bg-blue-600 px-4 py-2 mt-3"
        >
          Save Bio
        </button>

      </div>

      {/* LOGOUT */}

      <button
        onClick={logout}
        className="bg-red-600 px-4 py-2"
      >
        Logout
      </button>

    </div>

  )
}