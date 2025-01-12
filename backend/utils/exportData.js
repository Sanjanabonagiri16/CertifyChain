const fs = require('fs');
const path = require('path');
const db = require('../config/database');

// Helper function to convert object to CSV row
function objectToCSV(obj) {
    return Object.values(obj).map(value => 
        `"${String(value).replace(/"/g, '""')}"`
    ).join(',');
}

// Export users to CSV
function exportUsers(filters = {}, callback) {
    const where = [];
    const params = [];
    
    if (filters.role) {
        where.push('role = ?');
        params.push(filters.role);
    }
    if (filters.verified) {
        where.push('email_verified = ?');
        params.push(filters.verified ? 1 : 0);
    }
    if (filters.dateFrom) {
        where.push('created_at >= ?');
        params.push(filters.dateFrom);
    }
    if (filters.dateTo) {
        where.push('created_at <= ?');
        params.push(filters.dateTo);
    }
    if (filters.search) {
        where.push('(username LIKE ? OR email LIKE ?)');
        params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    const whereClause = where.length ? 'WHERE ' + where.join(' AND ') : '';
    
    const query = `
        SELECT 
            id, username, email, role, email_verified,
            created_at, updated_at,
            (SELECT COUNT(*) FROM certificates WHERE issuer_id = users.id) as certificates_issued
        FROM users
        ${whereClause}
        ORDER BY created_at DESC
    `;

    db.all(query, params, (err, users) => {
        if (err) {
            return callback(err);
        }

        const headers = ['ID', 'Username', 'Email', 'Role', 'Email Verified', 'Certificates Issued', 'Created At', 'Updated At'];
        const csvContent = [
            headers.join(','),
            ...users.map(user => objectToCSV({
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                verified: user.email_verified ? 'Yes' : 'No',
                certs: user.certificates_issued,
                created: user.created_at,
                updated: user.updated_at
            }))
        ].join('\n');

        callback(null, csvContent);
    });
}

// Export certificates to CSV
function exportCertificates(filters = {}, callback) {
    const where = [];
    const params = [];
    
    if (filters.status) {
        where.push('certificates.status = ?');
        params.push(filters.status);
    }
    if (filters.dateFrom) {
        where.push('certificates.created_at >= ?');
        params.push(filters.dateFrom);
    }
    if (filters.dateTo) {
        where.push('certificates.created_at <= ?');
        params.push(filters.dateTo);
    }
    if (filters.search) {
        where.push(`(
            recipient_name LIKE ? OR 
            recipient_email LIKE ? OR 
            course_name LIKE ? OR
            certificate_id LIKE ?
        )`);
        params.push(
            `%${filters.search}%`,
            `%${filters.search}%`,
            `%${filters.search}%`,
            `%${filters.search}%`
        );
    }

    const whereClause = where.length ? 'WHERE ' + where.join(' AND ') : '';
    
    const query = `
        SELECT 
            c.*,
            u.username as issuer_name,
            (SELECT COUNT(*) FROM certificate_verifications WHERE certificate_id = c.id) as verification_count
        FROM certificates c
        JOIN users u ON c.issuer_id = u.id
        ${whereClause}
        ORDER BY c.created_at DESC
    `;

    db.all(query, params, (err, certificates) => {
        if (err) {
            return callback(err);
        }

        const headers = [
            'ID', 'Certificate ID', 'Recipient Name', 'Recipient Email', 
            'Course Name', 'Issue Date', 'Expiry Date', 'Status',
            'Issuer', 'Verifications', 'Blockchain Hash', 'Created At'
        ];
        
        const csvContent = [
            headers.join(','),
            ...certificates.map(cert => objectToCSV({
                id: cert.id,
                certId: cert.certificate_id,
                recipient: cert.recipient_name,
                email: cert.recipient_email,
                course: cert.course_name,
                issued: cert.issue_date,
                expiry: cert.expiry_date || 'N/A',
                status: cert.status,
                issuer: cert.issuer_name,
                verifications: cert.verification_count,
                hash: cert.blockchain_hash || 'Not on blockchain',
                created: cert.created_at
            }))
        ].join('\n');

        callback(null, csvContent);
    });
}

// Export verifications to CSV
function exportVerifications(filters = {}, callback) {
    const where = [];
    const params = [];
    
    if (filters.status) {
        where.push('cv.verification_status = ?');
        params.push(filters.status);
    }
    if (filters.dateFrom) {
        where.push('cv.verification_date >= ?');
        params.push(filters.dateFrom);
    }
    if (filters.dateTo) {
        where.push('cv.verification_date <= ?');
        params.push(filters.dateTo);
    }

    const whereClause = where.length ? 'WHERE ' + where.join(' AND ') : '';
    
    const query = `
        SELECT 
            cv.*,
            c.certificate_id,
            c.recipient_name,
            c.course_name,
            c.status as certificate_status,
            u.username as issuer_name
        FROM certificate_verifications cv
        JOIN certificates c ON cv.certificate_id = c.id
        JOIN users u ON c.issuer_id = u.id
        ${whereClause}
        ORDER BY cv.verification_date DESC
    `;

    db.all(query, params, (err, verifications) => {
        if (err) {
            return callback(err);
        }

        const headers = [
            'ID', 'Certificate ID', 'Recipient', 'Course',
            'Verified By', 'Verification Date', 'Method',
            'Status', 'Certificate Status', 'IP Address'
        ];
        
        const csvContent = [
            headers.join(','),
            ...verifications.map(v => objectToCSV({
                id: v.id,
                certId: v.certificate_id,
                recipient: v.recipient_name,
                course: v.course_name,
                verifier: v.verified_by,
                date: v.verification_date,
                method: v.verification_method,
                status: v.verification_status,
                certStatus: v.certificate_status,
                ip: v.ip_address
            }))
        ].join('\n');

        callback(null, csvContent);
    });
}

module.exports = {
    exportUsers,
    exportCertificates,
    exportVerifications
}; 