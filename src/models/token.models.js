import { Schema, model } from "mongoose";
const tokenSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    token: {
      type: String,
      required: true,
    },
  },

  { timestamps: true }
);

export const Token = model("Token", tokenSchema);
