import React, { useEffect, useState } from "react";
import { getTopNfts, setNftId } from "../../Service/nftService";
import Card from "../Card/Card";
import markt from "./Marketplace.module.css";
import srch from "../../Assets/search.svg";
import { SpinnerDotted } from "spinners-react";


const Marketplace = (props) => {

  const [nfts, setnfts] = useState([]);
  const [limit, setlimit] = useState(8);
  

  const [Spinner, setSpinner] = useState(false);

  useEffect(() => {
    getnfts();
  }, []);

  const getselectednft = (data) => {
    setNftId(data._id);
    // props.selectednfts(data._id)
  };

  const getnfts = (limit) => {
    setSpinner(true);
    getTopNfts(limit).then((data) => {
      console.log("nft list data");
      console.log(data);
      setnfts(data);
      setSpinner(false);
    });
  };

  const getevent = (e) => {
    if (
      e.target.scrollTop + 100 >=
      e.target.scrollHeight - e.target.clientHeight
    ) {
      setlimit(limit + 2);
      getnfts(limit);
    }
  };

  const handleChange = (e) => {
    const params = {};
    params.search = e.target.value;
    getTopNfts(params).then((data) => {
      console.log("nft list data");
      console.log(data);
      setnfts(data);
      setSpinner(false);
    });
  };


  return (
    <div className={markt.maketplace} onScroll={getevent}>
      <div className={markt.filterSearch}>
        <div className={markt.filterSearchAlign}>
          <div className={markt.filterSearchHeading}>
            <h1>Browse Marketplace</h1>
            <p>Browse through more than 50k NFTs on the NFT Marketplace.</p>
          </div>
          <div className={markt.inputfieldoutline}>
            <input
              type="text"
              className={markt.searchinput}
              onChange={handleChange}
            />
            <img src={srch} alt="" />
          </div>
        </div>
     
      </div>
   
      {nfts?.map((data) => (
        <Card
          key={data._id}
        
          wish={data.wishList ? true : false}
          showcart={true}
          display={data.cart ? true : false}
          favr={true}
          onselect={getselectednft}
          nftdetails={data.nft}
          username={data?.ownerName ? data.ownerName : "unnamed"}
          userprofile={data.profilePicture ? data.profilePicture : "nill"}
          userId={data.userId}
        />
      ))}
          <SpinnerDotted
        className={markt.spinner}
        size={90}
        thickness={180}
        speed={100}
        color="#a259ff"
        enabled={Spinner}
      />
    </div>
  );
};

export default Marketplace;
