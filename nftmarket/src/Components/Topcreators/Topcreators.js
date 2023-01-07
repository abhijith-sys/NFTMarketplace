import React, { useEffect, useState } from "react";
import "./Topcreators.css";
import avathar from "../../Assets/defaultUser.png";
import { getTopCreators } from "../../Service/userService";
import { useNavigate } from "react-router-dom";
import { setUserId } from "../../Service/nftService";
import { SpinnerDotted } from "spinners-react";
export const Topcreators = (props) => {
  const navigate = useNavigate();
  const [Creators, setCreators] = useState();
  const imagehosturl = "http://localhost:8080/";
  const [Spinner, setSpinner] = useState(false)

  const getCreators = () => {
    setSpinner(true);
    getTopCreators().then((data) => {
      setCreators(data);
      setSpinner(false)
    });
  };

  useEffect(() => {
   
    getCreators()
  }, []);

  const getuserDetails = (id) => {
    setUserId(id);
    // props.usid(id)
    navigate("/profile");
  };
  const toranking = ()=>{
    navigate("/ranking");
  }

  return (
    <div className="topcreators">
     { Creators?<div className="topcreators-heading">
        <div className="topcreators-heading-one">Top Creators</div>

        <div className="topcreators-content-bottom">
          <div className="topcreators-description-one">
            Checkout Top Rated Creators On The Nft Marketplace
          </div>
          <div className="topcreators-btns">
            <button className="topcreator-btn" onClick={toranking}>view Rankings</button>
          </div>
        </div>
      </div>:<></>}
      <SpinnerDotted
     
        size={90}
        thickness={180}
        speed={100}
        color="#a259ff"
        enabled={Spinner}
      />
      <div className="topcreators-list">
        {Creators?.map((data, index) => (
          <div
            className="topcreator-card"
            key={data._id}
            onClick={() => {
              getuserDetails(data._id);
            }}
          >
            <div className="align-ranking">
              <div className="topcreator-ranking">
                <h5 className="topcreator-ranking-value">{index + 1}</h5>
              </div>
            </div>
            <div className="topcreator-avathar">
              <img
                className="topcreator-avatha-img"
                src={
                  data.profile_photo
                    ? imagehosturl + data.profile_photo
                    : avathar
                }
                alt="profilephoto"
              />
            </div>
            <div className="mobile-view">
              <div className="creator-name">
                {data.name ? data.name : data.metamaskId.slice(0, 5) + ".."}
              </div>
              <div className="totalsales">
                <div className="totalsal">Total Sales :</div>
                <div className="total-eth">
                  {data.total_sale ? data.total_sale : "0.00"}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
