import React, { useState, useEffect } from 'react';
import { getuserdetailsAdmin, listUsers } from '../../Service/adminservice';

import listcss from './userlist.module.css';



function UserList() {
    const [userdetails, setuserdetails] = useState();
    const imagehosturl = "http://localhost:8080/";
    const getuserdata = () => {
        let key=""
        listUsers(key).then(data => {
            setuserdetails(data.paginatedData)
            console.log(data);
        })
    }
    useEffect(() => {
        getuserdata();

    }, []);

    return (
        <div>
        <div className={listcss.listBody}>
            {/* Search<input type="text" name="key"/> */}


                <header>
                    <h1 className={listcss.leaderboardTitle}><span className={listcss.leaderboardTitleTop}>Users</span><span className={listcss.leaderboardTitleBottom}>Leaderboard</span></h1>
                    <a href="http://localhost:8080/api/admin/csvExport"><button className={listcss.csvBtn}>Export csv</button></a>

                </header>

            
                    <table style={{maxWidth:"500px"}}>

                    {
                        userdetails?.map((user) => {
                            return (
                                      <tr key={user._id}>
                                         <td>{user?.name}</td>
                                         <td>{user?.email}</td>
                                      </tr>


                            //     (userdetails !== null) ? 
                            //     <article className={listcss.leaderboardProfile} key={user._id}>
                                 
                            //         <span className={listcss.leaderboardName}>{user?.name}</span>
                                    
                            //         <span className={listcss.leaderboardValue}><span className={listcss.leaderboardName}>{user?.email}</span></span>
                            //     </article>
                            //     :<span className={listcss.leaderboardName}>No data found</span>
                             )
                        })
                    }</table>

   
            <div className={listcss.csv}>
            </div>
        </div></div>
    )
}
export default UserList
