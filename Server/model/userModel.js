const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const userSchema = mongoose.Schema(
  {
    metamaskId: { type: String },
    name: { type: String },
    email: { type: String, unique: false },
    profile_photo: { type: String, unique: false },
    cover_photo: { type: String, unique: false },
    bio: { type: String },
    password: { type: String },
    status: { type: Number },
    sellCount: { type: Number },
    approvedBids: { type: Array },
    cart: [
      {
        type: Schema.Types.ObjectId,
        ref: "nft",
      },
    ],
    wishlist: [
      {
        type: Schema.Types.ObjectId,
        ref: "nft",
      },
    ],
    created: [
      {
        type: Schema.Types.ObjectId,
        ref: "nft",
      },
    ],
    // owned: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: "nft",
    //   },
    // ],
    link: {
      discord: { type: String },
      youtube: { type: String },
      twitter: { type: String },
      instagram: { type: String },
    },

    accessToken: { type: String },
    refreshToken: { type: String },
    cartTotal: { type: Number },
    hasNextPage: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("user", userSchema);
