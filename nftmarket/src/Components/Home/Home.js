import React, { useEffect, useState } from "react";
import hm from "./Home.module.css";
import dimg from "../../Assets/Screenshot from 2022-11-28 16-14-34.png";
import avtharimg from "../../Assets/Screenshot from 2022-11-28 16-21-30.png";
import Trending from "../TrendingCollections/Trending";
import { Topcreators } from "../Topcreators/Topcreators";
import { Discove } from "../Discovertrends/Discover";
import { Auction } from "../Auction/Auction";
import { getTopNfts, setNftId, setUserId } from "../../Service/nftService";
import rkt from "../../Assets/rocketlaunch@2x.svg";
import { useNavigate } from "react-router-dom";

export const Home = (props) => {
  const [Nfts, setNfts] = useState([]);
  const imagehosturl = "http://localhost:8080/";
  const navigate = useNavigate();
  const [Randnft, setRandNft] = useState(
    Math.floor(Math.random() * Nfts?.length)
  );

  const getCreators = () => {
    getTopNfts(20).then((data) => {
      setNfts(data.docs);
      
    });
  };

  useEffect(() => {
    getCreators();
  }, []);

  const gotoMarket = () => {
    navigate("/marketplace");
  };

  const details = (id) => {
    setNftId(id);
    navigate("/detail");
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setRandNft(Math.floor(Math.random() * Nfts?.length));
    }, 20000);
    return () => clearInterval(interval);
  }, [Nfts]);


  const getUserProfile = (id) => {
    setUserId(id);
    navigate("/profile");
  };

//spinning card
  const spiningCard = () => {
    return (
      <div className={hm.nftDemoImage}>
        <div className={hm.imageTag}>
          <img
            className={hm.img}
            src={Nfts?.length > 0 ? Nfts[Randnft].nft.image : dimg}
            alt="img"
            onClick={() => {
              details(Nfts.length > 0 ? Nfts[Randnft].nft._id : undefined);
            }}
          />
          <div className={hm.avatharDetails}>
            <div className={hm.avathar}>
              <img
                className={hm.avatharImg}
                src={
                  Nfts?.length > 0
                    ? imagehosturl + Nfts[Randnft]?.nft?.owner?.profile_photo
                    : avtharimg
                }
                alt=""
                onClick={() => {
                  getUserProfile();
                }}
              />
            </div>
            <div className={hm.detailsNames}>
              <div
                className={hm.avatharName}
                onClick={() => {
                  getUserProfile(
                    Nfts?.length > 0 ? Nfts[Randnft]?.nft.owner?._id : undefined
                  );
                }}
              >
                {Nfts?.length > 0 ? Nfts[Randnft]?.nft?.owner?.name : "unnamed"}
              </div>
              <div className={hm.totalsalesDetails}>
                {/* <h4 className={hm.salesDescription}>Total Sales : 80.60 ETH</h4> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };


  const selecteduser = (usid) => {
    console.log(usid + "from home");
    props.id(usid);
  };


  return (
    <div>
      <div className={hm.homePage}>
        <div className={hm.description}>
          <div className={hm.heading}>Discover Digital Art & Collect Nfts</div>
          <div className={hm.headingDescription}>
            Collect, Buy And Sell Art From More Than 20k Nft Artists.
          </div>
          <div className={hm.getstartBtn}>
            <img src={rkt} alt="" className={hm.rcket} />
            <button className={hm.btn} onClick={gotoMarket}>
              Get Started
            </button>
          </div>
          <div className={hm.totalDescription}>
            {/* <div className={hm.totalSales}>
              <h3 className={hm.totalNumbers}>240k+</h3>
              <h4 className={hm.auctionDesc}>Total Sale</h4>
            </div>
            <div className={hm.auctions}>
              <h3 className={hm.totalNumbers}>100k+</h3>
              <h4 className={hm.auctionDesc}>Auctions</h4>
            </div>
            <div className={hm.artists}>
              <h3 className={hm.totalNumbers}>240k+</h3>
              <h4 className={hm.auctionDesc}>Artists</h4>
            </div> */}
          </div>
        </div>
        {spiningCard()}
      </div>

      <Trending />
      <Topcreators usid={selecteduser} />
      <Discove />
      <Auction />
    
    </div>
  );
};
