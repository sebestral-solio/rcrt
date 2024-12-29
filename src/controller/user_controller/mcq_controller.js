const db = require('../../db/db'); 

module.exports.mcq_page = async (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    console.log('Query Parametersss:', req.query); // Log the query parameters here
    const { id, company_name, skills, role, ctc } = req.query;
    const userEmail = req.user.email;

    if (!id || !company_name || !skills || !role || !ctc) {
        return res.status(400).send("Missing required data.");
    }

    res.render('user/mcq', {
        userEmail: userEmail,
        jobId: id,
        companyName: company_name,
        requiredSkills: skills,
        jobRole: role,
        ctcOffering: ctc
    });
};

module.exports.submitMCQ = (req, res) => {
    const { user_email, company_id, score, max_score } = req.body;
    console.log("mcq body:", req.body);

    if (!user_email || score == null || max_score == null) {
        return res.status(400).json({ error: "User Email, score, and max score are required." });
    }

    // Calculate percentage and determine pass/fail status
    const percentage = (score / max_score) * 100;
    const passed = percentage >= 70;
    const status = passed ? 'passed' : 'failed';

    // Query to get the user_id from the email
    const getUserIdQuery = 'SELECT UserID FROM users WHERE Email = ?';

    db.query(getUserIdQuery, [user_email], (err, result) => {
        if (err) {
            console.error('Database error during user_id retrieval:', err);
            return res.status(500).json({ error: "Database error while retrieving user_id" });
        }

        if (result.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const user_id = result[0].UserID;

        // Check if a record with the same user_id and company_id exists
        const checkQuery = 'SELECT * FROM mcq_scores WHERE user_id = ? AND company_id = ?';

        db.query(checkQuery, [user_id, company_id], (err, result) => {
            if (err) {
                console.error('Database error during record check:', err);
                return res.status(500).json({ error: "Database error while checking existing record" });
            }

            if (result.length > 0) {
                // Record exists, update the score
                const updateQuery = 'UPDATE mcq_scores SET score = ?, max_score = ? WHERE user_id = ? AND company_id = ?';

                db.query(updateQuery, [score, max_score, user_id, company_id], (err, result) => {
                    if (err) {
                        console.error('Database error during score update:', err);
                        return res.status(500).json({ error: "Database error while updating score" });
                    }

                    return res.json({
                        status,
                        passed,
                        percentage,
                        message: "Score updated successfully"
                    });
                });
            } else {
                // Record does not exist, insert new record
                const insertQuery = 'INSERT INTO mcq_scores (user_id, company_id, score, max_score) VALUES (?, ?, ?, ?)';

                db.query(insertQuery, [user_id, company_id, score, max_score], (err, result) => {
                    if (err) {
                        console.error('Database error during MCQ submission:', err);
                        return res.status(500).json({ error: "Database error while inserting score" });
                    }

                    return res.json({
                        status,
                        passed,
                        percentage,
                        message: "Score inserted successfully"
                    });
                });
            }
        });
    });
};






