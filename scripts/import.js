const { MongoClient } = require('mongodb');
require('dotenv').config();

async function importCollection() {
    const sourceUri = process.env.SOURCE_URI;
    const destinationUri = process.env.DESTINATION_URI;
    const sourceDbName = process.env.SOURCE_DB_NAME;
    const destinationDbName = process.env.DESTINATION_DB_NAME;
    const sourceCollectionName = process.env.SOURCE_COLLECTION_NAME;
    const destinationCollectionName = process.env.DESTINATION_COLLECTION_NAME;

    const sourceClient = new MongoClient(sourceUri);
    const destinationClient = new MongoClient(destinationUri);

    try {
        await sourceClient.connect();
        await destinationClient.connect();

        const sourceDb = sourceClient.db(sourceDbName);
        const destinationDb = destinationClient.db(destinationDbName);

        const sourceCollection = sourceDb.collection(sourceCollectionName);
        const destinationCollection = destinationDb.collection(destinationCollectionName);

        const documents = await sourceCollection.find({}).toArray();

        console.log(`Retrieved ${documents.length} documents from ${sourceCollectionName}.`);

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
        console.log(`${result.insertedCount} documents were inserted into ${destinationCollectionName}.`);
    } catch (error) {
        console.error('Error importing collection:', error);
    } finally {
        await sourceClient.close();
        await destinationClient.close();
    }
}

importCollection().catch(console.error);
