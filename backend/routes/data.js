const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const db = require('../config/database');
const { exportUsers, exportCertificates, exportVerifications } = require('../utils/exportService');
const path = require('path');
const fs = require('fs');

// Advanced search for users
router.get('/users/search', auth.verifyToken, (req, res) => {
    const {
        role,
        verified,
        dateFrom,
        dateTo,
        search,
        page = 1,
        limit = 10,
        sortBy = 'created_at',
        sortOrder = 'DESC'
    } = req.query;

    const where = [];
    const params = [];
    
    if (role) {
        where.push('role = ?');
        params.push(role);
    }
    if (verified !== undefined) {
        where.push('email_verified = ?');
        params.push(verified === 'true' ? 1 : 0);
    }
    if (dateFrom) {
        where.push('created_at >= ?');
        params.push(dateFrom);
    }
    if (dateTo) {
        where.push('created_at <= ?');
        params.push(dateTo);
    }
    if (search) {
        where.push('(username LIKE ? OR email LIKE ?)');
        params.push(`%${search}%`, `%${search}%`);
    }

    const whereClause = where.length ? 'WHERE ' + where.join(' AND ') : '';
    const offset = (page - 1) * limit;
    
    const query = `
        SELECT 
            users.*,
            (SELECT COUNT(*) FROM certificates WHERE issuer_id = users.id) as certificates_issued,
            (SELECT COUNT(*) FROM sessions WHERE user_id = users.id AND expires_at > datetime('now')) as active_sessions
        FROM users
        ${whereClause}
        ORDER BY ${sortBy} ${sortOrder}
        LIMIT ? OFFSET ?
    `;

    // Get total count for pagination
    db.get(
        `SELECT COUNT(*) as total FROM users ${whereClause}`,
        params,
        (err, count) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            // Get paginated results
            db.all(
                query,
                [...params, limit, offset],
                (err, users) => {
                    if (err) {
                        return res.status(500).json({ error: 'Database error' });
                    }
                    res.json({
                        users,
                        pagination: {
                            total: count.total,
                            pages: Math.ceil(count.total / limit),
                            currentPage: page,
                            limit
                        }
                    });
                }
            );
        }
    );
});

// Advanced search for certificates
router.get('/certificates/search', auth.verifyToken, (req, res) => {
    const {
        status,
        dateFrom,
        dateTo,
        search,
        issuerId,
        hasBlockchain,
        page = 1,
        limit = 10,
        sortBy = 'created_at',
        sortOrder = 'DESC'
    } = req.query;

    const where = [];
    const params = [];
    
    if (status) {
        where.push('c.status = ?');
        params.push(status);
    }
    if (dateFrom) {
        where.push('c.created_at >= ?');
        params.push(dateFrom);
    }
    if (dateTo) {
        where.push('c.created_at <= ?');
        params.push(dateTo);
    }
    if (issuerId) {
        where.push('c.issuer_id = ?');
        params.push(issuerId);
    }
    if (hasBlockchain !== undefined) {
        where.push(hasBlockchain === 'true' ? 'c.blockchain_hash IS NOT NULL' : 'c.blockchain_hash IS NULL');
    }
    if (search) {
        where.push(`(
            c.recipient_name LIKE ? OR 
            c.recipient_email LIKE ? OR 
            c.course_name LIKE ? OR
            c.certificate_id LIKE ?
        )`);
        params.push(
            `%${search}%`,
            `%${search}%`,
            `%${search}%`,
            `%${search}%`
        );
    }

    const whereClause = where.length ? 'WHERE ' + where.join(' AND ') : '';
    const offset = (page - 1) * limit;
    
    const query = `
        SELECT 
            c.*,
            u.username as issuer_name,
            (SELECT COUNT(*) FROM certificate_verifications WHERE certificate_id = c.id) as verification_count
        FROM certificates c
        JOIN users u ON c.issuer_id = u.id
        ${whereClause}
        ORDER BY c.${sortBy} ${sortOrder}
        LIMIT ? OFFSET ?
    `;

    // Get total count for pagination
    db.get(
        `SELECT COUNT(*) as total FROM certificates c ${whereClause}`,
        params,
        (err, count) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            // Get paginated results
            db.all(
                query,
                [...params, limit, offset],
                (err, certificates) => {
                    if (err) {
                        return res.status(500).json({ error: 'Database error' });
                    }
                    res.json({
                        certificates,
                        pagination: {
                            total: count.total,
                            pages: Math.ceil(count.total / limit),
                            currentPage: page,
                            limit
                        }
                    });
                }
            );
        }
    );
});

// Export users data
router.get('/export/users', auth.verifyToken, auth.isAdmin, async (req, res) => {
    try {
        const format = req.query.format?.toLowerCase() || 'csv';
        if (!['csv', 'json', 'excel', 'pdf'].includes(format)) {
            return res.status(400).json({ error: 'Unsupported export format' });
        }

        const filters = {
            role: req.query.role,
            verified: req.query.verified === 'true',
            search: req.query.search
        };

        const options = {
            compress: req.query.compress === 'true'
        };

        const filePath = await exportUsers(db, filters, format, options);
        const fileName = `users_export${path.extname(filePath)}`;
        res.download(filePath, fileName, (err) => {
            if (err) console.error('Download error:', err);
            // Clean up file after sending
            fs.unlink(filePath, (err) => {
                if (err) console.error('Cleanup error:', err);
            });
        });
    } catch (error) {
        console.error('Error exporting users:', error);
        res.status(500).json({ error: 'Failed to export users data' });
    }
});

// Export certificates data
router.get('/export/certificates', auth.verifyToken, async (req, res) => {
    try {
        const format = req.query.format?.toLowerCase() || 'csv';
        if (!['csv', 'json', 'excel', 'pdf'].includes(format)) {
            return res.status(400).json({ error: 'Unsupported export format' });
        }

        const filters = {
            status: req.query.status,
            search: req.query.search
        };

        const options = {
            compress: req.query.compress === 'true'
        };

        const filePath = await exportCertificates(db, filters, format, options);
        const fileName = `certificates_export${path.extname(filePath)}`;
        res.download(filePath, fileName, (err) => {
            if (err) console.error('Download error:', err);
            // Clean up file after sending
            fs.unlink(filePath, (err) => {
                if (err) console.error('Cleanup error:', err);
            });
        });
    } catch (error) {
        console.error('Error exporting certificates:', error);
        res.status(500).json({ error: 'Failed to export certificates data' });
    }
});

// Export verifications data
router.get('/export/verifications', auth.verifyToken, auth.isAdmin, async (req, res) => {
    try {
        const format = req.query.format?.toLowerCase() || 'csv';
        if (!['csv', 'json', 'excel', 'pdf'].includes(format)) {
            return res.status(400).json({ error: 'Unsupported export format' });
        }

        const filters = {
            status: req.query.status,
            startDate: req.query.startDate,
            endDate: req.query.endDate
        };

        const options = {
            compress: req.query.compress === 'true'
        };

        const filePath = await exportVerifications(db, filters, format, options);
        const fileName = `verifications_export${path.extname(filePath)}`;
        res.download(filePath, fileName, (err) => {
            if (err) console.error('Download error:', err);
            // Clean up file after sending
            fs.unlink(filePath, (err) => {
                if (err) console.error('Cleanup error:', err);
            });
        });
    } catch (error) {
        console.error('Error exporting verifications:', error);
        res.status(500).json({ error: 'Failed to export verifications data' });
    }
});

// Get statistics and analytics
router.get('/stats', auth.verifyToken, (req, res) => {
    const queries = [
        // User statistics
        `SELECT 
            COUNT(*) as total_users,
            SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) as admin_count,
            SUM(CASE WHEN email_verified = 1 THEN 1 ELSE 0 END) as verified_users
        FROM users`,
        
        // Certificate statistics
        `SELECT 
            COUNT(*) as total_certificates,
            SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_certificates,
            SUM(CASE WHEN status = 'revoked' THEN 1 ELSE 0 END) as revoked_certificates,
            SUM(CASE WHEN blockchain_hash IS NOT NULL THEN 1 ELSE 0 END) as blockchain_certificates
        FROM certificates`,
        
        // Verification statistics
        `SELECT 
            COUNT(*) as total_verifications,
            SUM(CASE WHEN verification_status = 'valid' THEN 1 ELSE 0 END) as valid_verifications,
            COUNT(DISTINCT certificate_id) as unique_certificates_verified
        FROM certificate_verifications`,
        
        // Recent activity
        `SELECT 
            (SELECT COUNT(*) FROM users WHERE created_at >= datetime('now', '-30 days')) as new_users_30d,
            (SELECT COUNT(*) FROM certificates WHERE created_at >= datetime('now', '-30 days')) as new_certificates_30d,
            (SELECT COUNT(*) FROM certificate_verifications WHERE verification_date >= datetime('now', '-30 days')) as verifications_30d
        `
    ];

    Promise.all(queries.map(query => 
        new Promise((resolve, reject) => {
            db.get(query, [], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        })
    ))
    .then(([users, certificates, verifications, activity]) => {
        res.json({
            users,
            certificates,
            verifications,
            activity
        });
    })
    .catch(err => {
        res.status(500).json({ error: 'Failed to fetch statistics' });
    });
});

module.exports = router; 