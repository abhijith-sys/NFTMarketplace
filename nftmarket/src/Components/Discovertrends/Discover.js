import React, { useEffect, useState } from "react";
import "./Discover.module.css";
import { useNavigate } from "react-router-dom";
import dis from "../Discovertrends/Discover.module.css";
import { getTopNfts, setNftId, setUserId } from "../../Service/nftService";


export const Discove = () => {
  const navigate = useNavigate();
  const [nfts, setnfts] = useState([]);

  const getnfts = () => {
    getTopNfts(3).then((data) => {
      console.log("nft list data");
      console.log(data?.docs);
      setnfts(data?.docs);
    });
  };

  useEffect(() => {
    getnfts();
  }, []);

  const details = (id) => {
    setNftId(id);
    navigate("/detail");
  };

  const getuserDetails = (id) => {
    setUserId(id);
    // props.usid(id)
    navigate("/profile");
  };
  const gotoMarket = () => {
    navigate("/marketplace");
  };


  const imagehosturl = "http://localhost:8080/";
  return (
    <div className={dis.discoverTrends}>
     {nfts?.length>0? <div className={dis.discoverHeading}>
        <div className={dis.topcreatorsHeadingOne}>Discover More Nfts</div>
        <div className={dis.topcreatorsContentBottom}>
          <div className={dis.topcreatorsDescriptionOne}>
            Explore New Trending Nfts
          </div>
          <div className={dis.discoverTrendsBtns}>
            <button className={dis.discoverTrendsBtn} onClick={gotoMarket}>See All</button>
          </div>
        </div>
      </div>:<></>}

      <div className={dis.trendingCards}>
        {nfts?.map((data) => (
          <div key={data._id} className={dis.trendingCard}>
            <img
              className={dis.trendingCardImg}
              src={data.nft.image}
              alt=""
              onClick={() => {
                details(data.nft._id);
              }}
            />
            <div className={dis.trendingCardContent}>
              <div className={dis.artistInfo}>
                <div className={dis.artName}>Distant Galaxy</div>
              </div>
              <div className={dis.artistAvatharInfo}>
                <div className={dis.artistAvatharIcon}>
                  <img
                    className={dis.artistAvatharIconImg}
                    src={imagehosturl + data?.nft?.owner?.profile_photo}
                    alt=""
                  />
                </div>
                <div className={dis.artistName}>
                  <div
                    className={dis.name}
                    onClick={() => {
                      getuserDetails(data?.nft?.owner?._id);
                    }}
                  >
                    {data?.nft.owner?.name}
                  </div>
                </div>
              </div>
              <div className={dis.priceAndBid}>
                <div className={dis.price}>
                  <div className={dis.priceTitle}>Price</div>
                  <div className={dis.pricevalue}>1.63 ETH</div>
                </div>
                <div className={dis.bid}>
                  <div className={dis.bidTitle}>Highest Bid</div>
                  <div className={dis.priceValue}>1.63 ETH</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
