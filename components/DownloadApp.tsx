"use client"

export default function DownloadApp(){

  return(

    <section className="mt-20 bg-white/5 border border-white/10 rounded-2xl p-10 text-center">

      <h2 className="text-3xl font-bold mb-4">
        Download ReelSociety App
      </h2>

      <p className="text-gray-400 mb-8 max-w-xl mx-auto">
        Track movies, build lists, and share activity with friends.
        Install the Android app for the full experience.
      </p>

      <a
        href="/reelsociety.apk"
        download
        className="inline-block px-8 py-3 bg-red-600 hover:bg-red-500 rounded-xl font-semibold"
      >
        Download APK
      </a>

    </section>

  )

}