import {
  collectionGroup,
  query,
  orderBy,
  limit,
  getDocs,
  addDoc,
  collection,
  serverTimestamp
} from "firebase/firestore"

import { db } from "@/lib/firebase"

export async function getFriendsActivity(){

  const q = query(
    collectionGroup(db,"activity"),
    orderBy("createdAt","desc"),
    limit(20)
  )

  const snap = await getDocs(q)

  return snap.docs.map(doc=>({
    id:doc.id,
    ...doc.data()
  }))
}

export async function createActivity(
  userId:string,
  type:string,
  movie:any,
  extra?:any
){

  if(!movie?.id) return

  await addDoc(
    collection(db,"users",userId,"activity"),
    {
      type,
      movieId:movie.id,
      movieTitle:movie.title || movie.name || "Unknown",
      poster:movie.poster_path || null,
      rating:extra?.rating || null,
      createdAt:serverTimestamp()
    }
  )

}