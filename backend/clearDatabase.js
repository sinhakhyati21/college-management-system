import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const clearDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('Connected to MongoDB')

        // Get all collection names
        const collections = await mongoose.connection.db.listCollections().toArray()

        // Drop each collection
        for (const collection of collections) {
            await mongoose.connection.db.dropCollection(collection.name)
            console.log(`Dropped collection: ${collection.name}`)
        }

        console.log('All data cleared successfully!')
    } catch (error) {
        console.error('Error clearing database:', error)
    } finally {
        await mongoose.connection.close()
        console.log('Database connection closed')
    }
}

clearDatabase()