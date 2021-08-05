import multer from "multer";
import { Router } from "express";

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "uploads");
  },
  filename: (_req, file, cb) => {
    cb(null, Date.now()+ file.originalname );
  },
});

const upload = multer({ storage: storage });

const uploadRoutes = Router();

uploadRoutes.post("/image", upload.single("image"), (req, res, next) => {
  try {
    // if (!req.files || Object.keys(req.files).length === 0) {
  //   return res.status(400).send("No profile picture was uploaded.");
  // }
    //save file path in db
    res.json({
      imageUrl: req.file?.path,
    });
  } catch (err: any) {
    next(err);
  }
});

uploadRoutes.post("/images", upload.array("images"), (req, res, next) => {
    try {
      //save file path in db
      const files = req.files  as  Array<Express.Multer.File>;
      const result = files.map((file:any)=>file.path)
      res.json({
        imageUrl: result
      });
    } catch (err: any) {
      next(err);
    }
  });

uploadRoutes.post('/videos',(req,res,next)=>{
  try {
    //save file path in db
    res.json({
      video: req.file?.path
    });
  } catch (err: any) {
    next(err);
  }
})

export default uploadRoutes;
