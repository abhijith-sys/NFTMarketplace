import React, { useEffect, useState } from "react";
import "./Trending.css";
import cardimg1 from "../../Assets/Screenshot from 2022-11-28 17-40-00.png";
import cardimg2 from "../../Assets/Screenshot from 2022-11-28 17-45-33.png";
import cardimg3 from "../../Assets/Screenshot from 2022-11-28 17-50-02.png";
import { getTrendingCollections } from "../../Service/userService";
import { useNavigate } from "react-router-dom";
import { setNftId, setUserId } from "../../Service/nftService";


const Trending = () => {
  const navigate = useNavigate();
  const [Nfts, setNfts] = useState();
  const imagehosturl = "http://localhost:8080/";

  const getTrendingNfts = () => {
    getTrendingCollections().then((data) => {
      setNfts(data);
      console.log(data);
    });
  };

  useEffect(() => {
    getTrendingNfts();
  }, []);

  const details = (id) => {
    setNftId(id);
    navigate("/detail");
  };

  const selectedUsers = (id) => {
    setUserId(id);
    navigate("/profile");
  };

  return (
    <div className="trending">
      <div className="trendBdy">
        {Nfts ?<div className="trend-heading">
          <div className="heading-one">Trending Collection</div>
          <div className="description-one">
            Checkout Our Weekly Updated Trending Collectio
          </div>
        </div> :<></>}

        <div className="trend-cards">
          {Nfts?.map((data) => (
            <div className="trend-card" key={data._id}>
              <div
                className="main-card"
                onClick={() => {
                  details(data.owned[0]._id);
                }}
              >
                {" "}
                <img
                  className="main-card-img"
                  src={data.owned[0] ? data.owned[0].image : cardimg3}
                  alt=""
                />
              </div>
              <div className="samll-cards">
                <div
                  className="small-card"
                  onClick={() => {
                    details(data.owned[1]._id);
                  }}
                >
                  {" "}
                  <img
                    className="small-card-img"
                    src={data.owned[1] ? data.owned[1].image : cardimg1}
                    alt=""
                  />
                </div>
                <div
                  className="small-card"
                  onClick={() => {
                    details(data.owned[2]._id);
                  }}
                >
                  {" "}
                  <img
                    className="small-card-img2"
                    src={data.owned[2] ? data.owned[2].image : cardimg2}
                    alt=""
                  />
                </div>
                <div className="total-items-number">
                  <button className="total-items-number-btn"  onClick={() => selectedUsers(data._id)}>{((data.ownedCount -3)<0)?0:data.ownedCount-3}+</button>
                </div>
              </div>
              <div
                className="trend-card-details"
                onClick={() => selectedUsers(data._id)}
              >
                {/* <div className="collection-name">Dsgn Animals</div> */}
                <div className="creator-details">
                  <div className="creator-avathor">
                    {" "}
                    <img
                      className="creator-avathor-img"
                      src={
                        data.owned[0].profile_photo
                          ? imagehosturl + data.owned[0].profile_photo
                          : cardimg1
                      }
                      alt=""
                    />
                  </div>
                  <div className="trending-creator-name">
                    {data.owned[0].name ? data.owned[0].name : "Unnamed"}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Trending;
