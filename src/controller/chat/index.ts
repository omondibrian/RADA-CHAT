import Model from '../../model/chat.model';
import { IPusherProvider } from '../../utilitties/pusher';

export interface IChat {
  id?: string;
  content: string;
  media?:any;
  authorName:string;
}
//add database intergrations

export class Chats {
  constructor(private readonly pusher:IPusherProvider){}
 async  createChat(chat: IChat) {
    const newChat = new Model(chat);
    const result = await newChat.save();
    this.pusher.newChat(result);
    return result;
  } 

  async deleteChat(chatId: string) { 
   const chat = await Model.findOneAndRemove(
      { _id: chatId },
      { useFindAndModify: false }
    );
    return chat ? true : false;
  }

  async fetchChat(id: string) {
    const result = await Model.findById(id);
    return result;
  }

  async fetchChats() {
    const result = await Model.find({});
    return result;
  }
}
