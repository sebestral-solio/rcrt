// profileModel.js
const db = require('../../db/db');

// Update resume path in the profile table
const updateResumeInProfile = (email, resumePath) => {
  return new Promise((resolve, reject) => {
    const query = 'UPDATE profile SET Resume = ? WHERE Email = ?';
    db.query(query, [resumePath, email], (err, result) => {
      if (err) {
        console.error('Error in updateResumeInProfile:', err);
        return reject(err);
      }
      resolve(result);
    });
  });
};

const getJobSkills = (jobId) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT skills FROM job_listings WHERE id = ?';
    console.log('Executing query:', query, 'with jobId:', jobId);  // Log the query and jobId
    db.query(query, [jobId], (err, rows) => {
      if (err) {
        console.error('Error in getJobSkills:', err);
        return reject(err);
      }
      console.log('Database Query Result:', rows);  // Log the result to see what's being returned
      const skills = rows[0]?.skills ? rows[0].skills.split(',') : [];
      resolve(skills);
    });
  });
};




module.exports = { updateResumeInProfile, getJobSkills };
