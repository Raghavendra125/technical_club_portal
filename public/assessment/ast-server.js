const express = require("express");
const bodyParser = require("body-parser");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const questions = require("./questions.js");
//const { executeCode } = require("./executeCode"); 

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(__dirname));
//app.use(express.static(path.join(__dirname, "public")));

// Supported languages and their file extensions
const fileExtensions = {
  python: "py",
  javascript: "js",
  cpp: "cpp",
  c: "c",
  java: "java",
  r: "R",
};


const commands = {
  python: (filename, inputFile) => `python3 ${filename} < ${inputFile}`,
  javascript: (filename, inputFile) => `node ${filename} < ${inputFile}`,
  cpp: (filename, inputFile) => `gcc ${filename} -o program && ./program < ${inputFile}`,
  c: (filename, inputFile) => {
    // Use full paths or multiple potential compiler locations
    const compilers = [
      'gcc',          // Standard Linux/Unix
      'mingw32-gcc',  // Windows MinGW
      'cc',           // Alternative Unix compiler
      'C:\\MinGW\\bin\\gcc.exe',  // Common Windows MinGW location
      'C:\\Program Files\\mingw64\\bin\\gcc.exe' // Another potential Windows location
    ];

    // Try each compiler, return the first successful command
    for (let compiler of compilers) {
      return `${compiler} ${filename} -o program && program < ${inputFile}`;
    }

    throw new Error('No C compiler found');
  },
  java: (filename, inputFile) => {
    // Extract the first public class name from the code
    const classNameMatch = filename.match(/public\s+class\s+(\w+)/);
    const className = classNameMatch ? classNameMatch[1] : 'Main';
    
    // Rename the file to match the class name
    const renamedFilename = `${className}.java`;
    fs.renameSync(filename, renamedFilename);
    
    return `javac ${renamedFilename} && java ${className} < ${inputFile}`;
  },
  
  
  r: (filename, inputFile) => `Rscript ${filename} < ${inputFile}`,
};

// Enhanced error logging
const executeCode = async (language, code, input) => {
  const tempFileName = `temp_${Date.now()}`;
  const inputFile = `${tempFileName}.txt`;
  const fileName = `${tempFileName}.${fileExtensions[language]}`;
  
  return new Promise((resolve, reject) => {
    try {
      // Validate language support
      if (!fileExtensions[language]) {
        throw new Error(`Unsupported language: ${language}`);
      }
       // Modify Java code to ensure a standard class structure if needed
       let processedCode = code;
       if (language === 'java') {
         // If no public class is defined, wrap the code in a Main class
         if (!code.includes('public class')) {
           processedCode = `
 public class Main {
     public static void main(String[] args) {
         ${code}
     }
 }`;
         }
       }

      // Write the code to a temporary file
      fs.writeFileSync(fileName, code, 'utf8');

      // Write the input to a temporary file
      if (input) {
        fs.writeFileSync(inputFile, input, 'utf8');
      }

      // Get the appropriate command
      const command = commands[language](fileName, inputFile);

      // Execute the code with comprehensive error handling
      exec(command, { 
        timeout: 5000,
        shell: true  // Use shell to resolve path issues
      }, (err, stdout, stderr) => {
        // Clean up temporary files
        [fileName, inputFile].forEach((file) => {
          try {
            if (fs.existsSync(file)) fs.unlinkSync(file);
            //if (fs.existsSync('program')) fs.unlinkSync('program');
          } catch (cleanupError) {
            console.error(`Error cleaning up file ${file}:`, cleanupError);
          }
        });

        if (err) {
          // Detailed error reporting
          const errorMessage = stderr || err.message;
          console.error('Execution Error:', errorMessage);
          reject(new Error(`Code execution failed: ${errorMessage}`));
          return;
        }

        resolve(stdout.trim());
      });
    } catch (setupError) {
      console.error('Setup Error:', setupError);
      reject(setupError);
    }
  });
};



// Store the current question to ensure test cases match
let currentQuestion = null;

app.get("/random-question", (req, res) => {
  const randomIndex = Math.floor(Math.random() * questions.length);
  currentQuestion = questions[randomIndex];

  res.json({ 
    success: true, 
    question: currentQuestion 
  });
});

// Updated run-code endpoint
app.post("/run-code", async (req, res) => {
  const { language, code, input, type } = req.body;
  
  try {
    if (type === "custom") {
      // Custom input execution remains the same
      const output = await executeCode(language, code, input || "");
      res.json({ success: true, output });
    } else if (type === "hidden") {
      // Ensure we have a current question loaded
      if (!currentQuestion) {
        return res.status(400).json({ 
          success: false, 
          error: "No question currently loaded. Please fetch a random question first." 
        });
      }

      // Use the test cases from the current question
      const results = [];

      for (const testCase of currentQuestion.testCases) {
        try {
          const output = await executeCode(language, code, testCase.input);
          results.push({
            input: testCase.input.trim(),
            expected: testCase.expected,
            actual: output,
            passed: output.trim() === testCase.expected.trim(),
          });
        } catch (error) {
          results.push({
            input: testCase.input.trim(),
            expected: testCase.expected,
            error: error.toString(),
            passed: false,
          });
        }
      }

      res.json({ 
        success: true, 
        results,
        questionDetails: {
          question: currentQuestion.question,
          difficulty: currentQuestion.details.difficulty
        }
      });
    }
  } catch (error) {
    res.json({ success: false, error: error.toString() });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


