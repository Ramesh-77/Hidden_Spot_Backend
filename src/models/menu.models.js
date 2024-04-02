import { Schema, model } from "mongoose";

const  menuSchema = new Schema(
  {
    admin: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
   
    menuName: {
      type: String,
      required: true
    },
  },

  { timestamps: true }
);




export const Menu = model("Menu", menuSchema);
