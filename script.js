const images = [
  "img1.jpg",
  "img2.jpg",
  "img3.jpg",
  "img4.jpg",
  "img5.jpg"
];

let selectedImages = [];
let selectedElements = [];
const container = document.getElementById("image-container");
const para = document.getElementById("para");
const resetBtn = document.getElementById("reset");
const verifyBtn = document.getElementById("verify");
const message = document.getElementById("h");

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)];
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Load images and initialize
function initializeGame() {
  container.innerHTML = "";
  para.textContent = "";
  resetBtn.style.display = "none";
  verifyBtn.style.display = "none";
  selectedImages = [];
  selectedElements = [];
  message.textContent = "Please click on the identical tiles to verify that you are not a robot.";

  const duplicateIndex = Math.floor(Math.random() * images.length);
  const imagesWithDuplicate = [...images, images[duplicateIndex]];
  shuffle(imagesWithDuplicate);

  imagesWithDuplicate.forEach((src, index) => {
    const img = document.createElement("img");
    img.src = src;
    img.dataset.src = src;
    img.addEventListener("click", () => handleImageClick(img));
    container.appendChild(img);
  });
}

function handleImageClick(imgElement) {
  const src = imgElement.dataset.src;

  if (selectedImages.length >= 2 || imgElement.classList.contains("selected")) {
    return;
  }

  imgElement.classList.add("selected");
  selectedImages.push(src);
  selectedElements.push(imgElement);

  if (selectedImages.length > 0) {
    resetBtn.style.display = "inline-block";
  }

  if (selectedImages.length === 2) {
    verifyBtn.style.display = "inline-block";
  }
}

resetBtn.addEventListener("click", () => {
  selectedImages = [];
  selectedElements.forEach(img => img.classList.remove("selected"));
  selectedElements = [];
  verifyBtn.style.display = "none";
  para.textContent = "";
});

verifyBtn.addEventListener("click", () => {
  if (selectedImages.length === 2) {
    if (selectedImages[0] === selectedImages[1]) {
      para.textContent = "You are a human. Congratulations!";
    } else {
      para.textContent = "We can't verify you as a human. You selected the non-identical tiles.";
    }
  }
  verifyBtn.style.display = "none";
});

initializeGame();
