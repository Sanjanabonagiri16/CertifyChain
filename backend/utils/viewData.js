const db = require('../config/database');

// ANSI color codes for terminal
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    bgBlue: '\x1b[44m'
};

// Helper function to create a box with colors
function createBox(title, data, options = {}) {
    const width = options.width || 80;
    const color = options.color || colors.cyan;
    const horizontalLine = '─'.repeat(width - 2);
    const topBorder = `${color}┌${horizontalLine}┐${colors.reset}`;
    const bottomBorder = `${color}└${horizontalLine}┘${colors.reset}`;

    // Format title with background
    const titlePadding = ' '.repeat(Math.max(0, width - title.length - 3));
    const titleLine = `${color}│${colors.bgBlue}${colors.bright} ${title}${titlePadding}${colors.reset}${color}│${colors.reset}`;

    // Format data with colors
    let content = '';
    if (typeof data === 'object') {
        content = Object.entries(data)
            .map(([key, value]) => {
                const line = `${colors.yellow}${key}${colors.reset}: ${formatValue(value)}`;
                return `${color}│${colors.reset} ${line}${' '.repeat(Math.max(0, width - line.length - 4))}${color}│${colors.reset}`;
            })
            .join('\n');
    } else {
        content = `${color}│${colors.reset} ${data}${' '.repeat(width - data.length - 3)}${color}│${colors.reset}`;
    }

    // Add separator line
    const separator = `${color}│${colors.reset}${' '.repeat(width - 2)}${color}│${colors.reset}`;

    return [
        topBorder,
        titleLine,
        separator,
        content,
        bottomBorder
    ].join('\n');
}

// Helper function to format specific values
function formatValue(value) {
    if (value === null || value === undefined) return colors.red + 'N/A' + colors.reset;
    if (value === true) return colors.green + '✓' + colors.reset;
    if (value === false) return colors.red + '✗' + colors.reset;
    if (typeof value === 'string') {
        // Format dates
        if (value.match(/^\d{4}-\d{2}-\d{2}/)) {
            return colors.magenta + value + colors.reset;
        }
        // Format status
        if (['active', 'valid'].includes(value.toLowerCase())) {
            return colors.green + value + colors.reset;
        }
        if (['revoked', 'expired', 'invalid'].includes(value.toLowerCase())) {
            return colors.red + value + colors.reset;
        }
    }
    return colors.white + value + colors.reset;
}

// View all users with filters
function viewUsers(filter = {}) {
    const where = [];
    const params = [];
    if (filter.role) {
        where.push('role = ?');
        params.push(filter.role);
    }
    if (filter.search) {
        where.push('(username LIKE ? OR email LIKE ?)');
        params.push(`%${filter.search}%`, `%${filter.search}%`);
    }

    const whereClause = where.length ? 'WHERE ' + where.join(' AND ') : '';
    
    db.all(`
        SELECT 
            id, username, email, role, 
            created_at,
            (SELECT COUNT(*) FROM certificates WHERE issuer_id = users.id) as certificates_issued,
            (SELECT COUNT(*) FROM sessions WHERE user_id = users.id AND expires_at > datetime('now')) as active_sessions
        FROM users
        ${whereClause}
        ORDER BY created_at DESC
    `, params, (err, users) => {
        if (err) {
            console.error('Error fetching users:', err);
            return;
        }
        console.log(`\n${colors.bright}${colors.blue}=== Users ===\n${colors.reset}`);
        users.forEach(user => {
            console.log(createBox(`User #${user.id} - ${user.role.toUpperCase()}`, {
                Username: user.username,
                Email: user.email,
                Role: user.role,
                'Created At': user.created_at,
                'Certificates Issued': user.certificates_issued,
                'Active Sessions': user.active_sessions
            }));
            console.log(); // Add spacing between boxes
        });
    });
}

// View certificates with enhanced details
function viewCertificates(filter = {}) {
    const where = [];
    const params = [];
    if (filter.status) {
        where.push('certificates.status = ?');
        params.push(filter.status);
    }
    if (filter.search) {
        where.push(`(
            recipient_name LIKE ? OR 
            recipient_email LIKE ? OR 
            course_name LIKE ? OR
            certificate_id LIKE ?
        )`);
        params.push(
            `%${filter.search}%`,
            `%${filter.search}%`,
            `%${filter.search}%`,
            `%${filter.search}%`
        );
    }

    const whereClause = where.length ? 'WHERE ' + where.join(' AND ') : '';

    db.all(`
        SELECT 
            certificates.*,
            users.username as issuer_name,
            (SELECT COUNT(*) FROM certificate_verifications WHERE certificate_id = certificates.id) as verification_count,
            (SELECT MAX(verification_date) FROM certificate_verifications WHERE certificate_id = certificates.id) as last_verified
        FROM certificates 
        JOIN users ON certificates.issuer_id = users.id 
        ${whereClause}
        ORDER BY created_at DESC
    `, params, (err, certificates) => {
        if (err) {
            console.error('Error fetching certificates:', err);
            return;
        }
        console.log(`\n${colors.bright}${colors.blue}=== Certificates ===\n${colors.reset}`);
        certificates.forEach(cert => {
            console.log(createBox(`Certificate #${cert.id} - ${cert.status.toUpperCase()}`, {
                'Certificate ID': cert.certificate_id,
                Recipient: cert.recipient_name,
                Email: cert.recipient_email,
                Course: cert.course_name,
                'Issue Date': cert.issue_date,
                'Expiry Date': cert.expiry_date || 'N/A',
                Status: cert.status,
                'Issued By': cert.issuer_name,
                'Verification Count': cert.verification_count,
                'Last Verified': cert.last_verified || 'Never',
                'Blockchain Hash': cert.blockchain_hash || 'Not on blockchain'
            }));
            console.log();
        });
    });
}

// View recent verifications with enhanced details
function viewVerifications(limit = 10) {
    db.all(`
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
        ORDER BY verification_date DESC
        LIMIT ?
    `, [limit], (err, verifications) => {
        if (err) {
            console.error('Error fetching verifications:', err);
            return;
        }
        console.log(`\n${colors.bright}${colors.blue}=== Recent Verifications ===\n${colors.reset}`);
        verifications.forEach(verify => {
            console.log(createBox(`Verification #${verify.id}`, {
                'Certificate ID': verify.certificate_id,
                Recipient: verify.recipient_name,
                Course: verify.course_name,
                'Verified By': verify.verified_by,
                'Verification Date': verify.verification_date,
                Status: verify.verification_status,
                'Certificate Status': verify.certificate_status,
                Method: verify.verification_method,
                'IP Address': verify.ip_address,
                'Issuer': verify.issuer_name
            }));
            console.log();
        });
    });
}

// View active sessions with enhanced details
function viewSessions() {
    db.all(`
        SELECT 
            sessions.*,
            users.username,
            users.email,
            users.role,
            (strftime('%s', expires_at) - strftime('%s', 'now')) / 3600.0 as hours_remaining
        FROM sessions 
        JOIN users ON sessions.user_id = users.id 
        WHERE expires_at > datetime('now')
        ORDER BY expires_at ASC
    `, [], (err, sessions) => {
        if (err) {
            console.error('Error fetching sessions:', err);
            return;
        }
        console.log(`\n${colors.bright}${colors.blue}=== Active Sessions ===\n${colors.reset}`);
        sessions.forEach(session => {
            console.log(createBox(`Session #${session.id} - ${session.role.toUpperCase()}`, {
                Username: session.username,
                Email: session.email,
                Role: session.role,
                'Expires At': session.expires_at,
                'Hours Remaining': Math.round(session.hours_remaining * 10) / 10,
                'Created At': session.created_at
            }));
            console.log();
        });
    });
}

// Execute with filters
console.log(`${colors.bright}${colors.cyan}🔐 CertifyChain Database Contents${colors.reset}`);

// Example filters (you can modify these)
const filters = {
    users: { role: process.argv[2] || null },
    certificates: { status: process.argv[3] || null }
};

viewUsers(filters.users);
viewSessions();
viewCertificates(filters.certificates);
viewVerifications(5);

// Keep the script running for a moment to allow async operations to complete
setTimeout(() => process.exit(), 2000); 