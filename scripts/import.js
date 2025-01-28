const path = require('path');
const { MongoClient } = require('mongodb');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const requiredEnvVars = [
    'SOURCE_URI',
    'DESTINATION_URI',
    'SOURCE_DB_NAME',
    'DESTINATION_DB_NAME',
    'SOURCE_COLLECTION_NAME',
    'DESTINATION_COLLECTION_NAME'
];

requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
        throw new Error(`Missing environment variable: ${varName}`);
    }
});

async function importCollection() {
    const {
        SOURCE_URI,
        DESTINATION_URI,
        SOURCE_DB_NAME,
        DESTINATION_DB_NAME,
        SOURCE_COLLECTION_NAME,
        DESTINATION_COLLECTION_NAME,
    } = process.env;

    const sourceClient = new MongoClient(SOURCE_URI);
    const destinationClient = new MongoClient(DESTINATION_URI);

    try {
        await sourceClient.connect();
        await destinationClient.connect();

        const sourceDb = sourceClient.db(SOURCE_DB_NAME);
        const destinationDb = destinationClient.db(DESTINATION_DB_NAME);

        const sourceCollection = sourceDb.collection(SOURCE_COLLECTION_NAME);
        const destinationCollection = destinationDb.collection(DESTINATION_COLLECTION_NAME);

        const documents = await sourceCollection.find({}).toArray();

        console.log(`Retrieved ${documents.length} documents from ${SOURCE_COLLECTION_NAME}.`);

        if (documents.length === 0) {
            console.log('No documents to import. Exiting.');
            return;
        }

        const transformedDocuments = documents.map(doc => ({
            name: doc.name,
            link: doc.link,
            user: doc.user,
            folderId: null,
        }));

        const result = await destinationCollection.insertMany(transformedDocuments);
        console.log(`${result.insertedCount} documents were inserted into ${DESTINATION_COLLECTION_NAME}.`);
    } catch (error) {
        console.error('Error importing collection:', error);
    } finally {
        await sourceClient.close();
        await destinationClient.close();
    }
}

importCollection().catch(console.error);
