const fs = require("fs");
const path = require("path");

// Source folder path
const sourceFolderPath = path.resolve(
  __dirname,
  "src/theme/assets/images/icons"
);

// Destination folder path
const destinationFolderPath = path.resolve(
  __dirname,
  "node_modules/react-native-story-view/lib/assets/icons"
);

// List of image files to copy
const imageFiles = [
  "emptyHeartIcon.png",
  "emptyHeartIcon@2x.png",
  "emptyHeartIcon@3x.png",
  "shareIcon.png",
  "shareIcon@2x.png",
  "shareIcon@3x.png",
  "filledHeartIcon.png",
  "filledHeartIcon@2x.png",
  "filledHeartIcon@3x.png",
];

// Copy images
imageFiles.forEach((file) => {
  const sourceFilePath = path.join(sourceFolderPath, file);
  const destinationFilePath = path.join(destinationFolderPath, file);

  // Check if source file exists
  if (fs.existsSync(sourceFilePath)) {
    // Create destination folder if it doesn't exist
    if (!fs.existsSync(destinationFolderPath)) {
      fs.mkdirSync(destinationFolderPath, { recursive: true });
    }

    // Copy file
    fs.copyFileSync(sourceFilePath, destinationFilePath);
    console.log(`Copied ${file} to ${destinationFolderPath}`);
  } else {
    console.log(`Source file ${file} does not exist`);
  }
});
