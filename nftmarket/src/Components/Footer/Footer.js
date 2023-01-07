import React, { useEffect, useState } from "react";
import ft from "./Footer.module.css";

import svgdis from "../../Assets/descord.svg";
import svgyou from "../../Assets/youtubelogo-3@2x.svg";
import svgtwi from "../../Assets/twitterlogo-3@2x.svg";
import svgins from "../../Assets/instagramlogo-1@2x.svg";
import { useNavigate } from "react-router-dom";
import { SubscribeEmailNotification } from "../../Service/userService";

export const Footer = () => {
  const navigate = useNavigate();
  const initialProfile = {
    email: ""
  };
  const [profileformErrors, setProfileformErrors] = useState({});
  const [profileform, setProfileform] = useState(initialProfile);
  const [isSubmit, setIsSubmit] = useState(false);
  const toMarket = () => {
    navigate("/marketplace");
  };
  const toRanking = () => {
    navigate("/ranking");
  };

  const submit =()=>{
    setProfileformErrors(validatefrorm(profileform));
    setIsSubmit(true);
  }

  const validatefrorm = (values) => {
    const errors = {};
    // Check that the email is a valid email address
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    if (!values.email) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(values.email)) {
      errors.email = "Invalid email";
    } else if (values.email.length > 254) {
      errors.email = "Email is too long";
    }
    
    return errors;
  };
  useEffect(() => {
    if (Object.keys(profileformErrors).length === 0 && isSubmit) {
     console.log(profileform);
    SubscribeEmailNotification(profileform).then((datavalue) => {
    
    });;

      
    } else {
      setIsSubmit(false);
    }
  }, [isSubmit, profileform, profileformErrors]);


  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setProfileform({ ...profileform, [name]: value });
  // };

  return (
    <div className={ft.footerAlign}>
      <div className={ft.footer}>
        <div className={ft.community}>
          <div className={ft.communityHeading}> NFT Marketplace</div>
          <div className={ft.communityDescription}>
            {" "}
            NFT Marketplace for Collect, Buy And Sell Art From More Than 20k Nft
            Artists.
          </div>
          <div className={ft.communityDescription}> Join our community</div>
          <div className={ft.communityLogos}>
            <div className={ft.discord}>
              <img src={svgdis} alt="" style={{ cursor: "pointer" }} />
            </div>
            <div className="youtube" style={{ cursor: "pointer" }}>
              {" "}
              <img src={svgyou} alt="" />
            </div>
            <div className="twitter" style={{ cursor: "pointer" }}>
              {" "}
              <img src={svgtwi} alt="" />
            </div>
            <div className="instagram" style={{ cursor: "pointer" }}>
              {" "}
              <img src={svgins} alt="" />
            </div>
          </div>
        </div>

        <div className={ft.explore}>
          <div className={ft.communityHeading} onClick={toMarket}>
            Explore
          </div>
          <div className={ft.communityDescription} onClick={toMarket}>
            {" "}
            Marketplace
          </div>
          <div className={ft.communityDescription} onClick={toRanking}>
            Ranking
          </div>
          {/* <div className={ft.communityDescription}> connect a wallet</div> */}
        </div>

        <div className={ft.joinEmail}>
          {/* <div className={ft.communityHeading}>Join Our Weekly Digest </div>
          <div className={ft.communityDescription}>
            {" "}
            Get exclusive promotions & updates straight to your inbox.
          </div> */}
          {/* <div className={ft.emailSubField}>
            <input
              type="email"
              name="email"
              className={ft.inputboxEmail}
              placeholder="Enter your email here "
              onChange={handleChange}
              value={profileform.email}
            />
          
            
            <div className={ft.emailSubmitBtn}>
              <h5 className={ft.emailSubmitBtnTxt} onClick={submit}>Subscribe</h5>
            </div>
           
          </div> */}
         
        </div>
      </div>
    </div>
  );
};
