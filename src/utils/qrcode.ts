/**
 * QR Code utility functions
 */
import QRCode from 'qrcode';

/**
 * Generates a QR code as a data URL
 * @param text The text to encode in the QR code
 * @returns Promise that resolves to a data URL string
 */
export async function generateQRCode(text: string): Promise<string> {
    try {
        const qrDataURL = await QRCode.toDataURL(text, {
            width: 256,
            margin: 2,
            color: {
                dark: '#58a6ff',
                light: '#0d1117',
            },
        });
        return qrDataURL;
    } catch (error) {
        console.error('Error generating QR code:', error);
        return '';
    }
}

/**
 * Creates an HTML img element with the QR code
 * @param text The text to encode in the QR code
 * @returns Promise that resolves to an HTML string
 */
export async function createQRCodeHTML(text: string): Promise<string> {
    const qrDataURL = await generateQRCode(text);
    if (!qrDataURL) {
        return '<div style="color: #f85149;">Error generating QR code</div>';
    }

    return `<br><img src="${qrDataURL}" alt="QR Code" style="display: block; margin: 10px 0; max-width: 100%; height: auto;" />`;
}
