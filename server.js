require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const bcrypt = require("bcrypt");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const pool = require('./database/db.js');
// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
  })
);


// Routes
app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/register', async (req, res) => {
  const { name, email, usn, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const [result] = await pool.query(
      'INSERT INTO users (name, email, usn, password) VALUES (?, ?, ?, ?)',
      [name, email, usn, hashedPassword]
    );

    if (result.affectedRows === 1) {
      res.status(200).json({ message: 'User registered successfully!' });
    } else {
      res.status(500).json({ message: 'Registration failed!' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Registration failed!' });
  }
});

app.post('/adminregister', async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password || !phone) {
    return res.status(400).json({ message: 'All fields are required!' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const [result] = await pool.query(
      'INSERT INTO admins (name, email, password, phone) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, phone]
    );
    if (result.affectedRows === 1) {
      res.status(200).json({ message: 'Admin registered successfully!' });
    } else {
      res.status(500).json({ message: 'Admin registration failed.' });
    }
  } catch (err) {
    console.error('Database error:', err.message);
    res.status(500).json({ message: 'Admin registration failed.' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password, isAdmin } = req.body;

  const table = isAdmin ? 'admins' : 'users';
  try {
    const [results] = await pool.query(`SELECT * FROM ${table} WHERE email = ?`, [email]);

    if (results.length > 0) {
      const validPassword = await bcrypt.compare(password, results[0].password);
      if (validPassword) {
        req.session.user = {
          id: results[0].id,
          name: results[0].name,
          email: results[0].email,
          role: isAdmin ? 'admin' : 'user',
        };
        const redirectPage = isAdmin ? 'admin_home_page.html' : 'user_home_page.html';
        return res.status(200).json({ message: 'Login successful!', redirect: redirectPage });
      }
    }
    res.status(401).json({ message: 'Invalid credentials!' });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: 'Login failed!' });
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login.html');
});

app.get('/user', (req, res) => {
  if (req.session.user) {
    return res.status(200).json(req.session.user);
  }
  res.status(401).json({ message: 'User not logged in!' });
});
 
// Update the GET /prompts route to include user information
app.get('/prompts', async (req, res) => {
  try {
    const [prompts] = await pool.query('SELECT * FROM prompts');

    const [allResponses] = await pool.query(`
      SELECT r.response, r.prompt_id, r.created_at, 
             u.name as username, u.id as user_id
      FROM responses r
      INNER JOIN users u ON r.user_id = u.id
      INNER JOIN prompts p ON r.prompt_id = p.id
      ORDER BY r.created_at ASC
    `);

    const responsesByPromptId = {};
    allResponses.forEach(r => {
      if (!responsesByPromptId[r.prompt_id]) {
        responsesByPromptId[r.prompt_id] = [];
      }
      responsesByPromptId[r.prompt_id].push({
        response: r.response,
        username: r.username,
        userId: r.user_id,
        timestamp: r.created_at
      });
    });

    prompts.forEach(prompt => {
      prompt.responses = responsesByPromptId[prompt.id] || [];
    });

    res.json(prompts);
  } catch (err) {
    console.error("Error fetching prompts:", err);
    res.status(500).json({ error: "Failed to fetch prompts" });
  }
});

// Update the POST /prompts/:id/responses route to include user authentication
app.post('/prompts/:id/responses', async (req, res) => {
  // Check if user is logged in
  if (!req.session.user) {
    return res.status(401).json({ error: "Please log in to post responses" });
  }

  try {
    const promptId = req.params.id;
    const response = req.body.response;
    const userId = req.session.user.id;

    const [result] = await pool.query(
      'INSERT INTO responses (prompt_id, user_id, response) VALUES (?, ?, ?)',
      [promptId, userId, response]
    );

    if (result.affectedRows === 1) {
      // Return the new response with user info for immediate display
      const [userInfo] = await pool.query(
        'SELECT name as username FROM users WHERE id = ?',
        [userId]
      );
      
      res.status(200).json({
        message: "Response added successfully",
        response: {
          response: response,
          username: userInfo[0].username,
          userId: userId,
          timestamp: new Date()
        }
      });
    } else {
      res.status(500).json({ error: "Failed to add response" });
    }
  } catch (err) {
    console.error("Error adding response:", err);
    res.status(500).json({ error: "Failed to add response" });
  }
});


// ... (Your code execution and other routes)

const questions = require("./public/assessment/questions.js");
//const { executeCode } = require("./executeCode"); 

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
  cpp: (filename, inputFile) => `g++ ${filename} -o program && ./program < ${inputFile}`,
  //cpp: (filename, inputFile) => `gcc ${filename} -o program && ./program < ${inputFile}`,
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
  
  r: (filename, inputFile) => `Rscript ${filename} --args $(cat ${inputFile})`,
  //r: (filename, inputFile) => `Rscript ${filename} < ${inputFile}`,
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


// Add these routes to your existing server.js file
// Add these new routes to your existing server.js file after your existing routes

// Save quiz score
app.post('/api/save-score', async (req, res) => {
  if (!req.session.user) {
      return res.status(401).json({ success: false, message: 'User not logged in' });
  }

  const { score, total_questions, accuracy, attempted_questions } = req.body;
  
  try {
      // Check if user has already saved a score for this quiz
      const [existingScore] = await pool.query(
          'SELECT id FROM quiz_scores WHERE user_id = ? AND completion_time > DATE_SUB(NOW(), INTERVAL 1 MINUTE)',
          [req.session.user.id]
      );

      if (existingScore.length > 0) {
          return res.json({ success: false, message: 'Score already saved' });
      }

      const [result] = await pool.query(
          'INSERT INTO quiz_scores (user_id, score, total_questions, accuracy, attempted_questions) VALUES (?, ?, ?, ?, ?)',
          [req.session.user.id, score, total_questions, accuracy, attempted_questions]
      );

      res.json({ success: true, message: 'Score saved successfully' });
  } catch (err) {
      console.error('Error saving score:', err);
      res.status(500).json({ success: false, message: 'Error saving score' });
  }
});

// Get leaderboard data
app.get('/api/leaderboard', async (req, res) => {
  try {
      const [scores] = await pool.query(`
          SELECT 
              u.name,
              u.usn,
              qs.score,
              qs.total_questions,
              qs.accuracy,
              qs.attempted_questions,
              qs.completion_time
          FROM quiz_scores qs
          JOIN users u ON qs.user_id = u.id
          ORDER BY qs.score DESC, qs.accuracy DESC
      `);

      res.json({ success: true, scores });
  } catch (err) {
      console.error('Error fetching leaderboard:', err); 
      res.status(500).json({ success: false, message: 'Error fetching leaderboard' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/login.html`);
});