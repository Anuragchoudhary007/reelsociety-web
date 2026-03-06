import {
  addDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp
} from "firebase/firestore"

import { db } from "@/lib/firebase"

export async function sendFriendRequest(from: string, to: string) {

  if (from === to) return

  const q = query(
    collection(db, "friendRequests"),
    where("from", "==", from),
    where("to", "==", to)
  )

  const existing = await getDocs(q)

  if (!existing.empty) {
    return
  }

  await addDoc(collection(db, "friendRequests"), {
    from,
    to,
    status: "pending",
    createdAt: serverTimestamp()
  })
} 

//   Accept Friend Request

export async function acceptFriendRequest(requestId: string, from: string, to: string) {

  await addDoc(collection(db, "friends"), {
    userId: from,
    friendId: to,
    createdAt: serverTimestamp()
  })

  await addDoc(collection(db, "friends"), {
    userId: to,
    friendId: from,
    createdAt: serverTimestamp()
  })

  await deleteDoc(doc(db, "friendRequests", requestId))
}


// Reject Request 

export async function rejectFriendRequest(requestId: string) {

  await deleteDoc(doc(db, "friendRequests", requestId))
}

// Remove Friend 


export async function removeFriend(userId: string, friendId: string) {

  const q1 = query(
    collection(db, "friends"),
    where("userId", "==", userId),
    where("friendId", "==", friendId)
  )

  const q2 = query(
    collection(db, "friends"),
    where("userId", "==", friendId),
    where("friendId", "==", userId)
  )

  const snap1 = await getDocs(q1)
  const snap2 = await getDocs(q2)

  snap1.forEach(d => deleteDoc(d.ref))
  snap2.forEach(d => deleteDoc(d.ref))
}


// Get Friend List 

export async function getFriends(userId: string) {

  const q = query(
    collection(db, "friends"),
    where("userId", "==", userId)
  )

  const snap = await getDocs(q)

  return snap.docs.map(doc => doc.data())
}

// Get Friend Requests 

export async function getFriendRequests(userId: string) {

  const q = query(
    collection(db, "friendRequests"),
    where("to", "==", userId)
  )

  const snap = await getDocs(q)

  return snap.docs.map(d => ({
    id: d.id,
    ...d.data()
  }))
}

// User Search


export async function searchUsers(search: string) {

  const q = query(
    collection(db, "users"),
    where("usernameLowercase", ">=", search.toLowerCase())
  )

  const snap = await getDocs(q)

  return snap.docs.map(d => ({
    id: d.id,
    ...d.data()
  }))
}