const db = require('../../db/db');

module.exports.user_job_listings_page = async (req, res) => {
    // Set headers to prevent caching
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    console.log('Session details in job listings page: ', req.session);

    // Check if session token exists
    if (!req.session.token) {
        console.log('No token found in session');
        return res.redirect('/');
    }

    try {
        // Fetch all job listings from the database
        await db.query(`SELECT id, company_name, job_role, skills, ctc_offering, 
                        DATE_FORMAT(created_at, '%d/%m/%Y') as created_at 
                        FROM job_listings ORDER BY created_at DESC`, 
            function (error, results) {
                if (error) {
                    console.error('Error fetching job listings:', error);
                    return res.status(500).render('user/error500');
                }

                if (results.length > 0) {
                    // Pass the job listings to the view
                    res.render('user/user_job_listings', { jobs: results });
                } else {
                    // No jobs found, render with an empty list
                    res.render('user/user_job_listings', { jobs: [] });
                }
            }
        );
    } catch (error) {
        console.error('Error fetching job listings:', error);
        return res.render('user/error500');
    }
};
