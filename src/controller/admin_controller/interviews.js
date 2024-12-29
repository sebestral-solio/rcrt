const db = require('../../db/db');
const jwt = require('jsonwebtoken');

module.exports.interviews_page = async (req, res) => {
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
        const token = req.session.token;

        if (!token) {
            return res.redirect('/user_dashboard'); // Redirect if not authenticated
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const role_id = decoded.role_id;

        if (role_id !== 2) { // Redirect if not admin (assuming role_id 2 is for admin)
            return res.redirect('/');
        }

      db.query('SELECT id, company_name, job_role, skills, ctc_offering, DATE_FORMAT(created_at, "%d-%m-%Y %H:%i:%s") AS created_at  FROM job_listings', (error, results) => {
        res.render('admin/interviews', { users: results});    
      })

        
    } catch (error) {
        console.error('Error retrieving users data:', error);
        return res.render('user/error500');
    }
};

module.exports.delete_interview = async (req, res) => {
    const  id  = req.body.id; // Destructure id directly from req.body
    console.log(id);

    if (!id) {
        return res.status(400).json({ error: 'id is required' });
    }

    try {
        await db.query('DELETE FROM job_listings WHERE id = ?', [id], (error, results) => {
            if (error) {
                console.error('Error deleting interview:', error);
                return res.render('user/error500');
            }
            // Redirect to the interviews page after successful deletion
            res.redirect('/interviews');
        });
    } catch (error) {
        console.error('Error deleting interview:', error);
        return res.render('user/error500');
    }
};

