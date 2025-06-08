import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { useEffect } from 'react';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ color: [] }, { background: [] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image', 'video'],
    ['clean'],
  ],
};

const formats = [
  'header', 'bold', 'italic', 'underline', 'strike',
  'color', 'background',
  'list', 'bullet',
  'link', 'image', 'video'
];

export default function RichTextEditor({ value, onChange }) {
  useEffect(() => {
    // Ensures proper styling on client side
    if (typeof window !== 'undefined') {
      import('react-quill/dist/quill.snow.css');
    }
  }, []);

  return (
    <div className="border rounded-lg shadow bg-white">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder="Write your content here..."
        className="min-h-[300px]"
      />
    </div>
  );
}