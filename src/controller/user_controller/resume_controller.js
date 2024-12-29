const path = require('path');
const fs = require('fs');
const { updateResumeInProfile, getJobSkills } = require('../models/profileModel');
const { parseResumeForSkills } = require('../../helper/parseResume');

const uploadResume = async (req, res) => {
  try {
    const { email } = req.user; // From JWT middleware
    const originalFilename = req.file.filename; // Original filename from multer
    const originalPath = req.file.path; // Path where the file is stored

    // Construct the new filename
    const newFilename = `${email}-Resume.pdf`; // Ensure consistent extension
    const newPath = path.join(path.dirname(originalPath), newFilename);

    // Rename the file
    fs.renameSync(originalPath, newPath);

    // Update the database with the new resume path
    await updateResumeInProfile(email, newFilename);

    res.status(200).json({ success: true, message: 'Resume uploaded successfully' });
  } catch (error) {
    console.error('Error uploading and renaming resume:', error);
    res.status(500).json({ success: false, message: 'Failed to upload resume' });
  }
};


const parseResume = async (req, res) => {
  try {
    const { email } = req.user; // From JWT middleware
    const resumeName = `${email}-Resume.pdf`; // Construct the expected file name
    const resumePath = path.join(__dirname, '../../../public/uploads/Resumes', resumeName);

    // Check if the file exists
    if (!fs.existsSync(resumePath)) {
      return res.status(404).json({ success: false, message: 'Resume not found. Please upload it first.' });
    }

    // Get jobId from the body (or query params if needed)
    const jobId = req.body.jobId;
    if (!jobId) {
      return res.status(400).json({ success: false, message: 'Job ID is missing in the request.' });
    }

    // Parse skills from resume
    const extractedSkills = await parseResumeForSkills(resumePath);

    // Get job skills based on jobId
    const jobSkills = await getJobSkills(jobId);

    // Normalize and remove duplicates from both job skills and extracted skills
    const normalizedJobSkills = [...new Set(jobSkills.map(skill => skill.toLowerCase()))];
    const normalizedExtractedSkills = [...new Set(extractedSkills.map(skill => skill.toLowerCase()))];
    console.log("job:" ,normalizedJobSkills)
    console.log("resume:" ,normalizedExtractedSkills)

    // Calculate the intersection of the two sets (common skills)
    const matchingSkills = normalizedExtractedSkills.filter(skill => normalizedJobSkills.includes(skill));
    console.log("matching:" ,matchingSkills)

    // Calculate match percentage based on the intersection
    const matchingPercentage = (matchingSkills.length / normalizedJobSkills.length) * 100;
    console.log("percent:" ,matchingPercentage)

    res.json({
      success: true,
      skills: extractedSkills,
      normalizedJobSkills,
      matchingSkills,
      matchPercentage: matchingPercentage,
    });
  } catch (error) {
    console.error('Error parsing resume:', error);
    res.status(500).json({ success: false, message: 'Failed to parse resume.' });
  }
};





module.exports = { uploadResume, parseResume };
