const fs = require('fs');
const pdfParse = require('pdf-parse');

// Function to escape special characters in skills for use in regex
const escapeRegExp = (string) => {
  return string.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, "\\$&");
};

const parseResumeForSkills = async (resumePath) => {
  try {
    if (!fs.existsSync(resumePath)) {
      throw new Error('File not found');
    }

    const dataBuffer = fs.readFileSync(resumePath);
    const parsedData = await pdfParse(dataBuffer);
    let text = parsedData.text.toLowerCase().trim();  // Normalize to lowercase and trim whitespace

    // Clean up the resume text: remove multiple spaces, newlines, and handle common delimiters
    text = text.replace(/\s+/g, ' ').replace(/\n/g, ' ').replace(/\r/g, ''); // Collapse spaces and newlines
    text = text.replace(/[^a-zA-Z0-9\s\+\-:]/g, '');  // Remove most punctuation except +, -, and :
    
    // List of skills to match (could be moved to a config file or database)
    const skills = ['C', 'Java', 'Python', 'C++', 'DBMS', 'OS', 'CN'];
    // const skills = ['C'];


    // Use regex to match skills, ensuring they are whole words and not part of other words
    const extractedSkills = skills.filter(skill => {
      const escapedSkill = escapeRegExp(skill.toLowerCase()); // Escape and convert to lowercase
      // Match whole skill words, not partial matches (e.g., 'os' in 'hosting')
      const regex = new RegExp(`\\b${escapedSkill}\\b(?![a-zA-Z])|${escapedSkill}[-:]*`, 'gi'); // Match exact skill with word boundary and not followed by letters
      return regex.test(text);
    });

    return extractedSkills;
  } catch (error) {
    console.error('Error parsing resume:', error.message);
    throw error; // Rethrow to handle upstream if needed
  }
};

module.exports = { parseResumeForSkills };
