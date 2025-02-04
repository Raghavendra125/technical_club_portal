 
const form = document.getElementById("response-form");
const responseInput = document.getElementById("response");
const responseList = document.getElementById("response-list");
const promptContainer = document.getElementById("prompt");

let currentPrompt;
let currentUser;

// Fetch current user info
const getCurrentUser = async () => {
    try {
        const response = await fetch('/user');
        if (!response.ok) {
            throw new Error('Not logged in');
        }
        currentUser = await response.json();
    } catch (error) {
        console.error("Error fetching user:", error);
        window.location.href = '/login.html';
    }
};

// Format timestamp to readable date/time
const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
};

// Create HTML element for a single response
const createResponseElement = (responseData) => {
    const responseDiv = document.createElement("div");
    responseDiv.classList.add("chat-response");

    const header = document.createElement("div");
    header.classList.add("response-header");
    
    const username = document.createElement("span");
    username.classList.add("username");
    username.textContent = responseData.username;
    
    const timestamp = document.createElement("span");
    timestamp.classList.add("timestamp");
    timestamp.textContent = formatTimestamp(responseData.timestamp);
    
    const content = document.createElement("p");
    content.classList.add("response-content");
    content.textContent = responseData.response;

    header.appendChild(username);
    header.appendChild(timestamp);
    responseDiv.appendChild(header);
    responseDiv.appendChild(content);

    return responseDiv;
};

// Fetch all prompts from the server
const fetchPrompts = async () => {
    try {
        const response = await fetch('/prompts');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const prompts = await response.json();
        return prompts;
    } catch (error) {
        console.error("Error fetching prompts:", error);
        promptContainer.textContent = "Error loading prompts. Please refresh the page.";
        return [];
    }
};

// Display a specific prompt and its responses
const displayPrompt = (prompt) => {
    currentPrompt = prompt;
    promptContainer.textContent = prompt.question;
    responseList.innerHTML = "";

    if (prompt.responses && prompt.responses.length > 0) {
        prompt.responses.forEach((responseData) => {
            const responseElement = createResponseElement(responseData);
            responseList.appendChild(responseElement);
        });
        // Scroll to bottom to show latest responses
        responseList.scrollTop = responseList.scrollHeight;
    } else {
        // Display "No responses yet" message
        const noResponsesMsg = document.createElement("p");
        noResponsesMsg.textContent = "No responses yet. Be the first to respond!";
        noResponsesMsg.className = "no-responses-message";
        responseList.appendChild(noResponsesMsg);
    }
};

// Display a random prompt
const displayRandomPrompt = async () => {
    const prompts = await fetchPrompts();
    if (prompts && prompts.length > 0) {
        const randomIndex = Math.floor(Math.random() * prompts.length);
        displayPrompt(prompts[randomIndex]);
    } else {
        promptContainer.textContent = "No prompts available.";
        responseList.innerHTML = "<p>Please try again later.</p>";
    }
};

// Handle form submission
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const response = responseInput.value.trim();
    
    if (!currentUser) {
        alert("Please log in to post responses.");
        window.location.href = '/login.html';
        return;
    }

    if (response === "") {
        alert("Please enter a response.");
        return;
    }

    if (!currentPrompt) {
        alert("Please wait for a prompt to load.");
        return;
    }

    try {
        const res = await fetch(`/prompts/${currentPrompt.id}/responses`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ response })
        });
        
        if (res.ok) {
            const data = await res.json();
            
            // Remove "No responses yet" message if it exists
            const noResponsesMsg = responseList.querySelector('.no-responses-message');
            if (noResponsesMsg) {
                noResponsesMsg.remove();
            }

            // Add new response to the list
            const responseElement = createResponseElement(data.response);
            responseList.appendChild(responseElement);
            responseInput.value = "";
            
            // Add the new response to the currentPrompt.responses array
            if (!currentPrompt.responses) {
                currentPrompt.responses = [];
            }
            currentPrompt.responses.push(data.response);
            
            // Scroll to the new response
            responseList.scrollTop = responseList.scrollHeight;
        } else {
            const errorData = await res.json();
            alert(errorData.error || 'Failed to add response');
        }
    } catch (error) {
        console.error("Error adding response:", error);
        alert("An error occurred while adding the response. Please try again.");
    }
});

// Add click handler for loading a new random prompt
promptContainer.addEventListener('click', () => {
    displayRandomPrompt();
});

// Initialize the page
window.addEventListener('load', async () => {
    try {
        await getCurrentUser();
        await displayRandomPrompt();
    } catch (error) {
        console.error("Error initializing page:", error);
        promptContainer.textContent = "Error loading the page. Please refresh.";
    }
});