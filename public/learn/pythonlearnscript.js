// script.js
document.addEventListener('DOMContentLoaded', function() {
    const videoPlaylist = [
        {
            id: 1,
            title: "Python for Beginners - Complete Course",
            description: "Comprehensive introduction to Python programming fundamentals and setup",
            videoUrl: "_uQrJ0TkZlc"
        },
        {
            id: 2,
            title: "Python Variables and Data Types",
            description: "Understanding numbers, strings, lists, and basic data structures",
            videoUrl: "khKv-8q7YmY"
        },
        {
            id: 3,
            title: "Control Flow in Python",
            description: "Mastering if statements, loops, and control structures",
            videoUrl: "PqFKRqpHrjw"
        },
        {
            id: 4,
            title: "Python Functions",
            description: "Creating and using functions, arguments, and return values",
            videoUrl: "9Os0o3wzS_I"
        },
        {
            id: 5,
            title: "Python Lists, Tuples, and Sets",
            description: "Working with different types of collections in Python",
            videoUrl: "W8KRzm-HUcc"
        },
        {
            id: 6,
            title: "Python Dictionaries",
            description: "Understanding key-value pairs and dictionary operations",
            videoUrl: "daefaLgNkw0"
        },
        {
            id: 7,
            title: "Object-Oriented Programming in Python",
            description: "Classes, objects, inheritance, and encapsulation",
            videoUrl: "ZDa-Z5JzLYM"
        },
        {
            id: 8,
            title: "Python File Handling",
            description: "Reading and writing files, working with different file formats",
            videoUrl: "Uh2ebFW8OYM"
        },
        {
            id: 9,
            title: "Python Exception Handling",
            description: "Managing errors and exceptions in Python programs",
            videoUrl: "NIWwJbo-9_8"
        },
        {
            id: 10,
            title: "Python Modules and Packages",
            description: "Creating and importing modules, package management with pip",
            videoUrl: "CqvZ3vGoGs0"
        },
        {
            id: 11,
            title: "Python List Comprehension",
            description: "Advanced list operations and functional programming concepts",
            videoUrl: "3dt4OGnU5sM"
        },
        {
            id: 12,
            title: "Python Decorators",
            description: "Understanding and implementing decorators in Python",
            videoUrl: "FsAPt_9Bf3U"
        },
        {
            id: 13,
            title: "Python Generators and Iterators",
            description: "Working with generators and custom iterators",
            videoUrl: "bD05uGo_sVI"
        },
        {
            id: 14,
            title: "Python Regular Expressions",
            description: "Pattern matching and text processing with regex",
            videoUrl: "K8L6KVGG-7o"
        },
        {
            id: 15,
            title: "Data Analysis with Pandas",
            description: "Introduction to data manipulation using Pandas library",
            videoUrl: "vmEHCJofslg"
        },
        {
            id: 16,
            title: "NumPy for Scientific Computing",
            description: "Working with numerical computations and arrays in Python",
            videoUrl: "QUT1VHiLmmI"
        },
        {
            id: 17,
            title: "Data Visualization with Matplotlib",
            description: "Creating charts and graphs for data visualization",
            videoUrl: "DAQNHzOcO5A"
        },
        {
            id: 18,
            title: "Web Scraping with Python",
            description: "Extracting data from websites using Beautiful Soup",
            videoUrl: "XVv6mJpFOb0"
        },
        {
            id: 19,
            title: "Python GUI Development with Tkinter",
            description: "Building graphical user interfaces in Python",
            videoUrl: "YXPyB4XeYLA"
        },
        {
            id: 20,
            title: "Database Operations with Python",
            description: "Working with SQLite and MySQL databases",
            videoUrl: "byHcYRpG_ak"
        },
        {
            id: 21,
            title: "Python Flask Framework",
            description: "Building web applications with Flask",
            videoUrl: "Z1RJmh_OqeA"
        },
        {
            id: 22,
            title: "Python Django Framework",
            description: "Creating full-stack web applications with Django",
            videoUrl: "F5mRW0jo-U4"
        },
        {
            id: 23,
            title: "Machine Learning with Python",
            description: "Introduction to machine learning using scikit-learn",
            videoUrl: "7eh4d6sabA0"
        },
        {
            id: 24,
            title: "Python Testing with Pytest",
            description: "Writing and running automated tests in Python",
            videoUrl: "DhUpxWjOhME"
        },
        {
            id: 25,
            title: "Python Projects for Beginners",
            description: "Building practical applications using Python",
            videoUrl: "8ext9G7xspg"
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