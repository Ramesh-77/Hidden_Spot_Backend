import { Schema, model } from "mongoose";

const serviceSchema = new Schema(
  {
    admin: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    serviceName: {
      type: String,
      required: true,
    },
    serviceDesc: {
      type: String,
    },
    avatar: {
      type: String,
    },
  },

  { timestamps: true }
);

export const Service = model("Service", serviceSchema);
