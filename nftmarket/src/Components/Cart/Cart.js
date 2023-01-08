import React, { useCallback, useEffect, useState } from "react";
import { getuserCartDetails } from "../../Service/nftService";
import Card from "../Card/Card";
import cartstyle from "./Cart.module.css";
const Cart = () => {
  const [nfts, setnfts] = useState([]);
  const [limit, setlimit] = useState()
  const [hasnext, sethasnext] = useState(false)
  const getcart = (number) => {
    getuserCartDetails(number).then((data) => {
      setnfts(data);
      sethasnext(data.hasNextPage)
    });
  };
  useEffect(() => {
    getcart();
  }, []);
  const refresh = useCallback(() => {
    getcart();
  }, []);
  const getevent = (e) => {
    if (
      e.target.scrollTop + 100 >=
      e.target.scrollHeight - e.target.clientHeight
    ) {
      setlimit(limit + 2);
      if(hasnext)
      getcart(limit);
    }
  };

  return (
    <div className={cartstyle.cartbody} onScroll={getevent}>
      {nfts?.map((data) => {
        return data.cart.map((nftdata) => {
          return (
            <Card
              key={nftdata?._id}
              showcart={true}
              display={data.wishlist ? false : true}
              nftdetails={nftdata}
              username={nftdata?.owner[0]?.name}
              userprofile={nftdata?.owner[0]?.profile_photo}
              refresh={refresh}
              wish={data?.wishlist ? true : false}
              userId={nftdata?.owner[0]._id}
            />
          );
        });
      })}
    </div>
  );
};

export default Cart;
