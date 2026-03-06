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
export async function createActivity(uid:string,type:string,movie:any){

await addDoc(
collection(db,"users",uid,"activity"),
{
type,
movieId:movie.id,
movieTitle:movie.title || movie.name,
poster:movie.poster_path,
createdAt:serverTimestamp()
}
)

}