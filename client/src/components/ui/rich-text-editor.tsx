import { useState, useCallback, useEffect } from 'react';
import ReactQuill, { Range as RangeStatic } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import YouTubeButton from './youtube-button';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, placeholder }) => {
  const [quill, setQuill] = useState<ReactQuill | null>(null);
  const [editorValue, setEditorValue] = useState(value);
  const [mounted, setMounted] = useState(false);

  const insertYouTubeVideo = useCallback(() => {
    const url = prompt('Please enter the YouTube video URL:');
    if (!url) return;

    // Extract video ID from various YouTube URL formats
    const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];

    if (!videoId) {
      alert('Invalid YouTube URL. Please enter a valid YouTube video URL.');
      return;
    }

    // Insert the YouTube iframe
    const editor = quill?.getEditor();
    if (editor) {
      const { index = 0 } = editor.getSelection() || {};
      editor.insertEmbed(index, 'video', `https://www.youtube.com/embed/${videoId}`);
      editor.setSelection(index + 1, 0);
    }
  }, [quill]);

    const modules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
        ['link', 'image'],
        ['clean']
      ],
    }
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video'
  ];

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
      <div className="flex items-center space-x-2 mb-2">
        <YouTubeButton onClick={insertYouTubeVideo} />
      </div>
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