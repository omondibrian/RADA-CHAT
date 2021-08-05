import express from "express";
import cors from "cors";

import uploadRoutes from "./controller/imageUploads";
import chatRoutes from "./routes";
const app = express();


app.set("PORT", process.env.PORT || 8000);
//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
app.use(cors());

//upload routes
app.use("/rada/api/v1/uploads", uploadRoutes);

app.use("/rada/api/v1/chats", chatRoutes);
app.get("/", (req, res) => {
  res.send("hello from rada");
});


export default app;
