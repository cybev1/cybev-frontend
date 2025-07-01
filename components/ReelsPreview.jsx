export default function ReelsPreview() {
  const demoReels = [
    { id: 1, video: '/demo-reel.mp4', caption: 'Watch this epic moment!', username: 'jane_doe' },
    { id: 2, video: '/demo-reel.mp4', caption: 'This one went viral 🔥', username: 'prince' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {demoReels.map(reel => (
        <div key={reel.id} className="rounded-xl overflow-hidden shadow-lg bg-black">
          <video src={reel.video} controls className="w-full h-64 object-cover" />
          <div className="p-2 text-white text-sm">
            <p className="font-semibold">@{reel.username}</p>
            <p>{reel.caption}</p>
          </div>
        </div>
      ))}
    </div>
  );
}