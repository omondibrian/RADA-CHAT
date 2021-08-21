import express from "express";
import { Server, createServer } from "http";
import mongoose from "mongoose";
import Application from "./src/app";
import { Chats } from "./src/controller/chat";
import { config } from "dotenv";
import PusherServiceProvider from "./src/utilitties/pusher";

config();

export class ApplicationServer {
  private server: Server;

  constructor(private readonly _app: express.Application) {
    this.server = createServer(this._app);

    //conect mongoDb
    mongoose.Promise = global.Promise;
    mongoose.connect(process.env.CONNECTION_STRING as string, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    mongoose.connection
      .once("open", function () {
        console.log("connection made sucessfull");
      })
      .on("error", function (error: any) {
        console.log("connection error:", error);
      });
  }

  public listen(): void {
    this.server.listen(this._app.get("PORT"), () => {
      console.log(
        "rada is  listening 👂👂 on http://localhost:%s",
        this._app.get("PORT")
      );
    });
  }

  get app(): express.Application {
    return this._app;
  }
}

const application = new ApplicationServer(Application);

application.listen();
