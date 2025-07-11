'use client';

import React, { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { ResultDisplay } from '@/components/ResultDisplay';
import { ErrorDisplay } from '@/components/ErrorDisplay';
import { FilePreviewModal } from '@/components/FilePreviewModal'
import { extractText } from '@/lib/api';
import { Stethoscope, Shield, Zap, FileText, Eye } from 'lucide-react';

export default function Home() {
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState<string>('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const simulateProgress = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95; // Keep at 95% until actual completion
        }
        return prev + Math.random() * 15;
      });
    }, 200);
    return interval;
  };

  const handleFileSelect = async (files: File[]) => {
    if (files.length === 0) return;
  
    const file = files[0];
    setLoading(true);
    setError('');
    setResult(null);
    setCurrentFile(file.name);
    setProgress(0);
  
    // Add file to history immediately
    setUploadedFiles(prev => [...prev, file]);

    // Start progress simulation
    const progressInterval = simulateProgress();
  
    try {
      const response = await extractText(file);
      
      // Complete the progress
      clearInterval(progressInterval);
      setProgress(100);
      
      if (response.success) {
        setResult(response.data);
      } else {
        setError(response.message || 'Failed to process document');
      }
    } catch (err) {
      clearInterval(progressInterval);
      setProgress(0);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
      // Reset progress after a short delay
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const handleRetry = () => {
    setError('');
    setResult(null);
    setCurrentFile('');
    setProgress(0);
  };

  const handleUploadAnother = () => {
    setResult(null);
    setError('');
    setCurrentFile('');
    setProgress(0);
  };

  const handlePreviewFile = (file: File) => {
    setPreviewFile(file);
    setShowPreview(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-material-1 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Stethoscope className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">MediScan</h1>
                <p className="text-sm text-gray-500">Medical Document AI</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            MediScan
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            AI-powered OCR specifically designed for medical professionals. 
          </p>
          
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 px-10">
            <div className="bg-white p-6 rounded-xl shadow-material-1 material-hover material-transition ">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Stethoscope className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Supported formats: PNG, JPG, JPEG, PDF</h3>
         
            </div>

            <div className="bg-white p-6 rounded-xl shadow-material-1 material-hover material-transition">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <FileText className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">PDF pages supported - upto 9</h3>
             
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-material-1 material-hover material-transition">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">For best results, avoid blurry or low-resolution images</h3>
           
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-material-1 material-hover material-transition">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Ensure documents are clear and well-lit for better accuracy</h3>
             
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {!result && !error && (
            <div className="fade-in">
              <FileUpload 
                onFileSelect={handleFileSelect} 
                loading={loading}
                progress={progress}
                maxFiles={50}
              />
            </div>
          )}
          
          {result && (
            <div className="fade-in">
              <ResultDisplay 
                result={result} 
                filename={currentFile}
                onUploadAnother={handleUploadAnother}
              />
            </div>
          )}
          
          {error && (
            <div className="fade-in">
              <ErrorDisplay 
                error={error} 
                onRetry={handleRetry}
              />
            </div>
          )}

          {/* Uploaded Files History */}
          {uploadedFiles.length > 0 && (
            <div className="mt-12 bg-white rounded-xl shadow-material-1 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-600" />
                Recently Processed Files
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {uploadedFiles.slice(-6).map((file, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg material-hover material-transition"
                  >
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                        <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handlePreviewFile(file)}
                      className="ml-2 p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex-shrink-0"
                      title="Preview file"
                      aria-label="Preview file"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* File Preview Modal */}
      <FilePreviewModal
        file={previewFile}
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
      />

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-600">
              <strong>MediScan</strong> - Professional Medical Document Processing
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}