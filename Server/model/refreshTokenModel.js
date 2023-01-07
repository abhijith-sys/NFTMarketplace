const mongoose = require("mongoose");

const refreshSchema = mongoose.Schema(
  {
    refreshToken: {
      type: String,
    },
    userId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Refresh", refreshSchema);
