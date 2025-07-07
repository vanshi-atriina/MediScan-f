'use client';

import React, { useState } from 'react';
import { Copy, FileText, BarChart3, CheckCircle, AlertCircle, Upload } from 'lucide-react';

interface ResultDisplayProps {
  result: any;
  filename: string;
  onUploadAnother?: () => void;
}

export function ResultDisplay({ result, filename, onUploadAnother }: ResultDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const formatProcessingTime = (seconds: number) => {
    return seconds < 1 ? `${Math.round(seconds * 1000)}ms` : `${seconds.toFixed(1)}s`;
  };

  const getAllText = () => {
    if (result.type === 'pdf') {
      return result.pages.map((p: any) => `=== PAGE ${p.page} ===\n\n${p.text}`).join('\n\n');
    }
    return result.text;
  };

  const getTotalStats = () => {
    if (result.type === 'pdf') {
      return {
        pages: result.pages.length,
        words: result.pages.reduce((sum: number, p: any) => sum + p.word_count, 0),
        characters: result.pages.reduce((sum: number, p: any) => sum + p.character_count, 0)
      };
    }
    return {
      pages: 1,
      words: result.word_count,
      characters: result.character_count
    };
  };

  const stats = getTotalStats();

  return (
    <div className="bg-white rounded-xl shadow-material-2 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Extraction Complete</h3>
              <p className="text-gray-600 mb-2">
                Successfully processed: <span className="font-medium">{filename}</span>
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>{stats.pages} page{stats.pages !== 1 ? 's' : ''}</span>
                <span>•</span>
                <span>{stats.words} words</span>
                <span>•</span>
                <span>{formatProcessingTime(result.processing_time)}</span>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={onUploadAnother}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium material-hover material-transition flex items-center space-x-2"
            >
              <Upload className="h-4 w-4" />
              <span>Upload Another</span>
            </button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="p-6 border-b border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.pages}</div>
            <div className="text-sm text-blue-700">Page{stats.pages !== 1 ? 's' : ''}</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">{stats.words}</div>
            <div className="text-sm text-green-700">Words</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.characters}</div>
            <div className="text-sm text-purple-700">Characters</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-orange-600">{formatProcessingTime(result.processing_time)}</div>
            <div className="text-sm text-orange-700">Processing Time</div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => copyToClipboard(getAllText())}
            className={`px-4 py-2 rounded-lg font-medium material-transition flex items-center space-x-2 ${
              copied 
                ? 'bg-green-100 text-green-700 border border-green-200' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
            }`}
          >
            {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            <span>{copied ? 'Copied!' : 'Copy All Text'}</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <FileText className="h-5 w-5 text-gray-600" />
          <h4 className="text-lg font-semibold text-gray-900">Extracted Text</h4>
        </div>

        {result.type === 'pdf' && result.pages.length > 1 ? (
          <div>
            {/* Page Tabs */}
            <div className="flex space-x-1 mb-4 overflow-x-auto">
              {result.pages.map((page: any, index: number) => (
                <button
                  key={page.page}
                  onClick={() => setActiveTab(index)}
                  className={`px-4 py-2 rounded-lg font-medium material-transition whitespace-nowrap ${
                    activeTab === index
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
                  }`}
                >
                  Page {page.page}
                </button>
              ))}
            </div>

            {/* Active Page Content */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-medium text-gray-900">
                  Page {result.pages[activeTab].page}
                </h5>
                <span className="text-sm text-gray-500">
                  {result.pages[activeTab].word_count} words
                </span>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200 max-h-96 overflow-y-auto custom-scrollbar">
                <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono leading-relaxed">
                  {result.pages[activeTab].text || 'No text found on this page.'}
                </pre>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="bg-white rounded-lg p-4 border border-gray-200 max-h-96 overflow-y-auto custom-scrollbar">
              <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono leading-relaxed">
                {result.type === 'pdf' ? result.pages[0]?.text : result.text || 'No text found in the document.'}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* Medical Guidelines */}
      <div className="p-6 bg-amber-50 border-t border-amber-200">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <h5 className="font-medium text-amber-800 mb-2">Medical Document Guidelines</h5>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• Review extracted text for accuracy before clinical use</li>
              <li>• Verify medication names, dosages, and patient information</li>
              <li>• Check for any handwritten notes marked as "(unsure)" or "(illegible)"</li>
              <li>• Ensure patient privacy when handling extracted text</li>
              <li>• Cross-reference with original document for critical information</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}