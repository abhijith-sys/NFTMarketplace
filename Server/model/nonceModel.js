const mongoose = require("mongoose");

const nonceSchema = mongoose.Schema(
  {
    nonce: {
      type: String,
    },
    metamaskId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Nonce", nonceSchema);
