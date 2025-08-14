/* eslint-disable no-console */
import {Server} from 'http'
import mongoose from 'mongoose';
import app from './app';
import { envVars } from './app/config/envConfig';

let server:Server;

const main =async ()=>{
    try {
        await mongoose.connect(envVars.DB_URL)
        console.log('Mongoose Connected.');

        server = app.listen(5000, ()=>{
            console.log("Server listening on 5000");
        })
    } catch (error) {
        console.log(error);
        
    }
}
main()


process.on("uncaughtException", (error) => {
  console.log(
    "uncaughtException error detected, server shutting down!",
    error.name
  );
  if (server) {
    server.close();
  }
  process.exit(1);
});

process.on("unhandledRejection", (error: any) => {
  console.log(
    "unhandledRejection error detected, server shutting down!",
    error.name
  );
  if (server) {
    server.close();
  }
  process.exit(1);
});

process.on("SIGTERM", () => {
  console.log("Signal Termination received, shutting down server!");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("Signal Termination received, shutting down server!");
  process.exit(0);
});
