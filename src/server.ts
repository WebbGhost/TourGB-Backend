import app from './app';
import connectDB from './helpers/connectDB';

process.on('uncaughtException', (err: any) => {
  console.error(err.name, err.message);
  console.log('Uncaught Exception  ⚠️ SHUTTING DOWN');

  process.exit(1);
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server listening on http://localhost:${PORT}`);
});

process.on('unhandledRejection', (err: any) => {
  console.error(err.name, err.message);
  console.log('UNHANDLED REJECTION ⚠️ SHUTTING DOWN');
  server.close = () => {
    process.exit(1);
  };
});
