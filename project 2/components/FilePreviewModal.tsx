'use client';

import React, { useState, useEffect } from 'react';
import { X, FileText, Image as ImageIcon, Eye } from 'lucide-react';

interface FilePreviewModalProps {
  file: File | null;
  isOpen: boolean;
  onClose: () => void;
  isLoading?: boolean;
}

export function FilePreviewModal({ file, isOpen, onClose, isLoading = false }: FilePreviewModalProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [internalLoading, setInternalLoading] = useState(false);

  useEffect(() => {
    if (file && isOpen) {
      setInternalLoading(true);

      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        setInternalLoading(false);
      } else if (file.type === 'application/pdf') {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        setInternalLoading(false);
      } else {
        setPreviewUrl(null);
        setInternalLoading(false);
      }
    } else {
      setPreviewUrl(null);
    }

    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [file, isOpen]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!isOpen || !file) {
    return null;
  }

  const isImageFile = file.type.startsWith('image/');
  const isPDFFile = file.type === 'application/pdf';
  const loading = internalLoading;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-lg max-w-5xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              {isImageFile ? (
                <ImageIcon className="h-5 w-5 text-blue-600" />
              ) : (
                <FileText className="h-5 w-5 text-blue-600" />
              )}
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 truncate" title={file.name}>
                {file.name}
              </h3>
              <p className="text-sm text-gray-500">
                {formatFileSize(file.size)} • {file.type}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close preview"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              <p className="ml-4 text-gray-600">Loading preview...</p>
            </div>
          ) : isImageFile && previewUrl ? (
            <div className="flex items-center justify-center p-4">
              <img
                src={previewUrl}
                alt={file.name}
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
                onLoad={() => setInternalLoading(false)}
              />
            </div>
          ) : isPDFFile && previewUrl ? (
            <div className="flex items-center justify-center p-4">
              <div className="w-full max-w-4xl">
                <iframe
                  src={previewUrl}
                  className="w-full h-[70vh] border border-gray-300 rounded-lg"
                  title={`Preview of ${file.name}`}
                  onLoad={() => setInternalLoading(false)}
                />
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="h-12 w-12 text-gray-400" />
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">Preview Not Available</h4>
              <p className="text-gray-600 mb-4">
                This file type cannot be previewed in the browser.
              </p>
            </div>
          )}
        </div>

        {/* File Info */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <h5 className="font-medium text-gray-900 mb-3">File Information</h5>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="truncate">
              <span className="text-gray-500">File Name:</span>
              <p className="font-medium text-gray-900 truncate" title={file.name}>{file.name}</p>
            </div>
            <div>
              <span className="text-gray-500">File Size:</span>
              <p className="font-medium text-gray-900">{formatFileSize(file.size)}</p>
            </div>
            <div>
              <span className="text-gray-500">File Type:</span>
              <p className="font-medium text-gray-900">{file.type || 'Unknown'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FilePreviewModal;