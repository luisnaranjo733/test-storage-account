import { DefaultAzureCredential } from "@azure/identity"
import { BlobServiceClient} from "@azure/storage-blob"

const account = "salppcdevtede2cz6plihq";
const defaultAzureCredential = new DefaultAzureCredential();

const blobServiceClient = new BlobServiceClient(
  `https://${account}.blob.core.windows.net`,
  defaultAzureCredential
);

const sampleFpsData = {
  containerName: 'gamefpsdata',
  blobName: '9NTM9HXNLSZX.json',
  content: JSON.stringify({"fps30":4,"fps60":4}),
  sampleUrl: 'https://gaminglppc.blob.core.windows.net/gamefpsdata/9NTM9HXNLSZX.json'
}



async function main() {
    const containerClient = blobServiceClient.getContainerClient(sampleFpsData.containerName);
    await containerClient.createIfNotExists();

    const blockBlobClient = containerClient.getBlockBlobClient(sampleFpsData.blobName);
    const blobExists = await blockBlobClient.exists();
    if(!blobExists) {
      const uploadBlobResponse = await blockBlobClient.upload(sampleFpsData.content, sampleFpsData.content.length);
      console.log(`Upload block blob ${blobName} successfully`, uploadBlobResponse.requestId);
    } else {
      console.log("Blob already exists")
    }

    const blobClient = containerClient.getBlobClient(blobName);
  
    // Get blob content from position 0 to the end
    // In Node.js, get downloaded data by accessing downloadBlockBlobResponse.readableStreamBody
    const downloadBlockBlobResponse = await blobClient.download();
    const downloaded = (
      await streamToBuffer(downloadBlockBlobResponse.readableStreamBody)
    ).toString();
    console.log("Downloaded blob content:", downloaded);
  
    // [Node.js only] A helper method used to read a Node.js readable stream into a Buffer
    async function streamToBuffer(readableStream) {
      return new Promise((resolve, reject) => {
        const chunks = [];
        readableStream.on("data", (data) => {
          chunks.push(data instanceof Buffer ? data : Buffer.from(data));
        });
        readableStream.on("end", () => {
          resolve(Buffer.concat(chunks));
        });
        readableStream.on("error", reject);
      });
    }
  }
  
try {
    main()
} catch (error) {
    console.error("Unhandled exception from main")
    console.error(error)
}