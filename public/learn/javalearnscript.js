// script.js
document.addEventListener('DOMContentLoaded', function() {
    
    const videoPlaylist = [
        {
            id: 1,
            title: "Java Tutorial for Beginners",
            description: "Comprehensive introduction to Java programming basics and development environment setup",
            videoUrl: "eIrMbAQSU34"
        },
        {
            id: 2,
            title: "Java OOP Concepts",
            description: "Detailed explanation of Object-Oriented Programming principles in Java",
            videoUrl: "pTB0EiLXUC8"
        },
        {
            id: 3,
            title: "Java Variables and Data Types",
            description: "Understanding primitive data types, variables, and type conversion in Java",
            videoUrl: "GAGRrVZB6Vs"
        },
        {
            id: 4,
            title: "Control Flow Statements in Java",
            description: "Mastering if-else statements, switches, loops, and control structures",
            videoUrl: "mA23x39DjbI"
        },
        {
            id: 5,
            title: "Java Arrays and Strings",
            description: "Working with arrays, array lists, and string manipulation in Java",
            videoUrl: "n2BZQ3Lh_9Y"
        },
        {
            id: 6,
            title: "Methods in Java",
            description: "Understanding method declaration, parameters, return types, and method overloading",
            videoUrl: "r0SewFmbCUI"
        },
        {
            id: 7,
            title: "Java Class and Objects",
            description: "Deep dive into creating classes, objects, and understanding object lifecycle",
            videoUrl: "8yjkWGRlUmY"
        },
        {
            id: 8,
            title: "Inheritance in Java",
            description: "Understanding inheritance, super keyword, and method overriding",
            videoUrl: "Zs342ePFvRI"
        },
        {
            id: 9,
            title: "Java Interfaces and Abstract Classes",
            description: "Implementing interfaces and working with abstract classes",
            videoUrl: "DMqTEkXPYFg"
        },
        {
            id: 10,
            title: "Exception Handling in Java",
            description: "Managing errors with try-catch blocks and custom exceptions",
            videoUrl: "W-N2ltgU-X4"
        },
        {
            id: 11,
            title: "Java Collections Framework",
            description: "Understanding Lists, Sets, Maps, and Collection interfaces",
            videoUrl: "GdAon80-0KA"
        },
        {
            id: 12,
            title: "Java Generics",
            description: "Working with generic classes, methods, and wildcards",
            videoUrl: "XMvFFBAIqLk"
        },
        {
            id: 13,
            title: "File Handling in Java",
            description: "Reading and writing files using Java I/O streams",
            videoUrl: "3qtX3g_M2ZE"
        },
        {
            id: 14,
            title: "Java MultiThreading",
            description: "Understanding threads, synchronization, and concurrent programming",
            videoUrl: "TCd8QIS-2KI"
        },
        {
            id: 15,
            title: "Java GUI Programming",
            description: "Creating graphical user interfaces using Java Swing",
            videoUrl: "5o3fMLPY7qY"
        },
        {
            id: 16,
            title: "Java Database Connectivity (JDBC)",
            description: "Connecting and working with databases in Java applications",
            videoUrl: "2i4t-SL1VsU"
        },
        {
            id: 17,
            title: "Java Lambda Expressions",
            description: "Understanding functional programming and lambda expressions in Java",
            videoUrl: "4HC_WyBSDGA"
        },
        {
            id: 18,
            title: "Java Stream API",
            description: "Processing collections using Stream API and functional operations",
            videoUrl: "t1-YZ6bF-g0"
        },
        {
            id: 19,
            title: "Java Design Patterns",
            description: "Implementation of common design patterns in Java",
            videoUrl: "v9ejT8FO-7I"
        },
        {
            id: 20,
            title: "Unit Testing in Java",
            description: "Writing and running unit tests using JUnit framework",
            videoUrl: "vZm0lHciFsQ"
        },
        {
            id: 21,
            title: "Java Spring Framework Basics",
            description: "Introduction to Spring Framework and dependency injection",
            videoUrl: "If1Lw4pLLk8"
        },
        {
            id: 22,
            title: "RESTful Web Services in Java",
            description: "Building REST APIs using Spring Boot",
            videoUrl: "sdDDuQuX2sc"
        },
        {
            id: 23,
            title: "Java Memory Management",
            description: "Understanding garbage collection and memory optimization",
            videoUrl: "wq23ZDqXyUg"
        },
        {
            id: 24,
            title: "Advanced Java Concepts",
            description: "Exploring reflection, annotations, and advanced features",
            videoUrl: "7H2kFPYYuhk"
        },
        {
            id: 25,
            title: "Building Complete Java Applications",
            description: "Creating full-stack applications using Java technologies",
            videoUrl: "QqYsL_X4gAo"
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