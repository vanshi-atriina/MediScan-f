const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://34.47.177.112:8004'
console.log('API_BASE_URL:', API_BASE_URL);
export interface APIResponse {
  success: boolean;
  message: string;
  data?: any;
  timestamp: string;
}

export interface BatchResult {
  filename: string;
  success: boolean;
  data?: any;
  error?: string;
}

export interface BatchResponse extends APIResponse {
  data: {
    results: BatchResult[];
  };
}

export async function extractText(file: File): Promise<APIResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/extract-text`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function extractTextAdvanced(
  file: File,
  options: {
    include_metadata?: boolean;
    include_statistics?: boolean;
    output_format?: 'json' | 'csv' | 'txt';
  } = {}
): Promise<APIResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const url = new URL(`${API_BASE_URL}/extract-text-advanced`);
  Object.entries(options).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.append(key, value.toString());
    }
  });

  const response = await fetch(url.toString(), {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function batchExtract(files: File[]): Promise<BatchResponse> {
  if (files.length > 10) {
    throw new Error('Batch size limit exceeded. Maximum 10 files allowed.');
  }

  const formData = new FormData();
  files.forEach(file => {
    formData.append('files', file);
  });

  const response = await fetch(`${API_BASE_URL}/batch-extract`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function checkHealth(): Promise<{ status: string; timestamp: string; gemini_model: string }> {
  const response = await fetch(`${API_BASE_URL}/health`);
  
  if (!response.ok) {
    throw new Error(`Health check failed: ${response.status}`);
  }
  
  return response.json();
}

export async function getSupportedFormats(): Promise<{
  supported_formats: {
    images: string[];
    documents: string[];
  };
  max_file_size: string;
  batch_limit: number;
}> {
  const response = await fetch(`${API_BASE_URL}/supported-formats`);
  
  if (!response.ok) {
    throw new Error(`Failed to get supported formats: ${response.status}`);
  }
  
  return response.json();
}

export async function getRootInfo(): Promise<{
  message: string;
  version: string;
  status: string;
  endpoints: Record<string, string>;
}> {
  const response = await fetch(`${API_BASE_URL}/`);
  
  if (!response.ok) {
    throw new Error(`Failed to get API info: ${response.status}`);
  }
  
  return response.json();
}