import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import imageCompression from 'browser-image-compression';
import { uploadImage, dataURLtoFile } from '../../utils/supabase/storage';
import { useAuth } from '../../context/AuthContext';

const ImageUploader = ({ label, value, onChange, presets = [], bucket = 'bio-images' }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);
    const { user } = useAuth();

    const defaultPresets = [
        'https://images.unsplash.com/photo-1557683316-973673baf926?w=400',
        'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400',
        'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=400',
        'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400',
        'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=400'
    ];

    const imagePresets = presets.length > 0 ? presets : defaultPresets;

    const handleFileUpload = async (file) => {
        if (!file || !file.type.startsWith('image/')) {
            alert('Please select a valid image file');
            return;
        }

        if (!user) {
            alert('You must be logged in to upload images');
            return;
        }

        setUploading(true);
        try {
            // Compress image before upload
            const options = {
                maxSizeMB: 1, // Max file size 1MB
                maxWidthOrHeight: 1920, // Max dimension 1920px
                useWebWorker: true,
                fileType: file.type
            };

            console.log('Original file size:', (file.size / 1024 / 1024).toFixed(2), 'MB');
            const compressedFile = await imageCompression(file, options);
            console.log('Compressed file size:', (compressedFile.size / 1024 / 1024).toFixed(2), 'MB');

            const { url, error } = await uploadImage(compressedFile, bucket, user.id);

            if (error) {
                throw error;
            }

            onChange(url);
        } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to upload image. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        handleFileUpload(file);
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleFileUpload(file);
        }
    };

    return (
        <div className="space-y-3">
            {label && (
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400">
                    {label}
                </label>
            )}

            {/* Upload Area */}
            <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => !uploading && fileInputRef.current?.click()}
                className={`relative h-32 rounded-xl border-2 border-dashed transition-all cursor-pointer overflow-hidden ${uploading ? 'border-blue-500 bg-blue-500/10 cursor-wait' :
                    isDragging
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    }`}
            >
                {uploading ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/50">
                        <Loader2 size={32} className="text-blue-500 animate-spin" />
                        <p className="text-xs font-bold text-white uppercase tracking-wider">
                            Uploading...
                        </p>
                    </div>
                ) : value ? (
                    <>
                        <img src={value} alt="Preview" className="w-full h-full object-cover" />
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onChange('');
                            }}
                            className="absolute top-2 right-2 w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </>
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                        <Upload size={24} className="text-gray-500" />
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                            {isDragging ? 'Drop Image' : 'Upload Image'}
                        </p>
                    </div>
                )}
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                disabled={uploading}
            />

            {/* Image Presets */}
            {imagePresets.length > 0 && (
                <div className="grid grid-cols-5 gap-2">
                    {imagePresets.map((preset, i) => (
                        <button
                            key={i}
                            onClick={() => onChange(preset)}
                            disabled={uploading}
                            className="aspect-square rounded-lg border-2 border-white/10 hover:border-blue-500/50 hover:scale-105 transition-all overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <img src={preset} alt={`Preset ${i + 1}`} className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ImageUploader;
