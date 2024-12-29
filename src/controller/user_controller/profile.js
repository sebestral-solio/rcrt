const db = require('../../db/db');

module.exports.profile_page = async (req, res) => {
    // Set headers to prevent caching
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    console.log('Session details in user page: ', req.session);
    if (!req.session.token) {
        console.log('No token found in session');
        return res.redirect('/');
    }
    try {

        const email = req.user.email;
    
       await db.query(`SELECT FirstName, LastName, Email, Phone, DATE_FORMAT(DOB, '%d/%m/%Y') as DOB, Gender, State, City, Pincode FROM profile WHERE Email = ?`, [email], function (error, results, fields) {
            if (error) {
                console.error('Error fetching profile:', error);
                return res.status(500).json({ error: "Internal server error" });
            }
    
            if (results.length > 0) {
                res.render('user/profile', { user: results[0] });
            } else {
                res.status(404).render('user/error404');
            }
        });
    } catch (error) {
        console.error('Error fetching profile:', error);
        return res.render('user/error500');
    }
}

module.exports.profile = async (req, res) => {
    try {

        const email = req.user.email;
        const {
            FirstName = null,
            LastName = null,
            Phone = null,
            DOB = null,
            Gender = null,
            State = null,
            City = null,
            Pincode = null
        } = req.body;
        
        await db.query('UPDATE profile SET FirstName = ?, LastName = ?, Phone = ?, DOB = ?, Gender = ?, State = ?, City = ?, Pincode =? WHERE Email = ?', [FirstName, LastName, Phone, DOB, Gender, State, City, Pincode, email]);
        return res.redirect('/profile');

    } catch (error) {
        console.error('Error editing profile:', error);
        return res.render('user/error500');
    }
}
