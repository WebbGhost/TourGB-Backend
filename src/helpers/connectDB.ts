import mongoose from 'mongoose';

mongoose.set('strictQuery', true);

const url: string | undefined = process.env.MONGO_DB_URL as string;

const connectDB = async () => {
  try {
    await mongoose.connect(url);
    console.log('Connection to the DataBase was Successfull => 😃');
  } catch (error) {
    console.log(
      'Sorry Something wrong Happen Can not Connect to The Database => 😧',
    );
  }
};
export default connectDB;
