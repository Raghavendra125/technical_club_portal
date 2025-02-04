module.exports = [
  {
    question: "Check if a number is even or odd",
    details: {
      difficulty: "Easy",
      hints: [
        "Use the modulus operator (%) to determine divisibility",
        "Check the remainder when dividing by 2",
        "Return 'Even' or 'Odd' based on the result"
      ]
    },
    testCases: [
      { input: "2\n", expected: "Even" },
      { input: "3\n", expected: "Odd" },
      { input: "0\n", expected: "Even" },
      { input: "1\n", expected: "Odd" },
      { input: "-4\n", expected: "Even" }
    ]
  },
  {
    question: "Calculate the factorial of a number",
    details: {
      difficulty: "Medium",
      hints: [
        "Factorial of 0 is 1",
        "Use recursion or iterative approach",
        "Handle negative numbers as invalid input"
      ]
    },
    testCases: [
      { input: "5\n", expected: "120" },
      { input: "0\n", expected: "1" },
      { input: "1\n", expected: "1" },
      { input: "10\n", expected: "3628800" },
      { input: "-1\n", expected: "Invalid input" }
    ]
  },
  {
    question: "Reverse a string",
    details: {
      difficulty: "Easy",
      hints: [
        "Use string slicing",
        "Iterate backward through the string",
        "Consider using built-in string reversal methods"
      ]
    },
    testCases: [
      { input: "hello\n", expected: "olleh" },
      { input: "world\n", expected: "dlrow" },
      { input: "a\n", expected: "a" },
      { input: "\n", expected: "" },
      { input: "racecar\n", expected: "racecar" }
    ]
  },
  {
    question: "Find the maximum of three numbers",
    details: {
      difficulty: "Easy",
      hints: [
        "Use comparison operators",
        "Consider using max() function if available",
        "Handle cases with equal values"
      ]
    },
    testCases: [
      { input: "5 10 3\n", expected: "10" },
      { input: "-1 -5 -10\n", expected: "-1" },
      { input: "7 7 7\n", expected: "7" },
      { input: "0 0 1\n", expected: "1" }
    ]
  }
];