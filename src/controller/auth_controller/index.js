const db = require('../../db/db');

module.exports.index_page = (req, res) => {
    // Set headers to prevent caching
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    console.log('Session details in user page: ', req.session);
    // Check if user session exists and has a token
    if (req.session.token) {
        console.log('No token found in session');
        return res.redirect('/user_dashboard');
    }
    else{
        res.render('user/index', {error:''})
    }
}

// module.exports.index_page = async (req, res) => {
//     res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
//     res.setHeader('Pragma', 'no-cache');
//     res.setHeader('Expires', '0');

//     res.render('user/index', {error:''})
// }

module.exports.news_letter = async (req, res) => {
    const email = req.body.Email; 

    try {
        const existingUser = await db.query('SELECT * FROM news_letter WHERE Email = ?', [email]);
        
        if (existingUser.length > 0) {
            return res.render('user/index', { error: 'Email is already subscribed to the newsletter' });
        }

        db.query('INSERT INTO news_letter (Email) VALUES (?)', [email])
            res.render('user/index', { error: 'Successfully joined our News Letter' });
        
    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
}

module.exports.feedback = async (req, res) => {
    const name = req.body.fname; 
    const email = req.body.email; 
    const subject = req.body.subject; 
    const message = req.body.message; 

    try {
        await db.query('INSERT INTO feedback (name, email, subject, message) VALUES (?, ?, ?, ?)', [name, email, subject, message]);
        res.render('user/index', { error: 'Feedback Submitted Successfully' });
    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
}