const db = require('../../db/db');  // Import your DB connection or query helper

module.exports.hr_page = async (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    console.log('Query Parametersss:', req.query); // Log the query parameters here
    const { user_email, company_id } = req.query;
    const userEmail = user_email;

    if (!userEmail || !company_id) {
        return res.status(400).send("Missing required data.");
    }

    res.render('user/hr', {
        userEmail: userEmail,
        jobId: company_id
    });
};

module.exports.submithr = (req, res) => {
    const { company_id, user_email, total_score, max_score } = req.body;

    if (!company_id || !user_email || total_score == null || max_score == null) {
        return res.status(400).json({ error: "Company id, User Email, score, and max score are required." });
    }

    // Calculate percentage and determine pass/fail status
    const percentage = (total_score / max_score) * 100;
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
        const checkQuery = 'SELECT * FROM hr_scores WHERE user_id = ? AND company_id = ?';

        db.query(checkQuery, [user_id, company_id], (err, result) => {
            if (err) {
                console.error('Database error during record check:', err);
                return res.status(500).json({ error: "Database error while checking existing record" });
            }

            if (result.length > 0) {
                // Record exists, update the score
                const updateQuery = 'UPDATE hr_scores SET score = ?, max_score = ? WHERE user_id = ? AND company_id = ?';

                db.query(updateQuery, [total_score, max_score, user_id, company_id], (err, result) => {
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
                const insertQuery = 'INSERT INTO hr_scores (user_id, company_id, score, max_score) VALUES (?, ?, ?, ?)';

                db.query(insertQuery, [user_id, company_id, total_score, max_score], (err, result) => {
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
