const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');

const nftSchema = mongoose.Schema(
  {
    nftId: { type: String },
    nftName: { type: String },
    image: { type: String },
    description: { type: String },
    price: { type: Number },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    bids: [
      {
        price: Number,
        name: String,
        metamaskId: String,
        status: {
          type: Number,
          default: 0,
        },
      },
    ],
    status: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);
nftSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("nft", nftSchema);
