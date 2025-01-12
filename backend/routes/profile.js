const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const auth = require('../middleware/auth');
const db = require('../config/database');
const { sendEmail } = require('../utils/emailService');
const { upload, deleteFile, getFileUrl, uploadDirs } = require('../utils/uploadService');
const { 
    generateTOTPSecret, 
    generateQRCode, 
    verifyTOTP,
    generateBackupCodes,
    hashBackupCodes,
    verifyBackupCode,
    parseUserAgent
} = require('../utils/securityService');

// Get user profile with preferences
router.get('/', auth.verifyToken, (req, res) => {
    const userId = req.user.id;
    
    db.get(
        `SELECT u.*, up.email_notifications, up.theme_preferences, up.privacy_settings
         FROM users u
         LEFT JOIN user_preferences up ON u.id = up.user_id
         WHERE u.id = ?`,
        [userId],
        (err, user) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Remove sensitive data
            delete user.password;
            delete user.two_factor_secret;
            delete user.backup_codes;

            res.json(user);
        }
    );
});

// Update user profile
router.put('/', auth.verifyToken, (req, res) => {
    const userId = req.user.id;
    const { 
        username, 
        email,
        bio,
        company,
        website,
        location,
        email_notifications,
        theme_preferences,
        privacy_settings
    } = req.body;

    if (!username || !email) {
        return res.status(400).json({ error: 'Username and email are required' });
    }

    db.serialize(() => {
        // Start transaction
        db.run('BEGIN TRANSACTION');

        // Update user profile
        db.run(
            `UPDATE users 
             SET username = ?, email = ?, bio = ?, company = ?, 
                 website = ?, location = ?, updated_at = datetime('now')
             WHERE id = ?`,
            [username, email, bio, company, website, location, userId],
            (err) => {
                if (err) {
                    db.run('ROLLBACK');
                    return res.status(500).json({ error: 'Failed to update profile' });
                }

                // Update or insert preferences
                db.run(
                    `INSERT INTO user_preferences (
                        user_id, email_notifications, theme_preferences, privacy_settings, updated_at
                    ) VALUES (?, ?, ?, ?, datetime('now'))
                    ON CONFLICT(user_id) DO UPDATE SET
                        email_notifications = excluded.email_notifications,
                        theme_preferences = excluded.theme_preferences,
                        privacy_settings = excluded.privacy_settings,
                        updated_at = datetime('now')`,
                    [
                        userId,
                        JSON.stringify(email_notifications),
                        JSON.stringify(theme_preferences),
                        JSON.stringify(privacy_settings)
                    ],
                    (err) => {
                        if (err) {
                            db.run('ROLLBACK');
                            return res.status(500).json({ error: 'Failed to update preferences' });
                        }

                        db.run('COMMIT');
                        res.json({ message: 'Profile updated successfully' });
                    }
                );
            }
        );
    });
});

// Upload avatar
router.post('/avatar', auth.verifyToken, upload.single('avatar'), (req, res) => {
    const userId = req.user.id;

    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    // Get old avatar URL to delete later
    db.get('SELECT avatar_url FROM users WHERE id = ?', [userId], (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        const newAvatarUrl = getFileUrl(req.file.filename, 'avatar');

        db.run(
            'UPDATE users SET avatar_url = ?, updated_at = datetime("now") WHERE id = ?',
            [newAvatarUrl, userId],
            (err) => {
                if (err) {
                    return res.status(500).json({ error: 'Failed to update avatar' });
                }

                // Delete old avatar if exists
                if (user && user.avatar_url) {
                    const oldFilename = user.avatar_url.split('/').pop();
                    deleteFile(path.join(uploadDirs.avatars, oldFilename));
                }

                res.json({ 
                    message: 'Avatar updated successfully',
                    avatar_url: newAvatarUrl
                });
            }
        );
    });
});

// Enable 2FA
router.post('/2fa/enable', auth.verifyToken, async (req, res) => {
    const userId = req.user.id;

    db.get('SELECT email, two_factor_enabled FROM users WHERE id = ?', [userId], async (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (user.two_factor_enabled) {
            return res.status(400).json({ error: '2FA is already enabled' });
        }

        try {
            // Generate TOTP secret and backup codes
            const { otpauthUrl, base32: secret } = generateTOTPSecret(user.email);
            const backupCodes = generateBackupCodes();
            const hashedBackupCodes = hashBackupCodes(backupCodes);
            const qrCodeUrl = await generateQRCode(otpauthUrl);

            // Update user with 2FA details
            db.run(
                `UPDATE users 
                 SET two_factor_enabled = 1, 
                     two_factor_secret = ?,
                     backup_codes = ?,
                     updated_at = datetime('now')
                 WHERE id = ?`,
                [secret, JSON.stringify(hashedBackupCodes), userId],
                async (err) => {
                    if (err) {
                        return res.status(500).json({ error: 'Failed to enable 2FA' });
                    }

                    // Send email with QR code
                    await sendEmail(user.email, 'twoFactorEnabled', { qrCodeUrl });

                    res.json({
                        message: '2FA enabled successfully',
                        qrCode: qrCodeUrl,
                        backupCodes
                    });
                }
            );
        } catch (error) {
            console.error('Error enabling 2FA:', error);
            res.status(500).json({ error: 'Failed to enable 2FA' });
        }
    });
});

// Verify 2FA token
router.post('/2fa/verify', auth.verifyToken, (req, res) => {
    const userId = req.user.id;
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ error: 'Token is required' });
    }

    db.get(
        'SELECT two_factor_secret, backup_codes FROM users WHERE id = ?',
        [userId],
        (err, user) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            const isValidToken = verifyTOTP(token, user.two_factor_secret);
            const isValidBackup = verifyBackupCode(token, JSON.parse(user.backup_codes || '[]'));

            if (!isValidToken && !isValidBackup) {
                return res.status(401).json({ error: 'Invalid token' });
            }

            // If backup code was used, remove it
            if (isValidBackup) {
                const backupCodes = JSON.parse(user.backup_codes);
                const updatedCodes = backupCodes.filter(code => code !== token);
                db.run(
                    'UPDATE users SET backup_codes = ? WHERE id = ?',
                    [JSON.stringify(updatedCodes), userId]
                );
            }

            res.json({ message: 'Token verified successfully' });
        }
    );
});

// Disable 2FA
router.post('/2fa/disable', auth.verifyToken, (req, res) => {
    const userId = req.user.id;
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ error: 'Token is required' });
    }

    db.get(
        'SELECT two_factor_secret FROM users WHERE id = ?',
        [userId],
        (err, user) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            const isValid = verifyTOTP(token, user.two_factor_secret);
            if (!isValid) {
                return res.status(401).json({ error: 'Invalid token' });
            }

            db.run(
                `UPDATE users 
                 SET two_factor_enabled = 0,
                     two_factor_secret = NULL,
                     backup_codes = NULL,
                     updated_at = datetime('now')
                 WHERE id = ?`,
                [userId],
                (err) => {
                    if (err) {
                        return res.status(500).json({ error: 'Failed to disable 2FA' });
                    }
                    res.json({ message: '2FA disabled successfully' });
                }
            );
        }
    );
});

// Get login history
router.get('/security/login-history', auth.verifyToken, (req, res) => {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 10;

    db.all(
        `SELECT * FROM login_history 
         WHERE user_id = ? 
         ORDER BY created_at DESC 
         LIMIT ?`,
        [userId, limit],
        (err, history) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            res.json(history);
        }
    );
});

// Get active sessions
router.get('/security/sessions', auth.verifyToken, (req, res) => {
    const userId = req.user.id;

    db.all(
        `SELECT id, ip_address, user_agent, device_info, last_used_at, created_at 
         FROM sessions 
         WHERE user_id = ? AND expires_at > datetime('now')
         ORDER BY last_used_at DESC`,
        [userId],
        (err, sessions) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            res.json(sessions);
        }
    );
});

// Revoke session
router.delete('/security/sessions/:sessionId', auth.verifyToken, (req, res) => {
    const userId = req.user.id;
    const sessionId = req.params.sessionId;

    db.run(
        'DELETE FROM sessions WHERE id = ? AND user_id = ?',
        [sessionId, userId],
        (err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to revoke session' });
            }
            res.json({ message: 'Session revoked successfully' });
        }
    );
});

// Revoke all other sessions
router.delete('/security/sessions', auth.verifyToken, (req, res) => {
    const userId = req.user.id;
    const currentSessionId = req.session.id;

    db.run(
        'DELETE FROM sessions WHERE user_id = ? AND id != ?',
        [userId, currentSessionId],
        (err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to revoke sessions' });
            }
            res.json({ message: 'All other sessions revoked successfully' });
        }
    );
});

// Request password reset
router.post('/forgot-password', (req, res) => {
    const { email } = req.body;
    const resetToken = uuidv4();
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour from now

    db.get('SELECT id FROM users WHERE email = ?', [email], (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        db.run(
            'INSERT INTO password_resets (user_id, token, expires_at) VALUES (?, ?, ?)',
            [user.id, resetToken, expiresAt],
            (err) => {
                if (err) {
                    return res.status(500).json({ error: 'Failed to create reset token' });
                }
                // TODO: Send reset email with token
                res.json({ message: 'Password reset instructions sent to your email' });
            }
        );
    });
});

// Reset password with token
router.post('/reset-password', (req, res) => {
    const { token, newPassword } = req.body;

    db.get(
        `SELECT user_id FROM password_resets 
         WHERE token = ? AND expires_at > datetime('now') 
         AND used = 0`,
        [token],
        async (err, reset) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            if (!reset) {
                return res.status(400).json({ error: 'Invalid or expired reset token' });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            db.run(
                'UPDATE users SET password = ?, updated_at = datetime("now") WHERE id = ?',
                [hashedPassword, reset.user_id],
                (err) => {
                    if (err) {
                        return res.status(500).json({ error: 'Failed to reset password' });
                    }
                    // Mark token as used
                    db.run('UPDATE password_resets SET used = 1 WHERE token = ?', [token]);
                    // Invalidate all existing sessions
                    db.run('DELETE FROM sessions WHERE user_id = ?', [reset.user_id]);
                    res.json({ message: 'Password reset successful. Please login with your new password.' });
                }
            );
        }
    );
});

// Request email verification
router.post('/verify-email/request', auth.verifyToken, (req, res) => {
    const userId = req.user.id;
    const verificationToken = uuidv4();
    const expiresAt = new Date(Date.now() + 86400000); // 24 hours from now

    db.get('SELECT email_verified FROM users WHERE id = ?', [userId], (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (user.email_verified) {
            return res.status(400).json({ error: 'Email already verified' });
        }

        db.run(
            'INSERT INTO email_verifications (user_id, token, expires_at) VALUES (?, ?, ?)',
            [userId, verificationToken, expiresAt],
            (err) => {
                if (err) {
                    return res.status(500).json({ error: 'Failed to create verification token' });
                }
                // TODO: Send verification email with token
                res.json({ message: 'Verification email sent. Please check your inbox.' });
            }
        );
    });
});

// Verify email with token
router.post('/verify-email/:token', (req, res) => {
    const { token } = req.params;

    db.get(
        `SELECT ev.user_id, u.email_verified 
         FROM email_verifications ev
         JOIN users u ON ev.user_id = u.id
         WHERE ev.token = ? AND ev.expires_at > datetime('now')`,
        [token],
        (err, verification) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            if (!verification) {
                return res.status(400).json({ error: 'Invalid or expired verification token' });
            }
            if (verification.email_verified) {
                return res.status(400).json({ error: 'Email already verified' });
            }

            db.run(
                'UPDATE users SET email_verified = 1, updated_at = datetime("now") WHERE id = ?',
                [verification.user_id],
                (err) => {
                    if (err) {
                        return res.status(500).json({ error: 'Failed to verify email' });
                    }
                    // Delete used verification token
                    db.run('DELETE FROM email_verifications WHERE token = ?', [token]);
                    res.json({ message: 'Email verified successfully' });
                }
            );
        }
    );
});

module.exports = router; 