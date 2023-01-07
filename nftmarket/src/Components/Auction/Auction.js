import React, { useEffect, useState } from "react";
import auct from "./Auction.module.css";
import avatharimg from "../../Assets/Screenshot from 2022-11-28 16-21-30.png";
import { getAuctiondNft, setNftId, setUserId } from "../../Service/nftService";
import { useNavigate } from "react-router-dom";

export const Auction = () => {
  const navigate = useNavigate();
  const [nft, setnft] = useState({});
  // const [hours, setHours] = useState(0);
  // const [minutes, setMinutes] = useState(0);
  // const [seconds, setSeconds] = useState(0);
  const imagehosturl = "http://localhost:8080/";
  const [Randnft, setRandNft] = useState(0);

  useEffect(() => {
    Timer();
    getNft();
  }, []);

  const getNft = () => {
    getAuctiondNft().then((response) => {
      setnft(response.docs);
    });
  };

  function Timer() {
    let duration = 6000; // duration of the timer in seconds
    let remainingTime = duration;
    let isRunning = false;
    startTimer();
    function startTimer() {
      isRunning = true;
    }



    setInterval(() => {
      if (isRunning) {
        if (remainingTime > 0) {
          remainingTime -= 1;
        } else {
          isRunning = false;
        }
      }

      // setHours(Math.floor(remainingTime / 3600));
      // setMinutes(Math.floor((remainingTime % 3600) / 60));
      // setSeconds(Math.floor(remainingTime % 60));
    }, 1000);
  }

  const getdetailedView = (id) => {
    setNftId(id);
    navigate("/detail");
  };

  const getuserDetails = (id) => {
    setUserId(id);
    // props.usid(id)
    navigate("/profile");
  };

  
  useEffect(() => {
    if (nft) {
      const interval = setInterval(() => {
        setRandNft(Math.floor(Math.random() * nft?.length));
      }, 20000);
      return () => clearInterval(interval);
    }
  }, [nft]);


  
  return (
    <div className={auct.auction}>
      {nft?.length > 0 ? (
        <div
          className={auct.auctionImg}
          style={{
            backgroundImage: `url(${
              nft.length > 0 ? nft[Randnft]?.nft.image : ""
            })`,
          }}
        >
          <div className={auct.backColor}>
            <div className={auct.auctionDescLeft}>
              <div
                className={auct.auctionBy}
                onClick={() => {
                  getuserDetails(nft.length > 0 ? nft[Randnft]?.userId : 0);
                }}
              >
                <div className={auct.auctionByAvathar}>
                  <img
                    className={auct.auctionByAvatharImg}
                    src={
                      nft.length > 0
                        ? imagehosturl + nft[Randnft]?.profilePicture
                        : avatharimg
                    }
                    alt=""
                  />
                </div>
                <div className={auct.auctionByName}>
                  {nft.length > 0 ? nft[Randnft]?.owner?.name : "unnamed"}
                </div>
              </div>
              <div className={auct.auctionItem}>
                <div className={auct.auctionItemName}>
                  {nft.length > 0 ? nft[Randnft]?.nft.nftName : ""}
                </div>
              </div>

              <div className={auct.seeDetailsBtn}>
                <button
                  className={auct.seenftBtn}
                  onClick={() => {
                    getdetailedView(nft.length > 0 ? nft[Randnft]?.nft._id : 0);
                  }}
                >
                  See NFT
                </button>
              </div>
            </div>

            {/* <div className={auct.auctionDescRight}>
              <div className={auct.auctionTimer}>
                <div className={auct.auctionDescHeader}>Auction ends in:</div>
                <div className={auct.auctionEndTimes}>
                  <div className={auct.hour}>
                    <div className={auct.hourVal}>{hours}</div>
                    <div className={auct.hourDesc}>Hours</div>
                  </div>
                  <div className={auct.timeDots}>:</div>
                  <div className={auct.hour}>
                    <div className={auct.hourVal}>{minutes}</div>
                    <div className={auct.hourDesc}>Minutes</div>
                  </div>
                  <div className={auct.timeDots}>:</div>
                  <div className={auct.hour}>
                    <div className={auct.hourVal}>{seconds}</div>
                    <div className={auct.hourDesc}>seconds</div>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
