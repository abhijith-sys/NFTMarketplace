
import axios from "axios";
const API_URL = "http://localhost:8080";
export async function createNotification(data) {
    const datavalue = await axios
      .post(`${API_URL}/api/email/sendMail`, data)
      .then((response) => {
        return response.data;
      });
    return datavalue;
  }
  

  export async function getCount(data) {
    const datavalue = await axios
      .get(`${API_URL}/api/admin/count`, data)
      .then((response) => {
        return response.data;
      });
    return datavalue;
  }
  

  

  export async function login(data) {
    const datavalue = await axios
      .post(`${API_URL}/api/admin`, data)
      .then((response) => {
        return response.data;
      });
    return datavalue;
  }
  
  export async function getNotificationWithId() {
    return await axios
      .get(`${API_URL}/api/nft/list?filter=2`)
      .then((response) => {
        return response.data;
      });
  }
  export async function listnotification() {
    return await axios
      .get(`${API_URL}/api/email/listMail`)
      .then((response) => {
        return response.data;
      });
  }
  export async function listUsers() {
   
    return await axios
      .get(`${API_URL}/api/admin/listUser?keyWord`,)
      .then((response) => {
        return response.data;
      });
  }
  export async function getuserdetailsAdmin() {
    return await axios
      .get(`${API_URL}/api/nft/list?filter=2`)
      .then((response) => {
        return response.data;
      });
  }
  export async function deleteNotification(id) {
    return await axios
      .delete(`${API_URL}/api/email/deleteMail/:${id}`)
      .then((response) => {
        return response.data;
      });
  }