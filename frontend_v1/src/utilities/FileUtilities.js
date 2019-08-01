export function getBase64Async(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

/**
 * Returns a file descriptor with the file data encoded
 * in a base64 encoded string.
 * @param {*} file 
 */
export async function base64EncodeFileAsync(file) {
  const base64EncodedData = await getBase64Async(file);
  return {
    originalSize: file.size, 
    fileType: file.type, 
    ...file,
    base64EncodedData
  };
}

/**
 * Returns a new array in which all File objects
 * waiting to be uploaded are base64 encoded 
 * preparatory to be sent to the server.
 * @param {*} files 
 */
export async function base64EncodeFilesAsync(files) {
  const promises = files.map(file => base64EncodeFileAsync(file));
  const processedFiles = await Promise.all(promises);
  return processedFiles;
}

/**
 * Returns a new array in which all elements that have a file property
 * which is awaiting upload are processed. This function keeps array
 * order intact.
 * @param {*} mixedArray 
 */
export async function base64EncodeFilesFoundInMixedArray(mixedArray) {
  // Get list of files to load and the IDs they belong with
  // So we can splice them in later
  const filePlacementIndexes = [];
  const unprocessedFiles = [];
  mixedArray.forEach((possibleUpload, index) => {
    if(possibleUpload.file && possibleUpload.file.size > 0) {
      unprocessedFiles.push(possibleUpload.file); // get this file
      filePlacementIndexes.push(index); // Splice it back at this index
    }
  });

  // base64 encode the files
  const processedUploads = await base64EncodeFilesAsync(unprocessedFiles);

  // Create a new copy of the photos array
  // Insert the processed photos where the belong after
  // monkey patching the caption back into them.
  const processedFiles = mixedArray.slice(0);
  filePlacementIndexes.forEach((filePlacementIndex, index) => {
    const processedFile = processedUploads[index];
    
    // Remove the original file property
    const originalClone = { ...mixedArray[filePlacementIndex] };
    delete originalClone.file;
    
    // Save the merger of the processed file data and the original's properties
    processedFiles[filePlacementIndex] = { ...processedFile, ...originalClone };
  });

  return processedFiles;
}