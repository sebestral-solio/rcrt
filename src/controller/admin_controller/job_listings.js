const db = require('../../db/db');
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports.job_listings_page = (req, res) => {
    // Set headers to prevent caching
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    // Check if admin session exists and has a token
    if (!req.session.token) {
        return res.redirect('/');
    }

    // Verify the JWT token and get role_id
    try {
        const decodedToken = jwt.verify(req.session.token, process.env.JWT_SECRET);
        const roleId = decodedToken.role_id;

        // Render the appropriate dashboard based on role
        if (roleId === 2) {
            res.render('admin/job_listings'); // job listings dashboard
        } else {
            res.status(403).send('Unauthorized'); // Handle unauthorized access
        }
    } catch (error) {
        console.error('JWT verification error:', error);
        req.session.login_message = 'Unauthorized';
        return res.redirect('/');
    }
};

module.exports.upload_job_page = (req, res) => {
    // Set headers to prevent caching
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    // Check if admin session exists and has a token
    if (!req.session.token) {
        return res.redirect('/');
    }

    // Verify the JWT token and get role_id
    try {
        const decodedToken = jwt.verify(req.session.token, process.env.JWT_SECRET);
        const roleId = decodedToken.role_id;

        // Render the appropriate dashboard based on role
        if (roleId === 2) {
            res.render('admin/upload_job'); // job listings dashboard
        } else {
            res.status(403).send('Unauthorized'); // Handle unauthorized access
        }
    } catch (error) {
        console.error('JWT verification error:', error);
        req.session.login_message = 'Unauthorized';
        return res.redirect('/');
    }
};

module.exports.upload_job = async (req, res) => {
    // const { company_name, job_role, skills, ctc_offering } = req.body;
    const company_name = req.body.company_name;
    const job_role = req.body.job_role;
    const skills = req.body.skills;
     const ctc_offering = req.body.ctc_offering;
     
    // Validate the input fields
    if (!company_name || !job_role || !skills || !ctc_offering) {
        return res.status(400).send('All fields are required.');
    }

    try {
        // SQL query to insert job listing into database
        const query = 'INSERT INTO job_listings (company_name, job_role, skills, ctc_offering) VALUES (?, ?, ?, ?)';
        await db.query(query, [company_name, job_role, skills, ctc_offering]);

        // Redirect or render a success page
        res.redirect('/job_listings');
    } catch (error) {
        console.error('Error uploading job:', error);
        res.status(500).send('An error occurred while uploading the job.');
    }
};
