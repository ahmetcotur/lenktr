import { request } from './client';
export const uploadImage = async file => {
 const body = new FormData(); body.append('file', file);
 const { data, error } = await request('/api/uploads', body);
 return { url: data?.url || null, error };
};
export const deleteImage = async url => {
 const { error } = await request('/api/uploads', { url }, 'DELETE');
 return { success: !error, error };
};
export const dataURLtoFile = (dataUrl, filename) => {
 const [header, value] = dataUrl.split(',');
 return new File([Uint8Array.from(atob(value), c => c.charCodeAt(0))], filename, { type: header.match(/:(.*?);/)[1] });
};
