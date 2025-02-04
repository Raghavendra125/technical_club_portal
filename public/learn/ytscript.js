// script.js
document.addEventListener('DOMContentLoaded', function() {
    const videoPlaylist = [
        {
            id: 1,
            title: "Introduction to JavaScript",
            description: "Learn the basics of JavaScript programming language",
            videoUrl: "PkZNo7MFNFg"
        },
        {
            id: 2,
            title: "CSS Grid Tutorial",
            description: "Master CSS Grid layout with practical examples",
            videoUrl: "jV8B24rSN5o"
        },
        {
            id: 3,
            title: "React Fundamentals",
            description: "Understanding React core concepts and hooks",
            videoUrl: "w7ejDZ8SWv8"
        }
    ];

    let currentVideoIndex = 0;
    let isPlaying = false;
    let isFullscreen = false;

    // DOM elements
    const currentVideoFrame = document.getElementById('currentVideo');
    const videoTitle = document.getElementById('videoTitle');
    const videoDescription = document.getElementById('videoDescription');
    const playlistContainer = document.getElementById('videoPlaylist');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const prevButton = document.getElementById('prevVideo');
    const nextButton = document.getElementById('nextVideo');
    const playPauseButton = document.getElementById('playPause');
    const toggleSizeButton = document.getElementById('toggleSize');

    function initializePlaylist() {
        playlistContainer.innerHTML = '';
        videoPlaylist.forEach((video, index) => {
            const playlistItem = document.createElement('div');
            playlistItem.className = `playlist-item ${index === currentVideoIndex ? 'active' : ''}`;
            playlistItem.innerHTML = `
                <div class="playlist-item-info">
                    <h4>${video.title}</h4>
                    <p>${video.description}</p>
                </div>
            `;
            playlistItem.addEventListener('click', () => loadVideo(index));
            playlistContainer.appendChild(playlistItem);
        });
    }

    function loadVideo(index) {
        currentVideoIndex = index;
        const video = videoPlaylist[index];
        currentVideoFrame.src = `https://www.youtube-nocookie.com/embed/${video.videoUrl}?enablejsapi=1&origin=${window.location.origin}`;
        videoTitle.textContent = video.title;
        videoDescription.textContent = video.description;
        
        document.querySelectorAll('.playlist-item').forEach((item, idx) => {
            item.classList.toggle('active', idx === index);
        });
    }

    function searchVideos() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredVideos = videoPlaylist.filter(video => 
            video.title.toLowerCase().includes(searchTerm) || 
            video.description.toLowerCase().includes(searchTerm)
        );
        
        playlistContainer.innerHTML = '';
        filteredVideos.forEach((video) => {
            const index = videoPlaylist.indexOf(video);
            const playlistItem = document.createElement('div');
            playlistItem.className = `playlist-item ${index === currentVideoIndex ? 'active' : ''}`;
            playlistItem.innerHTML = `
                <div class="playlist-item-info">
                    <h4>${video.title}</h4>
                    <p>${video.description}</p>
                </div>
            `;
            playlistItem.addEventListener('click', () => loadVideo(index));
            playlistContainer.appendChild(playlistItem);
        });
    }

    function toggleFullscreen() {
        const mainVideo = document.querySelector('.main-video');
        isFullscreen = !isFullscreen;
        mainVideo.classList.toggle('expanded');
        toggleSizeButton.innerHTML = isFullscreen ? 
            '<i class="fas fa-compress"></i>' : '<i class="fas fa-expand"></i>';
        
        if (isFullscreen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }

    // Event listeners
    searchButton.addEventListener('click', searchVideos);
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') searchVideos();
    });

    prevButton.addEventListener('click', () => {
        if (currentVideoIndex > 0) {
            loadVideo(currentVideoIndex - 1);
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentVideoIndex < videoPlaylist.length - 1) {
            loadVideo(currentVideoIndex + 1);
        }
    });

    playPauseButton.addEventListener('click', () => {
        const iframe = currentVideoFrame;
        const message = isPlaying ? '{"event":"command","func":"pauseVideo","args":""}' 
                                : '{"event":"command","func":"playVideo","args":""}';
        iframe.contentWindow.postMessage(message, '*');
        isPlaying = !isPlaying;
        playPauseButton.innerHTML = isPlaying ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
    });

    toggleSizeButton.addEventListener('click', toggleFullscreen);

    // Handle ESC key to exit fullscreen
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isFullscreen) {
            toggleFullscreen();
        }
    });

    // Initialize the first video
    loadVideo(0);
    initializePlaylist();
});