import mongoose from "mongoose";
const Schema = mongoose.Schema;

const UserSchema = new Schema({

  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },

});
export default mongoose.model("User", UserSchema);