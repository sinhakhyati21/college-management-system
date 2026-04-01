import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
import connectDB from './src/db/index.js'

const cleanupDatabase = async () => {
    try {
        console.log('🔄 Connecting to database...')
        await connectDB()
        
        console.log('⚠️  Deleting all data from database...')
        
        // Get all collections
        const collections = await mongoose.connection.db.listCollections().toArray()
        
        for (const collection of collections) {
            console.log(`🗑️  Dropping collection: ${collection.name}`)
            await mongoose.connection.db.dropCollection(collection.name)
        }
        
        console.log('✅ All data deleted successfully!')
        console.log('📊 Database is now clean and ready to use')
        
        process.exit(0)
    } catch (error) {
        console.error('❌ Error cleaning database:', error.message)
        process.exit(1)
    }
}

cleanupDatabase()
