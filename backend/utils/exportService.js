const XLSX = require('xlsx');
const PDFDocument = require('pdfkit');
const archiver = require('archiver');
const path = require('path');
const fs = require('fs');

// Ensure exports directory exists
const exportsDir = path.join(__dirname, '../data/exports');
if (!fs.existsSync(exportsDir)) {
    fs.mkdirSync(exportsDir, { recursive: true });
}

// Excel styling configuration
const excelStyles = {
    headerFill: { fgColor: { rgb: "4F81BD" } },
    headerFont: { color: { rgb: "FFFFFF" }, bold: true },
    dateFmt: 'yyyy-mm-dd hh:mm:ss',
    numberFmt: '#,##0',
    columnWidths: {
        id: 10,
        username: 20,
        email: 30,
        created_at: 20,
        certificate_id: 36,
        recipient_name: 30,
        course_name: 30
    }
};

// Convert data to CSV format
function objectToCSV(data) {
    if (!data.length) return '';
    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];
    
    for (const row of data) {
        const values = headers.map(header => {
            const value = row[header];
            return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
        });
        csvRows.push(values.join(','));
    }
    
    return csvRows.join('\n');
}

// Convert data to Excel format
function objectToExcel(data, options = {}) {
    const workbook = XLSX.utils.book_new();
    
    // Process each sheet
    Object.entries(data).forEach(([sheetName, sheetData]) => {
        // Convert data to worksheet
        const worksheet = XLSX.utils.json_to_sheet(sheetData);
        
        // Apply column widths
        const columnWidths = [];
        Object.keys(sheetData[0] || {}).forEach(key => {
            if (excelStyles.columnWidths[key]) {
                columnWidths.push({ wch: excelStyles.columnWidths[key] });
            } else {
                columnWidths.push({ wch: 15 }); // Default width
            }
        });
        worksheet['!cols'] = columnWidths;

        // Apply header styling
        const range = XLSX.utils.decode_range(worksheet['!ref']);
        for (let col = range.s.c; col <= range.e.c; col++) {
            const headerCell = XLSX.utils.encode_cell({ r: 0, c: col });
            if (!worksheet[headerCell]) continue;
            
            worksheet[headerCell].s = {
                fill: excelStyles.headerFill,
                font: excelStyles.headerFont,
                alignment: { horizontal: 'center' }
            };
        }

        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    });

    return workbook;
}

// Convert data to PDF format
async function objectToPDF(data, title) {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument();
        const pdfPath = path.join(exportsDir, `${title}_${Date.now()}.pdf`);
        const writeStream = fs.createWriteStream(pdfPath);
        
        doc.pipe(writeStream);
        
        // Add title
        doc.fontSize(20).text(title, { align: 'center' });
        doc.moveDown();
        
        // Add timestamp
        doc.fontSize(12).text(`Generated on: ${new Date().toLocaleString()}`, { align: 'right' });
        doc.moveDown();

        // Add table headers
        if (data.length > 0) {
            const headers = Object.keys(data[0]);
            let yPos = doc.y;
            
            headers.forEach((header, i) => {
                doc.fontSize(12)
                   .text(header.toUpperCase(),
                        50 + (i * 100),
                        yPos,
                        { width: 90, align: 'left' });
            });
            
            doc.moveDown();
            yPos = doc.y;
            
            // Add table data
            data.forEach((row, rowIndex) => {
                if (doc.y > 700) { // Check for page overflow
                    doc.addPage();
                    yPos = doc.y;
                }
                
                Object.values(row).forEach((value, i) => {
                    doc.fontSize(10)
                       .text(String(value),
                            50 + (i * 100),
                            yPos + (rowIndex * 20),
                            { width: 90, align: 'left' });
                });
            });
        }
        
        doc.end();
        
        writeStream.on('finish', () => resolve(pdfPath));
        writeStream.on('error', reject);
    });
}

// Compress exported files
async function compressFiles(files, outputName) {
    const archivePath = path.join(exportsDir, `${outputName}_${Date.now()}.zip`);
    const output = fs.createWriteStream(archivePath);
    const archive = archiver('zip', { zlib: { level: 9 } });
    
    return new Promise((resolve, reject) => {
        output.on('close', () => resolve(archivePath));
        archive.on('error', reject);
        
        archive.pipe(output);
        
        files.forEach(file => {
            archive.file(file, { name: path.basename(file) });
        });
        
        archive.finalize();
    });
}

// Enhanced export function with compression support
async function exportData(data, format, filename, options = {}) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const exportPath = path.join(exportsDir, `${filename}_${timestamp}`);
    const exportedFiles = [];
    
    try {
        switch (format.toLowerCase()) {
            case 'csv':
                const csvContent = objectToCSV(data);
                const csvPath = `${exportPath}.csv`;
                fs.writeFileSync(csvPath, csvContent);
                exportedFiles.push(csvPath);
                break;
                
            case 'json':
                const jsonPath = `${exportPath}.json`;
                fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
                exportedFiles.push(jsonPath);
                break;
                
            case 'excel':
                const workbook = objectToExcel({
                    'Main Data': data,
                    'Summary': generateSummary(data)
                });
                const excelPath = `${exportPath}.xlsx`;
                XLSX.writeFile(workbook, excelPath);
                exportedFiles.push(excelPath);
                break;
                
            case 'pdf':
                const pdfPath = await objectToPDF(data, filename);
                exportedFiles.push(pdfPath);
                break;
                
            default:
                throw new Error('Unsupported export format');
        }

        // Compress if file size is large or explicitly requested
        const totalSize = exportedFiles.reduce((size, file) => 
            size + fs.statSync(file).size, 0);
            
        if (totalSize > 1024 * 1024 || options.compress) { // > 1MB
            const compressedPath = await compressFiles(exportedFiles, filename);
            // Clean up uncompressed files
            exportedFiles.forEach(file => fs.unlinkSync(file));
            return compressedPath;
        }

        return exportedFiles[0];
    } catch (error) {
        // Clean up any created files on error
        exportedFiles.forEach(file => {
            if (fs.existsSync(file)) fs.unlinkSync(file);
        });
        throw error;
    }
}

// Generate summary data for Excel export
function generateSummary(data) {
    if (!data.length) return [];
    
    const summary = {
        totalRecords: data.length,
        dateRange: {
            from: null,
            to: null
        }
    };

    // Add type-specific summaries
    if (data[0].hasOwnProperty('role')) {
        // Users summary
        summary.roleDistribution = data.reduce((acc, user) => {
            acc[user.role] = (acc[user.role] || 0) + 1;
            return acc;
        }, {});
    } else if (data[0].hasOwnProperty('status')) {
        // Certificates summary
        summary.statusDistribution = data.reduce((acc, cert) => {
            acc[cert.status] = (acc[cert.status] || 0) + 1;
            return acc;
        }, {});
    }

    // Convert summary to array format for Excel
    return Object.entries(summary).map(([key, value]) => ({
        metric: key,
        value: typeof value === 'object' ? JSON.stringify(value) : value
    }));
}

// Export users data
async function exportUsers(db, filters = {}, format = 'csv') {
    return new Promise((resolve, reject) => {
        let query = `
            SELECT 
                u.id, u.username, u.email, u.role, 
                u.email_verified, u.two_factor_enabled,
                u.created_at,
                COUNT(DISTINCT c.id) as certificates_issued,
                COUNT(DISTINCT s.id) as active_sessions
            FROM users u
            LEFT JOIN certificates c ON u.id = c.issuer_id
            LEFT JOIN sessions s ON u.id = s.user_id 
                AND s.expires_at > datetime('now')
            WHERE 1=1
        `;
        
        const params = [];
        
        if (filters.role) {
            query += ' AND u.role = ?';
            params.push(filters.role);
        }
        
        if (filters.verified !== undefined) {
            query += ' AND u.email_verified = ?';
            params.push(filters.verified ? 1 : 0);
        }
        
        if (filters.search) {
            query += ' AND (u.username LIKE ? OR u.email LIKE ?)';
            params.push(`%${filters.search}%`, `%${filters.search}%`);
        }
        
        query += ' GROUP BY u.id ORDER BY u.created_at DESC';
        
        db.all(query, params, async (err, users) => {
            if (err) return reject(err);
            try {
                const filePath = await exportData(users, format, 'users');
                resolve(filePath);
            } catch (error) {
                reject(error);
            }
        });
    });
}

// Export certificates data
async function exportCertificates(db, filters = {}, format = 'csv') {
    return new Promise((resolve, reject) => {
        let query = `
            SELECT 
                c.id, c.certificate_id, c.recipient_name,
                c.recipient_email, c.course_name,
                c.issue_date, c.expiry_date, c.status,
                c.blockchain_hash,
                u.username as issuer_name,
                COUNT(cv.id) as verification_count,
                c.created_at
            FROM certificates c
            LEFT JOIN users u ON c.issuer_id = u.id
            LEFT JOIN certificate_verifications cv ON c.id = cv.certificate_id
            WHERE 1=1
        `;
        
        const params = [];
        
        if (filters.status) {
            query += ' AND c.status = ?';
            params.push(filters.status);
        }
        
        if (filters.search) {
            query += ` AND (
                c.recipient_name LIKE ? OR 
                c.recipient_email LIKE ? OR
                c.course_name LIKE ? OR
                c.certificate_id LIKE ?
            )`;
            const searchTerm = `%${filters.search}%`;
            params.push(searchTerm, searchTerm, searchTerm, searchTerm);
        }
        
        query += ' GROUP BY c.id ORDER BY c.created_at DESC';
        
        db.all(query, params, async (err, certificates) => {
            if (err) return reject(err);
            try {
                const filePath = await exportData(certificates, format, 'certificates');
                resolve(filePath);
            } catch (error) {
                reject(error);
            }
        });
    });
}

// Export verifications data
async function exportVerifications(db, filters = {}, format = 'csv') {
    return new Promise((resolve, reject) => {
        let query = `
            SELECT 
                cv.id, c.certificate_id,
                c.recipient_name, c.course_name,
                cv.verified_by, cv.verification_date,
                cv.verification_method, cv.verification_status,
                cv.ip_address
            FROM certificate_verifications cv
            JOIN certificates c ON cv.certificate_id = c.id
            WHERE 1=1
        `;
        
        const params = [];
        
        if (filters.status) {
            query += ' AND cv.verification_status = ?';
            params.push(filters.status);
        }
        
        if (filters.startDate) {
            query += ' AND cv.verification_date >= ?';
            params.push(filters.startDate);
        }
        
        if (filters.endDate) {
            query += ' AND cv.verification_date <= ?';
            params.push(filters.endDate);
        }
        
        query += ' ORDER BY cv.verification_date DESC';
        
        db.all(query, params, async (err, verifications) => {
            if (err) return reject(err);
            try {
                const filePath = await exportData(verifications, format, 'verifications');
                resolve(filePath);
            } catch (error) {
                reject(error);
            }
        });
    });
}

module.exports = {
    exportUsers,
    exportCertificates,
    exportVerifications
}; 