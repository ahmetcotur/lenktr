import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

const ImageUploader = ({ label, value, onChange, presets = [] }) => {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const defaultPresets = [
        'https://images.unsplash.com/photo-1557683316-973673baf926?w=400',
        'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400',
        'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=400',
        'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400',
        'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=400'
    ];

    const imagePresets = presets.length > 0 ? presets : defaultPresets;

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => onChange(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => onChange(e.target.result);
            reader.readAsDataURL(file);
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
                onClick={() => fileInputRef.current?.click()}
                className={`relative h-32 rounded-xl border-2 border-dashed transition-all cursor-pointer overflow-hidden ${isDragging
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    }`}
            >
                {value ? (
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
            />

            {/* Image Presets */}
            {imagePresets.length > 0 && (
                <div className="grid grid-cols-5 gap-2">
                    {imagePresets.map((preset, i) => (
                        <button
                            key={i}
                            onClick={() => onChange(preset)}
                            className="aspect-square rounded-lg border-2 border-white/10 hover:border-blue-500/50 hover:scale-105 transition-all overflow-hidden"
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
