import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../config/firebase';

/**
 * Compress and optimize image before upload
 * @param {File} file - Image file to compress
 * @param {number} maxWidth - Maximum width in pixels
 * @param {number} quality - Compression quality (0-1)
 * @returns {Promise<Blob>} - Compressed image blob
 */
export const compressImage = (file, maxWidth = 1200, quality = 0.8) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new Image();

            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Calculate new dimensions
                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            resolve(blob);
                        } else {
                            reject(new Error('Image compression failed'));
                        }
                    },
                    'image/jpeg',
                    quality
                );
            };

            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = e.target.result;
        };

        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
};

/**
 * Upload multiple images to Firebase Storage
 * @param {FileList|Array} files - Images to upload (max 15)
 * @param {string} carId - Car ID for organizing storage
 * @returns {Promise<Array<string>>} - Array of download URLs
 */
export const uploadImages = async (files, carId) => {
    try {
        const filesArray = Array.from(files).slice(0, 15); // Max 15 images
        const uploadPromises = filesArray.map(async (file, index) => {
            try {
                // Compress image before upload
                const compressedBlob = await compressImage(file);

                // Create unique filename
                const timestamp = Date.now();
                const filename = `${timestamp}_${index}.jpg`;
                const storageRef = ref(storage, `cars/${carId}/${filename}`);

                // Upload compressed image
                await uploadBytes(storageRef, compressedBlob);

                // Get download URL
                const downloadURL = await getDownloadURL(storageRef);

                return downloadURL;
            } catch (error) {
                console.error(`Error uploading image ${index}:`, error);
                return null;
            }
        });

        const urls = await Promise.all(uploadPromises);

        // Filter out any failed uploads
        return urls.filter(url => url !== null);
    } catch (error) {
        console.error('Error uploading images:', error);
        throw error;
    }
};

/**
 * Delete an image from Firebase Storage
 * @param {string} imageUrl - Full URL of the image to delete
 * @returns {Promise<void>}
 */
export const deleteImage = async (imageUrl) => {
    try {
        // Extract the path from the URL
        const baseUrl = 'https://firebasestorage.googleapis.com/v0/b/';

        if (!imageUrl.startsWith(baseUrl)) {
            console.warn('Invalid Firebase Storage URL:', imageUrl);
            return;
        }

        // Parse the storage path from URL
        const urlParts = imageUrl.split('/o/')[1];
        if (!urlParts) {
            console.warn('Could not parse storage path from URL');
            return;
        }

        const path = decodeURIComponent(urlParts.split('?')[0]);
        const imageRef = ref(storage, path);

        await deleteObject(imageRef);
    } catch (error) {
        // If image doesn't exist, that's okay
        if (error.code === 'storage/object-not-found') {
            console.warn('Image not found in storage:', imageUrl);
        } else {
            console.error('Error deleting image:', error);
            throw error;
        }
    }
};

/**
 * Delete multiple images from Firebase Storage
 * @param {Array<string>} imageUrls - Array of image URLs to delete
 * @returns {Promise<void>}
 */
export const deleteImages = async (imageUrls) => {
    try {
        await Promise.all(imageUrls.map(url => deleteImage(url)));
    } catch (error) {
        console.error('Error deleting images:', error);
        throw error;
    }
};
