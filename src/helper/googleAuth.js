const jwt = require('jsonwebtoken');
const db = require('../db/db');

function determineRole(email) {
    if (email === 'republicofengineers.sns@gmail.com') {
        return 2;
    } else {
        return 1;
    }
}

async function handleGoogleCallback(req, res) {
    try {
        const { email, given_name, family_name, picture, id } = req.user;

        // Check if the user already exists in the database
        db.query('SELECT * FROM users WHERE Email = ?', [email], async (error, results) => {
            if (error) {
                throw error;
            }

            if (results.length > 0) {
                // User exists, update their profile and log them in
                const user = results[0];
                db.query(
                    'UPDATE users SET FirstName = ?, LastName = ?, ProfilePictureURL = ?, GoogleUserID = ?, isActive = ?, verified = ?, isDeleted = ?, LastLogin = current_timestamp() WHERE Email = ?',
                    [given_name, family_name, picture, id, true, true, false, email],
                    async (updateError) => {
                        if (updateError) {
                            throw updateError;
                        }

                        // Create JWT token
                        const token = jwt.sign({ email, role_id: user.role_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
                        
                        // Set session token
                        req.session.token = token;
                        
                        // Redirect based on role
                        const dashboard = user.role_id === 1 ? '/user_dashboard' : '/admin_dashboard';
                        res.redirect(dashboard);
                    }
                );
            } else {
                // User does not exist, determine role and create a new user
                const role_id = determineRole(email);

                const newUser = {
                    Email: email,
                    FirstName: given_name,
                    LastName: family_name,
                    ProfilePictureURL: picture,
                    GoogleUserID: id,
                    role_id: role_id,
                    isActive: true,
                    verified: true,
                    isDeleted: false
                };

                // Insert new user into users table
                db.query('INSERT INTO users SET ?', newUser, async (insertError) => {
                    const profileData = {
                        FirstName: given_name,
                        LastName: family_name,
                        Email: email,
                        isActive: true,
                        isDeleted: false
                    };
                    await db.query('INSERT INTO profile SET ?', profileData);

                    // Create JWT token
                    const token = jwt.sign({ email, role_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
                    
                    // Set session token
                    req.session.token = token;
                    
                    // Redirect based on role
                    const dashboard = role_id === 1 ? '/user_dashboard' : '/admin_dashboard';
                    res.redirect(dashboard);
                });
            }
        });
    } catch (error) {
        console.error('Error inserting or updating user data in database:', error);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = {
    handleGoogleCallback
};


// const jwt = require('jsonwebtoken');
// const db = require('../db/db');

// function determineRole(email) {
//     if (email === 'republicofengineers.sns@gmail.com') {
//         return 2; // Admin role
//     } else {
//         return 1; // User role
//     }
// }

// async function handleGoogleCallback(req, res) {
//     try {
//         const { email, given_name, family_name, picture, id } = req.user;

//         // Check if the user exists in the database
//         db.query('SELECT * FROM users WHERE Email = ?', [email], async (error, results) => {
//             if (error) {
//                 throw error;
//             }

//             if (results.length > 0) {
//                 // User exists, update their profile and log them in
//                 const user = results[0];
//                 db.query(
//                     'UPDATE users SET FirstName = ?, LastName = ?, ProfilePictureURL = ?, GoogleUserID = ?, isActive = ?, verified = ?, isDeleted = ?, LastLogin = current_timestamp() WHERE Email = ?',
//                     [given_name, family_name, picture, id, true, true, false, email],
//                     async (updateError) => {
//                         if (updateError) {
//                             throw updateError;
//                         }

//                         // Create JWT token
//                         const token = jwt.sign({ email, role_id: user.role_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
                        
//                         // Set session token
//                         req.session.token = token;
                        
//                         // Redirect based on role
//                         const dashboard = user.role_id === 1 ? '/user_dashboard' : '/admin_dashboard';
//                         res.redirect(dashboard);
//                     }
//                 );
//             } else {
//                 // User does not exist, redirect them to the registration page
//                 // Where they will fill in their details (like password, Pancard, etc.)
//                 res.redirect(`/set_password?email=${email}`);
//             }
//         });
//     } catch (error) {
//         console.error('Error during Google login:', error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// }

// module.exports = {
//     handleGoogleCallback
// };
