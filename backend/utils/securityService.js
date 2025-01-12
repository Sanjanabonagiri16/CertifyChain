const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const crypto = require('crypto');

// Generate TOTP secret
function generateTOTPSecret(email) {
    const secret = speakeasy.generateSecret({
        name: `CertifyChain:${email}`
    });
    return {
        otpauthUrl: secret.otpauth_url,
        base32: secret.base32
    };
}

// Generate QR code for TOTP
async function generateQRCode(otpauthUrl) {
    try {
        return await QRCode.toDataURL(otpauthUrl);
    } catch (error) {
        console.error('Error generating QR code:', error);
        throw error;
    }
}

// Verify TOTP token
function verifyTOTP(token, secret) {
    return speakeasy.totp.verify({
        secret: secret,
        encoding: 'base32',
        token: token,
        window: 1 // Allow 30 seconds before/after
    });
}

// Generate backup codes
function generateBackupCodes(count = 8) {
    const codes = [];
    for (let i = 0; i < count; i++) {
        const code = crypto.randomBytes(4).toString('hex').toUpperCase();
        codes.push(`${code.slice(0, 4)}-${code.slice(4)}`);
    }
    return codes;
}

// Hash backup codes for storage
function hashBackupCodes(codes) {
    return codes.map(code => {
        const hash = crypto.createHash('sha256');
        hash.update(code);
        return hash.digest('hex');
    });
}

// Verify backup code
function verifyBackupCode(code, hashedCodes) {
    const hash = crypto.createHash('sha256');
    hash.update(code);
    const hashedCode = hash.digest('hex');
    return hashedCodes.includes(hashedCode);
}

// Generate session token
function generateSessionToken() {
    return crypto.randomBytes(32).toString('hex');
}

// Parse user agent for device info
function parseUserAgent(userAgent) {
    // Basic parsing, you might want to use a library like 'ua-parser-js' for better results
    const device = {
        browser: 'Unknown',
        os: 'Unknown',
        device: 'Unknown'
    };

    if (userAgent.includes('Firefox')) {
        device.browser = 'Firefox';
    } else if (userAgent.includes('Chrome')) {
        device.browser = 'Chrome';
    } else if (userAgent.includes('Safari')) {
        device.browser = 'Safari';
    }

    if (userAgent.includes('Windows')) {
        device.os = 'Windows';
    } else if (userAgent.includes('Mac')) {
        device.os = 'MacOS';
    } else if (userAgent.includes('Linux')) {
        device.os = 'Linux';
    } else if (userAgent.includes('Android')) {
        device.os = 'Android';
    } else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) {
        device.os = 'iOS';
    }

    if (userAgent.includes('Mobile')) {
        device.device = 'Mobile';
    } else if (userAgent.includes('Tablet')) {
        device.device = 'Tablet';
    } else {
        device.device = 'Desktop';
    }

    return device;
}

// Rate limiting helper
const rateLimits = new Map();

function checkRateLimit(key, limit, windowMs) {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    // Clean up old entries
    for (const [k, data] of rateLimits.entries()) {
        if (data.timestamp < windowStart) {
            rateLimits.delete(k);
        }
    }
    
    // Check current key
    const current = rateLimits.get(key) || { count: 0, timestamp: now };
    if (current.timestamp < windowStart) {
        current.count = 1;
        current.timestamp = now;
    } else {
        current.count++;
    }
    rateLimits.set(key, current);
    
    return current.count <= limit;
}

module.exports = {
    generateTOTPSecret,
    generateQRCode,
    verifyTOTP,
    generateBackupCodes,
    hashBackupCodes,
    verifyBackupCode,
    generateSessionToken,
    parseUserAgent,
    checkRateLimit
}; 