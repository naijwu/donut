import { Storage } from '@google-cloud/storage'
import * as path from 'path'
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GCLOUD_PROJECT_ID = process.env.PROJECT_ID
const GCLOUD_PROJECT_KEYFILE = path.join(__dirname, `./${process.env.BUCKET_KEYFILE}`)

const storage = new Storage({
    keyFilename: GCLOUD_PROJECT_KEYFILE,
    projectId: GCLOUD_PROJECT_ID
})

const bucket = storage.bucket(process.env.BUCKET_NAME)

/**
 * Upload files for usage with a test
 * @param {*} file 
 * @param {*} path the path to file: should be the test ID
 * @param {*} index the variance index
 * @returns 
 */
export const uploadFile = (file, path, index) => new Promise ((res, rej) => {
    const { buffer, mimetype } = file;

    const mtmap = {
        "image/jpeg": ".jpeg",
        "image/png": ".png",
        "image/webp": ".webp"
    }

    if (!mtmap[mimetype]) return

    const uname = uuidv4();
    const fileName = `${uname}${mtmap[mimetype]}`
    const blob = bucket.file(path + '/' + fileName);

    const blobStream = blob.createWriteStream({
        resumable: true
    })

    blobStream.on('finish', async () => {
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${path}/${fileName}`;
        await blob.makePublic();
        await res(publicUrl);
    }).on('error', (err) => {
        console.error(err);
        rej(err, 'Failed to upload File');
    }).end(buffer)
});

/**
 * 
 * @param {*} folderName the name of folder to delete
 */
export async function deleteFolder(folderName) {
    const options = {
      prefix: folderName,
    };

    // Lists files in the bucket
    const [files] = await bucket.getFiles(options);

    for (let i = 0; i < files.length; i++) {
        await bucket.file(files[i].name).delete();
    }

    console.log(`Deleted all files in /${folderName}`)
}

export async function deleteFilesInFolder(folder, files) {
    
    for (let i = 0; i < files.length; i++) {
        try {
            await bucket.file(`${folder}/${files[i]}`).delete();
        } catch (err) {
            console.error(err);
        }
    }
}