const bcrypt = require('bcryptjs');
const db = require('../config/database');

async function createAdminUser() {
    const adminUser = {
        username: 'admin',
        email: 'admin@certifychain.com',
        password: 'admin123', // This is just for testing
        role: 'admin'
    };

    try {
        // Check if admin already exists
        db.get('SELECT id FROM users WHERE email = ?', [adminUser.email], async (err, user) => {
            if (err) {
                console.error('Database error:', err);
                process.exit(1);
            }
            if (user) {
                console.log('Admin user already exists');
                process.exit(0);
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(adminUser.password, salt);

            // Insert admin user
            db.run(
                'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
                [adminUser.username, adminUser.email, hashedPassword, adminUser.role],
                function(err) {
                    if (err) {
                        console.error('Error creating admin:', err);
                        process.exit(1);
                    }

                    console.log('Admin user created successfully');
                    console.log('Email:', adminUser.email);
                    console.log('Password:', adminUser.password);
                    process.exit(0);
                }
            );
        });
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

createAdminUser(); 