const db = require('../../db/db');
const {sendVerificationEmail} = require('../../helper/sendmail');
const jwt = require('jsonwebtoken');

// module.exports.signup = async (req, res) => {
//     const { Email } = req.body;

//     try {
//         db.query('SELECT * FROM users WHERE Email = ? and isActive = ?', [Email,true], async (error, results) => {

//             if (results.length > 0) {
//                 return res.render('user/login', { error: 'Email already exist' })
//             }
//             else {
//                 // If email does not exist, proceed to create verification token
//                 const verification_token = jwt.sign({ email: Email }, process.env.JWT_SECRET, {
//                     expiresIn: '1h'
//                 });

//                 const verificationLink = `http://localhost:3000/verify-email?token=${verification_token}`;

//                 // Send verification email
//                 sendVerificationEmail(Email, verificationLink, verification_token);

//                 // Render success message
//                 return res.render('user/login', { error: `Verification email is sent to ${Email}` });
//             }
//         });

//     } catch (error) {
//         console.error('Error checking existing user or sending verification email:', error);
//         return res.render('user/error500');
//     }
// };


module.exports.signup = async (req, res) => {
    const { Email } = req.body;

    try {
        db.query('SELECT * FROM users WHERE Email = ? and isActive = ?', [Email, true], async (error, results) => {

            if (results.length > 0) {
                // If email already exists, send error message
                return res.json({ success: false, error: 'Email already exists' });
            }
            else {
                // If email does not exist, proceed to create verification token
                const verification_token = jwt.sign({ email: Email }, process.env.JWT_SECRET, {
                    expiresIn: '1h'
                });

                const verificationLink = `http://localhost:3000/verify-email?token=${verification_token}`;

                // Send verification email
                sendVerificationEmail(Email, verificationLink, verification_token);

                // Send success message
                return res.json({ success: true, message: `Verification email is sent to ${Email}` });
            }
        });

    } catch (error) {
        console.error('Error checking existing user or sending verification email:', error);
        return res.json({ success: false, error: 'Internal server error' });
    }
};
