import AnimateOnScroll from '../AnimateOnScroll';

export default function PromoVideo() {
  return (
    <AnimateOnScroll>
      <section className="px-6 py-12 bg-blue-50 text-center">
        <h2 className="text-3xl font-bold mb-4">Watch CYBEV in Action</h2>
        <div className="max-w-3xl mx-auto aspect-video rounded overflow-hidden shadow-lg">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="CYBEV Promo Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </section>
    </AnimateOnScroll>
  );
}