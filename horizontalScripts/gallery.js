let images = [];
let currentImage;
let newImage;
let galleryImageChosen;
let galleryImageChosenClone;

function initializeHorizontalGallery() {
  const container = document.getElementById("images-container");
  for (const child of container.childNodes) images.push(child);

  initializeGalleryMovement(container);
  currentImage = document.getElementById("current-image");

  // newImage = document.
  for (let i = 0; i < images.length; i++) {
    const image = images[i];

    let clone =
      i >= images.length / 2
        ? images[i - images.length / 2]
        : images[i + images.length / 2];

    image.addEventListener("pointerup", () => {
      if (galleryImageChosen) {
        galleryImageChosen.classList.remove("image-chosen");
        galleryImageChosenClone.classList.remove("image-chosen");
      }

      currentImage.src = image.src;
      currentImage.alt = image.alt;
      galleryImageChosen = image;
      galleryImageChosenClone = clone;

      galleryImageChosen.classList.add("image-chosen");
      galleryImageChosenClone.classList.add("image-chosen");
    });

    image.addEventListener("pointerenter", () => (pause = true));
    image.addEventListener("pointerleave", () => (pause = false));
  }
}

let pause = false;
let stopHorizontal = false;

function initializeGalleryMovement(container) {
  const imagesLength = images.length;
  for (let i = 0; i < imagesLength; i++) {
    const clone = images[i].cloneNode(true);
    images.push(clone);
    container.appendChild(clone);
  }

  let left = 0;
  let lastTimestamp;

  function animate(timestamp) {
    if (!container) return;

    if (!lastTimestamp) lastTimestamp = timestamp;
    const delta = timestamp - lastTimestamp;
    lastTimestamp = timestamp;

    if (stopHorizontal) {
      images = [];
      currentImage = null;
      newImage = null;
      galleryImageChosen = null;
      galleryImageChosenClone = null;
      stopHorizontal = false;
      return;
    }
    if (pause) return requestAnimationFrame(animate);

    left -= delta * GALLERY_AUTOMATIC_SPEED;
    if (left <= -container.scrollWidth / 2) left = 0;
    container.style.left = left + "px";

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}
