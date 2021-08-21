import multer from "multer";
import { Router } from "express";
import { Chats, IChat } from "../controller/chat";
import PusherServiceProvider from "../utilitties/pusher";

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "uploads");
  },
  filename: (_req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage });

const chatRoutes = Router();
const controller = new Chats(new PusherServiceProvider());
chatRoutes.post("/", upload.single("media"), async (req, res, next) => {
  try {
    let chat: IChat;
    if (req.file) {
      chat = {
        authorName: req.body.authorName,
        content: req.body.content,
        media: req.file.path,
      };
    } else {
      chat = {
        authorName: req.body.authorName,
        content: req.body.content,
      };
    }
    const result = await controller.createChat(chat);
    res.json({ chat: result });
  } catch (err: any) {
    next(err);
  }
});

chatRoutes.delete("/:id", async (req, res, next) => {
  try {
    const result = await controller.deleteChat(req.params.id);
    res.json({ chat: result });
  } catch (e: any) {
    next(e);
  }
});

chatRoutes.get("/:id", async (req, res, next) => {
  try {
    const result = await controller.fetchChat(parseInt(req.params.id));
    res.json({ chat: result });
  } catch (e: any) {
    next(e);
  }
});

chatRoutes.get("/", async (req, res, next) => {
  try {
    const result = await controller.fetchChats();
    res.json({ chats: result });
  } catch (e: any) {
    next(e);
  }
});

export default chatRoutes;
