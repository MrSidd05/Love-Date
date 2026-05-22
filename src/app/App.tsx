import { useState, useRef, useCallback, useEffect } from "react";
import { Heart, Plus, ChevronLeft, ChevronRight, X, Type, Image, Video, ChevronDown, MapPin, Utensils, Home, Star, Music, Film, ShoppingBag } from "lucide-react";

/* ── helpers ── */
function useLocalStorage<T>(key: string, init: T): [T, (v: T | ((prev: T) => T)) => void] {
  const [val, setVal] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : init;
    } catch {
      return init;
    }
  });
  const set = useCallback((v: T | ((prev: T) => T)) => {
    setVal((prev) => {
      const next = typeof v === "function" ? (v as (p: T) => T)(prev) : v;
      try { localStorage.setItem(key, JSON.stringify(next)); } catch { /* quota exceeded */ }
      return next;
    });
  }, [key]);
  return [val, set];
}

/* ── floating hearts ── */
function FloatingHearts() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 16 }).map((_, i) => (
        <span
          key={i}
          className="absolute opacity-0"
          style={{
            left: `${(i * 19 + 3) % 93}%`,
            color: `hsl(${340 + (i % 30)}deg 70% 80%)`,
            fontSize: `${8 + (i % 14)}px`,
            animation: `floatHeart ${6 + (i % 4)}s linear ${(i * 0.65) % 7}s infinite`,
          }}
        >♥</span>
      ))}
    </div>
  );
}

/* ══════════════════════════ PAGE 1 – COVER ══════════════════════════ */
function CoverPage({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-rose-50 via-pink-50 to-amber-50 px-6 text-center overflow-hidden">
      <FloatingHearts />
      {/* corner folds */}
      <div className="absolute top-0 left-0 w-0 h-0 border-l-[110px] border-l-rose-200/70 border-b-[110px] border-b-transparent" />
      <div className="absolute top-0 right-0 w-0 h-0 border-r-[110px] border-r-rose-200/70 border-b-[110px] border-b-transparent" />
      <div className="absolute bottom-0 left-0 w-0 h-0 border-l-[110px] border-l-rose-200/50 border-t-[110px] border-t-transparent" />
      <div className="absolute bottom-0 right-0 w-0 h-0 border-r-[110px] border-r-rose-200/50 border-t-[110px] border-t-transparent" />

      <div className="relative z-10 flex flex-col items-center gap-5">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-rose-600 to-rose-800 flex items-center justify-center shadow-2xl border-4 border-rose-300">
          <Heart size={36} className="text-white" fill="white" />
        </div>

        <p className="text-xs tracking-[0.35em] uppercase text-rose-400" style={{ fontFamily: "'Lato', sans-serif", fontWeight: 300 }}>
          You are cordially invited to
        </p>

        <h1 className="text-6xl md:text-7xl font-bold italic leading-tight" style={{ fontFamily: "'Playfair Display', serif", color: "#7a1628" }}>
          Love Data
        </h1>

        <p className="text-2xl tracking-widest" style={{ fontFamily: "'Cormorant', serif", color: "#c8875a" }}>
          May 23rd, 2026
        </p>

        <div className="flex items-center gap-3">
          <div className="h-px w-16 bg-rose-200" />
          <Heart size={10} className="text-rose-300" fill="currentColor" />
          <div className="h-px w-16 bg-rose-200" />
        </div>

        <p className="text-xs tracking-[0.2em] uppercase text-rose-400" style={{ fontFamily: "'Lato', sans-serif", fontWeight: 300 }}>
          A day curated with love
        </p>

        <button
          onClick={onOpen}
          className="mt-6 px-10 py-3.5 bg-rose-700 text-white rounded-full text-sm tracking-widest uppercase hover:bg-rose-800 active:scale-95 transition-all duration-200 shadow-xl"
          style={{ fontFamily: "'Lato', sans-serif", fontWeight: 700 }}
        >
          Open Invitation ♥
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════ PAGE 2 – PHOTOS ══════════════════════════ */
function PhotoPage({ onNext }: { onNext: () => void }) {
  const [photos, setPhotos] = useLocalStorage<string[]>(
  "love-photos",
  ["/photos/main.jpg"]
);
  const [current, setCurrent] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  // clamp current if photos were removed
  useEffect(() => {
    if (photos.length > 0 && current >= photos.length) setCurrent(photos.length - 1);
  }, [photos.length, current]);

  const handleFiles = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPhotos((prev) => {
          const updated = [...prev, ev.target?.result as string];
          setCurrent(updated.length - 1);
          return updated;
        });
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  }, [setPhotos]);

  const removePhoto = (idx: number) => {
    setPhotos((prev) => {
      const updated = prev.filter((_, i) => i !== idx);
      setCurrent((c) => Math.min(c, Math.max(0, updated.length - 1)));
      return updated;
    });
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50 px-4 py-10 overflow-hidden">
      <FloatingHearts />
      <div className="relative z-10 flex flex-col items-center gap-5 w-full max-w-md">

        {/* Main frame */}
        <div className="relative w-full max-w-xs">
          <div
            className="relative w-full overflow-hidden shadow-2xl"
            style={{ height: "280px", border: "6px solid #f5e6d8", boxShadow: "0 8px 32px rgba(122,22,40,0.15), inset 0 0 0 1px rgba(200,135,90,0.2)" }}
          >
            {photos.length > 0 ? (
              <>
                <img src={photos[current]} alt={`Photo ${current + 1}`} className="w-full h-full object-cover" />
                {photos.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrent((c) => (c - 1 + photos.length) % photos.length)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center shadow hover:bg-white transition-colors"
                    >
                      <ChevronLeft size={16} className="text-rose-700" />
                    </button>
                    <button
                      onClick={() => setCurrent((c) => (c + 1) % photos.length)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center shadow hover:bg-white transition-colors"
                    >
                      <ChevronRight size={16} className="text-rose-700" />
                    </button>
                  </>
                )}
                {/* remove current */}
                <button
                  onClick={() => removePhoto(current)}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/40 flex items-center justify-center hover:bg-red-500/70 transition-colors"
                >
                  <X size={13} className="text-white" />
                </button>
                <div className="absolute bottom-2 right-2 bg-black/40 text-white text-xs px-2 py-0.5 rounded-full" style={{ fontFamily: "'Lato', sans-serif" }}>
                  {current + 1} / {photos.length}
                </div>
              </>
            ) : (
              <div
                className="w-full h-full flex flex-col items-center justify-center gap-3 bg-rose-50 cursor-pointer hover:bg-rose-100/50 transition-colors"
                onClick={() => fileRef.current?.click()}
              >
                <div className="w-14 h-14 rounded-full bg-rose-100 flex items-center justify-center">
                  <Heart size={28} className="text-rose-400" fill="currentColor" />
                </div>
                <p className="text-sm text-rose-400" style={{ fontFamily: "'Lato', sans-serif" }}>Tap to add our photos</p>
              </div>
            )}
          </div>

          {/* Thumbnail scroll strip */}
          {photos.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide" style={{ scrollbarWidth: "none" }}>
              {photos.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className="flex-shrink-0 w-12 h-12 overflow-hidden transition-all duration-200"
                  style={{
                    border: i === current ? "2.5px solid #9b2335" : "2px solid transparent",
                    opacity: i === current ? 1 : 0.6,
                    outline: "none",
                  }}
                >
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Dot nav */}
          {photos.length > 1 && photos.length <= 10 && (
            <div className="flex justify-center gap-1.5 mt-2">
              {photos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className="rounded-full transition-all duration-200"
                  style={{ width: i === current ? "18px" : "6px", height: "6px", background: i === current ? "#9b2335" : "#d4b8a8" }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Add button */}
        <button
          onClick={() => fileRef.current?.click()}
          className="flex items-center gap-2 px-6 py-2 rounded-full text-xs tracking-widest uppercase hover:bg-rose-50 active:scale-95 transition-all duration-200"
          style={{ fontFamily: "'Lato', sans-serif", fontWeight: 700, border: "1.5px solid #c8a882", color: "#9b2335" }}
        >
          <Plus size={13} /> {photos.length > 0 ? "Add More Photos" : "Add Photos"}
        </button>
        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />

        {/* Title */}
        <div className="text-center mt-1">
          <h1 className="text-5xl font-bold italic" style={{ fontFamily: "'Playfair Display', serif", color: "#7a1628" }}>
            Love Data
          </h1>
          <p className="text-xl mt-1.5 tracking-widest" style={{ fontFamily: "'Cormorant', serif", color: "#c8875a" }}>
            May 23rd, 2026
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-px w-14 bg-rose-200" />
          <Heart size={10} className="text-rose-300" fill="currentColor" />
          <div className="h-px w-14 bg-rose-200" />
        </div>

        <button
          onClick={onNext}
          className="px-10 py-3 bg-rose-700 text-white rounded-full text-sm tracking-widest uppercase hover:bg-rose-800 active:scale-95 transition-all duration-200 shadow-lg"
          style={{ fontFamily: "'Lato', sans-serif", fontWeight: 700 }}
        >
          See Our Day ♥
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════ PAGE 3 – ITINERARY ══════════════════════════ */
const activities = [
  { time: "8:30 AM", icon: <Star size={16} className="text-rose-600" />, title: "Meenakshi Temple", desc: "Blessings to begin our day" },
  { time: "9:30 AM", icon: <Utensils size={16} className="text-amber-600" />, title: "Breakfast at Dosa Camp", desc: "Crispy dosas & warm chai" },
  { time: "10:20 – 1:30 PM", icon: <Home size={16} className="text-rose-500" />, title: "At Home", desc: "Prepare dinner, play games & talk" },
  { time: "2:30 PM", icon: <Utensils size={16} className="text-amber-600" />, title: "Lunch", desc: "Nasi & me + surprise 🎁" },
];
const choices = [
  { icon: <ShoppingBag size={15} />, label: "Mall visit & fun, then home for dinner" },
  { icon: <Film size={15} />, label: "Watch a movie" },
  { icon: <Music size={15} />, label: "Karaoke night" },
];

function ItineraryPage({ onNext }: { onNext: () => void }) {
  const [chosen, setChosen] = useState<number | null>(null);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-rose-50 via-pink-50 to-amber-50 px-4 py-10 overflow-hidden">
      <FloatingHearts />
      <div className="relative z-10 max-w-sm mx-auto flex flex-col items-center gap-6">
        <div className="text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-rose-400 mb-1" style={{ fontFamily: "'Lato', sans-serif", fontWeight: 300 }}>Our perfect day</p>
          <h2 className="text-4xl font-bold italic" style={{ fontFamily: "'Playfair Display', serif", color: "#7a1628" }}>May 23rd, 2026</h2>
        </div>

        <div className="w-full">
          {activities.map((act, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-white border-2 border-rose-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                  {act.icon}
                </div>
                {i < activities.length - 1 && <div className="w-px bg-rose-200 my-1 flex-1 min-h-[20px]" />}
              </div>
              <div className="pb-5 flex-1">
                <span className="text-xs tracking-wider text-rose-400" style={{ fontFamily: "'Lato', sans-serif" }}>{act.time}</span>
                <p className="font-semibold text-rose-900 mt-0.5 leading-tight" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem" }}>{act.title}</p>
                <p className="text-xs text-rose-400 mt-0.5" style={{ fontFamily: "'Lato', sans-serif", fontWeight: 300 }}>{act.desc}</p>
              </div>
            </div>
          ))}

          {/* Evening choice */}
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-rose-700 flex items-center justify-center flex-shrink-0 shadow-sm">
                <Heart size={14} className="text-white" fill="white" />
              </div>
            </div>
            <div className="flex-1 pb-5">
              <span className="text-xs tracking-wider text-rose-400" style={{ fontFamily: "'Lato', sans-serif" }}>Evening</span>
              <p className="font-semibold text-rose-900 mt-0.5 mb-2.5" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem" }}>Choose our adventure</p>
              <div className="flex flex-col gap-1.5">
                {choices.map((c, idx) => (
                  <button
                    key={idx}
                    onClick={() => setChosen(idx)}
                    className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-left text-sm transition-all duration-200"
                    style={{
                      fontFamily: "'Lato', sans-serif",
                      border: chosen === idx ? "1.5px solid #9b2335" : "1.5px solid #f5ddd0",
                      background: chosen === idx ? "#9b2335" : "white",
                      color: chosen === idx ? "white" : "#7a4030",
                      transform: chosen === idx ? "scale(1.02)" : "scale(1)",
                      boxShadow: chosen === idx ? "0 4px 14px rgba(155,35,53,0.3)" : "none",
                    }}
                  >
                    <span className={chosen === idx ? "text-white" : "text-rose-400"}>{c.icon}</span>
                    <span className="font-medium">{String.fromCharCode(97 + idx)}) {c.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Farewell */}
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-white border-2 border-rose-200 flex items-center justify-center flex-shrink-0 shadow-sm">
              <MapPin size={14} className="text-rose-400" />
            </div>
            <div className="pt-1 pb-2">
              <p className="font-semibold text-rose-900" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem" }}>Bidding Farewell</p>
              <p className="text-xs text-rose-400 mt-0.5" style={{ fontFamily: "'Lato', sans-serif", fontWeight: 300 }}>Until we meet again…</p>
            </div>
          </div>
        </div>

        <button
          onClick={onNext}
          className="px-10 py-3 bg-rose-700 text-white rounded-full text-sm tracking-widest uppercase hover:bg-rose-800 active:scale-95 transition-all duration-200 shadow-lg"
          style={{ fontFamily: "'Lato', sans-serif", fontWeight: 700 }}
        >
          Continue ♥
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════ PAGE 4 – PROPOSAL ══════════════════════════ */
function ProposalPage({ onNext }: { onNext: () => void }) {
  const [answered, setAnswered] = useState(false);
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const [noAttempts, setNoAttempts] = useState(0);
  const noRef = useRef<HTMLButtonElement>(null);

  const runAway = useCallback(() => {
    const btn = noRef.current;
    if (!btn) return;
    const area = btn.closest(".prop-area") as HTMLElement;
    if (!area) return;
    const pw = area.offsetWidth, ph = area.offsetHeight;
    const bw = btn.offsetWidth, bh = btn.offsetHeight;
    const newX = (Math.random() - 0.5) * (pw - bw - 20) * 0.85;
    const newY = (Math.random() - 0.5) * (ph - bh - 20) * 0.85;
    setNoPos({ x: newX, y: newY });
    setNoAttempts((n) => n + 1);
  }, []);

  const msgs = ["Nope! Try again 😄", "Nice try! 💨", "Come back here! 😂", "You can't catch me! 🏃", "Wrong button! ✨", "Only YES works! 💌"];

  if (answered) {
    return (
      <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-rose-700 via-rose-600 to-pink-500 text-white px-6 text-center overflow-hidden">
        <FloatingHearts />
        <div className="relative z-10 flex flex-col items-center gap-6">
          <div className="text-8xl" style={{ animation: "pulseSlow 2s ease-in-out infinite" }}>💍</div>
          <h1 className="text-5xl font-bold italic" style={{ fontFamily: "'Playfair Display', serif" }}>She said YES!</h1>
          <p className="text-xl tracking-widest opacity-90" style={{ fontFamily: "'Cormorant', serif" }}>The most beautiful answer</p>
          <div className="flex gap-3 text-3xl">
            {[0, 200, 400].map((d) => (
              <span key={d} style={{ animation: `bounceHeart 1s ease-in-out ${d}ms infinite` }}>♥</span>
            ))}
          </div>
          <p className="text-xs tracking-[0.3em] uppercase opacity-60 mt-2" style={{ fontFamily: "'Lato', sans-serif", fontWeight: 300 }}>
            Forever begins today · May 23rd, 2026
          </p>
          <button
            onClick={onNext}
            className="mt-4 px-10 py-3 rounded-full text-sm tracking-widest uppercase active:scale-95 transition-all duration-200 shadow-lg"
            style={{ fontFamily: "'Lato', sans-serif", fontWeight: 700, background: "rgba(255,255,255,0.2)", border: "1.5px solid rgba(255,255,255,0.5)", color: "white" }}
          >
            Our Memories ♥
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-rose-50 via-pink-50 to-amber-50 px-6 text-center overflow-hidden">
      <FloatingHearts />
      <div className="relative z-10 flex flex-col items-center gap-7 max-w-xs w-full">
        <div className="text-7xl" style={{ animation: "pulseSlow 2s ease-in-out infinite" }}>💍</div>

        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-rose-400 mb-2" style={{ fontFamily: "'Lato', sans-serif", fontWeight: 300 }}>
            After all these beautiful moments…
          </p>
          <h1 className="text-5xl font-bold italic leading-tight" style={{ fontFamily: "'Playfair Display', serif", color: "#7a1628" }}>
            Will You<br />Marry Me?
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-px w-12 bg-rose-200" />
          <Heart size={10} className="text-rose-300" fill="currentColor" />
          <div className="h-px w-12 bg-rose-200" />
        </div>

        <div className="prop-area relative w-72 h-36 flex items-center justify-center" style={{ overflow: "visible" }}>
          <button
            onClick={() => setAnswered(true)}
            className="absolute left-4 px-10 py-4 bg-rose-700 text-white rounded-full text-sm tracking-widest uppercase font-bold hover:bg-rose-800 active:scale-95 transition-all duration-200 shadow-xl z-10"
            style={{ fontFamily: "'Lato', sans-serif" }}
          >
            YES ♥
          </button>
          <button
            ref={noRef}
            onMouseEnter={runAway}
            onTouchStart={runAway}
            onClick={runAway}
            className="absolute right-4 px-8 py-4 rounded-full text-sm tracking-widest uppercase font-bold transition-all duration-300 z-10 select-none"
            style={{
              fontFamily: "'Lato', sans-serif",
              background: "#f0e8e0",
              color: "#c0a898",
              border: "1.5px solid #e0cfc0",
              cursor: "default",
              transform: `translate(${noPos.x}px, ${noPos.y}px)`,
            }}
          >
            NO
          </button>
        </div>

        {noAttempts > 0 && (
          <p className="italic text-rose-500" style={{ fontFamily: "'Cormorant', serif", fontSize: "1.15rem" }}>
            {msgs[Math.min(noAttempts - 1, msgs.length - 1)]}
          </p>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════ PAGE 5 – MEMORIES ══════════════════════════ */
type MemType = "photo" | "video" | "text";
type Memory =
  | { type: "photo"; src: string; caption: string }
  | { type: "video"; src: string; caption: string }
  | { type: "text"; content: string; date: string };

function MemoriesPage() {
  const [memories, setMemories] = useLocalStorage<Memory[]>(
  "love-memories",
  [
    {
      type: "photo",
      src: "/photos/pic1.jpg",
      caption: "♥",
    },
    {
      type: "photo",
      src: "/photos/pic2.jpg",
      caption: "♥",
    },
    {
      type: "photo",
      src: "/photos/pic3.jpg",
      caption: "♥",
    },
    {
      type: "photo",
      src: "/photos/pic4.jpg",
      caption: "♥",
    },
    {
      type: "photo",
      src: "/photos/pic5.jpg",
      caption: "♥",
    },
    {
      type: "photo",
      src: "/photos/pic6.jpg",
      caption: "♥",
    },
    {
      type: "photo",
      src: "/photos/pic7.jpg",
      caption: "♥",
    },
    {
      type: "photo",
      src: "/photos/pic8.jpg",
      caption: "♥",
    },
    {
      type: "photo",
      src: "/photos/pic9.jpg",
      caption: "♥",
    },
    {
      type: "photo",
      src: "/photos/pic10.jpg",
      caption: "♥",
    },
    {
      type: "photo",
      src: "/photos/pic11.jpg",
      caption: "♥",
    },
    {
      type: "photo",
      src: "/photos/pic12.jpg",
      caption: "♥",
    },
    {
      type: "photo",
      src: "/photos/pic13.jpg",
      caption: "♥",
    },
    {
      type: "photo",
      src: "/photos/pic14.jpg",
      caption: "♥",
    },
    {
      type: "photo",
      src: "/photos/pic15.jpg",
      caption: "♥",
    },
    {
      type: "photo",
      src: "/photos/pic16.jpg",
      caption: "♥",
    },
    {
      type: "photo",
      src: "/photos/pic17.jpg",
      caption: "♥",
    },
    {
      type: "photo",
      src: "/photos/pic18.jpg",
      caption: "♥",
    },
    {
      type: "photo",
      src: "/photos/pic19.jpg",
      caption: "♥",
    },
    {
      type: "photo",
      src: "/photos/pic20.jpg",
      caption: "♥",
    },
    {
      type: "photo",
      src: "/photos/pic21.jpg",
      caption: "♥",
    },
    {
      type: "photo",
      src: "/photos/pic22.jpg",
      caption: "♥",
    },
    {
      type: "photo",
      src: "/photos/pic23.jpg",
      caption: "♥",
    }
  ]
);
  const [activeIdx, setActiveIdx] = useState(0);
  const [addMode, setAddMode] = useState<MemType | null>(null);
  const [textDraft, setTextDraft] = useState("");
  const [captionDraft, setCaptionDraft] = useState("");
  const [dateDraft, setDateDraft] = useState("");
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // scroll wheel / touch
  useEffect(() => {
    if (!memories.length) return;
    const el = scrollRef.current;
    if (!el) return;
    let lastTime = 0;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const now = Date.now();
      if (now - lastTime < 600) return;
      lastTime = now;
      if (e.deltaY > 0) setActiveIdx((a) => Math.min(a + 1, memories.length - 1));
      else setActiveIdx((a) => Math.max(a - 1, 0));
    };
    let startY = 0;
    const onTStart = (e: TouchEvent) => { startY = e.touches[0].clientY; };
    const onTEnd = (e: TouchEvent) => {
      const dy = startY - e.changedTouches[0].clientY;
      if (Math.abs(dy) < 50) return;
      if (dy > 0) setActiveIdx((a) => Math.min(a + 1, memories.length - 1));
      else setActiveIdx((a) => Math.max(a - 1, 0));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTStart, { passive: true });
    el.addEventListener("touchend", onTEnd, { passive: true });
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTStart);
      el.removeEventListener("touchend", onTEnd);
    };
  }, [memories.length]);

  const handleMediaFile = (e: React.ChangeEvent<HTMLInputElement>, type: "photo" | "video") => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const mem: Memory = type === "photo"
        ? { type: "photo", src: ev.target?.result as string, caption: captionDraft }
        : { type: "video", src: ev.target?.result as string, caption: captionDraft };
      setMemories((prev) => {
        const next = [...prev, mem];
        setActiveIdx(next.length - 1);
        return next;
      });
      setCaptionDraft("");
      setAddMode(null);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const addText = () => {
    if (!textDraft.trim()) return;
    const mem: Memory = { type: "text", content: textDraft.trim(), date: dateDraft || "May 23rd, 2026" };
    setMemories((prev) => {
      const next = [...prev, mem];
      setActiveIdx(next.length - 1);
      return next;
    });
    setTextDraft(""); setDateDraft(""); setAddMode(null);
  };

  const removeMemory = (idx: number) => {
    setMemories((prev) => {
      const next = prev.filter((_, i) => i !== idx);
      setActiveIdx((a) => Math.min(a, Math.max(0, next.length - 1)));
      return next;
    });
  };

  const activeMem = memories[activeIdx];

  // Background src for active photo/video memory
  const bgSrc = activeMem && activeMem.type !== "text" ? activeMem.src : null;

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ background: "#1a0810" }}
    >
      {/* Full-bleed background that transitions */}
      <div className="absolute inset-0 transition-all duration-700 z-0">
        {bgSrc ? (
          activeMem?.type === "video" ? (
            <video src={bgSrc} className="absolute inset-0 w-full h-full object-cover opacity-25" autoPlay muted loop playsInline />
          ) : (
            <img src={bgSrc} alt="" className="absolute inset-0 w-full h-full object-cover opacity-25" />
          )
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-rose-950 to-[#1a0810]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
      </div>

      {/* Floating hearts */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <FloatingHearts />
      </div>

      {/* ── Top header ── */}
      <div className="relative z-20 flex items-center justify-between px-5 pt-8 pb-3">
        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-white/50" style={{ fontFamily: "'Lato', sans-serif", fontWeight: 300 }}>Our Memories</p>
          <p className="text-xl font-bold italic text-white/90" style={{ fontFamily: "'Playfair Display', serif" }}>Love Data</p>
        </div>
        <div className="flex gap-2">
          {([["photo", <Image size={14} />], ["video", <Video size={14} />], ["text", <Type size={14} />]] as [MemType, React.ReactNode][]).map(([type, icon]) => (
            <button
              key={type}
              onClick={() => setAddMode(type)}
              className="w-9 h-9 rounded-full flex items-center justify-center text-white transition-colors"
              style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}
            >
              {icon}
            </button>
          ))}
        </div>
      </div>

      {/* ── Memory card viewer ── */}
      <div
        ref={scrollRef}
        className="relative z-10 flex items-center justify-center px-4 pt-4 pb-6"
        style={{ minHeight: "calc(100vh - 120px)" }}
      >
        {memories.length === 0 ? (
          /* empty state */
          <div className="flex flex-col items-center gap-6 text-center max-w-xs">
            <div className="text-6xl">📸</div>
            <h2 className="text-3xl font-bold italic text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
              Our Memories
            </h2>
            <p className="text-sm text-white/50" style={{ fontFamily: "'Lato', sans-serif", fontWeight: 300 }}>
              Add photos, videos & notes to fill this page with love
            </p>
            <div className="flex gap-3 flex-wrap justify-center">
              {([
                ["photo", "📷 Photo", "#9b2335"],
                ["video", "🎬 Video", "#7a4030"],
                ["text", "✍️ Write", "#c8875a"],
              ] as [MemType, string, string][]).map(([type, label, bg]) => (
                <button
                  key={type}
                  onClick={() => setAddMode(type)}
                  className="px-6 py-2.5 rounded-full text-xs tracking-widest uppercase font-bold active:scale-95 transition-all shadow-lg text-white"
                  style={{ fontFamily: "'Lato', sans-serif", background: bg }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* memory card — compact, not full screen */
          <div className="w-full max-w-sm flex flex-col items-center gap-4">
            {/* Card */}
            <div
              className="relative w-full overflow-hidden shadow-2xl transition-all duration-500"
              style={{
                height: "360px",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.15)",
                boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
              }}
            >
              {activeMem?.type === "text" ? (
                <div className="w-full h-full flex flex-col items-center justify-center px-8 text-center" style={{ background: "linear-gradient(160deg, #fdfaf6, #f8f0e8)" }}>
                  <Heart size={24} className="text-rose-300 mb-5" fill="currentColor" />
                  <p
                    className="text-xl italic leading-relaxed"
                    style={{ fontFamily: "'Playfair Display', serif", color: "#4a2010" }}
                  >
                    "{activeMem.content}"
                  </p>
                  <p className="mt-5 text-xs tracking-widest uppercase" style={{ fontFamily: "'Lato', sans-serif", color: "#b08060" }}>
                    {activeMem.date}
                  </p>
                </div>
              ) : activeMem?.type === "photo" ? (
                <>
                  <img src={activeMem.src} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%)" }} />
                  {activeMem.caption && (
                    <p className="absolute bottom-4 left-0 right-0 text-center text-white text-base italic px-5" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {activeMem.caption}
                    </p>
                  )}
                </>
              ) : activeMem?.type === "video" ? (
                <>
                  <video src={activeMem.src} className="w-full h-full object-cover" autoPlay muted loop playsInline />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%)" }} />
                  {activeMem.caption && (
                    <p className="absolute bottom-4 left-0 right-0 text-center text-white text-base italic px-5" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {activeMem.caption}
                    </p>
                  )}
                </>
              ) : null}

              {/* Remove btn */}
              <button
                onClick={() => removeMemory(activeIdx)}
                className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center transition-colors"
                style={{ background: "rgba(0,0,0,0.4)" }}
              >
                <X size={13} className="text-white" />
              </button>

              {/* Nav arrows if multiple */}
              {memories.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveIdx((a) => Math.max(0, a - 1))}
                    disabled={activeIdx === 0}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-colors disabled:opacity-30"
                    style={{ background: "rgba(0,0,0,0.35)" }}
                  >
                    <ChevronLeft size={16} className="text-white" />
                  </button>
                  <button
                    onClick={() => setActiveIdx((a) => Math.min(memories.length - 1, a + 1))}
                    disabled={activeIdx === memories.length - 1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-colors disabled:opacity-30"
                    style={{ background: "rgba(0,0,0,0.35)" }}
                  >
                    <ChevronRight size={16} className="text-white" />
                  </button>
                </>
              )}
            </div>

            {/* Dot nav + counter */}
            {memories.length > 1 && (
              <div className="flex items-center gap-2">
                {memories.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIdx(i)}
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: i === activeIdx ? "20px" : "6px",
                      height: "6px",
                      background: i === activeIdx ? "white" : "rgba(255,255,255,0.35)",
                    }}
                  />
                ))}
              </div>
            )}

            {/* Scroll hint */}
            {memories.length > 1 && (
              <p className="text-white/40 text-xs text-center" style={{ fontFamily: "'Lato', sans-serif", fontWeight: 300 }}>
                scroll or swipe · {activeIdx + 1} of {memories.length}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Add modals */}
      {addMode === "photo" && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60" onClick={() => setAddMode(null)}>
          <div className="w-full max-w-lg p-6 pb-10 flex flex-col gap-4" style={{ background: "linear-gradient(160deg, #fdfaf6, #f5efe6)", borderRadius: "14px 14px 0 0" }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold italic" style={{ fontFamily: "'Playfair Display', serif", color: "#7a1628" }}>Add a Photo Memory</h3>
              <button onClick={() => setAddMode(null)}><X size={18} className="text-rose-400" /></button>
            </div>
            <input type="text" placeholder="Caption (optional)…" value={captionDraft} onChange={(e) => setCaptionDraft(e.target.value)} className="px-4 py-2.5 text-sm outline-none" style={{ fontFamily: "'Lato', sans-serif", color: "#4a2010", background: "#ede3d4", borderRadius: "6px", border: "1px solid #c8a882" }} />
            <button onClick={() => photoInputRef.current?.click()} className="flex items-center justify-center gap-2 py-3 rounded-full text-sm tracking-widest uppercase font-bold active:scale-95 transition-all shadow-md" style={{ background: "linear-gradient(135deg, #9b2335, #7a1628)", color: "#fdfaf6", fontFamily: "'Lato', sans-serif" }}>
              <Image size={15} /> Choose Photo
            </button>
          </div>
        </div>
      )}

      {addMode === "video" && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60" onClick={() => setAddMode(null)}>
          <div className="w-full max-w-lg p-6 pb-10 flex flex-col gap-4" style={{ background: "linear-gradient(160deg, #fdfaf6, #f5efe6)", borderRadius: "14px 14px 0 0" }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold italic" style={{ fontFamily: "'Playfair Display', serif", color: "#7a1628" }}>Add a Video Memory</h3>
              <button onClick={() => setAddMode(null)}><X size={18} className="text-rose-400" /></button>
            </div>
            <input type="text" placeholder="Caption (optional)…" value={captionDraft} onChange={(e) => setCaptionDraft(e.target.value)} className="px-4 py-2.5 text-sm outline-none" style={{ fontFamily: "'Lato', sans-serif", color: "#4a2010", background: "#ede3d4", borderRadius: "6px", border: "1px solid #c8a882" }} />
            <button onClick={() => videoInputRef.current?.click()} className="flex items-center justify-center gap-2 py-3 rounded-full text-sm tracking-widest uppercase font-bold active:scale-95 transition-all shadow-md" style={{ background: "linear-gradient(135deg, #7a4030, #5a2818)", color: "#fdfaf6", fontFamily: "'Lato', sans-serif" }}>
              <Video size={15} /> Choose Video
            </button>
          </div>
        </div>
      )}

      {addMode === "text" && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60" onClick={() => setAddMode(null)}>
          <div className="w-full max-w-lg p-6 pb-10 flex flex-col gap-4" style={{ background: "linear-gradient(160deg, #fdfaf6, #f5efe6)", borderRadius: "14px 14px 0 0" }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold italic" style={{ fontFamily: "'Playfair Display', serif", color: "#7a1628" }}>Write a Memory</h3>
              <button onClick={() => setAddMode(null)}><X size={18} className="text-rose-400" /></button>
            </div>
            <textarea rows={4} placeholder="Write something beautiful…" value={textDraft} onChange={(e) => setTextDraft(e.target.value)} className="px-4 py-3 text-sm outline-none resize-none" style={{ fontFamily: "'Cormorant', serif", color: "#4a2010", background: "#ede3d4", borderRadius: "6px", border: "1px solid #c8a882", fontSize: "1rem" }} />
            <input type="text" placeholder="Date (e.g. May 23rd, 2026)" value={dateDraft} onChange={(e) => setDateDraft(e.target.value)} className="px-4 py-2.5 text-sm outline-none" style={{ fontFamily: "'Lato', sans-serif", color: "#4a2010", background: "#ede3d4", borderRadius: "6px", border: "1px solid #c8a882" }} />
            <button onClick={addText} className="flex items-center justify-center gap-2 py-3 rounded-full text-sm tracking-widest uppercase font-bold active:scale-95 transition-all shadow-md" style={{ background: "linear-gradient(135deg, #c8875a, #a86840)", color: "#fdfaf6", fontFamily: "'Lato', sans-serif" }}>
              <Heart size={15} fill="white" /> Save Memory
            </button>
          </div>
        </div>
      )}

      <input ref={photoInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleMediaFile(e, "photo")} />
      <input ref={videoInputRef} type="file" accept="video/*" className="hidden" onChange={(e) => handleMediaFile(e, "video")} />
    </div>
  );
}

/* ══════════════════════════ ROOT ══════════════════════════ */
export default function App() {
  const [page, setPage] = useState(0);
  const [flipping, setFlipping] = useState(false);
  const [dir, setDir] = useState<"fwd" | "bck">("fwd");

  const goTo = (next: number) => {
    if (flipping) return;
    setDir(next > page ? "fwd" : "bck");
    setFlipping(true);
    setTimeout(() => { setPage(next); setFlipping(false); }, 580);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Cormorant:ital,wght@0,300;0,400;1,300;1,400&family=Lato:wght@300;400;700&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; background: #fdf6f0; }

        @keyframes floatHeart {
          0%   { transform: translateY(110vh) scale(0.5); opacity: 0; }
          10%  { opacity: 0.55; }
          90%  { opacity: 0.2; }
          100% { transform: translateY(-10vh) scale(1.2); opacity: 0; }
        }
        @keyframes pulseSlow {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.08); }
        }
        @keyframes bounceHeart {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-8px); }
        }
        @keyframes flipOutFwd {
          from { transform: perspective(1400px) rotateY(0deg); opacity: 1; }
          to   { transform: perspective(1400px) rotateY(-90deg); opacity: 0; }
        }
        @keyframes flipInFwd {
          from { transform: perspective(1400px) rotateY(90deg); opacity: 0; }
          to   { transform: perspective(1400px) rotateY(0deg); opacity: 1; }
        }
        @keyframes flipOutBck {
          from { transform: perspective(1400px) rotateY(0deg); opacity: 1; }
          to   { transform: perspective(1400px) rotateY(90deg); opacity: 0; }
        }
        @keyframes flipInBck {
          from { transform: perspective(1400px) rotateY(-90deg); opacity: 0; }
          to   { transform: perspective(1400px) rotateY(0deg); opacity: 1; }
        }
        .flip-out-fwd { animation: flipOutFwd 0.29s ease-in forwards; transform-origin: left center; }
        .flip-in-fwd  { animation: flipInFwd  0.29s ease-out 0.29s forwards; opacity: 0; transform-origin: left center; }
        .flip-out-bck { animation: flipOutBck 0.29s ease-in forwards; transform-origin: right center; }
        .flip-in-bck  { animation: flipInBck  0.29s ease-out 0.29s forwards; opacity: 0; transform-origin: right center; }
      `}</style>

      <div className={
        flipping
          ? (dir === "fwd" ? "flip-out-fwd" : "flip-out-bck")
          : (dir === "fwd" ? "flip-in-fwd"  : "flip-in-bck")
      }>
        {page === 0 && <CoverPage onOpen={() => goTo(1)} />}
        {page === 1 && <PhotoPage onNext={() => goTo(2)} />}
        {page === 2 && <ItineraryPage onNext={() => goTo(3)} />}
        {page === 3 && <ProposalPage onNext={() => goTo(4)} />}
        {page === 4 && <MemoriesPage />}
      </div>

      {/* Page dots for pages 1–3 */}
      {page >= 1 && page <= 3 && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-50">
          {[1, 2, 3].map((p) => (
            <button
              key={p}
              onClick={() => goTo(p)}
              className="rounded-full transition-all duration-300"
              style={{ height: "6px", width: page === p ? "20px" : "6px", background: page === p ? "#9b2335" : "#d4a8a0" }}
            />
          ))}
        </div>
      )}
    </>
  );
}
