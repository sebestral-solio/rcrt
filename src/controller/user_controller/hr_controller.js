const db = require('../../db/db');
const { PythonShell } = require('python-shell');
const levenshtein = require('fast-levenshtein');

// Initialize the final score
let finalScore = 0;
const natural = require('natural');
const stopwords = require('stopword'); // Use stopword library for stopword removal

module.exports.hr_page = async (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    console.log('Query Parameters:', req.query);
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

// Initialize the WordNet lemmatizer
const lemmatizer = new natural.WordNet();

// Function to remove stopwords from a text
const removeStopwords = (text) => {
    const words = text.toLowerCase().split(/\W+/);
    return stopwords.removeStopwords(words); // Use the removeStopwords function from the 'stopword' library
};

// Function to lemmatize words in text
const lemmatizeWords = (words, callback) => {
    const lemmatizedWords = [];
    let remaining = words.length;
    words.forEach((word, index) => {
        lemmatizer.lookup(word, (results) => {
            if (results.length > 0) {
                lemmatizedWords[index] = results[0].lemma;
            } else {
                lemmatizedWords[index] = word;
            }
            remaining -= 1;
            if (remaining === 0) {
                callback(lemmatizedWords); // Call the callback when all words are processed
            }
        });
    });
};

const textToVector = (text) => {
    return new Promise((resolve, reject) => {
        const words = removeStopwords(text);
        lemmatizeWords(words, (lemmatizedWords) => {
            if (!lemmatizedWords) {
                reject('Lemmatization failed');
                return;
            }

            const vector = {};
            lemmatizedWords.forEach(word => {
                if (!vector[word]) {
                    vector[word] = 0;
                }
                vector[word]++;
            });
            resolve(vector);
        });
    });
};

const cosineSimilarity = async (str1, str2) => {
    try {
        const vec1 = await textToVector(str1);
        const vec2 = await textToVector(str2);

        const dotProduct = (vec1, vec2) => {
            let product = 0;
            for (const key in vec1) {
                if (vec2[key]) {
                    product += vec1[key] * vec2[key];
                }
            }
            return product;
        };

        const magnitude = (vec) => {
            let sum = 0;
            for (const key in vec) {
                sum += vec[key] ** 2;
            }
            return Math.sqrt(sum);
        };

        const numerator = dotProduct(vec1, vec2);
        const denominator = magnitude(vec1) * magnitude(vec2);

        if (denominator === 0) {
            return 0;
        }

        return numerator / denominator;
    } catch (error) {
        console.error('Cosine similarity error:', error);
        return 0; // Return 0 if there's an error (like failed lemmatization or text vectorization)
    }
};

// In your submithr function, handle the case where the score might be NaN
module.exports.submithr = async (req, res) => {
    const { company_id, user_email, user_answer, correct_answer, question_index, final_score } = req.body;

    console.log("user answer:", user_answer);
    console.log("correct answer:", correct_answer);
    console.log("question index:", question_index);
    console.log("company id:", company_id);
    console.log("user email:", user_email);

    if (!company_id || !user_email || !user_answer || !correct_answer || !question_index) {
        return res.status(400).json({ error: "Invalid data." });
    }

    try {
        // Calculate the cosine score
        const cosineScore = await cosineSimilarity(user_answer, correct_answer) * 100;

        const levenshteinDistance = levenshtein.get(user_answer, correct_answer);
        const levenshteinScore = (1 - levenshteinDistance / Math.max(user_answer.length, correct_answer.length)) * 100;

        // Calculate the total score for the current question
        const questionScore = (cosineScore + levenshteinScore)/2;

        if (isNaN(questionScore)) {
            return res.status(400).json({ error: "Invalid score calculation." });
        }

        console.log("cosine score:", cosineScore);
        console.log("levenshtein score:", levenshteinScore);
        console.log("question score:", questionScore);

        // Accumulate the question score into finalScore
        // finalScore += questionScore;
           finalScore += questionScore;


        console.log("final score:", finalScore);

        // If this is the last question, save the final score to DB
        if (question_index === 5) {
            const savedScore = await saveFinalScore(company_id, user_email, finalScore, question_index, res);
            return savedScore;
        }

        // Otherwise, return the score for the current question
        return res.json({ questionScore, message: "Score calculated successfully." });

    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ error: "Internal server error." });
    }
};


async function saveFinalScore(company_id, user_email, final_score, question_index, res) {
    try {
           // Calculate percentage and determine pass/fail status
        const max_score = 100;
        const percentage = (final_score / max_score) * 100;
        const passed = percentage >= 70;
        const status = passed ? 'passed' : 'failed';

        // Query to get the user_id from the email
        const getUserIdQuery = 'SELECT UserID FROM users WHERE Email = ?';
        const total_score = final_score/question_index;
        
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
                            message: "Score inserted successfully"
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
    } catch (error) {
        console.error("Error saving final score:", error);
        return res.status(500).json({ error: "Failed to save final score: " + error.message });
    }
}

