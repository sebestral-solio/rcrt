
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

module.exports.coding_page = async (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    console.log('Query Parameters:', req.query);
    const { user_email, company_id } = req.query;
    const userEmail = user_email;

    // if (!userEmail || !company_id) {
    //     return res.status(400).send("Missing required data.");
    // }

    res.render('user/coding', {
        userEmail: userEmail,
        jobId: company_id
    });
};

module.exports.compileCode = async (req, res) => {
    try {
        const { code, testCases, expectedOutput } = req.body;

        if (!code || !testCases || !expectedOutput) {
            return res.status(400).json({ success: false, error: "Invalid request data" });
        }

        // Create a temporary file for the user's code
        const tempFilePath = path.join(__dirname, '..', '..', '..', '..', 'temp_user_code.py');

        const testHarness = `
if __name__ == "__main__":
    import json
    test_cases = ${JSON.stringify(testCases)}
    results = []
    for test_case in test_cases:
        try:
            result = solve_problem(*test_case if isinstance(test_case, list) else [test_case])
            results.append(result)
        except Exception as e:
            results.append(f"Error: {str(e)}")
    print(json.dumps(results))
        `;

        // Write the user's code + test harness to the temp file
        fs.writeFileSync(tempFilePath, `${code}\n\n${testHarness}`);

        // Run the Python file using spawn for better control
        const pythonProcess = spawn('python', [tempFilePath]);

        let stdoutData = '';
        let stderrData = '';

        pythonProcess.stdout.on('data', (data) => {
            stdoutData += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            stderrData += data.toString();
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                return res.status(500).json({
                    success: false,
                    error: stderrData || "Unknown error during Python execution",
                });
            }

            try {
                const userOutput = JSON.parse(stdoutData.trim());
                const errors = [];

                // Compare user output with expected output
                for (let i = 0; i < expectedOutput.length; i++) {
                    if (userOutput[i] !== expectedOutput[i]) {
                        errors.push({
                            test_case: testCases[i],
                            expected: expectedOutput[i],
                            received: userOutput[i],
                        });
                    }
                }

                if (errors.length > 0) {
                    return res.status(200).json({
                        success: false,
                        errors,
                    });
                }

                // If all tests passed
                return res.status(200).json({
                    success: true,
                    results: userOutput,
                });
            } catch (parseError) {
                return res.status(500).json({
                    success: false,
                    error: "Error parsing output from Python script",
                });
            } finally {
                // Clean up temporary file (important for security)
                fs.unlink(tempFilePath, (err) => {
                    if (err) {
                        console.error('Error deleting temp file:', err);
                    }
                });
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

// module.exports.compileCode = async (req, res) => {
//     try {
//         const { code, testCases, expectedOutput } = req.body;

//         if (!code || !testCases || !expectedOutput) {
//             return res.status(400).json({ success: false, error: "Invalid request data" });
//         }

//         // Create a temporary file for the user's code
//         const tempFilePath = path.join(__dirname, '..', '..','..','..', 'temp_user_code.py');
//         const safeTempFilePath = `"${tempFilePath}"`;
//         const testHarness = `
        
// if __name__ == "__main__":
//     import json
//     test_cases = ${JSON.stringify(testCases)}
//     results = []
//     for test_case in test_cases:
//         try:
//             result = solve_problem(*test_case if isinstance(test_case, list) else [test_case])
//             results.append(result)
//         except Exception as e:
//             results.append(f"Error: {str(e)}")
//     print(json.dumps(results))
//         `;

//         // Write the user's code + test harness to the temp file
//         fs.writeFileSync(safeTempFilePath, `${code}\n\n${testHarness}`);

//         // Run the Python file
//         exec(`python ${safeTempFilePath}`, (error, stdout, stderr) => {
//             if (error || stderr) {
//                 return res.status(500).json({
//                     success: false,
//                     error: stderr || error.message,
//                 });
//             }

//             try {
//                 const userOutput = JSON.parse(stdout.trim());
//                 const errors = [];

//                 // Compare user output with expected output
//                 for (let i = 0; i < expectedOutput.length; i++) {
//                     if (userOutput[i] !== expectedOutput[i]) {
//                         errors.push({
//                             test_case: testCases[i],
//                             expected: expectedOutput[i],
//                             received: userOutput[i],
//                         });
//                     }
//                 }

//                 if (errors.length > 0) {
//                     return res.status(200).json({
//                         success: false,
//                         errors,
//                     });
//                 }

//                 // If all tests passed
//                 return res.status(200).json({
//                     success: true,
//                     results: userOutput,
//                 });
//             } catch (parseError) {
//                 return res.status(500).json({
//                     success: false,
//                     error: "Error parsing output from Python script",
//                 });
//             }
//         });
//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             error: error.message,
//         });
//     }
// };
