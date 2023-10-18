const imageAlts = [
  "Duck in water",
  "Night sky with mountains",
  "Mountains",
  "Purple flops",
  "Bird at sea",
  "Tennis",
  "Crystals",
  "Orange ball on wall",
  "Forest",
  "Blue staircase",
];

let lastId;

/**
 * @returns random image
 */
function getRandomImage() {
  let id;
  do id = Math.floor(Math.random() * 10);
  while (id === lastId);
  lastId = id;

  const img = document.createElement("img");
  img.src = `/images/${id}.jpg`;
  img.alt = imageAlts[id];
  return img;
}

let container;
let columns = [];
/**
 * Adds a column
 */
function addColumn() {
  console.log("add column!");
  const column = document.createElement("div");
  column.classList.add("column");
  columns.push(column);
  container.appendChild(column);

  addImagesToColumn(column);
}

/**
 * removes the right-most column
 */
function removeColumn() {
  console.log("remove column!");
  const column = columns.pop();
  if (column) column.remove();
}

/**
 * Adds 10 images to the specified column. When the end is met, add 10 more
 * When each image is clicked, show a popup, which can be removed from clicking anywhere
 *
 * @param {HTMLDivElement} column
 */
function addImagesToColumn(column) {
  const imageAddCount = 10;
  for (let i = 0; i < imageAddCount; i++) {
    const image = getRandomImage();
    image.classList.add("img-hide");
    observeElement({
      element: image,
      onIntersecting: () => {
        image.classList.remove("img-hide");
        if (i === imageAddCount - 1) addImagesToColumn(column);
      },
      onNotIntersecting: () => {},
      delay: 0,
      repeat: false,
    });

    image.addEventListener("pointerup", () => {
      const imageToAdd = document.createElement("img");
      imageToAdd.src = image.src;
      imageToAdd.alt = image.alt;
      imageToAdd.classList.add("clicked-image");

      const textToAdd = document.createElement("div");
      textToAdd.classList.add("clicked-image-label");
      textToAdd.textContent = image.alt;

      const container = document.getElementById("clicked-image-container");
      container.classList.add("clicked-image-container");
      container.appendChild(imageToAdd);
      container.appendChild(textToAdd);

      container.addEventListener(
        "pointerup",
        () => {
          container.classList.remove("clicked-image-container");
          imageToAdd.remove();
          textToAdd.remove();
        },
        { once: true }
      );
    });

    column.appendChild(image);
  }
}

/**
 * Generate the columns with images, 3 by default
 */
function initializeGallery() {
  container = document.getElementById("images-container");
  adjustColumns();
}

/**
 * Adds / removes columns based on necessity
 */

function adjustColumns() {
  const width = document.body.clientWidth;
  let columnsCount = 1;
  if (width > 1700) columnsCount = 5;
  else if (width > 1400) columnsCount = 4;
  else if (width > 1000) columnsCount = 3;
  else if (width > 600) columnsCount = 2;

  let count = 0;
  while (columnsCount !== columns.length) {
    if (columnsCount > columns.length) addColumn();
    else removeColumn();

    count++;
    if (count > 10) return;
  }
}
