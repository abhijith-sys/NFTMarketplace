import React, { useState, useEffect, useCallback } from "react";
import {
  addToCart,
  approveBids,
  buyNftChnageOwership,
  getdetailsWithId,
  RemoveFromCart,
  updateNftDetails,
  bidding,
  getSelectedNfTId,
  closeSales,
} from "../../Service/nftService";
import detailcss from "./detail.module.css";
import Modal from "@mui/material/Modal";
import auct from "../Auction/Auction.module.css";
import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
import { ethers } from "ethers";
import Marketplace from "../../Marketplace.json";
function DetailView(props) {
  const style = {
    position: "absolute",
    top: "40%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    height: 350,
    bgcolor: "#2b2b2b",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  const [cartornot, setcartornot] = useState(false);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [option, setOption] = React.useState(false);
  const handleOption = () => setOption(true);
  const handleCloseModal = () => setOption(false);
  const [biddetails, setbiddetails] = useState({ price: "" });
  const [updateNft, setupdateNft] = useState();
  const [biddata, setbiddata] = useState([]);
  const [nft, setNft] = useState();
  const [selectedOption, setSelectedOption] = useState("");
  const [formErrors, setformErrors] = useState({});
  const [updateformErrors, setupdateformErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [isSubmitBid, setIsSubmitBid] = useState(false);
  const [own, setOwn] = useState();
  const [priceDiv, setPriceDiv] = useState(false);
  const [balance, setBalance] = useState(null);
  const accountId = localStorage.getItem("account");
  const [metamaskId, setMetamaskId] = useState("null");
  const [Spinner, setSpinner] = useState(false);
  const [bidapproveData, setbidapproveData] = useState("");
  const imagehosturl = "http://localhost:8080/";
  const [price, setPrice] = useState("");
  const [trans, setTrans] = useState("");
  const getdata = useCallback(() => {
    if (props.id) {
      localStorage.setItem("nft_id", props.id);
    }
    let nft_id = "";
    if (localStorage.getItem("nft_id")) {
      nft_id = localStorage.getItem("nft_id");
    } else {
      nft_id = getSelectedNfTId();
    }
    setSpinner(true);
    getdetailsWithId(nft_id).then((response) => {
      console.log("hiii", response);
      setNft(response);
      setOwn(response.owner);
      setMetamaskId(response.owner.metamaskId);
      console.log("nft res owner", response.owner);
      setbiddata(response.bids);
      async function getBalance() {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        let accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        const address = accounts[0];
        const balance = await provider.getBalance(address);
        const balanceInEther = ethers.utils.formatEther(balance);
        setBalance(balanceInEther);
        setSpinner(false);
      }
      getBalance();
      setSpinner(false);
    });
  }, [props.id]);

  useEffect(() => {
    getdata();
    setSpinner(false);
  }, [getdata]);

  const getAccount = useCallback(() => {
    return metamaskId.toLowerCase() === accountId?.toLowerCase();
  }, [accountId, metamaskId]);
  useEffect(() => {
    getAccount();
  }, [getAccount, metamaskId]);
  const validatefrorm = (values) => {
    const errors = {};
    console.log("====================================");
    console.log(values);
    if (values.price !== undefined) {
      if (!values.price || values === undefined) {
        errors.price = "Price required* ";
      }
      if (!values.price || values === "") {
        errors.price = "Price required* ";
      }
      if (!values.price || !values.price) {
        errors.price = "Price required* ";
      }
      // if (!values.price || values.price<=baseprice) {
      // errors.price = "Price should be greater than base price ";
      // }
      // if (!values.price || values.price<=lastbid) {
      // errors.price = "Price should be greater than latest bid price ";
      // }
    }
    return errors;
  };
  const validateform = (values) => {
    const errors = {};
    const re = /^[0.1-9\b]+$/;
    console.log(values);
    console.log("====================================");
    console.log(values);
    if (values) {
      if (!re.test(values.price)) {
        errors.price = "Price is required and cannot be 0 *";
      }
      if (errors.length === 0) {
        setformErrors({});
      }
    }
    return errors;
  };
  const addtoCart = () => {
    setSpinner(true);
    setcartornot(!cartornot);
    addToCart(getSelectedNfTId()).then((response) => {
      setSpinner(true);
    });
  };
  const handleNft = (e) => {
    const { name, value } = e.target;
    console.log(e);
    setupdateNft({ ...updateNft, [name]: value });
    setupdateformErrors(validateform(updateNft));
  };
  const updatePrice = () => {
    setupdateNft({ ...updateNft, id: getSelectedNfTId() });
    setupdateformErrors(validateform(updateNft));
    setIsSubmit(true);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setbiddetails({ ...biddetails, [name]: value, nft_id: nft.nftId });
    setformErrors(validatefrorm(biddetails));
  };
  const nftType = (e) => {
    setSelectedOption(e.target.value);
    setPriceDiv(true);
    setupdateNft({ ...updateNft, nft_id: nft.nftId, status: e.target.value });
    setformErrors(validateform(updateNft));
    console.log("updatenftdetails button", updateNft);
  };
  const placeBid = () => {
    setformErrors(validatefrorm(biddetails));
    setIsSubmitBid(true);
  };
  const closeSale = (Id) => {
    console.log(Id);
    closeSales({ id: Id }).then((response) => {
      alert("Sale Closed");
      console.log("sucess", response);
      getdata();
    });
  };
  const approveBid = async (id, price, metamaskId) => {
    setbidapproveData({
      ...bidapproveData,
      bidid: id,
      id: getSelectedNfTId(),
      price: price,
      metamaskId: metamaskId,
    });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    let contract = new ethers.Contract(
      Marketplace.address,
      Marketplace.abi,
      signer
    );
    const priceInEther = ethers.utils.parseUnits(price.toString(), "ether");
    let listingPrice = await contract.getListPrice();
    listingPrice = listingPrice.toString();
    try {
      contractReSell(contract, priceInEther, listingPrice);
    } catch (error) {
      if (
        "execution reverted: Only item owner can perform this operation " ===
        error.error.data.originalError.message
      ) {
        try {
          contractPriceUpdate(contract, priceInEther, listingPrice);
        } catch (error) {
          console.log(error);
        }
      } else {
        console.log(error.error.data.originalError.message);
      }
    }
  };
  //approve bid if user is the creator no resell here only price update is working
  const contractPriceUpdate = async (contract, priceInEther, listingPrice) => {
    let transaction = await contract.updatePrice(nft.nftId, priceInEther, {
      value: listingPrice,
    });
    setTrans(await transaction.wait());
    console.log(transaction);
  };
  //approve bid if user is  not the creator then  resell function will call

  const contractReSell = async (contract, priceInEther, listingPrice) => {
    let transaction = await contract.reSellToken(nft.nftId, priceInEther, {
      value: listingPrice,
    });
    setTrans(await transaction.wait());
    console.log(transaction);
  };
  useEffect(() => {
    if (bidapproveData?.bidid && trans) approveBids(bidapproveData);
  }, [bidapproveData, trans]);

  const buyTheNft = async () => {
    setSpinner(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      let contract = new ethers.Contract(
        Marketplace.address,
        Marketplace.abi,
        signer
      );
      const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
      let transaction = await contract.executeSale(nft.nftId, {
        value: price,
      });
      let trans = await transaction.wait();
      buyNftChnageOwership({
        preUserId: metamaskId,
        newUserId: localStorage.getItem("account"),
        nftId: getSelectedNfTId(),
      });
      console.log(trans);
      setSpinner(false);
    } catch (error) {
      setSpinner(false);
      console.log(error);
    }
  };

  useEffect(() => {
    const updatePriceInBlockChaing = async (updateNft) => {
      try {
        setSpinner(true);
        if (updateNft.status !== "2") {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          let contract = new ethers.Contract(
            Marketplace.address,
            Marketplace.abi,
            signer
          );
          const price = ethers.utils.parseUnits(updateNft.price, "ether");
          let listingPrice = await contract.getListPrice();
          listingPrice = listingPrice.toString();

          let transaction = await contract.reSellToken(nft.nftId, price, {
            value: listingPrice,
          });
          // if(transaction.)

          let trans = await transaction.wait();
          updateNftDetails(updateNft)
            .then((response) => {
              console.log(response);
              getdata();
              alert("price updated ");
              handleCloseModal();
              setIsSubmit(false);
              setupdateNft("");
            })
            .catch((err) => {
              console.log(err);
              setIsSubmit(false);
              alert("price not updated ");
              setupdateNft("");
            });
          console.log(trans);
        } else {
          updateNftDetails(updateNft)
            .then((response) => {
              console.log(response);
              getdata();
              alert("price updated ");
              handleCloseModal();
              setIsSubmit(false);
              setupdateNft("");
            })
            .catch((err) => {
              console.log(err);
              setIsSubmit(false);
              alert("price not updated ");
              setupdateNft("");
            });
        }
        setSpinner(false);
      } catch (error) {
        setSpinner(false);
        if (
          "execution reverted: Only item owner can perform this operation " ===
          error.error.data.originalError.message
        ) {
          try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            let contract = new ethers.Contract(
              Marketplace.address,
              Marketplace.abi,
              signer
            );
            const price = ethers.utils.parseUnits(updateNft.price, "ether");
            let listingPrice = await contract.getListPrice();
            listingPrice = listingPrice.toString();

            let transaction = await contract.updatePrice(nft.nftId, price, {
              value: listingPrice,
            });
            let trans = await transaction.wait();
            updateNftDetails(updateNft)
              .then((response) => {
                console.log(response);
                getdata();
                alert("price updated ");
                handleCloseModal();
                setIsSubmit(false);
                setupdateNft("");
              })
              .catch((err) => {
                console.log(err);
                setIsSubmit(false);
                alert("price not updated ");
                setupdateNft("");
              });
            console.log(trans);
          } catch (error) {
            console.log(error);
          }
        } else {
          console.log(error.error.data.originalError.message);
        }
      }
    };
    if (Object.keys(updateformErrors).length === 0 && isSubmit) {
      console.log(updateNft);
      setSpinner(true);
      updatePriceInBlockChaing(updateNft).then(setSpinner(false));
    }
  }, [getdata, isSubmit, nft?.nftId, updateNft, updateformErrors]);
  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmitBid) {
      setSpinner(true);
      bidding(biddetails)
        .then((response) => {
          console.log(response);
          handleClose();
          setIsSubmitBid(false);
          getdata();
          setSpinner(false);
        })
        .catch((err) => {
          setSpinner(false);
          console.log(err);
          setIsSubmitBid(false);
          alert("Bid not placed");
        });
    }
  }, [biddetails, formErrors, getdata, isSubmitBid]);
  const removeFromCart = (id) => {
    setcartornot(!cartornot);
    setSpinner(true);
    RemoveFromCart(id).then((response) => {
      setSpinner(false);
    });
  };

  return (
    <>
      <div className={detailcss.contain}>
        {Spinner && <div className={detailcss.loading}></div>}

        <div className={detailcss.grey}>
          <div className="">
            <div className={detailcss.co}>
              <div className={detailcss.nftDetails}>
                <div className={detailcss.articleImg}>
                  <img
                    className={detailcss.Img}
                    src={nft?.image}
                    title=""
                    alt=""
                  />
                </div>
                <div className={detailcss.articleBody}>
                  <div className={detailcss.articlalign}>
                    <div className={detailcss.leftcontent}>
                      <div className={detailcss.articleTitle}>
                        <h1 className={detailcss.nftName}>{nft?.nftName}</h1>
                        <h3 className={detailcss.nftminted}>
                          Minted On
                          <span className={detailcss.nftmintdate}>
                            &nbsp;&nbsp;
                            {new Date(nft?.createdAt).toDateString()}
                          </span>
                        </h3>
                        <h3 className={detailcss.createadby}>Owned By</h3>
                        <div className={detailcss.media}>
                          <div className={detailcss.mediaBody}>
                            <img
                              className={detailcss.profileimg}
                              src={imagehosturl + own?.profile_photo}
                              alt=""
                            />
                          </div>
                          <h4 className={detailcss.ownername}>{own?.name}</h4>
                        </div>
                      </div>
                      <div className={detailcss.articleContent}>
                        <label
                          style={{ color: "#939393" }}
                          className={detailcss.createadby}
                        >
                          Description
                        </label>
                        <p className={detailcss.articleDetails}>
                          {nft?.description}
                        </p>
                      </div>
                      <div className={detailcss.articleContent}>
                        <label
                          style={{ color: "#939393" }}
                          className={detailcss.createadby}
                        >
                          Current price
                        </label>
                        <p className={detailcss.articleDetails}>
                          {nft?.price ? nft.price : "0.01"} ETH
                        </p>
                      </div>
                      {getAccount() &&
                      (nft.status === 1 || nft.status === 2) ? (
                        <div>
                          <button
                            className={detailcss.sellBtn}
                            disabled
                            onClick={handleOption}
                          >
                            Open to Sale
                          </button>
                          &nbsp;
                          <button
                            className={detailcss.sellBt}
                            onClick={() => {
                              closeSale(nft._id);
                            }}
                          >
                            close Sale
                          </button>
                        </div>
                      ) : getAccount() && nft.status !== 3 ? (
                        <div>
                          <button
                            className={detailcss.sellBtn}
                            onClick={handleOption}
                          >
                            Sell your nft
                          </button>
                        </div>
                      ) : null}
                    </div>
                    <div className={detailcss.rightcontent}>
                      {!getAccount() &&
                      (nft?.status === 1 || nft?.status === 3) ? (
                        <div>
                          <br />
                          <button
                            className={detailcss.addbtn}
                            onClick={buyTheNft}
                          >
                            Buy
                          </button>
                          &nbsp;
                          {cartornot ? (
                            <button
                              className={detailcss.removebtn}
                              onClick={removeFromCart}
                            >
                              Remove from cart
                            </button>
                          ) : (
                            <button
                              className={detailcss.addbtn}
                              onClick={addtoCart}
                            >
                              Add to cart
                            </button>
                          )}
                        </div>
                      ) : null}
                      <div className={detailcss.auctionDescRight}>
                        {nft?.status === 2 && !getAccount() ? (
                          <div className={detailcss.auctionTimer}>
                            <div className={auct.auctionDescHeader}>
                              Auction ends in:
                            </div>
                            <div className={auct.auctionEndTimes}>
                              <div className={auct.hour}>
                                <div className={auct.hourVal}>59</div>
                                <div className={auct.hourDesc}>Hours</div>
                              </div>
                              <div className={auct.timeDots}>:</div>
                              <div className={auct.hour}>
                                <div className={auct.hourVal}>59</div>
                                <div className={auct.hourDesc}>Minutes</div>
                              </div>
                              <div className={auct.timeDots}>:</div>
                              <div className={auct.hour}>
                                <div className={auct.hourVal}>59</div>
                                <div className={auct.hourDesc}>seconds</div>
                              </div>
                            </div>
                            <div>
                              <button
                                className={detailcss.addbtn}
                                onClick={handleOpen}
                              >
                                Place Bid
                              </button>
                            </div>
                          </div>
                        ) : null}
                        {nft?.status === 2 ? (
                          <div className={detailcss.bids}>
                            <table className="table table-responsive table-dark">
                              <tbody>
                                <tr>
                                  <th scope="col">Price</th>
                                  <th scope="col">From</th>
                                  <th scope="col">Action</th>
                                </tr>
                                {biddata.length === 0 ? (
                                  <td colSpan={3}>No bids </td>
                                ) : (
                                  biddata.map((bids, index) => {
                                    return (
                                      <tr key={bids?._id}>
                                        <td>{bids.price}</td>
                                        <td>{bids.name}</td>
                                        {getAccount() ? (
                                          <td>
                                            <button
                                              type="button"
                                              className={detailcss.button3}
                                              onClick={() => {
                                                approveBid(
                                                  bids._id,
                                                  bids.price,
                                                  bids.metamaskId
                                                );
                                              }}
                                            >
                                              Accept
                                            </button>
                                          </td>
                                        ) : (
                                          <td style={{ color: "#a0a3a1" }}>
                                            No action &nbsp;
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="16"
                                              height="16"
                                              fill="currentColor"
                                              className="bi bi-x-circle"
                                              viewBox="0 0 16 16"
                                            >
                                              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                              <path
                                                d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5
0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
                                              />
                                            </svg>
                                          </td>
                                        )}
                                      </tr>
                                    );
                                  })
                                )}
                              </tbody>
                            </table>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* place bid modal */}
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={open}
          onClose={handleClose}
          closeAfterTransition
        >
          <Fade in={open}>
            <Box sx={style}>
              <div className={detailcss.priceCol}>
                <h3 className={detailcss.head}> Account Balance Wallet</h3>
                <p>
                  {" "}
                  Balance
                  <span className={detailcss.price}>&nbsp; {balance}</span>
                </p>
                <p>
                  Floor price<span className={detailcss.price}>8.4 WETH</span>
                </p>
                <p>
                  Best offer
                  <span className={detailcss.price}>7.60094 WETH</span>
                </p>
              </div>
              <br />
              <div className={detailcss.formGroup}>
                <input
                  className={detailcss.formField}
                  required
                  name="price"
                  type="number"
                  onChange={handleChange}
                  placeholder="Price in ETH"
                />
                <span>WETH</span>
              </div>
              <span className={detailcss.err}>{formErrors.price}</span>
              <br></br>
              <div>
                <br />
                <button className={detailcss.addbtn} onClick={placeBid}>
                  Make offer
                </button>
              </div>
            </Box>
          </Fade>
        </Modal>
        {/* modal for selecting sell option */}
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={option}
          onClose={handleCloseModal}
          closeAfterTransition
        >
          <Fade in={option}>
            <Box sx={style}>
              <h2 className={detailcss.heading}>Enable NFT Sell option</h2>
              <div className={detailcss.select}>
                <div style={{ marginTop: "13px" }}>
                  Choose :&nbsp;&nbsp;&nbsp;&nbsp;
                </div>
                <select
                  value={selectedOption}
                  className={detailcss.selecttag}
                  onChange={nftType}
                >
                  <option value="" disabled>
                    select an option
                  </option>
                  <option value="2">Bid NFT</option>
                  <option value="1">Direct buy</option>
                </select>
              </div>
              {priceDiv ? (
                <div>
                  <br />
                  <div className={detailcss.s}>
                    <input
                      className={detailcss.inputPrice}
                      required
                      name="price"
                      type="number"
                      onChange={handleNft}
                      placeholder="Price in ETH"
                    />
                    <span className={detailcss.err}>
                      {updateformErrors.price}
                    </span>
                    <br />
                  </div>

                  <div>
                    <br />
                    <button className={detailcss.addbtn} onClick={updatePrice}>
                      Update
                    </button>
                  </div>
                </div>
              ) : (
                <p style={{ color: "grey" }}>
                  *choose an option to sell your NFT through NFT marketplace{" "}
                </p>
              )}
            </Box>
          </Fade>
        </Modal>
      </div>
    </>
  );
}
export default DetailView;
