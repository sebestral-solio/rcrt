const jwt = require('jsonwebtoken');
const db = require('../../db/db');

require('dotenv').config();

module.exports.dashboard_page = async (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    console.log('Session details in user page: ', req.session);
    if (!req.session.token) {
        console.log('No token found in session');
        return res.redirect('/');
    }
    try {
        const decodedToken = jwt.verify(req.session.token, process.env.JWT_SECRET);
        console.log('Decoded token:', decodedToken);
        const email = req.user.email;

        await db.query(`SELECT FirstName,LastName FROM users Where Email = ?`, [email], function (error, results, fields){
            if (error) {
                console.error('Error fetching dashboard:', error);
                return res.status(500).json({ error: "Internal server error" });
            }
    
            if (results.length > 0) {
                res.render('user/user_dashboard', { user: results[0] });
            } else {
                res.status(404).render('user/error404');
            }
        })
    } catch (error) {
        console.error('JWT verification error:', error);
        req.session.login_message = 'Unauthorized';
        return res.redirect('/');
    }
};
