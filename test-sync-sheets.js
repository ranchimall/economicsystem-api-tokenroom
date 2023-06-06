const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Set the path to the Google service account key file
const keyFilePath = path.join(__dirname, 'config' ,'*.json');

// Set the ID of the Google Drive folder to sync
const folderId = '';

// Set the local directory path to sync the folder to
const localDirectory = path.join(__dirname, 'data');

async function waitForAPI() {
    while (true) {
      try {
        await axios.get('http://0.0.0.0:3000/helloworld'); // Adjust the URL based on your API's endpoint
        break;
      } catch (error) {
        console.log('API is not running yet. Retrying in 5 seconds...');
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }
  }

async function downloadFile(drive, fileId, filePath) {
    const dest = fs.createWriteStream(filePath);
    const res = await drive.files.export({
        fileId,
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // MIME type for Google Sheets
      }, { responseType: 'stream' });
  
    return new Promise((resolve, reject) => {
      res.data
        .on('end', () => {
          console.log(`Downloaded file: ${filePath}`);
          resolve();
        })
        .on('error', (err) => {
          console.error(`Error downloading file: ${filePath}`, err);
          reject(err);
        })
        .pipe(dest);
    });
  }

async function syncFolder(drive, folderId, localPath) {
    // List all files and subfolders in the folder
    const res = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      fields: 'files(id, name, mimeType)',
    });
  
    const items = res.data.files;
  
    // Create the local folder if it doesn't exist
    if (!fs.existsSync(localPath)) {
      fs.mkdirSync(localPath);
    }
    
    // // Iterate over files and subfolders
    for (const item of items) {
       const { id, name, mimeType } = item;
       const itemPath = `${localPath}/${name}`;

       if (mimeType === 'application/vnd.google-apps.folder') {
        console.log(`Ignoring folder ${itemPath}`)
        // Synchronize subfolders recursively
        //await syncFolder(drive, id, itemPath);
       } else {
            // Download files
            await downloadFile(drive, id, itemPath);
       }
     }
  }

async function runSync() {
  try {
    // Load the Google service account credentials
    const keyFileContent = fs.readFileSync(keyFilePath);
    const credentials = JSON.parse(keyFileContent);

    // Create an authentication instance
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    });

    // Authorize with the Google Drive API
    const authClient = await auth.getClient();

    // Create a Google Drive API instance
    const drive = google.drive({ version: 'v3', auth: authClient });

    await syncFolder(drive, folderId, localDirectory); // Update with the path to your local folder

  } catch (error) {
    console.error('Error during sync:', error);
  }
}

async function main() {
    await waitForAPI();
    while (true) {
      await runSync();
      console.log('Waiting for next sync...');
      await new Promise((resolve) => setTimeout(resolve, 60000)); // Delay between syncs (in milliseconds)
    }
  }

main();
