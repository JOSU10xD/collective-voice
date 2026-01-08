/**
 * Compresses an image file to a lightweight JPEG Data URL (Base64).
 * @param {File} file - The image file to compress.
 * @param {number} maxWidth - Maximum width of the output image.
 * @param {number} quality - JPEG quality (0 to 1).
 * @returns {Promise<string>} - Resolves with the Data URL.
 */
export function compressImage(file, maxWidth = 800, quality = 0.7) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const reader = new FileReader();
        reader.onerror = (e) => reject(e);
        reader.onload = (e) => {
            img.onload = () => {
                const canvas = document.createElement("canvas");
                let { width, height } = img;
                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, width, height);
                const dataUrl = canvas.toDataURL("image/jpeg", quality);
                resolve(dataUrl);
            };
            img.onerror = (e) => reject(e);
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
}

/**
 * Estimates the size of a Base64 Data URL string in bytes.
 * @param {string} dataUrl 
 * @returns {number}
 */
export function estimateDataUrlSizeBytes(dataUrl) {
    const base64 = dataUrl.split(",")[1] || "";
    const padding = base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0;
    return Math.ceil((base64.length * 3) / 4) - padding;
}
