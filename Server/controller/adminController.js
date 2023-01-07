const nftModel = require('../model/nftModel');
const userModel = require('../model/userModel')
const json2csv = require('json2csv').Parser;
const { validationResult } = require('express-validator');
const { id } = require('ethers/lib/utils');
const manangeAdminToken = require('../util/manangeAdminToken');
const bcrypt = require('bcryptjs');

const login = async (req, res) => {
    try {
        console.log(req.body);

        const admin = await userModel.find({ email: req.body.email })
        if (!admin) {
            return res.status(404).send({ message: "User not found", errorCode: "12134567876453253647554" })
        }
        console.log("admin===", admin);
        const success = await bcrypt.compare(req.body.password, admin[0].password)
        if (!success) {
            return res.status(400).send("Incorrect password")
        }
        const { token, refreshTokenSign } = await manangeAdminToken(admin[0]._id, admin[0].status, res);
        res.send({ admin: admin, accessToken: token, refreshToken: refreshTokenSign });
    } catch (error) {
        res.status(400).send({ message: "user cannot be fetched" })
    }
}

const listUser = async (req, res) => {
    try {
        const error = validationResult(req);
        if (error.errors.length != 0) {
            return res.status(400).send("Error msg:" + error.errors[0].msg)
        }
        let page = parseInt(req.query.pageNo);
        let limit = parseInt(req.query.limit)
        const keyWord = req.query.keyWord
        if (!limit) {
            limit = 20;
        }
        if (!page) {
            page = 1;
        }
        console.log("keyWord==" + keyWord, "limit===", limit, "page==", page);
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        let regex = new RegExp(`^${keyWord}`, "i");

        const list = await userModel.find({
            $and: [{ name: regex }]
        }).limit(limit)
            .skip(startIndex)
            .exec();
        console.log(list);
        const userCount = await userModel.find({
            $and: [{ name: regex }]
        }).count();
        console.log("count===", userCount);
        const result = {};
        result.totalCount = userCount;
        result.totalPages = Math.ceil(userCount / limit);
        result.paginatedData = list;

        return res.send(result);
    } catch (error) {
        res.status(400).send(error);

    }
};
const csvExport = async (req, res) => {
    try {
        const users = await userModel.find().sort({ created_date: -1 })

        let owned = users[0].owned.length
        let fields = ['metamaskId', 'name', 'email', 'bio', 'sellCount', 'owned']
        const csvHeader = await new json2csv({ fields })
        const csvFile = csvHeader.parse(users)
        res.setHeader(
            "Content-disposition",
            "attachment;filename=users.csv");
        res.status(200).send(csvFile)
    } catch (error) {
        res.status(500).send(error)
    }
}
const count = async (req, res) => {
    const userCount=await userModel.count();
    const nftCount=await nftModel.count()
    data={}
    data.userCount=userCount;
    data.nftCount=nftCount;
    res.send(data);
  }

module.exports = { listUser, csvExport, login,count }