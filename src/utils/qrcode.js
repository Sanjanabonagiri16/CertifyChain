import { QRCodeSVG } from 'qrcode.react';

export const generateQRCodeData = (certificate) => {
  return JSON.stringify({
    hash: certificate.hash,
    certificateId: certificate.hash.slice(0, 10),
    issuer: certificate.issuer,
    recipient: certificate.recipient,
    courseName: certificate.courseName,
    issueDate: certificate.issueDate,
    expiryDate: certificate.expiryDate,
    isValid: certificate.isValid
  });
};

export const parseQRCodeData = (data) => {
  try {
    // Try parsing as JSON first
    const jsonData = JSON.parse(data);
    if (jsonData.hash) {
      return jsonData;
    }
    throw new Error('Invalid QR code data format');
  } catch (err) {
    // If not JSON, try parsing as plain text (might be just the hash)
    if (typeof data === 'string' && data.length > 0) {
      return { hash: data };
    }
    throw new Error('Invalid QR code data format');
  }
};

export const downloadQRCode = (certificate) => {
  const svg = document.querySelector("svg");
  if (!svg) {
    console.error('SVG element not found');
    return;
  }

  try {
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      
      const url = canvas.toDataURL("image/png");
      const link = document.createElement('a');
      link.download = `certificate-${certificate.hash.slice(0, 10)}.png`;
      link.href = url;
      link.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  } catch (error) {
    console.error('Error downloading QR code:', error);
    throw new Error('Failed to download QR code');
  }
};

export const createQRCodeComponent = (data, size = 256, level = 'H', includeMargin = true) => {
  return (
    <QRCodeSVG
      value={typeof data === 'string' ? data : JSON.stringify(data)}
      size={size}
      level={level}
      includeMargin={includeMargin}
    />
  );
};

export const scanQRCode = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        try {
          // Here you would typically use a QR code scanning library
          // For example, you could use jsQR or a similar library
          // const code = jsQR(imageData.data, imageData.width, imageData.height);
          // resolve(code.data);
          
          // For now, we'll throw an error since we need to implement actual QR scanning
          throw new Error('QR code scanning not implemented');
        } catch (error) {
          reject(new Error('Failed to scan QR code'));
        }
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      img.src = e.target.result;
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
}; 