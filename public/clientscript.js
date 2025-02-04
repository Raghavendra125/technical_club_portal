
// Toggle Profile Dropdown
function toggleProfileDropdown() {
    const dropdown = document.getElementById('profileDropdown');
    if (dropdown) {
        const isVisible = dropdown.style.display === 'block';
        dropdown.style.display = isVisible ? 'none' : 'block';
    }
    //dropdown.classList.toggle('visible'); 
    //dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}
// Close Dropdown When Clicking Outside
document.addEventListener('click', (event) => {
    const dropdown = document.getElementById('profileDropdown');
    const button = document.querySelector('.profile-button');
    if (dropdown && button) {
        if (!dropdown.contains(event.target) && !button.contains(event.target)) {
            dropdown.style.display = 'none';
        }
    }
});
/*
document.addEventListener('click', (event) => {
    const dropdown = document.getElementById('profileDropdown');
    const button = document.getElementById('profileButton');

    if (!dropdown.contains(event.target) && !button.contains(event.target)) {
        dropdown.classList.remove('visible');
    }
});
*/

// Fetch User Data
async function fetchUserData() {
    try {
        const response = await fetch('/user', { credentials: 'include' });
        if (!response.ok) throw new Error('Failed to fetch user data');
        const user = await response.json();

        document.getElementById('profileName').textContent = user.name || 'Name not available';
        document.getElementById('profileEmail').textContent = user.email || 'Email not available';
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
}
/** 
// Fetch User Data
async function fetchUserData() {
    try {
        const response = await fetch('/current-user', { credentials: 'include' });
        if (!response.ok) throw new Error('Failed to fetch user data');
        const user = await response.json();

        document.getElementById('profileName').textContent = user.name || 'Name not available';
        document.getElementById('profileEmail').textContent = user.email || 'Email not available';
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
}
**/
// Logout Function
function logout() {
    if (confirm("Are you sure you want to logout?")) {
        fetch('/logout', { method: 'POST', credentials: 'include' })
            .then(() => window.location.href = 'login.html')
            .catch(error => console.error('Error during logout:', error));
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchUserData();

    // Ensure Profile Dropdown starts hidden
    const dropdown = document.getElementById('profileDropdown');
    if (dropdown) {
        dropdown.style.display = 'none';
    }
});

/*
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('profileButton').addEventListener('click', toggleProfileDropdown);
    fetchUserData();
});*/