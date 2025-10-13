export default function StoriesStrip() {
  const stories = [
    { id: 1, user: 'Jane', image: '/demo-story.jpg' },
    { id: 2, user: 'Prince', image: '/demo-story.jpg' },
    { id: 3, user: 'Chris', image: '/demo-story.jpg' },
  ];

  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {stories.map(story => (
        <div key={story.id} className="w-20 h-20 shrink-0 rounded-full border-2 border-blue-500 overflow-hidden">
          <img src={story.image} alt={story.user} className="w-full h-full object-cover" />
        </div>
      ))}
    </div>
  );
}