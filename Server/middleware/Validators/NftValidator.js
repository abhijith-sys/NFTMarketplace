const { body, query, param } = require("express-validator");
const regex = "((http|https)://)(www.)?[a-zA-Z0-9@:%._\\+~#?&//=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%._\\+~#?&//=]*)";
const nftModel = require("../../model/nftModel")
const mongoose =require('mongoose');


const nftValidator = (expression) => {
    switch (expression) {
        case "create-nft": {
            return [
                body("nft_id")
                    .trim()
                    .notEmpty()
                    .withMessage("provide nftId")
                    .isLength({ min: 2, max: 10 })
                    .withMessage({
                        message: 'nft_id must be between 2 & 10',
                        errorCode: 1,
                    })
                    .custom(async value => {
                        const nft = await nftModel.findOne({ nftId: value });
                        if (nft) {
                            return Promise.reject("Nft already exists with this ID");
                        }
                    }),

                body("nftName")
                    .trim()
                    .notEmpty()
                    .withMessage("provide nft name")
                    .isLength({ min: 5, max: 30 })
                    .withMessage("Name should be of length between 5 & 30"),


                body("image")

                    .notEmpty()
                    .withMessage("provide image")
                    .matches(regex)
                    .withMessage("Invalid image uri")
            ]
        }
        case "bidding": {
            return [
                body("nft_id")
                    .exists()
                    .notEmpty()
                    .withMessage("Provide nft_id")
                    .isLength({ min: 2, max: 10 })
                    .withMessage({
                        message: 'nft_id must be between 2 & 10',
                        errorCode: 1,
                    })
                    .custom(async value => {
                        const nft = await nftModel.findOne({ nftId: value });
                        if (!nft) {
                            return Promise.reject("Nft not found");
                        }
                    }),

                body("price")
                    .notEmpty()
                    .withMessage("provide price")
                    .isNumeric()
                    .withMessage("price should be a number")
                    .isLength({ min: 1, max: 10 })
                    .withMessage("price length ranges between 1 & 10")

            ]
        }


        case "upate-nft": {
            return [
                body("id")
                    .notEmpty()
                    .withMessage("Provide id")
                    .custom((id) => mongoose.isValidObjectId(id))
                    .withMessage("Provide valid objectId")
                    .custom(value => {
                        return nftModel.findById(value).then(nft => {
                            if (!nft) {
                                return Promise.reject("Nft not found")
                            }

                        })
                    }),
                   
                body("status")
                    .if(body("price").notEmpty())
                    .notEmpty()
                    .withMessage("provide status")
                    .isIn(['1', '2'])
                    .withMessage("provide valid status code"),

                body("price")
                    .if(body("status").notEmpty())
                    .notEmpty()
                    .withMessage("provide price")
                    .isNumeric()
                    .withMessage("price should be a number")
                    .isLength({ min: 1, max: 10 })
                    .withMessage("price length ranges between 1 & 10")
            ]
        }
        case "list-nft": {
            return [
                query("limit")
                .optional()
                .isNumeric()
                .withMessage("limit must be number"),

                query("filter")
                .optional()
                .isNumeric()
                .withMessage("filter must be number"),

                query("search")
                .optional()
                .isAlpha()
                .withMessage("only alphabets are allowed"),

            ]
        }

        case "approve-bid": {
            return [
                query("bidId")
                    .notEmpty()
                    .withMessage("provide bid ID")
                    .custom((bidId)=>mongoose.isValidObjectId(bidId))
                    .withMessage("provide valid bid Id"),

                query("id")
                    .notEmpty()
                    .withMessage("provide id")
                    .custom((id)=>mongoose.isValidObjectId(id))
                    .withMessage("provid valid id")

            ]
        }

        case "detailed-view":{
            return[
                param("id")
                .notEmpty()
                .withMessage("provide id")
                .custom((id)=> mongoose.isValidObjectId(id))
                .withMessage("provide valid id"),
            ]
        }
        
        case "close-sales": {
            return [
                query("id")
                    .notEmpty()
                    .withMessage("provide id")
                    .custom((id) => mongoose.isValidObjectId(id))
                    .withMessage("Provide valid objectId"),

            ]
        }

        default:
            return "error exists"
    }
};

module.exports = nftValidator
