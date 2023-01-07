import React, { useCallback, useEffect, useState } from "react";

import pro from "./Profile.module.css";

import { toast } from "react-toastify";
import svgdis from "../../Assets/descord.svg";
import svgyou from "../../Assets/youtubelogo-3@2x.svg";
import svgtwi from "../../Assets/twitterlogo-3@2x.svg";
import svgins from "../../Assets/instagramlogo-1@2x.svg";
import svgprncil from "../../Assets/icons8-pencil-drawing-50.png";
import {
  checkOutCart,
  getSelectedUserId,
  getuserCartDetails,
  getuserCollectednfts,
  getusernfts,
  getuserWishlist,
} from "../../Service/nftService";
import Card from "../Card/Card";

import { useNavigate } from "react-router-dom";

import {
  getuserdetails,
  getUserDetailsWithId,
  setUserDetails,
  setUserProfile,
} from "../../Service/userService";

const Profile = (props) => {
  const navigate = useNavigate();
  const [userdetails, setuserdetails] = useState([]);
  const [nfts, setnfts] = useState([]);
  const [SelectedTab, setSelectedTab] = useState(false);

  const imagehosturl = "http://localhost:8080/";
  const [selectedTab, setSelectedTabs] = useState("created");
  const [UserDeatsils, setUserDeatsils] = useState(false);

  const uploadCoverPhoto = (e) => {
    if (e.target.files.length) {
      const file = e.target.files[0];
      const fileSize = file.size / 1024 / 1024; //size in MB

      if (fileSize > 20) {
        toast("Error: File size must be less than 20 MB");
        return;
      }

      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!allowedTypes.includes(file.type)) {
        toast("Error: File is not an image");
        return;
      }

      const fd = new FormData();
      fd.append("cover_photo", file);
      setUserDetails(fd).then((data) => {
        if (data != null) {
          getuserdata();
        }
      });
    }
  };

  useEffect(() => {
    console.log("====================================");
    console.log("useeffect");
    console.log(nfts);
    console.log("====================================");
    console.log(nfts);
  }, [nfts]);

  const uploadProfilePhoto = (e) => {
    if (e.target.files.length) {
      const file = e.target.files[0];
      const fileSize = file.size / 1024 / 1024; //size in MB

      if (fileSize > 20) {
        toast("Error: File size must be less than 20 MB");
        return;
      }

      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!allowedTypes.includes(file.type)) {
        toast("Error: File is not an image");
        return;
      }

      const fileExtension = file.name.split(".").pop().toLowerCase();
      if (
        fileExtension !== "png" &&
        fileExtension !== "jpg" &&
        fileExtension !== "jpeg"
      ) {
        toast("Error: Only .png, .jpg, and .jpeg format images are allowed");
        return;
      }

      const fd = new FormData();
      fd.append("profile_photo", file);
      setUserProfile(fd).then((data) => {
        if (data != null) {
          getuserdata();
        }
      });
    }
  };

  const editprofile = () => {
    navigate("/profileform");
  };

  const getuserdata = () => {
    getuserdetails().then((data) => {
      setuserdetails(data);
    });
  };

  useEffect(() => {
    // if (props.uid !== undefined) {
    //   console.log("condion on");
    //   getUserDetails(props.uid);
    //   setUserDeatsils(true);
    //   // props.uid = undefined;
    // } else
    if (
      getSelectedUserId() &&
      getSelectedUserId() !== "" &&
      getSelectedUserId() !== "undefined"
    ) {
      console.log("condition 2");
      console.log("====================================");
      console.log(getSelectedUserId());
      console.log("====================================");
      getUserDetails(getSelectedUserId());
      setUserDeatsils(false);
    } else {
      console.log("condition 3");
      setUserDeatsils(true);
      getuserdata();
      getnfts();
    }
  }, []);

  const createnft = () => {
    navigate("/create");
  };

  const getUserDetails = (id) => {
    getUserDetailsWithId(id).then((data) => {
      console.log(data.docs[0].owner);
      setuserdetails(data.docs[0].owner);
      if (!UserDeatsils) setnfts([data.docs]);
      console.log("api return====================================");
      console.log(console.log(data.docs));
      console.log("====================================");

      setSelectedTab(false);
    });
  };

  const getcart = () => {
    getuserCartDetails().then((data) => {
      console.log("cart data");
      console.log(data);
      setnfts(data);
      setSelectedTab(true);
    });
  };

  const getnfts = () => {
    getusernfts().then((data) => {
      console.log("nft created data");
      console.log(data);
      setnfts(data);
      setSelectedTab(false);
    });
  };
  const collectednfts = () => {
    getuserCollectednfts().then((data) => {
      console.log("nft collected data");
      console.log(data.docs);
      setnfts([data.docs]);
      setSelectedTab(false);
    });
  };

  const getWshlist = () => {
    getuserWishlist().then((data) => {
      console.log("nft wishlist");
      console.log(data);
      setnfts(data);
      setSelectedTab(true);
    });
  };
  useEffect(() => {
    console.log("useeffect====================================");

    console.log("====================================");
  }, []);

  const refresh = useCallback(() => {
    getcart();
  }, []);
  const refrshWishList = useCallback(() => {
    console.log("====================================");
    console.log("refresh");
    console.log("====================================");
    getWshlist();
  }, []);

  function checkoutCart() {
    checkOutCart();
  }
  //total price bottom content
  function displayTotalPrice(nfts) {
    let cartTotal;
    if (nfts && nfts[0]) {
      if (nfts[0].cartTotal !== undefined) {
        cartTotal = nfts[0].cartTotal;
        return (
          <div className={pro.CartTotal}>
            <hr />
            <div className={pro.alignChekout}>
              <div className={pro.Total}>
                <h4 className={pro.totalpriceheadingCart}>Total Price : </h4>
                <h4 className={pro.totalpriceheadingCart}>{cartTotal}ETH</h4>
              </div>
              <button className={pro.btn} onClick={checkoutCart}>
                Complete Purchase
              </button>
            </div>
          </div>
        );
      }
    } else {
      return <></>;
    }
  }

  function renderCards(nfts, SelectedTab) {
    if (Array.isArray(nfts)) {
      return (
        <div className={pro.selectedContent}>
          {SelectedTab
            ? nfts.map((data) =>
                Array.isArray(data?.cart)
                  ? data.cart.map((nftdata) => (
                      <Card
                        key={nftdata?._id}
                        showcart={true}
                        display={data.wishlist ? false : true}
                        nftdetails={nftdata}
                        username={data?.name}
                        userprofile={data?.profile_photo}
                        refresh={refresh}
                        wish={data?.wishlist ? true : false}
                        refreshWish={refrshWishList}
                      />
                    ))
                  : Array.isArray(data?.wishlist)
                  ? data.wishlist.map((nftdata) => (
                      <Card
                        key={nftdata?._id}
                        showcart={true}
                        display={data.wishlist ? false : true}
                        nftdetails={nftdata}
                        username={data?.name}
                        userprofile={data?.profile_photo}
                        refresh={refresh}
                        wish={data?.wishlist ? true : false}
                        refreshWish={refrshWishList}
                      />
                    ))
                  : null
              )
            : nfts.map((data) =>
                Array.isArray(data?.created)
                  ? data.created.map((nftdata) => (
                      <Card
                        key={nftdata?._id}
                        showcart={false}
                        nftdetails={nftdata}
                        username={data?.name}
                        userprofile={data?.profile_photo}
                        display={false}
                      />
                    ))
                  : Array.isArray(data)
                  ? data.map((nftdata) => (
                      <Card
                        key={nftdata?._id}
                        showcart={false}
                        nftdetails={nftdata}
                        username={data?.name}
                        userprofile={data?.profile_photo}
                        display={false}
                      />
                    ))
                  : null
              )}
        </div>
      );
    }
    return null;
  }

  return (
    <div className={pro.profile}>
      <label htmlFor="file-input">
        <div className={pro.coverphoto}>
          <div className={pro.coverphotoground}>
            {UserDeatsils && (
              <img
                className={pro.coverphotogroundicon}
                src={svgprncil}
                alt=""
              />
            )}
          </div>
          <img
            src={`${imagehosturl}${userdetails?.cover_photo}`}
            className={pro.image}
            alt="img"
          />
        </div>
      </label>
      {UserDeatsils && (
        <input
          id="file-input"
          name="file"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={uploadCoverPhoto}
        />
      )}

      <label htmlFor="profile-input">
        <div className={pro.profilePhoto}>
          <div className={pro.iconbackground}>
            {UserDeatsils && (
              <img className={pro.icon} src={svgprncil} alt="" />
            )}
          </div>
          <img
            className={pro.profilePhotoImg}
            src={`${imagehosturl}${userdetails?.profile_photo}`}
            alt=""
          />
        </div>
      </label>
      {UserDeatsils && (
        <input
          id="profile-input"
          name="file"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={uploadProfilePhoto}
        />
      )}
      <div className={pro.userDetails}>
        <div className={pro.userDetailsALign}>
          <div className={pro.uerDetailsNameFollow}>
            <div className={pro.profileName}>
              { userdetails?.name
                ? userdetails?.name
                : "Unnamed"}
            </div>

            {/* <div className={pro.totaldescription}>
              <div className={pro.totalSales}>
                <h3 className={pro.totalNumbers}>240k+</h3>
                <h4 className={pro.auctionDesc}>Total Sale</h4>
              </div>
              <div className={pro.auctions}>
                <h3 className={pro.totalNumbers}>100k+</h3>
                <h4 className={pro.auctionDesc}>Auctions</h4>
              </div>
              <div className={pro.artists}>
                <h3 className={pro.totalNumbers}>240k+</h3>
                <h4 className={pro.auctionDesc}>Artists</h4>
              </div>
            </div> */}

            <div className={pro.bio}>
              <h3 className={pro.bioheding}>Bio</h3>
              <h4 className={pro.biocontent}>{userdetails?.bio}</h4>
            </div>
            <div className={pro.sociallinks}>
              {/* <h3 className={pro.bioheding}>Links</h3>
              <div className={pro.communitylogos}>
                <div className="discord" style={{ cursor: "pointer" }}>
                  <img src={svgdis} alt="" />
                </div>
                <div className="youtube" style={{ cursor: "pointer" }}>
                  {" "}
                  <img src={svgyou} alt="" style={{ cursor: "pointer" }} />
                </div>
                <div className="twitter" style={{ cursor: "pointer" }}>
                  {" "}
                  <img src={svgtwi} alt="" style={{ cursor: "pointer" }} />
                </div>
                <div className="instagram" style={{ cursor: "pointer" }}>
                  {" "}
                  <img src={svgins} alt="" style={{ cursor: "pointer" }} />
                </div>
              </div> */}
            </div>
          </div>
          {UserDeatsils ? (
            <div className={pro.profileFollowbtns}>
              <div className={pro.followbutton} onClick={editprofile}>
                <h3>Edit Profile</h3>
              </div>
              <div className={pro.followbutton} onClick={createnft}>
                <h3>Create nft</h3>
              </div>
              {/* <div className={pro.followbutton}>
                <h3>+Follow</h3>
              </div> */}
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>

      <hr style={{ width: "92vw" }} />
      <div className={pro.profileDetailedBtns}>
        {!UserDeatsils ? (
          <div id="created" className={pro.collected}></div>
        ) : (
          <>
            <div
              className={
                selectedTab === "created" ? pro.selected : pro.collected
              }
              onClick={() => {
                setSelectedTabs("created");
                getnfts();
              }}
            >
              <h5>Created</h5>
            </div>
            <div
              className={
                selectedTab === "collected" ? pro.selected : pro.collected
              }
              onClick={() => {
                setSelectedTabs("collected");
                collectednfts();
              }}
            >
              <h5>Owned</h5>
            </div>
            <div
              className={selectedTab === "Cart" ? pro.selected : pro.Cart}
              onClick={() => {
                setSelectedTabs("Cart");
                getcart();
              }}
            >
              <h5>Cart</h5>
            </div>
            <div
              className={selectedTab === "wish" ? pro.selected : pro.Cart}
              onClick={() => {
                setSelectedTabs("wish");
                getWshlist();
              }}
            >
              <h5>wishlist</h5>
            </div>
          </>
        )}
      </div>

      <div className={pro.selectedContent}>
        {/* {SelectedTab
          ? nfts?.map((data) =>
              (data?.cart ? data?.cart : data?.wishlist)?.map((nftdata) => (
                <Card
                  key={nftdata?._id}
                  showcart={true}
                  display={data.wishlist ? false : true}
                  nftdetails={nftdata}
                  username={data?.name}
                  userprofile={data?.profile_photo}
                  refresh={refresh}
                  wish={data?.wishlist ? true : false}
                  refreshWish={refrshWishList}
                />
              ))
            )
          : (nfts&&nfts)?.map((data) =>
              (data?.created ? data.created : data)?.map((nftdata) => (
                <Card
                  key={nftdata?._id}
                  showcart={false}
                  nftdetails={nftdata}
                  username={data?.name}
                  userprofile={data?.profile_photo}
                  display={false}
                />
              ))
            )} */}
        {renderCards(nfts, SelectedTab)}
      </div>
      {displayTotalPrice(nfts)}
    </div>
  );
};

export default Profile;
