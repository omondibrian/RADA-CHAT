import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ChatSchema = new Schema({

  media: {
    type: String,
  },
  content: {
    type: String,
    required: true,
  },
  authorName: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },

});
export default mongoose.model("Chat", ChatSchema);