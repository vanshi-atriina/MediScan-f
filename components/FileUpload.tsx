'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Image, AlertCircle, Plus, X, Eye } from 'lucide-react';
import { FilePreviewModal } from '@/components/FilePreviewModal';

interface FileUploadProps {
  onFileSelect: (files: File[]) => void;
  loading?: boolean;
  progress?: number;
  maxFiles?: number;
}

export function FileUpload({ onFileSelect, loading = false, progress = 0, maxFiles = 50 }: FileUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const newFiles = [...selectedFiles, ...acceptedFiles].slice(0, maxFiles);
      setSelectedFiles(newFiles);
    }
  }, [selectedFiles, maxFiles]);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/pdf': ['.pdf']
    },
    maxFiles: maxFiles - selectedFiles.length,
    maxSize: 50 * 1024 * 1024, // 50MB
    disabled: loading
  });

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
  };

  const handleUpload = () => {
    if (selectedFiles.length > 0) {
      onFileSelect(selectedFiles);
      setSelectedFiles([]);
    }
  };

  const handlePreviewFile = (file: File) => {
    setPreviewFile(file);
    setShowPreview(true);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-material-2 p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Upload className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Upload Medical Documents</h3>
          <p className="text-gray-600">
            Upload images (PNG, JPG, JPEG) or PDF files for AI-powered text extraction.
          </p>
        </div>

        {/* Progress Bar */}
        {loading && progress > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Processing...</span>
              <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="progress-bar h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {progress < 30 ? 'Uploading file...' : 
               progress < 60 ? 'Analyzing document...' : 
               progress < 90 ? 'Extracting text...' : 
               'Finalizing results...'}
            </p>
          </div>
        )}

        {/* Upload Area */}
        <div
          {...getRootProps()}
          className={`upload-area p-8 text-center cursor-pointer ${
            isDragActive ? 'dragover' : ''
          } ${loading ? 'pointer-events-none opacity-50' : ''}`}
        >
          <input {...getInputProps()} />
          
          {loading ? (
            <div className="flex flex-col items-center">
              <div className="loading-spinner mb-4"></div>
              <p className="text-lg font-medium text-gray-900">Processing Document...</p>
              <p className="text-gray-600">Please wait while we extract text from your document</p>
            </div>
          ) : (
            <div>
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Plus className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <p className="text-lg font-medium text-gray-900 mb-2">
                {isDragActive ? 'Drop your documents here' : 'Drag & drop your documents here'}
              </p>
              <p className="text-gray-600 mb-4">
                or <span className="text-blue-600 font-medium">click to browse</span>
              </p>
              <div className="flex justify-center space-x-4 mb-4">
                <div className="flex items-center space-x-2 px-3 py-2 bg-blue-50 rounded-lg">
                  <Image className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-blue-700">Images</span>
                </div>
                <div className="flex items-center space-x-2 px-3 py-2 bg-blue-50 rounded-lg">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-blue-700">PDF Files</span>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                Maximum file size: 10MB
              </p>
            </div>
          )}
        </div>

        {/* Selected Files */}
        {selectedFiles.length > 0 && (
          <div className="mt-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">
              Selected Files ({selectedFiles.length})
            </h4>
            <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar">
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      {file.type.startsWith('image/') ? (
                        <Image className="h-5 w-5 text-blue-600" />
                      ) : (
                        <FileText className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePreviewFile(file)}
                      className="p-1 text-gray-400 hover:text-blue-500 material-transition"
                      title="Preview file"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => removeFile(index)}
                      className="p-1 text-gray-400 hover:text-red-500 material-transition"
                      title="Remove file"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleUpload}
                disabled={loading || selectedFiles.length === 0}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium material-hover material-transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Process {selectedFiles.length} File{selectedFiles.length !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        )}

        {/* File Rejections */}
        {fileRejections.length > 0 && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-red-800 mb-2">File Upload Errors</h4>
                {fileRejections.map(({ file, errors }, index) => (
                  <div key={index} className="mb-2">
                    <p className="text-sm font-medium text-red-700">{file.name}</p>
                    <ul className="text-sm text-red-600 list-disc list-inside">
                      {errors.map(error => (
                        <li key={error.code}>{error.message}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* File Preview Modal */}
      <FilePreviewModal
        file={previewFile}
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
      />
    </>
  );
}