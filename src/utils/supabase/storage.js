import { createClient } from './client';

const supabase = createClient();

/**
 * Upload an image file to Supabase Storage
 * @param {File} file - The image file to upload
 * @param {string} bucket - The storage bucket name ('avatars', 'bio-backgrounds', etc.)
 * @param {string} userId - The user ID for organizing files
 * @returns {Promise<{url: string, error: null} | {url: null, error: Error}>}
 */
export const uploadImage = async (file, bucket = 'bio-images', userId) => {
    try {
        // Generate unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}/${Date.now()}.${fileExt}`;

        // Upload file to Supabase Storage
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) throw error;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(fileName);

        return { url: publicUrl, error: null };
    } catch (error) {
        console.error('Error uploading image:', error);
        return { url: null, error };
    }
};

/**
 * Delete an image from Supabase Storage
 * @param {string} url - The public URL of the image to delete
 * @param {string} bucket - The storage bucket name
 * @returns {Promise<{success: boolean, error: null} | {success: false, error: Error}>}
 */
export const deleteImage = async (url, bucket = 'bio-images') => {
    try {
        // Extract file path from URL
        const urlParts = url.split('/');
        const fileName = urlParts.slice(-2).join('/'); // userId/timestamp.ext

        const { error } = await supabase.storage
            .from(bucket)
            .remove([fileName]);

        if (error) throw error;

        return { success: true, error: null };
    } catch (error) {
        console.error('Error deleting image:', error);
        return { success: false, error };
    }
};

/**
 * Convert base64 data URL to File object
 * @param {string} dataUrl - The base64 data URL
 * @param {string} filename - The filename for the file
 * @returns {File}
 */
export const dataURLtoFile = (dataUrl, filename) => {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
};
