require("dotenv").config();

const express = require("express");
const userRoute = require("./routes/userRoute");
const adminRoute = require("./routes/adminRoute");
const nftRoute = require("./routes/nftRoute");
const cartRoute = require("./routes/cartRoute");
const wishlist = require("./routes/wishlistRoute");
const emailRoute = require('./routes/emailRoutes')

const cors = require("cors");
require("./database/connection");

const app = express();
const port = Number(process.env.PORT);

app.use(cors());
app.use(express.json());
app.use("/images", express.static("images"));

app.use("/api/users", userRoute);
app.use("/api/admin", adminRoute);
app.use("/api/nft", nftRoute);
app.use("/api/cart", cartRoute);
app.use("/api/wish", wishlist);
app.use("/api/email",emailRoute)
app.use((err, req, res, next) => {
  res.status(404).send({ message: "Something broke!" });
});
app.use("*", (req, res) => {
  res.status(404).send({ message: "this url does not exist" });
});

app.use(
  cors({
    origin: "*",
  })
);

app.listen(port);

const http = require("http").createServer(app);
const io = require("socket.io")(http);
require("./middleware/Socket").connect(io);
