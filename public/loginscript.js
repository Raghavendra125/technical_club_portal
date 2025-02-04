 document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const isAdmin = document.getElementById('adminSwitch').checked; // Check if admin switch is on
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!email || !password) {
        alert('Please fill in all fields!');
        return;
    }

    try {
        // Determine the endpoint based on the admin switch
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, isAdmin }), // Pass the isAdmin flag to the backend
        });

        const result = await response.json();

        if (response.ok) {
            alert(`${isAdmin ? 'Admin' : 'User'} Successfully Logged In!`);
            // Redirect to the appropriate page
            window.location.href = result.redirect || (isAdmin ? 'admin_home_page.html' : 'user_home_page.html');
        } else {
            alert(result.message || `${isAdmin ? 'Admin' : 'User'} login failed. Please check your credentials.`);
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred while logging in. Please try again later.');
    }
});

// Toggle between User and Admin views based on admin switch
document.getElementById('adminSwitch').addEventListener('change', function () {
    const loginLeft = document.querySelector('.login-left');
    const loginRight = document.querySelector('.login-right');
    const title = document.getElementById('login-title');
    const registerLink = document.getElementById('register-link');

    if (this.checked) {
        // Admin view
        loginLeft.style.transform = 'translateX(100%)';
        loginRight.style.transform = 'translateX(-100%)';
        title.textContent = 'Admin Login';
        registerLink.style.display = 'none'; 
    } else {
        // User view
        loginLeft.style.transform = 'translateX(0)';
        loginRight.style.transform = 'translateX(0)';
        title.textContent = 'Login to your account';
        registerLink.style.display = 'block'; 
    }
});

// Handle Enter key submission for a better user experience
document.getElementById('password').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        document.getElementById('loginForm').dispatchEvent(new Event('submit'));
    }
});
