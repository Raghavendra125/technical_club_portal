
// public/app.js
document.addEventListener('DOMContentLoaded', () => {
    const templateArea = document.getElementById('templateArea');
    const imageUpload = document.getElementById('imageUpload');
    const uploadImageBtn = document.getElementById('uploadImageBtn');
    const addTextBtn = document.getElementById('addTextBtn');
    const clearBtn = document.getElementById('clearBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const textControls = document.getElementById('textControls');
    const fontFamily = document.getElementById('fontFamily');
    const fontSize = document.getElementById('fontSize');
    const boldBtn = document.getElementById('boldBtn');
    const italicBtn = document.getElementById('italicBtn');
    const underlineBtn = document.getElementById('underlineBtn');

    const undoBtn = document.getElementById('undoBtn');
    const redoBtn = document.getElementById('redoBtn');
    const zoomInBtn = document.getElementById('zoomInBtn');
    const zoomOutBtn = document.getElementById('zoomOutBtn');
    
    let undoStack = [];
    let redoStack = [];
    let currentZoom = 1;


    let selectedElement = null;

     // History Management System
     function StateManager() {
        this.maxStates = 30;
        
        this.saveState = () => {
            const state = {
                html: templateArea.innerHTML,
                timestamp: Date.now()
            };
            
            undoStack.push(state);
            if (undoStack.length > this.maxStates) {
                undoStack.shift();
            }
            redoStack = [];
            this.updateButtons();
        };

        this.undo = () => {
            if (undoStack.length > 0) {
                const currentState = {
                    html: templateArea.innerHTML,
                    timestamp: Date.now()
                };
                redoStack.push(currentState);
                
                const previousState = undoStack.pop();
                this.applyState(previousState.html);
                this.updateButtons();
            }
        };

        this.redo = () => {
            if (redoStack.length > 0) {
                const currentState = {
                    html: templateArea.innerHTML,
                    timestamp: Date.now()
                };
                undoStack.push(currentState);
                
                const nextState = redoStack.pop();
                this.applyState(nextState.html);
                this.updateButtons();
            }
        };

        this.applyState = (html) => {
            templateArea.innerHTML = html;
            reattachEventListeners();
        };

        this.updateButtons = () => {
            undoBtn.disabled = undoStack.length === 0;
            redoBtn.disabled = redoStack.length === 0;
        };
    }

    const stateManager = new StateManager();



    function reattachEventListeners() {
        document.querySelectorAll('.draggable').forEach(element => {
            makeDraggable(element);
            if (element.querySelector('img')) {
                makeResizable(element);
            }
        });
    }


    
    // Enhanced Text Editor
    class TextEditor {
        constructor() {
            this.setupTextControls();
        }

        setupTextControls() {
            const fontFamily = document.getElementById('fontFamily');
            const fontSize = document.getElementById('fontSize');
            const boldBtn = document.getElementById('boldBtn');
            const italicBtn = document.getElementById('italicBtn');
            const underlineBtn = document.getElementById('underlineBtn');
            const textColor = document.getElementById('textColor');
            const alignLeftBtn = document.getElementById('alignLeftBtn');
            const alignCenterBtn = document.getElementById('alignCenterBtn');
            const alignRightBtn = document.getElementById('alignRightBtn');

            // Font Family
            fontFamily.addEventListener('change', (e) => {
                this.applyStyle('fontFamily', e.target.value);
            });

            // Font Size
            fontSize.addEventListener('change', (e) => {
                this.applyStyle('fontSize', e.target.value);
            });

            // Text Color
            textColor.addEventListener('input', (e) => {
                this.applyStyle('color', e.target.value);
            });

            // Style Buttons
            boldBtn.addEventListener('click', () => {
                this.toggleStyle('fontWeight', 'bold', 'normal');
            });

            italicBtn.addEventListener('click', () => {
                this.toggleStyle('fontStyle', 'italic', 'normal');
            });

            underlineBtn.addEventListener('click', () => {
                this.toggleStyle('textDecoration', 'underline', 'none');
            });

            // Alignment Buttons
            alignLeftBtn.addEventListener('click', () => {
                this.applyStyle('textAlign', 'left');
            });

            alignCenterBtn.addEventListener('click', () => {
                this.applyStyle('textAlign', 'center');
            });

            alignRightBtn.addEventListener('click', () => {
                this.applyStyle('textAlign', 'right');
            });
        }

        applyStyle(property, value) {
            if (selectedElement && selectedElement.classList.contains('text-element')) {
                selectedElement.style[property] = value;
                stateManager.saveState();
                this.updateToolbarState();
            }
        }

        toggleStyle(property, value1, value2) {
            if (selectedElement && selectedElement.classList.contains('text-element')) {
                const currentValue = selectedElement.style[property];
                selectedElement.style[property] = currentValue === value1 ? value2 : value1;
                stateManager.saveState();
                this.updateToolbarState();
            }
        }

        updateToolbarState() {
            if (!selectedElement) return;

            const styles = window.getComputedStyle(selectedElement);
            
            // Update font controls
            document.getElementById('fontFamily').value = styles.fontFamily.split(',')[0].replace(/['"]/g, '');
            document.getElementById('fontSize').value = styles.fontSize;
            document.getElementById('textColor').value = this.rgbToHex(styles.color);
            
            // Update style buttons
            document.getElementById('boldBtn').classList.toggle('active', styles.fontWeight === 'bold');
            document.getElementById('italicBtn').classList.toggle('active', styles.fontStyle === 'italic');
            document.getElementById('underlineBtn').classList.toggle('active', styles.textDecoration.includes('underline'));
            
            // Update alignment buttons
            const alignButtons = {
                'left': document.getElementById('alignLeftBtn'),
                'center': document.getElementById('alignCenterBtn'),
                'right': document.getElementById('alignRightBtn')
            };
            
            Object.keys(alignButtons).forEach(align => {
                alignButtons[align].classList.toggle('active', styles.textAlign === align);
            });
        }

        rgbToHex(rgb) {
            const match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
            if (!match) return '#000000';
            
            const r = parseInt(match[1]).toString(16).padStart(2, '0');
            const g = parseInt(match[2]).toString(16).padStart(2, '0');
            const b = parseInt(match[3]).toString(16).padStart(2, '0');
            
            return `#${r}${g}${b}`;
        }
    }

    const textEditor = new TextEditor();
    // Enhanced text editing
    function createTextElement() {
        const textElement = document.createElement('div');
        textElement.className = 'draggable text-element';
        textElement.contentEditable = true;
        textElement.innerHTML = 'Click to edit text';
        
        const handleContainer = document.createElement('div');
        handleContainer.className = 'resize-handles';
        ['top-left', 'top-right', 'bottom-left', 'bottom-right'].forEach(position => {
            const handle = document.createElement('div');
            handle.className = `resize-handle ${position}`;
            handleContainer.appendChild(handle);
        });
        
        textElement.appendChild(handleContainer);
        templateArea.appendChild(textElement);
        makeDraggable(textElement);
        makeResizable(textElement);
        
        textElement.addEventListener('focus', () => {
            selectedElement = textElement;
            textControls.style.display = 'flex';
            textElement.classList.add('selected');
        });

        textElement.addEventListener('blur', () => {
            textElement.classList.remove('selected');
            saveState();
        });

        return textElement;
    }
    
    // Event Listeners for Undo/Redo
    undoBtn.addEventListener('click', () => stateManager.undo());
    redoBtn.addEventListener('click', () => stateManager.redo());
    
    // Initialize first state
    stateManager.saveState();

    // Add keyboard shortcuts for undo/redo
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            if (e.key === 'z') {
                e.preventDefault();
                if (e.shiftKey) {
                    stateManager.redo();
                } else {
                    stateManager.undo();
                }
            }
        }
    });
    // Enhanced dragging functionality
    function makeDraggable(element) {
        let isDragging = false;
        let currentX, currentY, initialX, initialY, xOffset = 0, yOffset = 0;

        element.addEventListener('mousedown', dragStart, true);
        element.addEventListener('mousemove', drag, true);
        element.addEventListener('mouseup', dragEnd, true);

        function dragStart(e) {
            if (e.target.classList.contains('resize-handle')) return;
            
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
            isDragging = true;
            
            // Bring element to front
            element.style.zIndex = getMaxZIndex() + 1;
        }

        function drag(e) {
            if (!isDragging) return;
            
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            xOffset = currentX;
            yOffset = currentY;

            // Apply zoom scaling to movement
            const scaledX = currentX / currentZoom;
            const scaledY = currentY / currentZoom;
            
            element.style.transform = `translate(${scaledX}px, ${scaledY}px)`;
        }

        function dragEnd() {
            if (!isDragging) return;
            
            isDragging = false;
            saveState();
        }
    }

    // Enhanced resizing functionality
    function makeResizable(element) {
        const handles = element.querySelectorAll('.resize-handle');
        
        handles.forEach(handle => {
            handle.addEventListener('mousedown', initResize);
        });

        function initResize(e) {
            e.stopPropagation();
            
            const startX = e.clientX;
            const startY = e.clientY;
            const startWidth = element.offsetWidth;
            const startHeight = element.offsetHeight;
            const handleClass = e.target.className;

            function resize(e) {
                const deltaX = (e.clientX - startX) / currentZoom;
                const deltaY = (e.clientY - startY) / currentZoom;

                if (handleClass.includes('right')) {
                    element.style.width = `${startWidth + deltaX}px`;
                }
                if (handleClass.includes('bottom')) {
                    element.style.height = `${startHeight + deltaY}px`;
                }
            }

            function stopResize() {
                window.removeEventListener('mousemove', resize);
                window.removeEventListener('mouseup', stopResize);
                saveState();
            }

            window.addEventListener('mousemove', resize);
            window.addEventListener('mouseup', stopResize);
        }
    }

    // Zoom functionality
    zoomInBtn.addEventListener('click', () => {
        currentZoom = Math.min(currentZoom * 1.2, 3);
        applyZoom();
    });

    zoomOutBtn.addEventListener('click', () => {
        currentZoom = Math.max(currentZoom / 1.2, 0.5);
        applyZoom();
    });

    function applyZoom() {
        templateArea.style.transform = `scale(${currentZoom})`;
    }

    // Helper functions
    function getMaxZIndex() {
        return Math.max(
            ...Array.from(document.querySelectorAll('.draggable'))
                .map(el => parseInt(el.style.zIndex) || 0)
        );
    }

    // Text styling enhancements
    document.getElementById('textColor').addEventListener('change', (e) => {
        if (selectedElement) {
            selectedElement.style.color = e.target.value;
        }
    });
    document.getElementById('alignLeftBtn').addEventListener('click', () => {
        if (selectedElement) {
            selectedElement.style.textAlign = 'left';
        }
    });

    document.getElementById('alignCenterBtn').addEventListener('click', () => {
        if (selectedElement) {
            selectedElement.style.textAlign = 'center';
        }
    });

    document.getElementById('alignRightBtn').addEventListener('click', () => {
        if (selectedElement) {
            selectedElement.style.textAlign = 'right';
        }
    });
});

    // Image Upload Handling
    uploadImageBtn.addEventListener('click', () => imageUpload.click());
    imageUpload.addEventListener('change', handleImageUpload);

    function handleImageUpload(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = document.createElement('img');
                img.src = event.target.result;
                const wrapper = document.createElement('div');
                wrapper.className = 'draggable';
                wrapper.style.width = '300px';
                wrapper.appendChild(img);
                templateArea.appendChild(wrapper);
                makeDraggable(wrapper);
                makeResizable(wrapper);
            };
            reader.readAsDataURL(file);
        }
    }

    // Text Addition
    addTextBtn.addEventListener('click', () => {
        const textElement = document.createElement('div');
        textElement.className = 'draggable text-element';
        textElement.contentEditable = true;
        textElement.innerHTML = 'Click to edit text';
        templateArea.appendChild(textElement);
        makeDraggable(textElement);
        textElement.addEventListener('focus', () => {
            selectedElement = textElement;
            textControls.style.display = 'flex';
        });
    });

    // Dragging Functionality
    function makeDraggable(element) {
        let isDragging = false;
        let currentX, currentY, initialX, initialY, xOffset = 0, yOffset = 0;

        element.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        function dragStart(e) {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
            if (e.target === element || e.target.parentNode === element) {
                isDragging = true;
            }
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                xOffset = currentX;
                yOffset = currentY;
                element.style.transform = `translate(${currentX}px, ${currentY}px)`;
            }
        }

        function dragEnd() {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
        }
    }

    // Image Resizing
    function makeResizable(element) {
        element.addEventListener('wheel', (e) => {
            e.preventDefault();
            const width = element.offsetWidth;
            const newWidth = e.deltaY > 0 ? width * 0.9 : width * 1.1;
            element.style.width = `${newWidth}px`;
        });
    }

    // Text Formatting
    fontFamily.addEventListener('change', () => {
        if (selectedElement) {
            selectedElement.style.fontFamily = fontFamily.value;
        }
    });

    fontSize.addEventListener('change', () => {
        if (selectedElement) {
            selectedElement.style.fontSize = fontSize.value;
        }
    });

    boldBtn.addEventListener('click', () => {
        if (selectedElement) {
            selectedElement.style.fontWeight = 
                selectedElement.style.fontWeight === 'bold' ? 'normal' : 'bold';
        }
    });

    italicBtn.addEventListener('click', () => {
        if (selectedElement) {
            selectedElement.style.fontStyle = 
                selectedElement.style.fontStyle === 'italic' ? 'normal' : 'italic';
        }
    });

    underlineBtn.addEventListener('click', () => {
        if (selectedElement) {
            selectedElement.style.textDecoration = 
                selectedElement.style.textDecoration === 'underline' ? 'none' : 'underline';
        }
    });

    // Clear Template
    clearBtn.addEventListener('click', () => {
        templateArea.innerHTML = '';
        document.getElementById('coordinateTable').innerHTML = 
            'Coordinator Name:<br>Cell Number:';
        textControls.style.display = 'none';
        selectedElement = null;
    });

    // Download Template
    downloadBtn.addEventListener('click', () => {
        html2canvas(templateArea).then(canvas => {
            const link = document.createElement('a');
            link.download = 'template.png';
            link.href = canvas.toDataURL();
            link.click();
        });
    });
/** 
    // Click outside text element handler
    document.addEventListener('click', (e) => {
        if (!e.target.classList.contains('text-element')) {
            selectedElement = null;
            textControls.style.display = 'none';
        }
   

});*/
 // Set selectedElement on click
 templateArea.addEventListener('click', (event) => {
    if (event.target.classList.contains('text-element')) {
        selectedElement = event.target;
    } else {
        selectedElement = null;
    }
});

    