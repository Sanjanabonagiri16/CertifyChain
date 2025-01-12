const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Issue new certificate (Admin only)
router.post('/', verifyToken, isAdmin, async (req, res) => {
    const {
        recipient_name,
        recipient_email,
        course_name,
        expiry_date
    } = req.body;

    // Validate required fields
    if (!recipient_name || !recipient_email || !course_name) {
        return res.status(400).json({ 
            message: 'Missing required fields: recipient_name, recipient_email, and course_name are required' 
        });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipient_email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    const certificate_id = uuidv4();
    const issue_date = new Date().toISOString();

    try {
        await new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO certificates (
                    certificate_id, recipient_name, recipient_email, course_name,
                    issue_date, expiry_date, issuer_id, status
                ) VALUES (?, ?, ?, ?, datetime(?), datetime(?), ?, ?)`,
                [certificate_id, recipient_name, recipient_email, course_name, 
                 issue_date, expiry_date || null, req.user.id, 'active'],
                function(err) {
                    if (err) reject(err);
                    resolve(this.lastID);
                }
            );
        });

        res.status(201).json({
            message: 'Certificate issued successfully',
            certificate_id: certificate_id
        });
    } catch (error) {
        console.error('Error issuing certificate:', error);
        res.status(500).json({ message: 'Error issuing certificate' });
    }
});

// Get all certificates (Admin)
router.get('/all', verifyToken, isAdmin, async (req, res) => {
    try {
        const certificates = await new Promise((resolve, reject) => {
            db.all(
                `SELECT c.*, u.username as issuer_name 
                 FROM certificates c 
                 LEFT JOIN users u ON c.issuer_id = u.id 
                 ORDER BY c.created_at DESC`, 
                [], 
                (err, rows) => {
                    if (err) reject(err);
                    resolve(rows);
                }
            );
        });
        res.json(certificates);
    } catch (error) {
        console.error('Error fetching certificates:', error);
        res.status(500).json({ message: 'Error fetching certificates' });
    }
});

// Get user's certificates
router.get('/my-certificates', verifyToken, async (req, res) => {
    try {
        const certificates = await new Promise((resolve, reject) => {
            db.all(
                `SELECT c.*, u.username as issuer_name 
                 FROM certificates c 
                 LEFT JOIN users u ON c.issuer_id = u.id 
                 WHERE c.recipient_email = ? 
                 ORDER BY c.created_at DESC`,
                [req.user.email],
                (err, rows) => {
                    if (err) reject(err);
                    resolve(rows);
                }
            );
        });
        res.json(certificates);
    } catch (error) {
        console.error('Error fetching certificates:', error);
        res.status(500).json({ message: 'Error fetching certificates' });
    }
});

// Verify certificate
router.get('/verify/:certificateId', async (req, res) => {
    const { certificateId } = req.params;
    const verifier_email = req.query.email || 'anonymous';
    const ip_address = req.ip;

    if (!certificateId) {
        return res.status(400).json({ message: 'Certificate ID is required' });
    }

    try {
        const certificate = await new Promise((resolve, reject) => {
            db.get(
                `SELECT c.*, u.username as issuer_name 
                 FROM certificates c 
                 LEFT JOIN users u ON c.issuer_id = u.id 
                 WHERE c.certificate_id = ?`,
                [certificateId],
                (err, row) => {
                    if (err) reject(err);
                    resolve(row);
                }
            );
        });

        if (!certificate) {
            return res.status(404).json({ message: 'Certificate not found' });
        }

        const verification_status = certificate.status === 'active' ? 'valid' : 'invalid';

        // Record verification attempt
        await new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO certificate_verifications (
                    certificate_id, verified_by, verification_method,
                    verification_status, ip_address
                ) VALUES (?, ?, ?, ?, ?)`,
                [certificate.id, verifier_email, 'web', verification_status, ip_address],
                (err) => {
                    if (err) reject(err);
                    resolve();
                }
            );
        });

        res.json({
            valid: certificate.status === 'active',
            certificate: {
                recipient_name: certificate.recipient_name,
                course_name: certificate.course_name,
                issue_date: certificate.issue_date,
                expiry_date: certificate.expiry_date,
                issuer_name: certificate.issuer_name,
                status: certificate.status
            }
        });
    } catch (error) {
        console.error('Error verifying certificate:', error);
        res.status(500).json({ message: 'Error verifying certificate' });
    }
});

// Revoke certificate (Admin only)
router.post('/revoke/:certificateId', verifyToken, isAdmin, async (req, res) => {
    const { certificateId } = req.params;

    if (!certificateId) {
        return res.status(400).json({ message: 'Certificate ID is required' });
    }

    try {
        const result = await new Promise((resolve, reject) => {
            db.run(
                `UPDATE certificates 
                 SET status = ?, updated_at = datetime('now') 
                 WHERE certificate_id = ?`,
                ['revoked', certificateId],
                function(err) {
                    if (err) reject(err);
                    resolve(this.changes);
                }
            );
        });

        if (result === 0) {
            return res.status(404).json({ message: 'Certificate not found' });
        }

        res.json({ message: 'Certificate revoked successfully' });
    } catch (error) {
        console.error('Error revoking certificate:', error);
        res.status(500).json({ message: 'Error revoking certificate' });
    }
});

module.exports = router; 