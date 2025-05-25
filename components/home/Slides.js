import { useEffect, useState } from 'react';

const images = [
  'https://source.unsplash.com/featured/?blog,writing',
  'https://source.unsplash.com/featured/?ai,technology',
  'https://source.unsplash.com/featured/?blockchain,crypto',
  'https://source.unsplash.com/featured/?digital,nft',
  'https://source.unsplash.com/featured/?web3,code'
];

export default function Slides() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="px-6 py-12 bg-black text-white">
      <h2 className="text-3xl font-bold text-center mb-6">Explore CYBEV in Action</h2>
      <div className="relative w-full max-w-4xl mx-auto rounded overflow-hidden shadow-lg aspect-video">
        <img
          src={images[index]}
          alt="CYBEV slide"
          className="object-cover w-full h-full transition-opacity duration-700"
        />
      </div>
      <div className="flex justify-center mt-4 gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-3 h-3 rounded-full ${i === index ? 'bg-white' : 'bg-gray-500'}`}
          />
        ))}
      </div>
    </section>
  );
}