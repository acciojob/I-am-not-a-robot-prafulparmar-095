document.addEventListener('DOMContentLoaded', () => {
    const imagesContainer = document.getElementById('images-container');
    const tiles = document.querySelectorAll('.tile'); // Get all image elements
    const h3Message = document.getElementById('h');
    const paraMessage = document.getElementById('para');
    const resetButton = document.getElementById('reset');
    const verifyButton = document.getElementById('verify');

    // Define your image assets (assuming they are in an 'images' folder)
    const imageAssets = [
        'img1.jpg', 'img2.jpg', 'img3.jpg', 'img4.jpg', 'img5.jpg',
        // Add more if you have them, or use these 5 and one will repeat.
    ];

    let clickedTiles = []; // Stores the actual DOM elements of clicked images
    let firstClickMade = false;

    // Helper function to shuffle an array (Fisher-Yates algorithm)
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Swap elements
        }
        return array;
    }

    // Function to set up the game state
    function initializeGame() {
        // Reset UI elements
        h3Message.textContent = "Please click on the identical tiles to verify that you are not a robot.";
        paraMessage.textContent = "";
        resetButton.style.display = 'none';
        verifyButton.style.display = 'none';

        // Clear clicked state from all tiles
        tiles.forEach(tile => {
            tile.classList.remove('clicked');
            tile.style.pointerEvents = 'auto'; // Re-enable clicks
        });

        // Reset game state variables
        clickedTiles = [];
        firstClickMade = false;

        // --- Randomized Image Display ---
        // 1. Get 5 unique images
        const uniqueImages = shuffleArray([...imageAssets]).slice(0, 5);

        // 2. Choose one to be the duplicate
        const duplicateImage = uniqueImages[Math.floor(Math.random() * uniqueImages.length)];

        // 3. Create the full set of 6 images (5 unique + 1 duplicate)
        let allImagesForDisplay = [...uniqueImages, duplicateImage];

        // 4. Shuffle the final set of 6 images
        allImagesForDisplay = shuffleArray(allImagesForDisplay);

        // 5. Assign images to tiles
        tiles.forEach((tile, index) => {
            const imageName = allImagesForDisplay[index];
            tile.src = `images/${imageName}`; // Assuming images are in an 'images' folder
            tile.dataset.img = imageName; // Store the image type for comparison
        });
    }

    // --- Event Listeners ---

    // Click event for images (using event delegation on the container)
    imagesContainer.addEventListener('click', (event) => {
        const clickedTile = event.target;

        // Ensure a tile was clicked and it's not already selected
        if (clickedTile.classList.contains('tile') && !clickedTile.classList.contains('clicked')) {

            // Prevent clicking more than two images
            if (clickedTiles.length < 2) {
                clickedTile.classList.add('clicked');
                clickedTiles.push(clickedTile);
            } else {
                 // If already two clicked, disable further clicks on *new* tiles
                 // We specifically target the current clickedTile if it wasn't already selected
                 return; 
            }
            
            // State 2: At least one tile clicked
            if (clickedTiles.length >= 1) {
                resetButton.style.display = 'inline-block';
            }

            // State 3: Both tiles clicked
            if (clickedTiles.length === 2) {
                verifyButton.style.display = 'inline-block';
                // Optionally disable further clicks on *any* tile until verified or reset
                tiles.forEach(tile => {
                    if (!tile.classList.contains('clicked')) {
                        tile.style.pointerEvents = 'none'; 
                    }
                });
            } else {
                verifyButton.style.display = 'none'; // Ensure verify button hides if more than 2 are somehow selected
            }
        }
    });

    // Reset button click
    resetButton.addEventListener('click', () => {
        initializeGame();
    });

    // Verify button click
    verifyButton.addEventListener('click', () => {
        verifyButton.style.display = 'none'; // Hide verify button after click
        resetButton.style.display = 'none'; // Also hide reset button, as state is changing to result

        // Re-enable clicks on all tiles (important for subsequent rounds)
        tiles.forEach(tile => {
            tile.style.pointerEvents = 'auto';
            tile.classList.remove('clicked'); // Remove clicked highlights
        });

        // Check if exactly two tiles were clicked
        if (clickedTiles.length === 2) {
            const [tile1, tile2] = clickedTiles;
            if (tile1.dataset.img === tile2.dataset.img) {
                paraMessage.textContent = "You are a human. Congratulations!";
                h3Message.textContent = "Verification Successful!";
                h3Message.style.color = 'green';
            } else {
                paraMessage.textContent = "We can't verify you as a human. You selected the non-identical tiles.";
                h3Message.textContent = "Verification Failed!";
                h3Message.style.color = 'red';
            }
        } else {
            // This case should ideally not happen if logic is correct, but as a fallback
            paraMessage.textContent = "Please select exactly two tiles to verify.";
            h3Message.textContent = "Error!";
            h3Message.style.color = 'orange';
        }
        
        // After showing result, reset button should appear to allow user to try again
        // Re-show reset button after showing result so user can play again
        setTimeout(() => { // Give a small delay to read the message
            resetButton.style.display = 'inline-block';
            h3Message.textContent = "Click 'Reset' to try again.";
            h3Message.style.color = '#0056b3'; // Reset color
        }, 1500); 
    });

    // Initialize the game when the page loads
    initializeGame();
});