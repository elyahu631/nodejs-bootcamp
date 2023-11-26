// Importing necessary modules and utilities
const fs = require('fs');
const superagent = require('superagent');
const { promisify } = require('util');

// Promisify the readFile and writeFile methods from the fs module for use with async/await
const readFilePromise = promisify(fs.readFile);
const writeFilePromise = promisify(fs.writeFile);

// Async function to get dog images from an API
const getDogImages = async () => {
  try {
    // Construct the file path and read the breed from the file
    const filePath = `${__dirname}/dog.txt`;
    const breed = (await readFilePromise(filePath, 'utf8')).trim();
    console.log(`🔍 Retrieving images for breed: ${breed}`);

    // Making API requests in parallel to get random images for the breed
    const imageUrls = await Promise.all(
      Array.from({ length: 3 }, () =>
        superagent.get(`https://dog.ceo/api/breed/${breed}/images/random`)
      )
    ).then(responses => responses.map(resp => resp.body.message));

    // Log the retrieved image URLs
    console.log(`🐕 Retrieved image URLs:`, imageUrls);

    // Write the image URLs to a file
    const fileWritePath = `${__dirname}/dog-img.txt`;
    await writeFilePromise(fileWritePath, imageUrls.join('\n'));
    console.log(`✅ Saved random dog images to file: ${fileWritePath}`);

    // Return success message
    return '🎉 Successfully retrieved and saved dog images';
  } catch (error) {
    // Log any errors that occur during the process
    console.error(`❌ Error retrieving and saving dog images: ${error.message}`);
    throw error;
  }
};

// Immediately-invoked function expression (IIFE) to run the async process
(async () => {
  try {
    // Start the process and log the initiation message
    console.log('🚀 Starting process to get dog pictures...');
    // Wait for the getDogImages function to complete and log the returned message
    const message = await getDogImages();
    console.log(message);
  } catch (error) {
    // Log any errors that occur during the entire process
    console.error(`⚠️ An error occurred: ${error.message}`);
  }
})();



