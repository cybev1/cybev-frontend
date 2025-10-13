import DashboardLayout from '../../components/DashboardLayout';
import dynamic from 'next/dynamic';

const PostEditor = dynamic(() => import('../../components/PostEditor'), { ssr: false });

export default function CreatePostPage() {
  return (
    <DashboardLayout title="Create New Post">
      <PostEditor />
    </DashboardLayout>
  );
}
