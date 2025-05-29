import dynamic from 'next/dynamic';
const BlogEditor = dynamic(() => import('../../components/blog/BlogEditor'), { ssr: false });

export default function WritePostPage() {
  return <BlogEditor />;
}