import express from "express";
import * as SocketIO from "socket.io";
import { Server, createServer } from "http";
import mongoose from "mongoose";
import Application from "./src/app";
import { chatEvent } from "./src/utilitties/constansts";
import { Chats, IChat } from "./src/controller/chat";
import { config } from "dotenv";

config();

export class ApplicationServer {
  private server: Server;
  private io!: SocketIO.Server;
  private user: Map<string, string> = new Map();
  constructor(
    private readonly _app: express.Application,
    private readonly chatController: Chats
  ) {
    this.server = createServer(this._app);
    this.initSocket();
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

  private initSocket(): void {
    this.io = require("socket.io")(this.server, {
      cors: { origin: "*" },
    });
  }

  public listen(): void {
    this.server.listen(this._app.get("PORT"), () => {
      console.log(
        "rada is  listening 👂👂 on http://localhost:%s",
        this._app.get("PORT")
      );
    });

    this.io.on(chatEvent.CONNECT, (socket: any) => {
      console.log("Connected client on port %s.", this._app.get("PORT"));
      //listen for new connections
      socket.on(chatEvent.USER, async (userName: string) => {
        this.user.set(socket.id, userName);
        this.io.emit(chatEvent.online, userName);
      });

      //listen for typing event
      socket.on(chatEvent.typing, async () => {
        const userName = this.user.get(socket.id) as string;
        const result = `${userName} is typing`;
        this.io.emit(chatEvent.typing, result);
      });

      //listen for new chats event
      socket.on(chatEvent.newChat, async (Payload: IChat) => {
        const userName = this.user.get(socket.id) as string;
        const result = { ...Payload };
        this.io.emit(chatEvent.CHAT, result);
      });

      //request for chats that are available
      socket.on(chatEvent.FETCH_CHATS, async () => {
        const chats = await this.chatController.fetchChats();
        this.io.emit(chatEvent.CHATS, chats);
      });

      socket.on(chatEvent.DISCONNECT, () => {
        this.user.delete(socket.id);
        console.log("Client disconnected");
      });
    });
  }

  get app(): express.Application {
    return this._app;
  }
}

const application = new ApplicationServer(Application, new Chats());

application.listen();
