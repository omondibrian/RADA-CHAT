import multer from "multer";
import { Router } from "express";
import { Chats, IChat } from "../controller/chat";

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
const controller = new Chats();
chatRoutes.post(
  "/",
  upload.single("media"),
  async (req, res, next) => {
    try {
      let chat: IChat ;
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
  }
);

export default chatRoutes;
