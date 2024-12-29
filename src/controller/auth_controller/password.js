const db = require('../../db/db');
const { sendVerificationEmail, sendVerificationEmailForgot } = require('../../helper/sendmail');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 
require('dotenv').config();

module.exports.forgot_page = async (req, res) => {
    try {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');

        res.render('password/forgot');
    } catch (error) {
        console.error('Error rendering forgot password page:', error);
        return res.render('user/error500');
    }
};

module.exports.forgot = async (req, res) => {
    const { Email } = req.body;

    try {
        db.query('SELECT * FROM users WHERE Email = ? and isActive = ?', [Email,true], async (error, results) => {

            if (results.length === 0) {
                return res.render('user/index', { error: 'Email does not exist' })
            }
            else {
                // If email does not exist, proceed to create verification token
                const verification_token = jwt.sign({ email: Email }, process.env.JWT_SECRET, {
                    expiresIn: '1h'
                });

                const verificationLink = `http://localhost:3000/new_password?token=${verification_token}`;

                // Send verification email
                sendVerificationEmail(Email, verificationLink, verification_token);

                // Render success message
                return res.render('user/index', { error: `Verification email is sent to ${Email}` });
            }
        });
    } catch (error) {
        console.error('Error sending forgot password email:', error);
        return res.render('user/error500');
    }
};

module.exports.forgot_page_change = async (req, res) => {
    try {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');

        res.render('password/forgot_change');
    } catch (error) {
        console.error('Error rendering forgot password page:', error);
        return res.render('user/error500');
    }
};

module.exports.forgot_change = async (req, res) => {
    const { Email } = req.body;

    try {
        // Check if the email exists in the database
        const existingUser = await db.query('SELECT * FROM users WHERE Email = ? and isActive = ?', [Email,true]);

        if (!existingUser) {
            // If no user found with the provided email, render an error message
            return res.render('user/index', { error: 'Email does not exist!' });
        }

        // Generate a JWT token for verification link
        const verification_token = jwt.sign({ email: Email }, process.env.JWT_SECRET, {
            expiresIn: '1h' // Adjust as per your requirements
        });

        // Construct verification link
        const verificationLink = `http://localhost:3000/new_password_change?token=${verification_token}`;

        // Send verification email
        sendVerificationEmailForgot(Email, verificationLink, verification_token); // Assuming this function sends the email

        // Render success message to the user
        return res.render('user/index', { error: `Verification email is sent to ${Email}` });
    } catch (error) {
        console.error('Error sending forgot password email:', error);
        return res.render('user/error500');
    }
};

module.exports.set_password_page = async (req, res) => {
    const { token } = req.query;

    try {
        // Verify the JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const email = decoded.email;

        // Query the database to check if the email and token combination exists
        db.query('SELECT * FROM users WHERE Email = ? AND verification_token = ?', [email, token], (err, results) => {
            if (err || results.length === 0) {
                // Handle case where token or email doesn't match
                return res.render('user/index', { error: 'Invalid Token' });
            }

            // Render the set password page with the email
            res.render('password/set_password', { email });
        });
    } catch (error) {
        // Handle JWT verification errors
        console.error('JWT verification error:', error);
        res.status(400).send('Invalid token');
    }
};

module.exports.set_password = async (req, res) => {
    const { FirstName, LastName, Phone, DOB, Gender, State, City, Pincode, Password, Confirm_Password, email, verification_token } = req.body;

    // Validate file upload
    let PancardImage = null;
    if (req.file) {
        PancardImage = req.file.filename; // Get the file name only
    } else {
        return res.status(400).send('Pancard image is required');
    }

    // Validate passwords
    if (Password !== Confirm_Password) {
        return res.status(400).send('Passwords do not match');
    }

    const hashedPassword = await bcrypt.hash(Password, 10);

    try {
        const role_id = determineRole(email);

        db.query(
            'UPDATE users SET FirstName = ?, LastName = ?, Password = ?, verified = ?, isActive = ?, isDeleted = ?, verification_token = NULL, role_id = ? WHERE Email = ?',
            [FirstName, LastName, hashedPassword, true, true, false, role_id, email],
            async (error, results) => {
                if (error) {
                    console.error('Error updating user details:', error);
                    return res.render('user/error500');
                }

                // Create JWT token
                const token = jwt.sign({ email, role_id }, process.env.JWT_SECRET, { expiresIn: '1h' });

                // Set session token
                req.session.token = token;

                // Insert profile data including the Pancard image name
                await db.query(
                    'INSERT INTO profile (Email, FirstName, LastName, Phone, DOB, Gender, State, City, Pincode, PancardImage, isActive, isDeleted) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    [email, FirstName, LastName, Phone, DOB, Gender, State, City, Pincode, PancardImage, true, false]
                );

                // Render success message
                res.render('user/index', { error: 'Registration was successful' });
            }
        );
    } catch (error) {
        console.error('Error updating user details:', error);
        return res.render('user/error500');
    }
};



// module.exports.set_password = async (req, res) => {
//     const { FirstName, LastName, Phone, DOB, Gender, State, City, Pincode, PancardImage, Confirm_Password, email, verification_token } = req.body;
 
//     if (Password !== Confirm_Password) {
//         return res.status(400).send('Passwords do not match');
//     }

//     const hashedPassword = await bcrypt.hash(Password, 10);

//     try {
//         const role_id = determineRole(email); 


//         db.query('UPDATE users SET FirstName = ?, LastName = ?, Password = ?, verified = ?, isActive = ?, isDeleted = ?, verification_token = NULL, role_id = ? WHERE Email = ?',
//             [FirstName, LastName, hashedPassword, true, true, false, role_id, email],
//             async (error, results) => {
//                 if (error) {
//                     console.error('Error updating user details:', error);
//                     return res.render('user/error500');
//                 }

//                 // Create JWT token
//                 const token = jwt.sign({ email, role_id }, process.env.JWT_SECRET, { expiresIn: '1h' });

//                 // Set session token
//                 req.session.token = token;

//                 // Insert profile data if required
//                 await db.query('INSERT INTO profile (Email, FirstName, LastName, Phone, DOB, Gender, State, City, Pincode, PancardImage, isActive, isDeleted) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [email, FirstName, LastName, Phone, DOB, Gender, State, City, Pincode, PancardImage, true, false]);

//                 // Redirect based on role
//                 // const dashboard = role_id === 1 ? '/user_dashboard' : '/admin_dashboard';
//                 // res.redirect(dashboard);
//                 res.render('user/index',{error: 'Registration was successful'})
//             }
//         );
//     } catch (error) {
//         console.error('Error updating user details:', error);
//         return res.render('user/error500');
//     }
// }


function determineRole(email) {
    
    if (email === 'republicofengineers.sns@gmail.com') {
        return 2;
    } else {
        return 1;
    }
}

module.exports.cancel_signin = async (req, res) => {
    if (req.user.role_id === 1) { 
        return res.redirect('/user_dashboard');
    } else if (req.user.role_id === 2) { 
        return res.redirect('/admin_dashboard');
    } else {
        req.session.login_message = 'Unauthorized';
        return res.redirect('/');
    }
}

module.exports.new_password_page = async (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    const { token } = req.query;

    try {
        // Verify the JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const email = decoded.email;

        // Query the database to check if the email and token combination exists
        db.query('SELECT * FROM users WHERE Email = ? AND verification_token = ? and isActive =?', [email, token, true], (err, results) => {
            if (err || results.length === 0) {
                // Handle case where token or email doesn't match
                return res.render('index', { error: 'Invalid Token' });
            }

            // Render the set password page with the email
            res.render('password/new_password', { email: email, resetPasswordToken: token });
        });
    } catch (error) {
        // Handle JWT verification errors
        console.error('JWT verification error:', error);
        res.status(400).send('Invalid token');
    }
}

module.exports.new_password_page_change = async (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    const { token } = req.query;

    try {
        // Verify the JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const email = decoded.email;

        // Query the database to check if the email and token combination exists
        db.query('SELECT * FROM users WHERE Email = ? AND verification_token = ? and isActive =?', [email, token, true], (err, results) => {
            if (err || results.length === 0) {
                // Handle case where token or email doesn't match
                return res.render('index', { error: 'Invalid Token' });
            }

            // Render the set password page with the email
            res.render('password/new_password_change', { email: email, resetPasswordToken: token });
        });
    } catch (error) {
        // Handle JWT verification errors
        console.error('JWT verification error:', error);
        res.status(400).send('Invalid token');
    }
}

module.exports.new_password = async (req, res) => {
    
    console.log(req.body); 
    
    const { resetPasswordToken, Password } = req.body;

    try {
      
        // Check if resetPasswordToken exists
        if (!resetPasswordToken) {
            return res.status(400).json({ error: "Reset password token is required" });
        }
        
        // Verify the reset password token
        const decoded = jwt.verify(resetPasswordToken, process.env.JWT_SECRET);
        const email = decoded.email;

        // Hash the new password
        const hashedPassword = await bcrypt.hash(Password, 10);

        // Update the user's password in the database
        await db.query('UPDATE users SET Password = ? WHERE Email = ? and isActive = ?', [hashedPassword, email, true]);

        // Clear the session token (if you set it)
        req.session.token = null;

        // Render the index page with a success message
        return res.render('user/index', { error: 'Password changed successfully' });

    } catch (error) {
        console.error('Error setting new password:', error);
        return res.render('user/error500');
    }
};

module.exports.new_password_change = async (req, res) => {
    console.log(req.body); 
    
    const { resetPasswordToken, Password } = req.body;

    try {
        // Check if resetPasswordToken exists
        if (!resetPasswordToken) {
            return res.status(400).json({ error: "Reset password token is required" });
        }
        
        // Verify the reset password token
        const decoded = jwt.verify(resetPasswordToken, process.env.JWT_SECRET);
        const email = decoded.email;

        // Hash the new password
        const hashedPassword = await bcrypt.hash(Password, 10);

        // Update the user's password in the database
        await db.query('UPDATE users SET Password = ? WHERE Email = ? and isActive = ?', [hashedPassword, email, true]);

        // Clear the session token (if you set it)
        req.session.token = null;

        // Render the index page with a success message
        return res.render('user/index', { error: 'Password changed successfully' });

    } catch (error) {
        console.error('Error setting new password:', error);
        return res.render('user/error500');
    }
};


