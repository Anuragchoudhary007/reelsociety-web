"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";

const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

export default function Home() {
  const [posters, setPosters] = useState<string[]>([]);
  const [rotation, setRotation] = useState(0);
  const [introDone, setIntroDone] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  /* ---------------- FETCH MOVIES ---------------- */

  useEffect(() => {
    async function fetchMovies() {
      try {
        const res = await fetch("/api/tmdb/trending/movie/week");
        const data = await res.json();

        const images =
          data.results
            ?.filter((m: any) => m.poster_path)
            .slice(0, 12)
            .map((m: any) => IMAGE_BASE + m.poster_path) || [];

        setPosters(images);
      } catch {
        console.log("Movie intro fetch failed — reload.");
      }
    }

    fetchMovies();
  }, []);

  /* ---------------- 3D ORBIT ---------------- */

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => prev + 0.0007);
    }, 16);

    return () => clearInterval(interval);
  }, []);

  /* ---------------- CAMERA SMOOTH TILT ---------------- */

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { stiffness: 40, damping: 18 });
  const smoothY = useSpring(mouseY, { stiffness: 40, damping: 18 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 6;
      const y = (e.clientY / window.innerHeight - 0.5) * 6;
      mouseX.set(x);
      mouseY.set(-y);
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  /* ---------------- CINEMATIC AUDIO FIX ---------------- */

  useEffect(() => {
    const playAudio = async () => {
      audioRef.current = new Audio("/intro.mp3");
      audioRef.current.volume = 0;
      audioRef.current.muted = false;

      try {
        await audioRef.current.play();

        // volume fade in
        let vol = 0;
        const fade = setInterval(() => {
          if (!audioRef.current) return;
          vol += 0.05;
          audioRef.current.volume = Math.min(vol, 0.6);
          if (vol >= 0.6) clearInterval(fade);
        }, 120);
      } catch {
        console.log("User interaction needed for sound.");
      }
    };

    playAudio();
  }, []);

  /* ---------------- AUTO TRANSITION ---------------- */

  useEffect(() => {
    const timer = setTimeout(() => {
      setIntroDone(true);
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  if (introDone) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center text-white text-2xl">
        🎬 Main Dashboard
      </main>
    );
  }

  const radius = 900;
  const arcAngle = Math.PI; // semi circle

  return (
    <main
      className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center"
      style={{ perspective: 1800 }}
    >
      {/* LETTERBOX BARS */}
      <motion.div
        initial={{ y: -200 }}
        animate={{ y: 0 }}
        transition={{ duration: 1.5 }}
        className="absolute top-0 w-full h-[90px] bg-black z-50"
      />
      <motion.div
        initial={{ y: 200 }}
        animate={{ y: 0 }}
        transition={{ duration: 1.5 }}
        className="absolute bottom-0 w-full h-[90px] bg-black z-50"
      />

      {/* 3D ORBIT */}
      <motion.div
        style={{
          rotateY: smoothX,
          rotateX: smoothY,
          transformStyle: "preserve-3d",
        }}
        className="absolute inset-0 flex items-center justify-center"
      >
        {posters.map((poster, i) => {
          const angle =
            (i / (posters.length - 1)) * arcAngle -
            arcAngle / 2 +
            rotation;

          const x = radius * Math.sin(angle);
          const z = radius * Math.cos(angle);

          const depth = (z + radius) / (2 * radius);
          const scale = 0.7 + depth * 0.8;
          const blur = (1 - depth) * 6;
          const opacity = 0.4 + depth * 0.6;

          return (
            <img
              key={i}
              src={poster}
              style={{
                position: "absolute",
                width: 360,
                height: 520,
                transform: `
                  translateX(${x}px)
                  translateZ(${z}px)
                  rotateY(${angle}rad)
                  scale(${scale})
                `,
                zIndex: Math.floor(depth * 100),
                filter: `blur(${blur}px)`,
                opacity,
              }}
              className="rounded-xl shadow-[0_0_120px_rgba(0,0,0,0.9)]"
            />
          );
        })}
      </motion.div>

      {/* AMBIENT RED GLOW */}
      <motion.div
        className="absolute w-[1500px] h-[1500px] rounded-full border border-red-500/20 blur-3xl"
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      {/* FILM GRAIN */}
      <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay animate-pulse bg-[url('/grain.png')]" />

      {/* LOGO ZOOM */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [1, 1.05, 1], opacity: 1 }}
        transition={{ duration: 3 }}
        className="relative z-40"
      >
        <img
          src="/logo.svg"
          className="w-[450px] drop-shadow-[0_0_150px_rgba(255,0,0,0.95)]"
        />

        {/* Light Sweep */}
        <motion.div
          initial={{ x: -600 }}
          animate={{ x: 600 }}
          transition={{ duration: 3.5, repeat: Infinity }}
          className="absolute top-0 left-0 w-[220px] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]"
        />
      </motion.div>
    </main>
  );
}