let editor;

require.config({ paths: { vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.0/min/vs" } });
require(["vs/editor/editor.main"], () => {
  editor = monaco.editor.create(document.getElementById("editor-container"), {
    value: "",
    language: "python",
    theme: "vs-dark",
  });
});


// Fetch questions and populate dropdown
async function loadRandomQuestion() {
  try {
    const response = await fetch("/random-question"); // Fetch random question from the backend
    const data = await response.json();

    if (data.success) {
      const question = data.question;

      // Populate the question details dynamically
      document.getElementById("question-title").textContent = question.question;
      document.getElementById("question-text").textContent = `Description: ${question.details.hints.join(", ")}`;
      document.getElementById("difficulty").textContent = `Difficulty: ${question.details.difficulty}`;

      // Display the hints in a list
      const hintsList = document.getElementById("hints");
      hintsList.innerHTML = ''; // Clear any previous hints
      question.details.hints.forEach((hint) => {
        const li = document.createElement("li");
        li.textContent = hint;
        hintsList.appendChild(li);
      });
    } else {
      console.error("Failed to load question data.");
    }
  } catch (error) {
    console.error("Error fetching question:", error);
  }
}


// Handle running hidden test cases with more detailed reporting
document.getElementById("run-testcases").addEventListener("click", async () => {
  const code = editor.getValue();
  const language = document.getElementById("language-select").value;
  const output = document.getElementById("output");

  try {
    const response = await fetch("/run-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ language, code, type: "hidden" }),
    });

    const result = await response.json();

    if (result.success) {
      // More detailed test case reporting
      const testResults = result.results.map((test, index) => {
        const status = test.passed ? "✅ PASSED" : "❌ FAILED";
        return `Test Case ${index + 1}:
  Input: ${test.input}
  Expected: ${test.expected}
  Actual: ${test.actual || 'N/A'}
  Status: ${status}
`;
      }).join("\n---\n");

      // Calculate overall test success
      const passedTests = result.results.filter(test => test.passed).length;
      const totalTests = result.results.length;
      
      // Include question details in the output
      output.textContent = `Question: ${result.questionDetails.question}
Difficulty: ${result.questionDetails.difficulty}

Test Results (${passedTests}/${totalTests} Passed):\n\n${testResults}`;
    } else {
      output.textContent = `Error: ${result.error}`;
    }
  } catch (error) {
    output.textContent = `Network or unexpected error: ${error.message}`;
  }
});
 

// Handle running custom inputs
document.getElementById("run-custom").addEventListener("click", async () => {
  const code = editor.getValue();
  const language = document.getElementById("language-select").value;
  const input = document.getElementById("custom-input").value;

  const response = await fetch("/run-code", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ language, code, input, type: "custom" }),
  });

  const result = await response.json();
  const output = document.getElementById("output");
  output.textContent = result.success ? result.output : result.error;
});

document.getElementById("language-select").addEventListener("change", (e) => {
  monaco.editor.setModelLanguage(editor.getModel(), e.target.value);
});


loadRandomQuestion();
