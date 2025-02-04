// leaderboard.js
document.addEventListener('DOMContentLoaded', function() {
    loadLeaderboard();
});

async function loadLeaderboard() {
    try {
        const response = await fetch('/api/leaderboard');
        const data = await response.json();
        
        if (data.success) {
            displayLeaderboard(data.scores);
        } else {
            alert('Error loading leaderboard: ' + data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error loading leaderboard');
    }
}

function displayLeaderboard(scores) {
    const tbody = document.getElementById('leaderboard-body');
    tbody.innerHTML = '';

    scores.forEach((score, index) => {
        const row = document.createElement('tr');
        if (index < 3) {
            row.classList.add(`rank-${index + 1}`);
        }

        const date = new Date(score.completion_time).toLocaleDateString();
        
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${score.name}</td>
            <td>${score.usn}</td>
            <td>${score.score}/${score.total_questions}</td>
            <td>${score.accuracy}%</td>
            <td>${score.attempted_questions}/${score.total_questions}</td>
            <td>${date}</td>
        `;

        tbody.appendChild(row);
    });
}