document.getElementById('registerForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const usn = document.getElementById('usn').value;
    const password = document.getElementById('password').value;

    const nameRegex = /^[A-Za-z\s]+$/;
    const usnRegex = /^[1-9][a-zA-Z]{2}[0-9]{2}[a-zA-Z]{2}[0-9]{3}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!name || !nameRegex.test(name)) {
        alert('Name is required and must only contain letters');
        return;
    }
    if (!usn || !usnRegex.test(usn)) {
        alert('USN/ID is required and must follow this format e.g.. 1AB21CS001');
        return;
    }
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return;
    }
    
    if (!passwordRegex.test(password)) {
        alert('Password must be at least 8 characters long, contain at least one uppercase letter and one number');
        return;
    }


    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, usn, password }),
        });

        const result = await response.json();

        if (response.ok) {
            alert('Registration successful! You can now log in.');
            window.location.href = 'login.html'; // Redirect to login page after successful registration
        } else {
            alert(result.message || 'Registration failed. Please try again.');
        }
    } catch (error) {
        console.error('Error registering:', error);
        alert('An error occurred. Please try again.');
    }
});
