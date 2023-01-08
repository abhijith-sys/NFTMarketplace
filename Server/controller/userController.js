const userModel = require("../model/userModel");
const crypto = require("crypto");
const { ethers } = require("ethers");
const nonceModel = require("../model/nonceModel");
const manangeRefreshToken = require("../util/manageToken");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const getNonce = async (req, res) => {
  try {
    const validatorsError = validationResult(req);
    if (validatorsError.errors.length !== 0) {
      return res.status(400).send(validatorsError.errors[0].msg);
    }

    const nonce = crypto.randomBytes(16).toString("base64");
    const user = await nonceModel.updateOne(
      { metamaskId: { $regex: req.body.metamaskId, $options: "i" } },
      {
        nonce: nonce,
        metamaskId: req.body.metamaskId,
      }
    );
    if (user.modifiedCount === 0) {
      await nonceModel.create({
        nonce: nonce,
        metamaskId: req.body.metamaskId,
      });
    }

    res.send({ nonce: nonce });
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
};

const verifySignature = async (req, res) => {
  try {
    const validatorsError = validationResult(req);
    if (validatorsError.errors.length !== 0) {
      return res.status(400).send(validatorsError.errors[0].msg);
    }
    const selectedNonce = await nonceModel
      .findOne({
        metamaskId: { $regex: req.body.metamaskId, $options: "i" },
      })
      .lean();

    if (selectedNonce === null) {
      return res.status(404).send({ message: "nonce not found" });
    }
    const metamaskId = ethers.utils.verifyMessage(
      process.env.SECRET_MESSAGE + selectedNonce.nonce,
      req.body.verificationMessage
    );
    if (metamaskId.toLowerCase() !== req.body.metamaskId.toLowerCase()) {
      return res.status(404).send({ message: "verification failed" });
    }
    await nonceModel.deleteOne({
      metamaskId: { $regex: req.body.metamaskId, $options: "i" },
    });
    const selectedUser = await userModel
      .findOne(
        { metamaskId: { $regex: metamaskId, $options: "i" } },
        { metamaskId: true }
      )
      .lean();

    if (selectedUser === null) {
      const newUser = await userModel.create({
        metamaskId: metamaskId,
      });
      const { token, refreshTokenSign } = await manangeRefreshToken(
        newUser._id,
        res
      );
      newUser.accessToken = token;
      newUser.refreshToken = refreshTokenSign;
      res.send(newUser);
    } else {
      const { token, refreshTokenSign } = await manangeRefreshToken(
        selectedUser._id,
        res
      );
      selectedUser.accessToken = token;
      selectedUser.refreshToken = refreshTokenSign;
      res.send(selectedUser);
    }
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
};
const userdetails = async (req, res) => {
  try {
    const validatorsError = validationResult(req);
    if (validatorsError.errors.length !== 0) {
      return res.status(400).send(validatorsError.errors[0].msg);
    }
    const updatedUser = await userModel.updateOne(
      { _id: req.user },
      {
        name: req.body.name,
        email: req.body.email,
        bio: req.body.bio,
      }
    );
    if (updatedUser.matchedCount === 0) {
      return res.status(404).send({ message: "no user found" });
    }
    res.send({ message: "profile updated" });
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
};

//add cover photo
const addUserCoverPhoto = async (req, res) => {
  try {
    const validatorsError = validationResult(req);
    if (validatorsError.errors.length !== 0) {
      return res.status(400).send(validatorsError.errors[0].msg);
    }

    const updateUser = await userModel.updateOne(
      { _id: req.user },
      { cover_photo: req.file.path }
    );
    if (updateUser.matchedCount === 0) {
      return res.status(404).send({ message: "no user found" });
    }
    res.send({ message: "cover photo updated" });
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
};

//add profile photo
const addUserProfilePhoto = async (req, res) => {
  try {
    const validatorsError = validationResult(req);
    if (validatorsError.errors.length !== 0) {
      return res.status(400).send(validatorsError.errors[0].msg);
    }
    const updateUser = await userModel.updateOne(
      { _id: req.user },
      { profile_photo: req.file.path }
    );
    if (updateUser.matchedCount === 0) {
      return res.status(404).send({ message: "no user found" });
    }
    res.send({ message: "profile photo updated" });
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const value = await userModel
      .findById(req.user, {
        metamaskId: 1,
        cover_photo: 1,
        profile_photo: 1,
        bio: 1,
        email: 1,
        name: 1,
      })
      .lean();
    res.send(value);
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
};

const Refresh = require("../model/refreshTokenModel");
const jwt = require("jsonwebtoken");
const nftModel = require("../model/nftModel");

const refreshUserToken = async (req, res) => {
  try {
    const { userId } = jwt.verify(
      req.body.refreshToken,
      process.env.SECRET_REFRESH_TOKEN
    );

    const preUser = await Refresh.findOne({
      refreshToken: req.body.refreshToken,
    }).lean();
    if (preUser === null)
      return res.status(401).send({ message: "invalid access" });

    const token = jwt.sign(
      { userId: userId },
      process.env.SECRET_ACCESS_TOKEN,
      {
        expiresIn: process.env.ACCESS_EXPIRESIN,
      }
    );
    res.send({ accessToken: token, refreshToken: req.body.refreshToken });
  } catch (error) {
    Refresh.deleteOne({ refreshToken: req.body.refreshToken });
    res.status(404).send({ refeshTokenError: error });
  }
};
const getUserCollectedNft = async (req, res) => {
  try {
    const validatorsError = validationResult(req);
    if (validatorsError.errors.length !== 0) {
      return res.status(400).send(validatorsError.errors[0].msg);
    }
    let { page, limit } = req.query;

    const query = { owner: req.user };
    const ownedValue = await nftModel.paginate(query, {
      page: page || 1,
      limit: limit || 5,
      populate: {path:"owner",select:"profile_photo name"},
      lean: true,
    });
    res.send(ownedValue);
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
};
const getTopTrendingNftCollection = async (req, res) => {
  try {
    const limit = 3;
    const users = await userModel
      .find({}, { _id: true })
      .sort({ sellCount: -1 })
      .limit(limit)
      .lean();
    const collectedNft = await nftModel
      .aggregate([
        {
          $match: { owner: { $in: users.map((doc) => doc._id) } },
        },
        {
          $lookup: {
            from: "users",
            localField: "owner",
            foreignField: "_id",
            as: "owner",
          },
        },

        {
          $group: {
            _id: "$owner.name",
            nft: { $push: "$$ROOT" },
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            "nft._id": 1,
            "nft.nftId": 1,
            "nft.nftName": 1,
            "nft.image": 1,
            "nft.owner.name": 1,
            "nft.owner.profile_photo": 1,
            "nft.owner.sellCount": 1,
            count:1
          },
        },
        {
          $sort: { "nft.owner.sellCount": -1 },
        },
        {
          $limit: limit,
        },
      ])
      .exec();
    res.send(collectedNft);
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
};
const getUserCreatedNft = async (req, res) => {
  try {
    const validatorsError = validationResult(req);
    if (validatorsError.errors.length !== 0) {
      return res.status(400).send(validatorsError.errors[0].msg);
    }
    let { page, limit } = req.query;

    const createdNft = await userModel.aggregate([
      {
        $match: { _id: ObjectId(req.user) },
      },
      {
        $lookup: {
          from: "nfts",
          localField: "created",
          foreignField: "_id",
          as: "created",
        },
      },
      {
        $project: {
          name: true,
          profile_photo: true,
          hasNextPage: {
            $gt: [{ $size: "$created" }, (page || 0) + (limit || 5)],
          },
          created: {
            $cond: {
              if: { $gte: [{ $size: "$created" }, (page || 0) * (limit || 5)] },
              then: { $slice: ["$created", page || 0, limit || 5] },
              else: "[]",
            },
          },
        },
      },
    ]);
    res.send(createdNft);
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
};
const getTopCreators = async (req, res) => {
  try {
    const users = await userModel
      .find({}, { profile_photo: true, name: true, metamaskId: true ,sellCount:true})
      .sort({ sellCount: -1 })
      .limit(12)
      .lean();
    res.send(users);
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
};
const getUserById = async (req, res) => {
  try {
    const validatorsError = validationResult(req);
    if (validatorsError.errors.length !== 0) {
      return res.status(400).send(validatorsError.errors[0].msg);
    }

    let { page, limit } = req.query;

    const query = { owner: req.params.id };
    const ownedValue = await nftModel.paginate(query, {
      page: page || 1,
      limit: limit || 5,
      populate: {path:"owner",select:"metamaskId name profile_photo cover_photo"},
      select:"nftName image price",
      lean: true,
    });
    res.send(ownedValue);
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
};
const getUserApprovedBids = async (req, res) => {
  const user = await userModel.findById(req.user, { approvedBids: true });
  const userIdList = user.approvedBids.map((obj) => {
    return obj._id;
  });
  const nftDetail =await nftModel.find({"bids._id":{$in:userIdList}},{nftName:1,image:1,description:1,price:1})

  res.send(nftDetail);
};

const addLinks = async (req, res) => {
  const validatorsError = validationResult(req);
  if (validatorsError.errors.length !== 0) {
    return res.status(400).send(validatorsError.errors[0].msg);
  }
  try {
    await userModel.updateOne(
      { _id: req.user },
      {
        link: {
          discord: req.body.links.discord,
          youtube: req.body.links.youtube,
          twitter: req.body.links.twitter,
          instagram: req.body.links.instagram,
        },
      }
    );

    res.send({ message: "success" });
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
};

const checkOutCart = async (req, res) => {
  try {
    const userCart = await userModel.findById(req.user, { cart: true });
    userCart.cart.forEach(async (cart) => {
      const nft = await nftModel.findById(cart, { owner: true });
      nft.owner = req.user;
      nft.save();
    });
    await userModel.updateOne({ _id: req.user }, { $set: { cart: [] } });
    res.send(userCart);
  } catch (error) {
    res.status(404).send(error.message);
  }
};

module.exports = {
  getNonce,
  verifySignature,
  userdetails,
  addUserCoverPhoto,
  addUserProfilePhoto,
  getUser,
  refreshUserToken,
  getUserCollectedNft,
  getUserCreatedNft,
  getTopTrendingNftCollection,
  getTopCreators,
  getUserById,
  getUserApprovedBids,
  addLinks,
  checkOutCart,
};
