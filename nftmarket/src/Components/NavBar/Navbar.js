import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";

import bricon from "../../Assets/burger-menu@2x.svg";
import nfticon from "../../Assets/nftlogo.svg";
import stl from "./Navbar.module.css";
import { getNonce, Login } from "../../Service/userService";
import profileicon from "../../Assets/user-1@2x.svg";
import {
  addToFavorite,
  ClearUserId,
  logOut,
  setUserId,
} from "../../Service/nftService";

const Navbar = () => {

  const [dropdownm, setdropdown] = useState(false);
  const navigate = useNavigate();
  const [account, setAccount] = useState(localStorage.getItem("account"));
  const [accessToken, setaccessToken] = useState(
    localStorage.getItem("accessToken")
  );


  const [signature, setsignature] = useState(null);
  const [homeselected, sethomeselected] = useState(false)
  const [marketplaceSelected, setmarketplaceSelected] = useState(false)
  const [rankingSelected, setrankingSelected] = useState(false)

  const web3Handler = async () => {
    if (typeof window.ethereum == "undefined") {
      console.log("MetaMask is not installed");
      window.open("https://metamask.io/download/", "_blank");
    } else {
      // Set signer
      let accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (!accounts.length > 0) {
        console.log("no account found");
        accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
      }
      // Get provider from Metamask
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setAccount(accounts[0]);
      await getNonce(accounts[0]).then(async (data) => {
        console.log(data.nonce);
        const signer = provider.getSigner();
        let text1 = "welcome";
        let text2 = data.nonce;
        let result = text1.concat(text2);
        setsignature(await signer.signMessage(result));
      });
    }
  };

  useEffect(() => {
    if (signature !== null) {
      Login(signature).then((response) => {
        localStorage.setItem("accessToken", response.accessToken);
        localStorage.setItem("refreshToken", response.refreshToken);
        localStorage.setItem("username", response.name);
        
        setaccessToken(localStorage.getItem("accessToken"));
       
        addToFavorite(JSON.parse(localStorage.getItem("wishlist")) || []).then(
          (response) => {
            console.log(response);
          }
        );
      });
    }
  }, [signature]);

  useEffect(() => {
    try {
      window.ethereum.on("accountsChanged", async function (accounts) {
        if (accounts.length === 0 && localStorage.getItem("account") === null) {
          localStorage.clear();
          window.location.reload();
        }
        if (localStorage.getItem("account") === accounts[0]) {
          setAccount(accounts[0]);
          if (localStorage.getItem("accessToken"))
            setaccessToken(localStorage.getItem("accessToken"));
        } else {
          if (localStorage.getItem("accessToken") !== null) {
            localStorage.clear();
            window.location.reload();
          }
        }
      });
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    if (account !== null) localStorage.setItem("account", account);
  }, [account]);

  const toprofile = () => {
    sethomeselected(false)
    setmarketplaceSelected(false)
    setrankingSelected(false)
    localStorage.removeItem("nft_id");
    ClearUserId();
    setUserId(undefined);
    navigate("/userprofile");
  };

  const tohome = () => {
    sethomeselected(true)
    setmarketplaceSelected(false)
    setrankingSelected(false)
    localStorage.removeItem("nft_id");
    ClearUserId();
    navigate("/");
  };
  const toMarket = () => {
    sethomeselected(false)
    setmarketplaceSelected(true)
    setrankingSelected(false)
    localStorage.removeItem("nft_id");
    ClearUserId();
    navigate("/marketplace");
  };
  const logout = () => {
    logOut();
    localStorage.clear();
    setAccount(null);
    setaccessToken(localStorage.getItem("accessToken"));
    navigate("/");
  };

  const dropdown = () => {
    setdropdown(!dropdownm);
  };

  const toRanking =()=>{
    ClearUserId();
    setrankingSelected(true)
    sethomeselected(false)
    setmarketplaceSelected(false)
    navigate("/ranking");
  }

  return (
    <>
      <div className={stl.navbar}>
        <div className={stl.logo} onClick={tohome}>
          <img
            style={{ height: "30px", width: "40px" }}
            src={nfticon}
            alt="logo"
          />
          <h2 className={`${stl.nftheading} ${homeselected?stl.selected:""}`}>NFT Marketplace</h2>
        </div>
        <div className={stl.menus}>
          {accessToken ? (
            <div className={stl.SignUp}>
              <button className={stl.signUpButton} onClick={toprofile}>
                {" "}
                <img className={stl.profileicon} src={profileicon} alt="" />
                {" " + account.slice(0, 5) + "..."}
              </button>
            </div>
          ) : (
            <div className={stl.SignUp}>
              <button className={stl.signUpButton} onClick={web3Handler}>
                <img className={stl.profileicon} src={profileicon} alt="" />{" "}
              Connect
              </button>
            </div>
          )}
          {accessToken ? (
            <div className={stl.ranking} onClick={logout}>
              logout
            </div>
          ) : (
            <></>
          )}
          
          <div className={`${stl.ranking} ${rankingSelected?stl.selected:""}`} onClick={toRanking}>Ranking</div>
          <div className={`${stl.marketplace} ${marketplaceSelected?stl.selected:""}`} onClick={toMarket}>
            Marketplace
          </div>
        </div>
        <div className={stl.burgerIcon} onClick={dropdown}>
          <img src={bricon} alt="menu" />
        </div>
      </div>

      {dropdownm ? (
        <div id={stl.dropdowm} className={stl.dropdowm}>
          <div className={stl.marketplace} onClick={toMarket}>
            Marketplace
          </div>
          <hr style={{ width: "92vw" }} />
          {accessToken ? (
            <div className={stl.SignUp}>
              <div className={stl.ranking} onClick={toprofile}>
                profile
              </div>
            </div>
          ) : (
            <div className={stl.SignUp}>
              <div className={stl.ranking} onClick={web3Handler}>
               Connect
              </div>
            </div>
          )}

          {accessToken ? (
            <>
              <hr style={{ width: "92vw" }} />
              <div className={stl.ranking} onClick={logout}>
                logout
              </div>
            </>
          ) : (
            <></>
          )}
          <hr style={{ width: "92vw" }} />
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default Navbar;
