import React, { useState, useRef } from 'react';
import { UploadCloud, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { uploadApi } from '../../api/upload.api';
import { toast } from '../../hooks/useToast';
import { getImageUrl } from '../../utils/image';

interface ImageUploaderProps {
  label?: string;
  value?: string | null;
  onChange: (url: string) => void;
  error?: string;
  helperText?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  label,
  value,
  onChange,
  error,
  helperText = 'Supported formats: JPG, PNG, WEBP (Max 10MB)',
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Invalid file format. Please upload JPG, PNG, or WEBP images.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size exceeds maximum limit of 10MB.');
      return;
    }

    setIsUploading(true);
    try {
      const res = await uploadApi.uploadFile(file);
      if (res.success && res.data?.url) {
        onChange(res.data.url);
        toast.success('Image uploaded successfully');
      } else {
        toast.error(res.message || 'Failed to upload image');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error uploading image to server');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0]);
    }
  };


  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
          {label}
        </label>
      )}

      {value ? (
        <div className="relative group rounded-xl border border-slate-200 overflow-hidden bg-slate-100 max-h-56 flex items-center justify-center p-2">
          <img
            src={getImageUrl(value)}
            alt="Uploaded preview"
            className="max-h-48 w-auto object-contain rounded-lg shadow-xs"
          />
          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-white text-slate-800 text-xs font-semibold rounded-md shadow-md hover:bg-slate-50 transition"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-1.5 bg-rose-600 text-white rounded-md shadow-md hover:bg-rose-700 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
            dragActive
              ? 'border-blue-500 bg-blue-50/50'
              : error
              ? 'border-rose-300 bg-rose-50/30'
              : 'border-slate-300 hover:border-blue-400 bg-slate-50/50'
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2 text-blue-600">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="text-xs font-medium text-slate-600">Uploading file to server...</span>
            </div>
          ) : (
            <>
              <div className="p-3 bg-white text-blue-600 rounded-full shadow-xs mb-2">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="text-xs font-semibold text-slate-700 mb-1">
                Drag and drop image here, or <span className="text-blue-600 underline">browse</span>
              </p>
              <p className="text-[11px] text-slate-500">{helperText}</p>
            </>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleChange}
        className="hidden"
      />
      {error && <p className="mt-1 text-xs text-rose-600 font-medium">{error}</p>}
    </div>
  );
};
