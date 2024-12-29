document.addEventListener('DOMContentLoaded', function() {
    const editorContainer = document.getElementById('editor-container');
    const editorTextarea = document.createElement('textarea');
    editorContainer.appendChild(editorTextarea);

    const editor = CodeMirror.fromTextArea(editorTextarea, {
        lineNumbers: true,
        mode: "python",
        theme: "dracula",
        matchBrackets: true,
        extraKeys: {"Ctrl-Space": "autocomplete"}
    });

    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true; // Initially disable the Submit button

    const userEmail = document.getElementById("user_email").getAttribute("data-user-email");
    const jobId = document.getElementById("company_id").getAttribute("data-company-id");

    const questions = [
        {
            title: "Factorial Function",
            problemStatement: "Write a Python function to calculate the factorial of a given number.",
            testCase: {
                input: [0, 1, 5, 7],
                output: [1, 1, 120, 5040],
            }
        }
        // {
        //     title: "Palindrome Check",
        //     problemStatement: "Write a Python function to check if a given string is a palindrome.",
        //     testCase: {
        //         input: ["madam", "hello", "racecar"],
        //         output: [true, false, true],
        //     }
        // },
        // {
        //     title: "Prime Number Check",
        //     problemStatement: "Write a Python function to check if a given number is prime.",
        //     testCase: {
        //         input: [2, 3, 4, 17],
        //         output: [true, true, false, true],
        //     }
        // }
    ];

    const questionTitleElement = document.getElementById('question-title');
    const questionTextElement = document.getElementById('question-text');

    async function loadRandomQuestion() {
        const randomQuestion = questions[Math.floor(Math.random() * questions.length)];

        questionTitleElement.textContent = randomQuestion.title;
        questionTextElement.innerHTML = randomQuestion.problemStatement;

        questionTextElement.innerHTML += `<br><h3>Example Input:</h3>${randomQuestion.testCase.input.join(', ')}`;
        questionTextElement.innerHTML += `<br><h3>Expected Output:</h3>${randomQuestion.testCase.output.join(', ')}`;

        editor.setValue(`
def solve_problem(*args):
    # Replace this with the problem-specific logic
    pass
        `);

        editorContainer.dataset.selectedQuestion = JSON.stringify(randomQuestion);
    }

    loadRandomQuestion();

    async function runCode() {
        const spinner = document.getElementById('spinner');
        const outputElement = document.getElementById('output');
        const code = editor.getValue();
        const selectedQuestion = JSON.parse(editorContainer.dataset.selectedQuestion);

        spinner.style.display = 'inline-block';
        outputElement.textContent = '';
        submitBtn.disabled = true; // Disable the submit button during code execution

        try {
            const response = await fetch('/compile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: code,
                    testCases: selectedQuestion.testCase.input,
                    expectedOutput: selectedQuestion.testCase.output,
                }),
            });

            const result = await response.json();
            console.log(result); 
            if (result.success) {
                outputElement.textContent = 'All test cases passed!';
                submitBtn.disabled = false; // Enable the submit button
            } else {
                outputElement.textContent = `Some test cases failed:\n${JSON.stringify(result.errors, null, 2)}`;
                // submitBtn.disabled = false; // Enable the submit button
            }
        } catch (error) {
            console.log(error);
            outputElement.textContent = 'Error: Unable to contact the server.';
        } finally {
            spinner.style.display = 'none';
        }
    }

    async function handleSubmit() {
        const queryParams = new URLSearchParams({
            user_email: userEmail,
            company_id: jobId,
        }).toString();

        window.location.href = `/hr?${queryParams}`;
    }

    const runBtn = document.getElementById('runBtn');
    runBtn.addEventListener('click', runCode);

    submitBtn.addEventListener('click', handleSubmit); // Handle Submit button click
});
