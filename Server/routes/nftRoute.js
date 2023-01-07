const router = require("express").Router();
const { listNft,createNft,detailView,bidding, updateNft , approveBid, buyNft, closeSales} = require("../controller/nftController");
const authenticateToken=require('../middleware/auth');
const authenticateTokenTemp=require('../middleware/tempAuth');
const nftValidator =require("../middleware/Validators/NftValidator")

router.post('/', authenticateToken, nftValidator("create-nft"), createNft)
router.get("/list",authenticateTokenTemp, nftValidator("list-nft"), listNft);
router.get("/list/:id",nftValidator('detailed-view'),detailView)
router.put("/bid",authenticateToken,nftValidator("bidding"), bidding)
router.put("/bid/approve",authenticateToken,nftValidator("approve-bid"),approveBid)
router.put("/updateNft",nftValidator("upate-nft"),updateNft)
router.put("/buyNft",buyNft)
router.put("/closeSales",closeSales)
module.exports = router;
