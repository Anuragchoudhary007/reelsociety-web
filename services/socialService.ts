import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs
} from "firebase/firestore"
import { db } from "@/lib/firebase"

/* FRIENDS ACTIVITY */

export async function getFriendsActivity(friendIds:string[]) {

  if(friendIds.length === 0) return []

  const q = query(
    collection(db,"activity"),
    where("userId","in",friendIds.slice(0,10)),
    orderBy("createdAt","desc"),
    limit(20)
  )

  const snap = await getDocs(q)

  return snap.docs.map(d=>({
    id:d.id,
    ...d.data()
  }))
}


/* RECENT REVIEWS */

export async function getRecentReviews(){

  const q = query(
    collection(db,"moviesReviews"),
    orderBy("createdAt","desc"),
    limit(20)
  )

  const snap = await getDocs(q)

  return snap.docs.map(d=>({
    id:d.id,
    ...d.data()
  }))
}