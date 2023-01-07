import React, {  useState } from "react";
import {  useNavigate } from "react-router-dom";
import img1 from "../../Assets/Screenshot from 2022-12-02 16-56-33.png";

import card from "./Card.module.css";
import favricon from "../../Assets/icons8-favorite-48.png";
import faviconDeselect from "../../Assets/icons8-favorite-24.png";
import {
  addToCart,
  addToFavorite,

  removeFavorite,
  RemoveFromCart,
  setNftId,
  setUserId,
} from "../../Service/nftService";

import carticon from "../../Assets/icons8-fast-cart-30.png";

export const Card = (props) => {
  const navigate = useNavigate();
  const [favselect, setfavselect] = useState();
  const [InCart, setInCart] = useState();
  const imagehosturl = "http://localhost:8080/";

  const handleClick = (id) => {
    setNftId(id);
    // props.onselect(props.nftdetails)
    navigate("/detail");
  };

  const addToLocal = (id) => {
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    if (wishlist.length < 49) {
      if (!wishlist.includes(id)) {
        wishlist.push(id);
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
      }
    } else {
      alert("To many items : limit 50");
    }
  };

  const removeFromLocla = (id) => {
    let wishlistr = JSON.parse(localStorage.getItem("wishlist")) || [];
    const index = wishlistr.indexOf(id);
    if (index > -1) {
      wishlistr.splice(index, 1);
      localStorage.setItem("wishlist", JSON.stringify(wishlistr));
    }
  };

  const changefav = (id) => {
    if (localStorage.getItem("accessToken")) {
      setfavselect(true);
      if (id) {
        addToFavorite([id]).then((response) => {
          props.refresh();
        });
      }
    } else {
      setfavselect(!favselect);
      addToLocal(id);
    }
  };

  const remfav = (id) => {
    removeFromLocla(id);
    setfavselect(false);
    if (id) {
      removeFavorite(id).then((response) => {
        // props.refresh()
        props.refreshWish();
      });
    }
  };

  const addToCarts = (id) => {
    setInCart(true);
    addToCart(id).then((response) => {
      props.refresh();
    });
  };

  const removeFromCart = (id) => {
    setInCart(false);
    RemoveFromCart(id).then((response) => {
      if (response.status) {
        props.refresh();
      }
    });
  };

  const getuserDetails = (id) => {
    setUserId(id);
    // props.usid(id)
    navigate("/profile");
  };
  const ToCarts = () => {
    navigate("/profile");
  };
  function renderImgElement(favselect, props) {
    let imgElement;
    if (favselect !== undefined) {
      if (favselect) {
        imgElement = (
          <img
            className={card.favicon}
            src={favricon}
            alt=""
            onClick={() => remfav(props.nftdetails._id)}
          />
        );
      } else {
        imgElement = (
          <img
            className={card.favicon}
            src={faviconDeselect}
            alt=""
            onClick={() => changefav(props.nftdetails._id)}
          />
        );
      }
    } else {
      if (props.wish) {
        imgElement = (
          <img
            className={card.favicon}
            src={favricon}
            alt=""
            onClick={() => remfav(props.nftdetails._id)}
          />
        );
      } else {
        imgElement = (
          <img
            className={card.favicon}
            src={faviconDeselect}
            alt=""
            onClick={() => changefav(props.nftdetails._id)}
          />
        );
      }
    }
    return imgElement;
  }

  function renderCartButton(InCart, showcart, display, nftdetails) {
    if (showcart && localStorage.getItem("accessToken")) {
      if (InCart !== undefined) {
        if (InCart) {
          return (
            <div
              className={card.addTOCart}
              onClick={() => removeFromCart(nftdetails._id)}
            >
              <h1 className={card.addTOCartContent}> remove from cart</h1>
              <img
                className={card.carticon}
                src={carticon}
                alt=""
                onClick={ToCarts}
              />
            </div>
          );
        } else {
          return (
            <div
              className={card.addTOCart}
              onClick={() => addToCarts(nftdetails._id)}
            >
              <h1 className={card.addTOCartContent}> Add to cart</h1>
            </div>
          );
        }
      } else {
        console.log("condition 2");
        if (display) {
          return (
            <div className={card.addTOCart}>
              <h1
                className={card.addTOCartContent}
                onClick={() => removeFromCart(nftdetails._id)}
              >
                {" "}
                remove from cart
              </h1>
              <img
                onClick={ToCarts}
                className={card.carticon}
                src={carticon}
                alt=""
              />
            </div>
          );
        } else {
          return (
            <div
              className={card.addTOCart}
              onClick={() => addToCarts(nftdetails._id)}
            >
              <h1 className={card.addTOCartContent}> Add to cart</h1>
            </div>
          );
        }
      }
    } else {
      return <></>;
    }
  }

  return (
    <div className={props.bg ? card.chgbg : card.trending}>
      <div className={card.fav}>
        {renderImgElement(favselect, props)}
        
      </div>
      <img
        className={card.trendingCardImg}
        src={props.nftdetails.image ? props.nftdetails.image : img1}
        alt=""
        onClick={() => {
          handleClick(props.nftdetails._id);
        }}
      />
      <div className={card.trendingCardContent}>
        <div className={card.artistInfo}>
          <div className={card.artName}>
            {props.nftdetails.nftName ? props.nftdetails.nftName : "nft name"}
          </div>
        </div>
        <div
          className={card.artistAvatharInfo}
          onClick={() => {
            getuserDetails(props.userId);
          }}
        >
          <div className={card.artistAvatharIcon}>
            <img
              className={card.artistAvatharIconImg}
              src={(props?.nftdetails?.owner) ? imagehosturl + props?.nftdetails?.owner?.profile_photo : img1}
              alt=""
            />
          </div>
          <div className={card.artistName}>
            <div className="name">
              {" "}
              {(props?.nftdetails?.owner)? props.nftdetails?.owner?.name : "creator name"}
            </div>
          </div>
        </div>
        <div className={card.priceAndBid}>
          <div className={card.price}>
            <div className={card.priceTitle}>Price</div>
            <div className={card.priceValue}>
              {props.nftdetails.price ? props.nftdetails.price : "0.00 "} ETH{" "}
            </div>
          </div>
          <div className={card.bid}>
            {/* <div className={card.bidTitle}>Highest Bid</div>
            <div className={card.priceValue}>
              {props.nftdetails.highest_price
                ? props.nftdetails.highest_price
                : "0.00 ETH"}
            </div> */}
          </div>
        </div>
      </div>

      {renderCartButton(
        InCart,
        props.showcart,
        props.display,
        props.nftdetails
      )}
    </div>
  );
};

export default Card;
