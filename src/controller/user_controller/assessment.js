module.exports.assessment_page = async (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    console.log('Query Parametersss:', req.query); // Log the query parameters here
    const { company_name, skills, role, ctc } = req.query;
    const user_email = req.user.email;

    if (!company_name || !skills || !role || !ctc) {
        return res.status(400).send("Missing required data.");
    }

    res.render('user/assessment', {
        user_email: user_email,
        companyName: company_name,
        requiredSkills: skills,
        jobRole: role,
        ctcOffering: ctc
    });
};
