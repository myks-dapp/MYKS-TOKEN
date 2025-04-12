// components/ProductSlider.tsx
'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const images = [
  '/produk1.png',
  '/produk2.png',
  '/produk3.png',
]

const ProductSlider = () => {
  const [index, setIndex] = useState(0)

  const nextImage = () => setIndex((index + 1) % images.length)
  const prevImage = () => setIndex((index - 1 + images.length) % images.length)

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-6">
      <div className="relative overflow-hidden rounded-2xl shadow-xl border-4 border-green-500">
        <AnimatePresence initial={false} mode="wait">
          <motion.img
            key={images[index]}
            src={images[index]}
            alt={`Product ${index + 1}`}
            className="w-full h-auto object-cover"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
          />
        </AnimatePresence>

        <button
          onClick={prevImage}
          className="absolute top-1/2 left-3 transform -translate-y-1/2 bg-red-600 text-white px-3 py-1 rounded-full shadow-lg hover:bg-red-700 transition"
        >
          ‹
        </button>

        <button
          onClick={nextImage}
          className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-yellow-400 text-black px-3 py-1 rounded-full shadow-lg hover:bg-yellow-500 transition"
        >
          ›
        </button>
      </div>

      <div className="flex justify-center gap-2 mt-4">
        {images.map((_, i) => (
          <span
            key={i}
            className={`h-3 w-3 rounded-full transition-all duration-300 ${
              i === index ? 'bg-green-600 scale-110' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default ProductSlider