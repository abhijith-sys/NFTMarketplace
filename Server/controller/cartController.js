const userModel = require("../model/userModel");
const { validationResult } = require("express-validator");
const nftModel = require("../model/nftModel");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
//To get the users cart values
const getUserCart = async (req, res) => {
  try {
    const validatorsError = validationResult(req);
    if (validatorsError.errors.length !== 0) {
      return res.status(400).send(validatorsError.errors[0].msg);
    }
    let { page, limit } = req.query;

    const cartValue = await userModel.aggregate([
      {
        $match: { _id: ObjectId(req.user) },
      },
      {
        $lookup: {
          from: "nfts",
          localField: "cart",
          foreignField: "_id",
          as: "cart",
        },
      },
      {
        $unwind: "$cart",
      },
      {
        $lookup: {
          from: "users",
          localField: "cart.owner",
          foreignField: "_id",
          as: "cart.owner",
        },
      },
      {
        $project: {
          "cart._id": 1,
          "cart.nftName": 1,
          "cart.image": 1,
          "cart.description": 1,
          "cart.bids": 1,
          "cart.status": 1,
          "cart.price": 1,

          cartTotal: { $sum: "$cart.price" },
          "cart.owner.name": 1,
          "cart.owner.profile_photo": 1,
        },
      },

      {
        $group: {
          _id: "$_id",
          cart: {
            $push: "$cart",
          },
          cartTotal: { $sum: "$cartTotal" },
        },
      },
      {
        $project: {
          hasNextPage: {
            $gt: [{ $size: "$cart" }, (page || 0) + (limit || 5)],
          },
          cart: {
            $cond: {
              if: { $gte: [{ $size: "$cart" }, (page || 0) * (limit || 5)] },
              then: { $slice: ["$cart", page || 0, limit || 5] },
              else: "[]",
            },
          },
          cartTotal: 1,

        },
      },
    ]);

    res.send(cartValue);
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
};
//to add nft to the cart
const addToCart = async (req, res) => {
  try {
    const validatorsError = validationResult(req);
    if (validatorsError.errors.length !== 0) {
      return res.status(400).send(validatorsError.errors[0].msg);
    }
    const val = await userModel.updateOne(
      { _id: req.user, cart: { $ne: req.body._id } },
      { $push: { cart: req.body._id } }
    );
    if (val.modifiedCount !== 1)
      return res
        .status(404)
        .send({ message: "nft is not found or already added" });
    res.send({ message: "value added" });
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
};

const deleteCartItem = async (req, res) => {
  try {
    const validatorsError = validationResult(req);
    if (validatorsError.errors.length !== 0) {
      return res.status(400).send(validatorsError.errors[0].msg);
    }
    const cartItem = await userModel.updateOne(
      { _id: req.user, cart: { $eq: req.params.id } },
      { $pull: { cart: req.params.id } }
    );
    if (cartItem.modifiedCount !== 1)
      return res.status(400).send({ message: "item not found" });
    res.send({ message: "Item deleted from cart" });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

module.exports = { getUserCart, addToCart, deleteCartItem };