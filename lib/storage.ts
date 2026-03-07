import { storage } from "@/lib/firebase"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"

export async function uploadProfileImage(file: File, uid: string) {

  const storageRef = ref(storage, `avatars/${uid}.jpg`)

  await uploadBytes(storageRef, file)

  const url = await getDownloadURL(storageRef)

  return url
}