document.getElementById('registerForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    // Extracting form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const phone = document.getElementById('phone').value.trim();

    // Validation patterns
    const nameRegex = /^[A-Za-z\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    const phoneRegex = /^[0-9]{10}$/;

    // Input validations
    if (!name || !nameRegex.test(name)) {
        alert('Name is required and must only contain letters');
        return;
    }
    if (!email || !emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return;
    }
    if (!password || !passwordRegex.test(password)) {
        alert('Password must be at least 8 characters long, contain one uppercase letter, one number, and one special character');
        return;
    }
    if (!phone || !phoneRegex.test(phone)) {
        alert('Phone number must be exactly 10 digits');
        return;
    }

    try {
        // Sending registration data to the server
        const response = await fetch('/adminregister', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, phone }),
        });

        const result = await response.json();

        if (response.ok) {
            alert('Admin registration successful! You can now log in.');
            window.location.href = 'login.html'; // Redirect to login page
        } else {
            alert(result.message || 'Admin registration failed. Please try again.');
        }
    } catch (error) {
        console.error('Error during admin registration:', error);
        alert('An error occurred. Please try again later.');
    }
});
