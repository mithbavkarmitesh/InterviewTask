import ImagePicker, { Options } from "react-native-image-crop-picker";

function openImagePicker(options: Options): Promise<any> {
  // Default configuration
  const defaultOptions: Options = {
    width: 300,
    height: 400,
  };

  // Merge default options with provided options
  const mergedOptions: Options = {
    ...defaultOptions,
    ...options,
  };

  // Return a promise for ImagePicker
  return new Promise((resolve, reject) => {
    ImagePicker.openPicker(mergedOptions)
      .then((image: any) => {
        resolve(image);
      })
      .catch((error: any) => {
        reject(error);
      });
  });
}

export { openImagePicker };
