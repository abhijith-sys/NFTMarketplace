const Refresh = require("../model/refreshTokenModel");
const jwt = require("jsonwebtoken");
const manangeRefreshToken = async (_id, res) => {
  try {
    const token = jwt.sign({ userId: _id }, process.env.SECRET_ACCESS_TOKEN, {
      expiresIn: process.env.ACCESS_EXPIRESIN,
    });
    const refreshTokenSign = jwt.sign(
      { userId: _id },
      process.env.SECRET_REFRESH_TOKEN,
      { expiresIn: process.env.REFRESH_EXPIRESIN }
    );
    const authUser = await Refresh.updateOne(
      {
        userId: _id,
      },
      { refreshToken: refreshTokenSign, userId: _id }
    );
    if (authUser.modifiedCount !== 1) {
      await Refresh.create({ refreshToken: refreshTokenSign, userId: _id });
    }
    return { token, refreshTokenSign };
  } catch (error) {
    return res.status(404).send(error);
  }
};

module.exports = manangeRefreshToken;
