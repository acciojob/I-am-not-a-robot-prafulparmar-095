const imageGallery = document.getElementById('image-gallery');
const resetButton = document.getElementById('reset');
const verifyButton = document.getElementById('verify');
const messageHeader = document.getElementById('h');
const resultParagraph = document.getElementById('para');

const imageNames = ['img1.jpg', 'img2.jpg', 'img3.jpg', 'img4.jpg', 'img5.jpg'];
let selectedImages = [];
let shuffledImages = [];
let duplicateImageName = '';

function initializeGame() {
    selectedImages = [];
    resultParagraph.textContent = '';
    messageHeader.textContent = "Please click on the identical tiles to verify that you are not a robot.";
    resetButton.style.display = 'none';
    verifyButton.style.display = 'none';
    imageGallery.innerHTML = ''; // Clear previous images

    // Choose a random image to be the duplicate
    const randomIndexForDuplicate = Math.floor(Math.random() * imageNames.length);
    duplicateImageName = imageNames[randomIndexForDuplicate];

    // Create the initial set of 6 images (5 unique + 1 duplicate)
    let imagesToDisplay = [...imageNames];
    imagesToDisplay.push(duplicateImageName); // Add the duplicate

    // Shuffle the images
    shuffledImages = shuffleArray(imagesToDisplay);

    // Render images to the DOM
    shuffledImages.forEach((imgName, index) => {
        const imgElement = document.createElement('img');
        imgElement.src = `./images/${imgName}`;
        imgElement.alt = `Tile ${index + 1}`;
        imgElement.dataset.name = imgName; // Store the original image name
        imgElement.addEventListener('click', handleImageClick);
        imageGallery.appendChild(imgElement);
    });
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function handleImageClick(event) {
    const clickedImage = event.target;

    // Prevent double-clicking the same image
    if (selectedImages.includes(clickedImage)) {
        return;
    }

    // Only allow selecting up to two images
    if (selectedImages.length < 2) {
        clickedImage.classList.add('selected');
        selectedImages.push(clickedImage);
    }

    resetButton.style.display = 'inline-block'; // Show reset button after first click
    resultParagraph.textContent = ''; // Clear previous result message

    if (selectedImages.length === 2) {
        verifyButton.style.display = 'inline-block';
    } else {
        verifyButton.style.display = 'none';
    }
}

function resetGame() {
    initializeGame(); // Re-initialize the game to its initial state
}

function verifySelection() {
    verifyButton.style.display = 'none';
    resetButton.style.display = 'none'; // Hide reset button after verification

    if (selectedImages.length === 2) {
        const [img1, img2] = selectedImages;
        if (img1.dataset.name === img2.dataset.name) {
            resultParagraph.textContent = "You are a human. Congratulations!";
            resultParagraph.style.color = 'green';
        } else {
            resultParagraph.textContent = "We can't verify you as a human. You selected the non-identical tiles.";
            resultParagraph.style.color = 'red';
        }
    } else {
        // This case should ideally not happen if logic is correct, but as a fallback
        resultParagraph.textContent = "Please select exactly two images.";
        resultParagraph.style.color = 'orange';
    }

    // Make images unclickable after verification, or handle reset to allow new clicks
    // For this task, resetting the game after verification seems like the expected flow.
    // If we wanted to keep the current images and just allow a new selection,
    // we would remove event listeners or disable clicks until reset.
    // Given the "State 4" description, the result is shown and then implicitly
    // the user would reload/reset for a new attempt.
}

// Event Listeners for buttons
resetButton.addEventListener('click', resetGame);
verifyButton.addEventListener('click', verifySelection);

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', initializeGame);