const userModel = require("../model/userModel");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const getUserWishlist = async (req, res) => {
  try {
    const validatorsError = validationResult(req);
    if (validatorsError.errors.length !== 0) {
      return res.status(400).send(validatorsError.errors[0].msg);
    }
    let { page, limit } = req.query;

    const wishlistValue = await userModel.aggregate([
      {
        $match: { _id: ObjectId(req.user) },
      },
      {
        $lookup: {
          from: "nfts",
          localField: "wishlist",
          foreignField: "_id",
          as: "wishlist",
        },
      },
      {
        $unwind: "$wishlist",
      },
      {
        $lookup: {
          from: "users",
          localField: "wishlist.owner",
          foreignField: "_id",
          as: "wishlist.owner",
        },
      },
      {
        $project: {
          "wishlist._id": 1,
          "wishlist.nftName": 1,
          "wishlist.image": 1,
          "wishlist.description": 1,
          "wishlist.bids": 1,
          "wishlist.status": 1,
          "wishlist.price": 1,
          "wishlist.owner._id": 1,
          "wishlist.owner.name": 1,
          "wishlist.owner.profile_photo": 1,
        },
      },

      {
        $group: {
          _id: "$_id",
          wishlist: {
            $push: "$wishlist",
          },
        },
      },
      {
        $project: {
          hasNextPage: {
            $gt: [{ $size: "$wishlist" }, (page || 0) + (limit || 5)],
          },
          wishlist: {
            $cond: {
              if: { $gte: [{ $size: "$wishlist" }, (page || 0) * (limit || 5)] },
              then: { $slice: ["$wishlist", page || 0, limit || 5] },
              else: "[]",
            },
          },
        },
      },
      // {
      //   $match: { _id: ObjectId(req.user) },
      // },
      // {
      //   $lookup: {
      //     from: "nfts",
      //     localField: "wishlist",
      //     foreignField: "_id",
      //     as: "wishlist",
      //   },
      // },
      // {
      //   $project: {
      //     wishlist: 1,
      //   },
      // },
      // {
      //   $lookup: {
      //     from: "users",
      //     localField: "wishlist.owner",
      //     foreignField: "_id",
      //     as: "wishlist.owner",
      //   },
      // },
      // // {
      // //   $project: {
      // //     "wishlist.owner.name": 1,
      // //     "wishlist.owner.profile_photo": 1,
      // //   },
      // // },
      // {
      //   $group: {
      //     _id: "$_id",
      //     wishlist: {
      //       $push: "$wishlist",
      //     },
      //   },
      // },
      // {
      //   $project: {
      //     hasNextPage: { $gt: [{ $size: "$wishlist" }, (page || 0) + (limit || 5)] },
      //     wishlist: {
      //       $cond: {
      //         if: { $gte: [{ $size: "$wishlist" }, (page || 0) * (limit || 5)] },
      //         then: { $slice: ["$wishlist", page || 0, limit || 5] },
      //         else: "[]",
      //       },
      //     },
      //   },
      // },
      // {
      //   $project: {
      //     "wishli"
      //     "wishlist.owner.name": 1,
      //     "wishlist.owner.profile_photo": 1,
      //     hasNextPage:1
      //   },
      // },
    ]);

    res.send(wishlistValue);
  } catch (error) {
    res.status(404).send({message:error.message});
  }
};

const addToWishlist = async (req, res) => {
  try {
    const validatorsError = validationResult(req);
    if (validatorsError.errors.length !== 0) {
      return res.status(400).send(validatorsError.errors[0].msg);
    }
    let uniqueItems = [...new Set(req.body.wishlistArray)];
    if (uniqueItems.length > 50) {
      return res.status(400).send({message:"only upto 50 nft can be added"});
    }
    const value = await userModel.updateOne(
      { _id: req.user },
      { $addToSet: { wishlist: { $each: uniqueItems } } }
    );
    if (value.modifiedCount !== 1)
      return res.status(404).send({message:"nft is not found or already added"});
    res.send({ message: "value added"});
  } catch (error) {
    res.status(404).send({message:error.message});
  }
};

const deleteWishlistItem = async (req, res) => {
  try {
    const validatorsError = validationResult(req);
    if (validatorsError.errors.length !== 0) {
      return res.status(400).send(validatorsError.errors[0].msg);
    }
    const wishlistItem = await userModel.updateOne(
      { _id: req.user, wishlist: { $eq: req.params.id } },
      { $pull: { wishlist: req.params.id } }
    );
    if (wishlistItem.modifiedCount !== 1)
      return res.status(404).send({ message: "Item not found" });
    res.send({ message: "Item deleted from wishlist" });
  } catch (error) {
    res.status(404).send({message:error.message});
  }
};

module.exports = { getUserWishlist, addToWishlist, deleteWishlistItem };
