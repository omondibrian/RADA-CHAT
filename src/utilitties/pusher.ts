import Pusher from "pusher";
import { config } from "dotenv";

import { chatEvent } from "./constansts";

config();

export interface IPusherProvider {
  newConnection(userName: string): Promise<void>;
  newChat(payload: any): void;
  fireTyping(userName: string): Promise<void>;
}

class PusherServiceProvider implements IPusherProvider {
  private pusherServerConn: Pusher = new Pusher({
    appId: process.env.app_id as string,
    key: process.env.key as string,
    secret: process.env.secret as string,
    cluster: process.env.cluster as string,
    useTLS: false,
  });

  constructor() {
    console.log("pusher initialised ....");
  }

  newConnection(userName: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  /**
   *
   * @param {ChatModel} payload chat payload to be broadcasted to other nodes
   */
  newChat(payload: any) {
    this.pusherServerConn.trigger("radaComms", chatEvent.CHAT, {
      chat: payload,
    });
  }
  fireTyping(userName: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}

export default PusherServiceProvider;
