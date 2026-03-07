"use client"

import Link from "next/link"

export default function DownloadApp() {

  return (

    <div className="mt-24">

      <div className="
        relative
        overflow-hidden
        bg-gradient-to-br
        from-white/5
        to-white/10
        border border-white/10
        rounded-3xl
        p-14
        text-center
        backdrop-blur-xl
      ">

        {/* Glow background */}

        <div className="
          absolute
          inset-0
          opacity-20
          pointer-events-none
          bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.4),transparent_60%)]
          animate-pulse
        "/>

        {/* Content */}

        <div className="relative z-10">

          {/* Title */}

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Download ReelSociety App
          </h2>

          <p className="text-gray-400 max-w-xl mx-auto mb-10">
            Track movies, build lists, and share activity with friends.
            Install the Android app for the full experience.
          </p>

          {/* Download Button */}

          <button className="
            bg-white
            text-black
            px-8
            py-3
            rounded-xl
            font-semibold
            hover:bg-gray-200
            hover:scale-105
            transition
            shadow-lg
          ">
            Download APK
          </button>

          {/* Divider */}

          <div className="mt-14 border-t border-white/10 pt-10">

            <p className="text-sm text-gray-500 mb-8">
              Created by
            </p>

            {/* Team */}

            <div className="flex flex-wrap justify-center gap-16">

              {/* YOU */}

              <Link
                href="https://github.com/Anuragchoudhary007"
                target="_blank"
                className="group text-center"
              >

                <div className="
                  w-20 h-20
                  mx-auto
                  rounded-full
                  bg-gradient-to-br
                  from-red-500
                  to-orange-500
                  flex items-center
                  justify-center
                  text-2xl
                  font-bold
                  mb-4
                  shadow-xl
                  group-hover:scale-110
                  group-hover:shadow-red-500/40
                  transition
                ">
                  A
                </div>

                <p className="font-semibold text-lg group-hover:text-red-400 transition">
                  Anurag Choudhary
                </p>

                <p className="text-sm text-gray-400">
                  Founder
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  Lead Developer · Backend · API Engineer
                </p>

              </Link>

              {/* FRIEND */}

              <Link
                href="https://github.com/panwar-cloud"
                target="_blank"
                className="group text-center"
              >

                <div className="
                  w-20 h-20
                  mx-auto
                  rounded-full
                  bg-gradient-to-br
                  from-blue-500
                  to-purple-500
                  flex items-center
                  justify-center
                  text-2xl
                  font-bold
                  mb-4
                  shadow-xl
                  group-hover:scale-110
                  group-hover:shadow-blue-500/40
                  transition
                ">
                  P
                </div>

                <p className="font-semibold text-lg group-hover:text-blue-400 transition">
                  Paramjeet Singh
                </p>

                <p className="text-sm text-gray-400">
                  Full-Stack Developer
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  UI/UX Engineer
                </p>

              </Link>

            </div>

          </div>

        </div>

      </div>

    </div>

  )

}