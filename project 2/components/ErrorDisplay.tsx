'use client';

import React from 'react';
import { AlertCircle, RefreshCw, Upload } from 'lucide-react';

interface ErrorDisplayProps {
  error: string;
  onRetry?: () => void;
}

export function ErrorDisplay({ error, onRetry }: ErrorDisplayProps) {
  return (
    <div className="bg-white rounded-xl shadow-material-2 overflow-hidden">
      {/* Error Header */}
      <div className="bg-gradient-to-r from-red-50 to-rose-50 p-6 border-b border-red-200">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Processing Error</h3>
            <p className="text-gray-600">
              We encountered an issue while processing your document
            </p>
          </div>
        </div>
      </div>

      {/* Error Details */}
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800 font-medium mb-2">Error Details:</p>
          <p className="text-red-700 text-sm">
            {error || 'An unexpected error occurred while processing your document.'}
          </p>
        </div>

        {/* Action Buttons */}
        {onRetry && (
          <div className="flex justify-center mb-6">
            <button 
              onClick={onRetry}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium material-hover material-transition flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Try Again</span>
            </button>
          </div>
        )}

        {/* Troubleshooting Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h5 className="font-medium text-blue-800 mb-3 flex items-center">
            <Upload className="h-4 w-4 mr-2" />
            Troubleshooting Tips
          </h5>
          <ul className="text-sm text-blue-700 space-y-2">
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Ensure your document is clear and well-lit</span>
            </li>
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Check that the file size is under 50MB</span>
            </li>
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Verify the file format is supported (PNG, JPG, JPEG, PDF)</span>
            </li>
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Try uploading a different document to test the service</span>
            </li>
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Check your internet connection and try again</span>
            </li>
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>For handwritten documents, ensure text is legible</span>
            </li>
          </ul>
        </div>

        {/* Common Issues */}
        <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h5 className="font-medium text-gray-800 mb-3">Common Issues & Solutions</h5>
          <div className="space-y-3 text-sm">
            <div>
              <p className="font-medium text-gray-700">File too large:</p>
              <p className="text-gray-600">Compress your image or split large PDFs into smaller files</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Poor image quality:</p>
              <p className="text-gray-600">Use better lighting, avoid shadows, and ensure text is in focus</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Unsupported format:</p>
              <p className="text-gray-600">Convert your file to PNG, JPG, JPEG, or PDF format</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Network issues:</p>
              <p className="text-gray-600">Check your internet connection and try uploading again</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}