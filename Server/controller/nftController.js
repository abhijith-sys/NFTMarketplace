const nftModel = require("../model/nftModel");
const userModel = require("../model/userModel");
const { validationResult } = require("express-validator");


// List ,search,sort,filter Nft
const listNft = async (req, res) => {
  let nftDetails = [];
  try {
    const error = validationResult(req)
    if (error.errors.length != 0) {
      return res.status(700).send(error)
    }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const search = req.query.search || "";
    let filter = req.query.filter || "all";
    let filterOptions = await nftModel.find().distinct("status").lean();
    filter = filter == "all" ? [...filterOptions] : req.query.filter;
    let sort = req.query.sort || "nftName";
    sort = req.query.sort ? req.query.sort.split(",") : [sort];
    let sortBy = {};
    if (sort[1]) {
      sortBy[sort[0]] = sort[1];
    } else {
      sortBy[sort[0]] = "asc";
    }

    // for getting owner details and favourites nftDetail

    const [userFavourite, nftDetail] = await Promise.all([
      userModel
        .find({ _id: req.user }, { cart: true, wishlist: true })
        .lean()
        .populate({ path: "cart" })
        .lean()
        .populate({ path: "wishlist" }),
      nftModel
        .find({ nftName: { $regex: search, $options: "i" } }, { bids: false })
        .lean()
        .populate({ path: 'owner', select: 'name profile_photo' })
        .sort(sortBy)
        .where("status")
        .in([...filter]),
    ]);
    let cart, wishList

    nftDetail.forEach((nft) => {
      cart = req.user ? getCart(nft.nftName, userFavourite[0].cart) : 0;
      wishList = req.user ? getWishList(nft.nftName, userFavourite[0].wishlist) : 0;
      nftDetails.push({ nft, cart, wishList })
    })
    const hasNext = nftDetails.length > limit
    let paginatedArray = paginate(nftDetails, limit, page);
    res.send({ docs: paginatedArray, hasNext });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// to get cartDetails
function getCart(nftName, cart) {
  let data = 0;
  cart.forEach((cartData) => {
    if (nftName == cartData.nftName) {
      data = 1;
    }
  });
  return data;
}

// to get wishlistDetails
function getWishList(nftName, wishList) {
  let wish = 0;
  wishList.forEach((wished) => {
    if (nftName == wished.nftName) {
      wish = 1;
    }
  });
  return wish;
}

// paginate Array
function paginate(nftDetails, limit, pageNumber) {
  --pageNumber;
  return nftDetails.slice(pageNumber * limit, (pageNumber + 1) * limit)
}

// NFT detailed view
const detailView = async (req, res) => {
  try {
    const error = validationResult(req)
    if (error.errors.length != 0) {
      return res.status(500).send(error)
    }
    const nft = await nftModel.findById(req.params.id)
      .populate({ path: "owner", select: "name profile_photo metamaskId" });
    nft.bids.sort((a, b) => {
      return b.price - a.price
    })
    res.send(nft);
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
};

const createNft = async (req, res) => {
  try {
    const error = validationResult(req);
    if (error.errors.length != 0) {
      return res.status(400).send("Error msg:" + error.errors[0].msg)
    }
    const { nft_id, nftName, description, image } = req.body;

    const nft = await nftModel.create({
      nftId: nft_id,
      nftName,
      image,
      description,
      owner: req.user
    });
    await userModel.updateOne(
      { _id: req.user, created: { $ne: nft._id } },
      { $push: { created: nft._id } }
    );
    await userModel.updateOne(
      { _id: req.user, owned: { $ne: nft._id } },
      { $push: { owned: nft._id } }
    );

    res.send(nft);

  } catch (error) {
    res.status(400).send("Error" + error);
  }
};

const bidding = async (req, res) => {
  try {
    const error = validationResult(req);
    if (error.errors.length != 0) {
      return res.status(400).send({ "Error msg:": error.errors[0].msg })
    }
    const { price, nft_id } = req.body;
    let bid = []
    const user = await userModel.findById(req.user)
    bid.push({ 'price': price, 'name': user.name, 'metamaskId': user.metamaskId })
    const nft = await nftModel.updateOne(
      { nftId: nft_id },
      {
        $push: { bids: bid },
      }
    );
    if (nft.modifiedCount == 0)
      res.status(500).send("Error:Cannot place bid");
    else
      res.send(nft);

  } catch (error) {
    res.status(404).send("Error" + error);
  }
};

// change name nft_id to id (in validator too)
const updateNft = async (req, res) => {
  try {
    const error = validationResult(req);
    if (error.errors.length != 0) {
      return res.status(400).send("Error msg:" + error.errors[0].msg)
    }

    const { price, description, status, id } = req.body;
    const user = await nftModel.findById(id);
    user.price = price;
    user.description = description;
    user.status = status;
    res.send(await user.save());
  } catch (error) {
    res.send(error);
  }
};

// approve bid
const approveBid = async (req, res) => {
  try {
    const error = validationResult(req);
    if (error.errors.length != 0) {
      return res.status(400).send(error)
    }
    const userOwnedNft = await userModel.findOne({ metamaskId: req.query.metamaskId }, { approvedBids: true });
    console.log(userOwnedNft);
    const nftOwner = await nftModel.findById(req.query.id);
    const nftDetail = await nftModel.findOne({ "bids._id": req.query.bidId }, { bids: true });
    if (nftOwner.owner._id.valueOf() == req.user) {
      nftDetail.bids.forEach((bid, index) => {
        if (bid._id == req.query.bidId) {
          nftDetail.bids[index].status = 1;
          nftDetail.status = 3;
          nftDetail.price = req.query.price
          nftDetail.save();
          let isPresent = userOwnedNft.approvedBids.includes(bid._id);
          if (isPresent === false) {
            userOwnedNft.approvedBids.push({ _id: bid._id, price: req.query.price });
            userOwnedNft.save();
            return res.send("bid approved");
          }
        }
        res.status(404).send("bid not found")
      });
    }
    else {
      return res.status(403).send("you are not the owner")
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const buyNft = async (req, res) => {
  try {
    const { preUserId, newUserId, nftId } = req.body;
    console.log(req.body);


    const newUser = await userModel.findOne(
      {
        metamaskId: { $regex: newUserId, $options: "i" },

      }
    );
    await nftModel.updateOne({ _id: nftId }, { owner: newUser._id, status: 0 });

    res.send("success");
  } catch (error) {
    res.send(error);
  }
};

const closeSales = async (req, res) => {
  const updateUser = await nftModel.updateOne(
    { _id: req.body.id },
    { status: 0, bids: [] }
  );
  if (updateUser.modifiedCount == 0) {
    return res.send("Update failed")
  }
  res.send("Update successfull")
}
module.exports = {
  listNft,
  createNft,
  bidding,
  detailView,
  updateNft,
  approveBid,
  buyNft,
  closeSales
};
