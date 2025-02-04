// script.js
document.addEventListener('DOMContentLoaded', function() {



    const videoPlaylist = [
        {
            id: 1,
            title: "Introduction to C Programming",
            description: "Understanding the basics of C programming language and its importance in software development",
            videoUrl: "KJgsSFOSQv0"
        },
        {
            id: 2,
            title: "Setting Up C Development Environment",
            description: "Installing and configuring C compiler, IDE, and necessary tools for development",
            videoUrl: "1uR4tL-OSNI"
        },
        {
            id: 3,
            title: "First C Program - Hello World",
            description: "Writing and understanding your first C program with detailed explanation of basic syntax",
            videoUrl: "wKoGImLA2KA"
        },
        {
            id: 4,
            title: "Variables and Data Types in C",
            description: "Deep dive into various data types, variable declaration, and initialization in C",
            videoUrl: "h4VBpylsjJc"
        },
        {
            id: 5,
            title: "Operators in C Programming",
            description: "Understanding arithmetic, relational, logical, and assignment operators",
            videoUrl: "GG0xc8fhGhw"
        },
        {
            id: 6,
            title: "Control Flow - If Statements",
            description: "Learning decision making in C using if, else if, and nested if statements",
            videoUrl: "K8mntKyBJGc"
        },
        {
            id: 7,
            title: "Loops in C Programming",
            description: "Mastering for, while, and do-while loops with practical examples",
            videoUrl: "WgS_SF1VrEk"
        },
        {
            id: 8,
            title: "Arrays in C",
            description: "Working with single and multi-dimensional arrays in C programming",
            videoUrl: "e_kEJjHcU_Q"
        },
        {
            id: 9,
            title: "Functions in C",
            description: "Understanding function declaration, definition, and function calls",
            videoUrl: "Npo1u37lcg8"
        },
        {
            id: 10,
            title: "Pointers Basics",
            description: "Introduction to pointers and memory management in C",
            videoUrl: "f2i0CnUOniA"
        },
        {
            id: 11,
            title: "Advanced Pointer Concepts",
            description: "Deep dive into pointer arithmetic and pointer to arrays",
            videoUrl: "X1DcpcgSUXs"
        },
        {
            id: 12,
            title: "Strings in C",
            description: "String manipulation and common string functions in C",
            videoUrl: "5TzFqKZreOk"
        },
        {
            id: 13,
            title: "Structures and Unions",
            description: "Working with user-defined data types in C",
            videoUrl: "6gg9Xlv35-I"
        },
        {
            id: 14,
            title: "File Handling in C",
            description: "Reading from and writing to files using C programming",
            videoUrl: "MQIF-WMUPM8"
        },
        {
            id: 15,
            title: "Dynamic Memory Allocation",
            description: "Understanding malloc, calloc, realloc, and free functions",
            videoUrl: "R0qIYWo8igs"
        },
        {
            id: 16,
            title: "Command Line Arguments",
            description: "Handling command line arguments in C programs",
            videoUrl: "h8dEBJMZm7s"
        },
        {
            id: 17,
            title: "Preprocessor Directives",
            description: "Understanding #include, #define, and other preprocessor directives",
            videoUrl: "VJ7P2AN_yE8"
        },
        {
            id: 18,
            title: "Error Handling in C",
            description: "Implementing error handling and debugging techniques",
            videoUrl: "UdYwNX-P9oA"
        },
        {
            id: 19,
            title: "Bitwise Operations",
            description: "Working with bits and implementing bit manipulation in C",
            videoUrl: "jlQmeyce65Q"
        },
        {
            id: 20,
            title: "Recursion in C",
            description: "Understanding and implementing recursive functions",
            videoUrl: "XVv6qJa5tDE"
        },
        {
            id: 21,
            title: "Sorting Algorithms",
            description: "Implementation of various sorting algorithms in C",
            videoUrl: "YJtJBd4J_Yg"
        },
        {
            id: 22,
            title: "Searching Algorithms",
            description: "Linear and binary search implementation in C",
            videoUrl: "K5PK2c-yyCk"
        },
        {
            id: 23,
            title: "Data Structures - Linked Lists",
            description: "Understanding and implementing linked lists in C",
            videoUrl: "VOpjAHCee7c"
        },
        {
            id: 24,
            title: "Data Structures - Stacks and Queues",
            description: "Implementation of stack and queue data structures",
            videoUrl: "A4sRHBGET-E"
        },
        {
            id: 25,
            title: "Building a Complete C Project",
            description: "Creating a comprehensive C project combining all learned concepts",
            videoUrl: "oq7B_jZs8Oo"
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