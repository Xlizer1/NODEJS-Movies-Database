import express from 'express';
import mongoose from 'mongoose';
import setupRoutes from './routes.js';
import bodyParser from 'body-parser';

const start = async () => {

   try {
      await mongoose.connect('mongodb://127.0.0.1:27017/netflux', {
      useNewUrlParser: true,
      useUnifiedTopology: true
   });

      console.log("connected to the DB");
      
      const app = express();
      app.use(bodyParser.urlencoded());

      console.log("app is created, lets setup routes");
      setupRoutes(app);

      console.log("App routes added, lets listen on port 3000");
      app.listen(3000);

   }
   
   catch (error) {
      console.error(error);
   }
}
start();