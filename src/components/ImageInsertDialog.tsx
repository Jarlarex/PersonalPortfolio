'use client';

import { useState, useRef } from 'react';
import { uploadToCloudinary, validateImageFile } from '@/lib/cloudinary';

interface ImageInsertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (imageUrl: string, altText: string) => void;
}

type TabType = 'upload' | 'url' | 'inline';

/**
 * Dialog for inserting images with three modes:
 * 1. Upload to Cloudinary
 * 2. Paste external URL
 * 3. Inline data URL (for small images <200KB)
 */
export default function ImageInsertDialog({
  isOpen,
  onClose,
  onInsert,
}: ImageInsertDialogProps) {
  const [activeTab, setActiveTab] = useState<TabType>('upload');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Upload tab
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // URL tab
  const [imageUrl, setImageUrl] = useState('');
  const [urlAltText, setUrlAltText] = useState('');
  
  // Inline tab
  const [inlineFile, setInlineFile] = useState<File | null>(null);
  const [inlineAltText, setInlineAltText] = useState('');

  if (!isOpen) return null;

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const url = await uploadToCloudinary(selectedFile);
      const altText = selectedFile.name.replace(/\.[^/.]+$/, '');
      onInsert(url, altText);
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleUrlInsert = () => {
    if (!imageUrl.trim()) {
      setError('Please enter an image URL');
      return;
    }

    // Validate URL
    try {
      const url = new URL(imageUrl);
      if (url.protocol !== 'https:' && url.protocol !== 'http:') {
        setError('URL must use HTTP or HTTPS protocol');
        return;
      }
    } catch {
      setError('Invalid URL format');
      return;
    }

    onInsert(imageUrl, urlAltText || 'Image');
    handleClose();
  };

  const handleInlineInsert = async () => {
    if (!inlineFile) {
      setError('Please select a file');
      return;
    }

    // Validate file size
    if (inlineFile.size > 200 * 1024) {
      setError('File must be smaller than 200KB for inline mode. Use Upload mode instead.');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // Convert to data URL
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        const altText = inlineAltText || inlineFile.name.replace(/\.[^/.]+$/, '');
        onInsert(dataUrl, altText);
        handleClose();
      };
      reader.onerror = () => {
        setError('Failed to read file');
        setUploading(false);
      };
      reader.readAsDataURL(inlineFile);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process file');
      setUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateImageFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSelectedFile(file);
    setError(null);
  };

  const handleInlineFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 200 * 1024) {
      setError('File must be smaller than 200KB for inline mode');
      return;
    }

    const validationError = validateImageFile(file, 0.2); // 0.2MB = 200KB
    if (validationError) {
      setError(validationError);
      return;
    }

    setInlineFile(file);
    setInlineAltText(file.name.replace(/\.[^/.]+$/, ''));
    setError(null);
  };

  const handleClose = () => {
    setActiveTab('upload');
    setSelectedFile(null);
    setImageUrl('');
    setUrlAltText('');
    setInlineFile(null);
    setInlineAltText('');
    setError(null);
    setUploading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div className="relative w-full max-w-lg rounded-xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Insert Image
          </h2>
          <button
            onClick={handleClose}
            className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            aria-label="Close dialog"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'upload'
                ? 'border-b-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
            }`}
          >
            Upload
          </button>
          <button
            onClick={() => setActiveTab('url')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'url'
                ? 'border-b-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
            }`}
          >
            URL
          </button>
          <button
            onClick={() => setActiveTab('inline')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'inline'
                ? 'border-b-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
            }`}
          >
            Inline
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Upload Tab */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Upload image to Cloudinary (free CDN hosting)
              </p>
              <div>
                <label className="block">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <div className="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-6 text-center transition-colors hover:border-blue-500 dark:border-gray-700">
                    {selectedFile ? (
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {selectedFile.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {(selectedFile.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    ) : (
                      <div>
                        <svg
                          className="mx-auto mb-2 h-12 w-12 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Click to select an image
                        </p>
                      </div>
                    )}
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* URL Tab */}
          {activeTab === 'url' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Paste an external image URL (must be HTTPS)
              </p>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Image URL *
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Alt Text (optional)
                </label>
                <input
                  type="text"
                  value={urlAltText}
                  onChange={(e) => setUrlAltText(e.target.value)}
                  placeholder="Description of the image"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                />
              </div>
            </div>
          )}

          {/* Inline Tab */}
          {activeTab === 'inline' && (
            <div className="space-y-4">
              <div className="rounded-lg bg-yellow-50 p-3 dark:bg-yellow-950">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  ⚠️ <strong>Dev only:</strong> Embeds image as data URL. Max 200KB. Not recommended for production.
                </p>
              </div>
              <div>
                <label className="block">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleInlineFileSelect}
                    className="hidden"
                  />
                  <div className="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-6 text-center transition-colors hover:border-blue-500 dark:border-gray-700">
                    {inlineFile ? (
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {inlineFile.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {(inlineFile.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Click to select image (&lt; 200KB)
                        </p>
                      </div>
                    )}
                  </div>
                </label>
              </div>
              {inlineFile && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Alt Text
                  </label>
                  <input
                    type="text"
                    value={inlineAltText}
                    onChange={(e) => setInlineAltText(e.target.value)}
                    placeholder="Description of the image"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                  />
                </div>
              )}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-gray-200 p-4 dark:border-gray-800">
          <button
            onClick={handleClose}
            disabled={uploading}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={
              activeTab === 'upload'
                ? handleUpload
                : activeTab === 'url'
                  ? handleUrlInsert
                  : handleInlineInsert
            }
            disabled={
              uploading ||
              (activeTab === 'upload' && !selectedFile) ||
              (activeTab === 'url' && !imageUrl) ||
              (activeTab === 'inline' && !inlineFile)
            }
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploading ? 'Processing...' : 'Insert Image'}
          </button>
        </div>
      </div>
    </div>
  );
}

