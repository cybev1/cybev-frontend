export default function StoriesCarousel() {
  const stories = [
    { id:1, name:'Alice', avatar:'/default-avatar.png' },
    { id:2, name:'Bob', avatar:'/default-avatar.png' },
    { id:3, name:'Carol', avatar:'/default-avatar.png' },
    { id:4, name:'Dave', avatar:'/default-avatar.png' },
  ];
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-4 overflow-x-auto">
      <div className="flex space-x-4">
        {stories.map(story => (
          <div key={story.id} className="flex flex-col items-center">
            <img src={story.avatar} alt={story.name} className="w-12 h-12 rounded-full mb-1" />
            <span className="text-sm">{story.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
