import Image from 'next/image'
import Link from 'next/link'
import PresalePanel from '@/components/PresalePanel'
import ProductSlider from '@/components/ProductSlider'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-[#fefefe] text-gray-800 px-4 py-12">
      {/* Logo */}
      <div className="mb-8">
        <Image
          src="/logo.png"
          alt="MYKS Logo"
          width={80}
          height={80}
          className="rounded-xl shadow-md"
        />
      </div>

      {/* Headline */}
      <h1 className="text-5xl md:text-6xl font-extrabold text-center mb-6 leading-tight">
        <span className="text-red-600">Invest</span> in Local Brilliance,<br />
        <span className="text-green-600">Profit</span> from Global Vision
      </h1>

      {/* Subheadline */}
      <p className="text-lg md:text-xl text-center text-gray-600 max-w-3xl mb-6">
        Join the future of culinary investment with <strong>MYKS Token</strong> —
        supporting the growth of <em>Mas Yuswanto Kremes Sragen</em>. Earn
        <span className="text-yellow-500 font-semibold"> monthly returns</span> through
        a real-world, blockchain-based profit-sharing model.
      </p>

      {/* CTA Button */}
      <Link
        href="/buy"
        className="bg-gradient-to-r from-red-600 via-yellow-500 to-green-600 text-white text-lg font-semibold px-8 py-3 rounded-full shadow-xl transition duration-300 hover:scale-105"
      >
        Buy MYKS Tokens
      </Link>

      {/* Countdown Presale */}
      <PresalePanel />

      {/* Product Image Slider */}
      <div className="mt-14 w-full max-w-4xl px-4">
        <ProductSlider />
      </div>

      {/* Footer */}
      <p className="mt-10 text-sm text-gray-400 text-center">
        Powered by Blockchain | Thirdweb | Polygon Network
      </p>
    </main>
  )
}