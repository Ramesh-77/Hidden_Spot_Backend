import { Schema, model } from "mongoose";

const itemSchema = new Schema(
  {
    itemName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    itemPrice: {
      type: String,
      required: true,
    },
    itemQuantity: {
      type: String,
      default: 1,
    },
    menu: {
      type: Schema.Types.String,
      ref: "Menu",
    },
    admin: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    itemDesc: {
      type: String,
    },
    avatar: [
      {
        type: String,
        default:
          "https://imgix.theurbanlist.com/content/article/Blackwood_bacon_and_egg_roll.jpg",
      },
    ],
    
  },
  { timestamps: true }
);

export const Item = model("Item", itemSchema);
