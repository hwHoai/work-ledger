import mongoose from 'mongoose';

export const mongoConnectionString = `mongodb+srv://${process.env.MONGO_HOST}:${process.env.MONGO_PASSWORD}@work-ledger-demo.pcnacnc.mongodb.net/?retryWrites=true&w=majority&appName=work-ledger-demo`;

export const connectToDatabase = async () => {
  try {
    console.log('Connecting to MongoDB...', mongoConnectionString);
    await mongoose.connect(mongoConnectionString);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

export const disconnectDatabase = async () => {
  try {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error);
  }
};
