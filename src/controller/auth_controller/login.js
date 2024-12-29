const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../../db/db');
require('dotenv').config();

module.exports.login_page = (req, res) => {
    // Set headers to prevent caching
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    console.log('Session details in user page: ', req.session);
    // Check if user session exists and has a token
    
        res.render('user/login', {error:''})
}

// module.exports.login = (req, res) => {
//     const { Email, Password } = req.body;

//     try {
//         // Fetch user from the database
//         db.query('SELECT * FROM users WHERE Email = ? and isActive = ?', [Email,true], async (error, results) => {
//             if (error) {
//                 console.error('Database query error:', error);
//                 return res.status(500).json({ error: "Internal server error" });
//             }

//             if (results.length === 0) {
//                 return res.render('user/login', { error: "Email does not exist!" });
//             }

//             const user = results[0];
//             if (!user.Password) {
//                 return res.render('user/login', { error: "Password not found for the user!" });
//             }
//             // Compare provided password with hashed password
//             const match = await bcrypt.compare(Password, user.Password);

//             if (!match) {
//                 return res.render('user/login', { error: "Invalid password!" });
//             }
//             const role_id = user.role_id
//             // Update LastLogin timestamp
//             db.query('UPDATE users SET LastLogin = current_timestamp() WHERE Email = ?', [Email], (error) => {
//                 if (error) {
//                     console.error('Error updating LastLogin:', error);
//                     return res.status(500).json({ error: "Internal server error" });
//                 }
                
//                 // Create a JWT token
//                 const token = jwt.sign({ email: Email, role_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
                
//                 // Set session token
//                 req.session.token = token;

//                 // Redirect based on role
//                 const dashboard = user.role_id === 1 ? '/user_dashboard' : '/admin_dashboard';
//                 res.redirect(dashboard);
//             });
//         });
//     } catch (error) {
//         console.error('Error in login:', error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// };

module.exports.login = (req, res) => {
    const { Email, Password } = req.body;
    console.log('Email:', Email); // Debugging the email input
    console.log('Password:', Password); // Debugging the password input

    try {
        // Query the database for the user
        db.query('SELECT * FROM users WHERE Email = ? AND isActive = ?', [Email, true], async (error, results) => {
            if (error) {
                console.error('Database query error:', error);
                return res.status(500).json({ error: "Internal server error" });
            }

            console.log('Query Results:', results); // Debugging query results

            if (results.length === 0) {
                console.log('No matching email found in the database.'); // Debugging
                return res.status(400).json({ error: "Email does not exist!" });
            }

            const user = results[0];
            console.log('User Found:', user); // Debugging user details

            if (!user.Password) {
                return res.status(400).json({ error: "Password not found for the user!" });
            }

            // Compare provided password with hashed password
            const match = await bcrypt.compare(Password, user.Password);
            console.log('Password comparison result:', match); // Debugging match result

            if (!match) {
                console.log('Password mismatch for user:', Email); // Debugging
                return res.status(400).json({ error: "Invalid password!" });
            }

            const role_id = user.role_id;
            // Update LastLogin timestamp
            db.query('UPDATE users SET LastLogin = current_timestamp() WHERE Email = ?', [Email], (error) => {
                if (error) {
                    console.error('Error updating LastLogin:', error);
                    return res.status(500).json({ error: "Internal server error" });
                }

                const token = jwt.sign({ email: Email, role_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
                req.session.token = token;

                const dashboard = user.role_id === 1 ? '/user_dashboard' : '/admin_dashboard';
                console.log('Redirecting to:', dashboard); // Debugging
                return res.json({ success: true, redirect: dashboard });
            });
        });
    } catch (error) {
        console.error('Error in login:', error);
        res.status(500).json({ error: "Internal server error" });
    }
};

