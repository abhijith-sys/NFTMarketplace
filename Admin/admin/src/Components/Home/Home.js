import React, { useEffect, useState } from 'react'
import { getCount, getNftCount, getuserCount } from '../../Service/adminservice'
import homecss from "./Home.module.css"
const Home = () => {
  const [count, setcount] = useState()
  const getUsercount=()=>{
    getCount().then(response=>{
      setcount(response)
    })
  }
  useEffect(() => {
   console.log('====================================');
   console.log(count);
   console.log('====================================');
  }, [count])
  

  useEffect(() => {
    getUsercount()
  }, [])
  
  return (
    <div className={homecss.mainbody}>
        <div className={homecss.cards}>
               <div className={homecss.count}>
                <div className={homecss.usercount}>
                        <h3>Total Users</h3>
                        <h3>{count?.userCount}</h3>
                </div>
                <div className={homecss.usercount}>
                       <h3>Total Nfts</h3>
                       <h3>{count?.nftCount}</h3>
                </div>
               </div>
        </div>
    </div>
  )
}

export default Home