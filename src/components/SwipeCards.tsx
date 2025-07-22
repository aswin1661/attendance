'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useAnimationControls } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type Card = {
  id: number;
  image: string;
  title: string;
};

const cards: Card[] = [
  { id: 1, image: '/card.jpg', title: 'Card One' },
  { id: 2, image: '/card.jpg', title: 'Card Two' },
  { id: 3, image: '/card.jpg', title: 'Card Three' },
  { id: 4, image: '/card.jpg', title: 'Card Four' },
  { id: 5, image: '/card.jpg', title: 'Card Five' },
  { id: 6, image: '/card.jpg', title: 'Card Six' },
  { id: 7, image: '/card.jpg', title: 'Card Seven' },
  { id: 8, image: '/card.jpg', title: 'Card Eight' },
  { id: 9, image: '/card.jpg', title: 'Card Nine' },
  { id: 10, image: '/card.jpg', title: 'Card Ten' },
  { id: 11, image: '/card.jpg', title: 'Card Eleven' },
  { id: 12, image: '/card.jpg', title: 'Card Twelve' },
  { id: 13, image: '/card.jpg', title: 'Card Thirteen' },  { id: 14, image: '/card.jpg', title: 'Card Fourteen' },
];

export default function SwipeCards() {
  const [index, setIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [finishedLastCard, setFinishedLastCard] = useState(false);
  const [wave, setWave] = useState<'left' | 'right' | null>(null);
  const [swipeHistory, setSwipeHistory] = useState<{ id: number; direction: 'left' | 'right' }[]>([]);
  const [lastSwipe, setLastSwipe] = useState<'left' | 'right' | null>(null);
  const [previousIndices, setPreviousIndices] = useState<number[]>([]);

  const lastSwipeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const controls = useAnimationControls();
  const router = useRouter();

  const handleSwipe = (direction: -1 | 1) => {
    if (isAnimating || finishedLastCard) return;

    const swipeDirection = direction === 1 ? 'right' : 'left';

    setLastSwipe(swipeDirection);
    if (lastSwipeTimeoutRef.current) clearTimeout(lastSwipeTimeoutRef.current);
    lastSwipeTimeoutRef.current = setTimeout(() => setLastSwipe(null), 2500);

    // Check if the card has been swiped before and update its swipe direction
    setSwipeHistory((prev) => {
      const updatedHistory = prev.filter((entry) => entry.id !== cards[index].id); // Remove any previous entry for this card
      updatedHistory.push({ id: cards[index].id, direction: swipeDirection }); // Add the updated swipe direction for this card
      return updatedHistory;
      
    });

    setPreviousIndices(prev => [...prev, index]); // Push current index before moving forward
    setTimeout(() => setWave(null), 720);

    setIsAnimating(true);
    setWave(swipeDirection);

    controls
      .start({
        x: direction * 1000,
        opacity: 0,
        scale: 0.8,
        rotate: direction * 45,
        transition: { duration: 0.33 }, // 10% faster (was 0.36)
      })
      .then(() => {
        if (index + 1 === cards.length) {
          setFinishedLastCard(true);
        } else {
          setIndex(prev => prev + 1); // Move to next card
        }
        controls.set({ x: 0, opacity: 1, scale: 1, rotate: 0 });
        setIsAnimating(false);
      });
  };

  const handleDragEnd = (_: any, info: { velocity: { x: number }; offset: { x: number } }) => {
    if (isAnimating || finishedLastCard) return;

    const { x: velocityX } = info.velocity;
    const { x: offsetX } = info.offset;

    if (Math.abs(velocityX) > 500 || Math.abs(offsetX) > 100) {
      handleSwipe(offsetX > 0 ? 1 : -1);
    } else {
      controls.start({
        x: 0,
        rotate: 0,
        opacity: 1,
        scale: 1,
        transition: { duration: 0.24, ease: 'easeOut' },
      });
    }
  };

  const goToResults = () => {
    localStorage.setItem('swipeResults', JSON.stringify(swipeHistory));
    router.push('/results');
  };

  const handlePrevious = () => {
    if (previousIndices.length > 0) {
      const prevArr = [...previousIndices];
      const prevIndex = prevArr.pop()!;
      setIndex(prevIndex);
      setPreviousIndices(prevArr);
    }
  };

  if (finishedLastCard) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900 text-gray-100 px-4">
        <p className="mb-6 text-xl font-semibold text-center">The End of Roll Number.</p>
        <button
          onClick={goToResults}
          className="px-6 py-3 bg-green-700 hover:bg-green-800 rounded-md transition text-white"
        >
          See Results
        </button>
      </div>
    );
  }

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-grey text-gray-100 overflow-hidden px-4">
      {/* Swipe wave animation */}
      <AnimatePresence>
        {wave && (
          <motion.div
            key="wave"
            initial={{ opacity: 0, scaleY: 0, y: 120 }}
            animate={{ opacity: 0.3, scaleY: 1, y: 0 }}
            exit={{ opacity: 0, scaleY: 1, y: -120 }}
            transition={{ duration: 0.72, ease: 'easeOut' }}
            className="absolute left-0 right-0 bottom-0 top-[-20vh] origin-bottom z-0 pointer-events-none"
            style={{
              height: '120vh',
              background:
                wave === 'right'
                  ? `linear-gradient(to top, rgba(34,197,94,0) 0%, rgba(34,197,94,0.3) 20%, rgba(34,197,94,0.7) 40%, rgba(34,197,94,0.7) 60%, rgba(34,197,94,0.3) 80%, rgba(34,197,94,0) 100%)`
                  : `linear-gradient(to top, rgba(220,38,38,0) 0%, rgba(220,38,38,0.3) 20%, rgba(220,38,38,0.7) 40%, rgba(220,38,38,0.7) 60%, rgba(220,38,38,0.3) 80%, rgba(220,38,38,0) 100%)`,
            }}
          />
        )}
      </AnimatePresence>

      {/* Last swipe notification */}
      <AnimatePresence>
        {lastSwipe && (
          <motion.div
            key="lastSwipe"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="fixed top-6 left-1/2 -translate-x-1/2 w-[92%] max-w-md z-50 flex bg-gray-900 text-white rounded-md shadow-lg overflow-hidden"
          >
            {/* Vertical colored strip */}
            <div
              className={`w-[6px] ${lastSwipe === 'right' ? 'bg-green-500' : 'bg-red-500'}`}
              style={{
                borderTopRightRadius: '8px',
                borderBottomRightRadius: '8px',
              }}
            />
            <div className="flex-1 px-4 py-3 flex items-center">
              <span className="text-sm font-medium">
                Marked {lastSwipe === 'right' ? 'Presented' : 'Absent'}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Swipe buttons */}
      <button
        onClick={() => handleSwipe(-1)}
        disabled={isAnimating || finishedLastCard}
        className="fixed bottom-4 left-4 md:absolute md:left-4 md:top-1/2 md:-translate-y-1/2 bg-red-600 hover:bg-red-700 disabled:bg-red-900 text-white rounded-full w-12 h-12 flex justify-center items-center shadow-lg z-30"
      >
        ←
      </button>

      <button
        onClick={() => handleSwipe(1)}
        disabled={isAnimating || finishedLastCard}
        className="fixed bottom-4 right-4 md:absolute md:right-4 md:top-1/2 md:-translate-y-1/2 bg-green-600 hover:bg-green-700 disabled:bg-green-900 text-white rounded-full w-12 h-12 flex justify-center items-center shadow-lg z-30"
      >
        →
      </button>

      {/* Previous button (below center) */}
      <button
        onClick={handlePrevious}
        disabled={isAnimating || finishedLastCard || previousIndices.length === 0}
        className="fixed bottom-16 md:absolute md:left-1/2 md:-translate-x-1/2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900 text-white rounded-full w-20 h-12 flex justify-center items-center shadow-lg z-30"
      >
        ↩
      </button>

      {/* Current draggable card */}
      <AnimatePresence mode="wait" initial={false}>
        {index < cards.length && !isAnimating && (
          <motion.div
            key={cards[index].id}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            initial={{ scale: 1, opacity: 1, x: 0, rotate: 0 }}
            animate={{ scale: 1, opacity: 1, x: 0, rotate: 0 }}
            exit={{
              scale: 0.8,
              opacity: 0,
              y: -50,
              transition: { duration: 0.33 }, // 10% faster (was 0.36/0.18)
            }}
            className="absolute w-80 h-96 bg-gray-800 rounded-xl shadow-lg p-0 cursor-grab touch-none overflow-hidden
    border-t-2 border-l-2 border-r-2 border-b-[1.2px] border-gray-700
    backdrop-blur-md
    bg-gradient-to-br from-white/10 via-white/5 to-transparent
    ring-2 ring-white/20
    "
            style={{ touchAction: 'none', zIndex: 20 }} // Higher z-index
          >
            <CardContent card={cards[index]} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CardContent({ card }: { card: Card }) {
  return (
    <div className="relative w-full h-full">
      <Image
        src={card.image}
        alt={card.title}
        fill
        sizes="(max-width: 768px) 100vw, 320px"
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      <div className="absolute bottom-0 p-4 text-white z-10">
        <h2 className="text-lg font-semibold">{card.title}</h2>
        <p className="text-sm text-gray-300">Swipe left or right</p>
      </div>
    </div>
  );
}
