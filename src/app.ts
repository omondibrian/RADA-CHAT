import express from "express";
import cors from "cors";
import morgan from 'morgan';
import helmet from 'helmet';

import chatRoutes from "./routes";
import userRoutes from "./controller/user";
import uploadRoutes from "./controller/imageUploads";
import { errorHandler, notFound, TokenMiddleware } from "./utilitties/middleware";
const app = express();


app.set("PORT", process.env.PORT || 8000);
//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/rada/uploads", express.static("uploads"));
app.use(cors());
app.use(helmet());
app.use(morgan('tiny'));

//upload routes
app.use("/rada/api/v1/uploads", uploadRoutes);
app.use("/rada/api/v1/user", userRoutes);
app.use("/rada/api/v1/chats",TokenMiddleware, chatRoutes);
app.get("/", (req, res) => {
  res.send("hello from rada");
});
app.use(notFound);
app.use(errorHandler);

export default app;
