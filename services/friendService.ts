import {
  addDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp,
  getDoc
} from "firebase/firestore"

import { db } from "@/lib/firebase"


/* SEND FRIEND REQUEST */

export async function sendFriendRequest(from: string, to: string) {

  if (from === to) return

  const q = query(
    collection(db, "friendRequests"),
    where("from", "==", from),
    where("to", "==", to),
    where("status", "==", "pending")
  )

  const existing = await getDocs(q)

  if (!existing.empty) return

  await addDoc(collection(db, "friendRequests"), {
    from,
    to,
    status: "pending",
    createdAt: serverTimestamp()
  })

}


/* GET FRIEND REQUESTS */

export async function getFriendRequests(uid: string) {

  const snapshot = await getDocs(
    query(
      collection(db, "friendRequests"),
      where("to", "==", uid),
      where("status", "==", "pending")
    )
  )

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))

}


/* ACCEPT REQUEST */

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


/* REJECT REQUEST */

export async function rejectFriendRequest(requestId: string) {

  await deleteDoc(doc(db, "friendRequests", requestId))

}


/* REMOVE FRIEND */

export async function removeFriend(userId: string, friendId: string) {

  const q = query(
    collection(db, "friends"),
    where("userId", "==", userId),
    where("friendId", "==", friendId)
  )

  const snap = await getDocs(q)

  snap.forEach(d => deleteDoc(d.ref))

}


/* GET FRIEND LIST */

export async function getFriends(uid:string){

const snapshot = await getDocs(
query(
collection(db,"friends"),
where("userId","==",uid)
)
)

const map = new Map()

for(const docSnap of snapshot.docs){

const friendId = docSnap.data().friendId

if(!map.has(friendId)){

const userDoc = await getDoc(
doc(db,"users",friendId)
)

map.set(friendId,{
friendId,
...userDoc.data()
})

}

}

return Array.from(map.values())

}


/* SEARCH USERS */

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