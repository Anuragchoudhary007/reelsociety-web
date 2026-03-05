"use client";

export default function TrailerModal({ videoKey, onClose }: any) {
  if (!videoKey) return null;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
      <div className="relative w-[80%] aspect-video">
        <iframe
          className="w-full h-full rounded-lg"
          src={`https://www.youtube.com/embed/${videoKey}`}
          allowFullScreen
        />
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-white text-black px-3 py-1 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
}