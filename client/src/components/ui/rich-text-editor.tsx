import { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
    ['link', 'image', 'video'],
    ['clean']
  ],
};

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image', 'video'
];

const RichTextEditor = ({ value, onChange, placeholder }: RichTextEditorProps) => {
  const [editorValue, setEditorValue] = useState(value);
  const [mounted, setMounted] = useState(false);

  // Handle SSR
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (value !== editorValue) {
      setEditorValue(value);
    }
  }, [value]);

  const handleChange = (content: string) => {
    setEditorValue(content);
    onChange(content);
  };

  if (!mounted) {
    return (
      <div className="border border-gray-300 dark:border-gray-700 rounded-md min-h-[300px] bg-gray-50 dark:bg-gray-900 p-4">
        Loading editor...
      </div>
    );
  }

  return (
    <div className="rich-text-editor">
      <style dangerouslySetInnerHTML={{ __html: `
        .rich-text-editor .ql-container {
          min-height: 300px;
          border-bottom-left-radius: 0.375rem;
          border-bottom-right-radius: 0.375rem;
          background-color: white;
        }
        
        .dark .rich-text-editor .ql-container {
          background-color: #1f2937;
          color: #d1d5db;
          border-color: #374151;
        }
        
        .rich-text-editor .ql-toolbar {
          border-top-left-radius: 0.375rem;
          border-top-right-radius: 0.375rem;
          background-color: #f9fafb;
        }
        
        .dark .rich-text-editor .ql-toolbar {
          background-color: #374151;
          color: #d1d5db;
          border-color: #4b5563;
        }
        
        .dark .rich-text-editor .ql-picker {
          color: #d1d5db;
        }
        
        .dark .rich-text-editor .ql-stroke {
          stroke: #d1d5db;
        }
        
        .dark .rich-text-editor .ql-fill {
          fill: #d1d5db;
        }
        
        .dark .rich-text-editor .ql-picker-options {
          background-color: #1f2937;
          border-color: #4b5563;
        }
      ` }} />
      <ReactQuill
        theme="snow"
        value={editorValue}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
    </div>
  );
};

export default RichTextEditor;