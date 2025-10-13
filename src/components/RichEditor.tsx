import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

// Load react-quill only in the browser (no SSR)
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

type Props = {
  value?: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  className?: string;
  // add any other props you need and forward them
};

export default function RichEditor({ value, onChange, ...rest }: Props) {
  return <ReactQuill value={value} onChange={onChange ?? (() => {})} {...rest} />;
}
