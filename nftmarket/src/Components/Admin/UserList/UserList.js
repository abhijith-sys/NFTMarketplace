import React, { useState, useEffect } from 'react';

import listcss from '../UserList/userlist.module.css';
import {  getuserdetailsAdmin } from '../../../Service/userService';
import avathar from "../../../Assets/defaultUser.png";

function UserList() {
    const [userdetails, setuserdetails] = useState();
    const imagehosturl = "http://localhost:8080/";
    const getuserdata = () => {
        let key=""
        getuserdetailsAdmin(key).then(data => {
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
            Search<input type="text" name="key"/>
            <article className={listcss.leaderboard}>

                <header>
                    <h1 className={listcss.leaderboardTitle}><span className={listcss.leaderboardTitleTop}>Users</span><span className={listcss.leaderboardTitleBottom}>Leaderboard</span></h1>
                    <a href="http://localhost:8080/api/admin/csvExport"><button className={listcss.csvBtn}>Export csv</button></a>

                </header>

                <main className={listcss.leaderboardProfiles}>
                    {
                        userdetails?.map((user) => {
                            return (

                                (userdetails !== null) ? 
                                <article className={listcss.leaderboardProfile} key={user._id}>
                                    <img
                                        className={listcss.leaderboardPicture}
                                        src={
                                            user.profile_photo
                                                ? imagehosturl + user.profile_photo
                                                : avathar
                                        }
                                        alt="profilephoto"
                                    />
                                    <span className={listcss.leaderboardName}>{user?.name}</span>
                                  Created Date :  <span className={listcss.leaderboardName}>{user?.created}</span>
                                    
                                    <span className={listcss.leaderboardValue}><span className={listcss.leaderboardName}>{user?.email}</span></span>
                                </article>
                                :<span className={listcss.leaderboardName}>No data found</span>
                            )
                        })
                    }
                </main>
            </article>
            <div className={listcss.csv}>
            </div>
        </div></div>
    )
}
export default UserList
