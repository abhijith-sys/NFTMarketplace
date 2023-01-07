import axios from "axios";
import Cookies from "js-cookie";
const API_URL = "http://localhost:8080";
// process.env.API_URL
//get nft list
export async function getTopNfts(limit) {
  let datavalue;
  if (!limit) {
    datavalue = await axios
      .get(`${API_URL}/api/nft/list`)
      .then((response) => {
        return response.data;
      })
      .catch(function (error) {
        console.log(error.toJSON());
      });
  } else if (!limit.search) {
    datavalue = await axios
      .get(`${API_URL}/api/nft/list?limit=${limit ? limit : "2"}`)
      .then((response) => {
        return response.data;
      });
  } else {
    datavalue = await axios
      .get(`${API_URL}/api/nft/list?search=${limit.search ? limit.search : ""}`)
      .then((response) => {
        return response.data;
      });
  }
  return datavalue;
}

export async function getAuctiondNft() {
  return await axios
    .get(`${API_URL}/api/nft/list?filter=2`)
    .then((response) => {
      return response.data;
    });
}

//upload image to ipfs
export async function uploadImageToIpfs(data) {
  const requestOptions = {
    method: "post",
    headers: {
      //   "Content-Type": "multipart/form-data",
      pinata_api_key: "fc933c6a303948e0280a",
      pinata_secret_api_key:
        "e8a035f30c6a9d28c23b43b520dd6cfc2cc340aff8451db68bc3c6d86c9f2ae5",
    },
    body: data,
  };
  const resFile = fetch(
    "https://api.pinata.cloud/pinning/pinFileToIPFS",
    requestOptions
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const ImgHash = `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;
      return ImgHash;
    });
  return resFile;
}
//create nft
export async function createNft(data) {
  const datavalue = await axios
    .post(`${API_URL}/api/nft`, data)
    .then((response) => {
      return response.data;
    });
  return datavalue;
}

//get user nfts
export async function getusernfts() {
  const datavalue = await axios
    .get(`${API_URL}/api/users/getUserCreatedNft`)
    .then((response) => {
      return response.data;
    });
  return datavalue;
}

//get user collcted  nfts
export async function getuserCollectednfts() {
  const datavalue = await axios
    .get(`${API_URL}/api/users/getUserCollectedNft`)
    .then((response) => {
      return response.data;
    });
  return datavalue;
}

//get userdetails
export async function getuserCartDetails() {
  const datavalue = await axios.get(`${API_URL}/api/cart`).then((response) => {
    return response.data;
  });
  return datavalue;
}

export async function getuserdetailsPhotos(limit) {
  return null;
}

//add to wishlist
export async function addToFavorite(data) {
  if (data.length > 0) {
    const datavalue = await axios
      .put(`${API_URL}/api/wish/addToWishlist`, { wishlistArray: data })
      .then((response) => {
        return response.data;
      });
      return datavalue;
  }else{
    return null
  }
 
}

//remove from wishlist
export async function removeFavorite(data) {
  const datavalue = await axios
    .delete(`${API_URL}/api/wish/deleteWishlistItem/${data}`)
    .then((response) => {
      return response.data;
    });
  return datavalue;
}

//get user wishlist
export async function getuserWishlist() {
  const datavalue = await axios.get(`${API_URL}/api/wish`).then((response) => {
    return response.data;
  });
  return datavalue;
}

//add to cart
export async function addToCart(data) {
  const datavalue = await axios
    .put(`${API_URL}/api/cart/addToCart`, { _id: data })
    .then((response) => {
      return response.data;
    });
  return datavalue;
}
//get nft details
export async function getdetailsWithId(id) {
  const datavalue = await axios
    .get(`${API_URL}/api/nft/list/${id}`)
    .then((response) => {
      return response.data;
    });
  return datavalue;
}
//get bid details
export async function getBidData(id) {
  const datavalue = await axios
    .get(`${API_URL}/api/nft/bid/${id}`)
    .then((response) => {
      return response.data;
    });
  return datavalue;
}
//place new bid
export async function bidding(data) {
  const datavalue = await axios
    .put(`${API_URL}/api/nft/bid`, data)
    .then((response) => {
      return response.data;
    });
  return datavalue;
}

//cart checkout
export async function checkOutCart(data) {
  const datavalue = await axios
    .put(`${API_URL}/api/cart/checkout`, { check: 1 })
    .then((response) => {
      return response.data;
    });
  return datavalue;
}

//remove from cart
export async function RemoveFromCart(data) {
  const datavalue = await axios
    .delete(`${API_URL}/api/cart/deleteCartItem/${data}`)
    .then((response) => {
      return response.data;
    });
  return datavalue;
}


export function getSelectedNfTId() {
  if (Cookies.get("selectedNFTid")) {
    return Cookies.get("selectedNFTid");
  } else {
    return undefined;
  }
}

export function setNftId(id) {
  Cookies.set("selectedNFTid", id);
 
}
export function ClearNftId() {
  Cookies.remove("selectedNFTid");
}

export function setUserId(id) {
  Cookies.set("selectedUserId", id);
}
export function getSelectedUserId() {
  if (Cookies.get("selectedUserId")) {
    return Cookies.get("selectedUserId");
  } else {
    return undefined;
  }
}
export function ClearUserId() {
  Cookies.remove("selectedUserId");
}

export async function updateNftDetails(data) {
  const datavalue = await axios
    .put(`${API_URL}/api/nft/updateNft`, data)
    .then((response) => {
      return response.data;
    });
  return datavalue;
}

export function logOut() {
  localStorage.clear();
  ClearUserId();
  ClearNftId();
}

//approve bids
export async function approveBids(data) {
  console.log(data);
  const datavalue = await axios
    .put(`${API_URL}/api/nft/bid/approve?bidId=${data.bidid}&id=${data.id}&price=${data.price}&metamaskId=${data.metamaskId}`)
    .then((response) => {
      return response.data;
    });
  return datavalue;
}

//change owner
export async function buyNftChnageOwership(data) {
  const datavalue = await axios
    .put(`${API_URL}/api/nft/buyNft`, data)
    .then((response) => {
      return response.data;
    });
  return datavalue;
}

//close sales
export async function closeSales(id){
  const datavalue = await axios
    .put(`${API_URL}/api/nft/closeSales`, id)
    .then((response) => {
      return response.data;
    });
  return datavalue;
}