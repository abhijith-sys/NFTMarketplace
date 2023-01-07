import axios from "axios";
const API_URL = "http://localhost:8080";

export async function getAccessToken() {
  let datavalue
 if( localStorage.getItem("refreshToken")){ datavalue = await axios
    .put(`${API_URL}/api/users/refresh`, {
      refreshToken: localStorage.getItem("refreshToken"),
    })
    .then((response) => {
      return response.data;
    });}else{
      datavalue=null
    }
  return datavalue ;
}
export async function getNonce(data) {
  const datavalue = await axios
    .post(`${API_URL}/api/users/getNonce`, { metamaskId: data })
    .then((response) => {
      return response.data;
    });
  return datavalue;
}

export async function Login(data) {
  let accounts = await window.ethereum.request({
    method: "eth_accounts",
  });
  const datavalue = await axios
    .post(`${API_URL}/api/users/verifySignature`, {
      verificationMessage: data,
      metamaskId: accounts[0],
    })
    .then((response) => {
      return response.data;
    });

  return datavalue;
}

//add user cover photo
export async function setUserDetails(userdetails) {
  const datavalue = await axios
    .put(`${API_URL}/api/users/addUserCoverPhoto`, userdetails)
    .then((response) => {
      return response.data;
    });

  return datavalue;
}

//add user profile photo
export async function setUserProfile(userdetails) {
  const datavalue = await axios
    .put(`${API_URL}/api/users/addUserProfilePhoto`, userdetails)
    .then((response) => {
      return response.data;
    });

  return datavalue;
}

//get userdetails
export async function getuserdetails() {
  const datavalue = await axios.get(`${API_URL}/api/users`).then((response) => {
    return response.data;
  });
  return datavalue;
}

//add user details name,bio,email
export async function details(data) {

  const datavalue = await axios
    .put(`${API_URL}/api/users/userdetails`, data)
    .then((response) => {
      return response.data;
    }).catch(function (error) {
     
    });

  return datavalue;
}

//get top creators
export async function getTopCreators() {
  const datavalue = await axios
    .get(`${API_URL}/api/users/getTopCreators`)
    .then((response) => {
      return response.data;
    });
  return datavalue;
}
//get trending colllections
export async function getTrendingCollections() {
  const datavalue = await axios
    .get(`${API_URL}/api/users/getAllUserCollectedNft`)
    .then((response) => {
      return response.data;
    });
  return datavalue;
}

//get user with id
export async function getUserDetailsWithId(id) {
  const datavalue = await axios
    .get(`${API_URL}/api/users/getUserById/${id}`)
    .then((response) => {
      return response.data;
    });
  return datavalue;
}


//subscribe using email
export async function SubscribeEmailNotification(data){
  const datavalue = await axios
    .post(`${API_URL}/api/users/email`, data)
    .then((response) => {
      return response.data;
    }).catch(function (error) {
     
    });

  return datavalue;
}
//get userdetails
export async function getuserdetailsAdmin (key){
  const datavalue =  await axios.get(`${API_URL}/api/admin/listUser?keyWord=${key}`).then((response) => {

    // .get(`${API_URL}/api/nft/list?search=${limit.search ? limit.search : ""}`)

      return response.data
  })
  return datavalue
}
//csv export user data
export async function csvExport (){
  const datavalue =  await axios.get(`${API_URL}/api/admin/csvExport`).then((response) => {
      return response.data
  })
  return datavalue
}
