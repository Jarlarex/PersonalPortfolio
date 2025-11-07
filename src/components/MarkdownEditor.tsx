'use client';

import { useRef, useState } from 'react';
import MarkdownRenderer from './MarkdownRenderer';
import { uploadToCloudinary, validateImageFile } from '@/lib/cloudinary';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

/**
 * Two-pane Markdown editor with toolbar and live preview
 */
export default function MarkdownEditor({
  value,
  onChange,
  placeholder = 'Write your content here...',
}: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  /**
   * Insert text at cursor position
   */
  const insertAtCursor = (
    before: string,
    after: string = '',
    placeholder: string = ''
  ) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end) || placeholder;
    const newText =
      value.substring(0, start) +
      before +
      selectedText +
      after +
      value.substring(end);

    onChange(newText);

    // Set cursor position after insertion
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + selectedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  /**
   * Insert text at the beginning of selected lines
   */
  const insertAtLineStart = (prefix: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    // Find line boundaries
    const beforeSelection = value.substring(0, start);
    const selection = value.substring(start, end);
    const afterSelection = value.substring(end);

    const lastNewlineBeforeStart = beforeSelection.lastIndexOf('\n');
    const lineStart =
      lastNewlineBeforeStart === -1 ? 0 : lastNewlineBeforeStart + 1;

    const lines = value.substring(lineStart, end).split('\n');
    const modifiedLines = lines.map((line) => prefix + line);
    const modifiedText = modifiedLines.join('\n');

    const newText =
      value.substring(0, lineStart) + modifiedText + afterSelection;
    onChange(newText);

    setTimeout(() => {
      textarea.focus();
    }, 0);
  };

  /**
   * Handle image upload to Cloudinary
   */
  const handleImageUpload = async (file: File) => {
    // Validate file
    const validationError = validateImageFile(file);
    if (validationError) {
      setUploadError(validationError);
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      // Upload to Cloudinary
      const downloadURL = await uploadToCloudinary(file);

      // Insert markdown image syntax
      const altText = file.name.replace(/\.[^/.]+$/, ''); // Remove extension
      insertAtCursor(`![${altText}](${downloadURL})`);
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadError(
        error instanceof Error ? error.message : 'Failed to upload image'
      );
    } finally {
      setUploading(false);
    }
  };

  /**
   * Trigger file picker for image upload
   */
  const triggerImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleImageUpload(file);
      }
    };
    input.click();
  };

  const toolbarButtons = [
    {
      label: 'H1',
      title: 'Heading 1',
      action: () => insertAtLineStart('# '),
      icon: 'H1',
    },
    {
      label: 'H2',
      title: 'Heading 2',
      action: () => insertAtLineStart('## '),
      icon: 'H2',
    },
    {
      label: 'H3',
      title: 'Heading 3',
      action: () => insertAtLineStart('### '),
      icon: 'H3',
    },
    {
      label: 'B',
      title: 'Bold',
      action: () => insertAtCursor('**', '**', 'bold text'),
      icon: 'format_bold',
    },
    {
      label: 'I',
      title: 'Italic',
      action: () => insertAtCursor('*', '*', 'italic text'),
      icon: 'format_italic',
    },
    {
      label: 'Link',
      title: 'Insert Link',
      action: () => insertAtCursor('[', '](url)', 'link text'),
      icon: 'link',
    },
    {
      label: 'Code',
      title: 'Code Block',
      action: () => insertAtCursor('\n```\n', '\n```\n', 'code'),
      icon: 'code',
    },
    {
      label: 'List',
      title: 'Bulleted List',
      action: () => insertAtLineStart('- '),
      icon: 'list',
    },
    {
      label: 'Quote',
      title: 'Quote',
      action: () => insertAtLineStart('> '),
      icon: 'format_quote',
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 rounded-t-lg border border-b-0 border-gray-300 bg-gray-50 p-2 dark:border-gray-700 dark:bg-gray-900">
        {toolbarButtons.map((button) => (
          <button
            key={button.label}
            type="button"
            onClick={button.action}
            title={button.title}
            className="rounded px-3 py-1.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            {button.label}
          </button>
        ))}

        {/* Divider */}
        <div className="mx-1 w-px bg-gray-300 dark:bg-gray-700" />

        {/* Image Upload Button */}
        <button
          type="button"
          onClick={triggerImageUpload}
          disabled={uploading}
          title="Upload Image"
          className="rounded px-3 py-1.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          {uploading ? '⏳' : '🖼️'} Image
        </button>
      </div>

      {/* Upload Error */}
      {uploadError && (
        <div className="border border-t-0 border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
          {uploadError}
        </div>
      )}

      {/* Two-Pane Editor */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Left Pane: Textarea */}
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="min-h-[500px] w-full rounded-b-lg border border-gray-300 bg-white p-4 font-mono text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 lg:rounded-bl-lg lg:rounded-br-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
            style={{ resize: 'vertical' }}
          />
          <div className="absolute bottom-2 right-2 text-xs text-gray-400">
            {value.length} characters
          </div>
        </div>

        {/* Right Pane: Live Preview */}
        <div className="rounded-b-lg border border-gray-300 bg-white p-4 lg:rounded-bl-none lg:rounded-br-lg dark:border-gray-700 dark:bg-gray-900">
          <div className="mb-2 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
            Preview
          </div>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            {value ? (
              <MarkdownRenderer content={value} />
            ) : (
              <p className="text-gray-400 dark:text-gray-600">
                Preview will appear here...
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
