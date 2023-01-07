import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { details, getuserdetails } from "../../Service/userService";

import eform from "./ProfileForm.module.css";

const ProfileForm = () => {
  const [userdetails, setuserdetails] = useState([]);
  const initialProfile = {
    name: userdetails.name,
    bio: userdetails.bio,
    email: userdetails.email,
  };
  const [profileform, setProfileform] = useState(initialProfile);
  const [profileformErrors, setProfileformErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileform({ ...profileform, [name]: value });
  };

  const submmit = () => {
    setProfileformErrors(validatefrorm(profileform));
    setIsSubmit(true);
  };

  const getuserdata = () => {
    getuserdetails().then((data) => {
      setuserdetails(data);
      setProfileform({ name: data.name, bio: data.bio, email: data.email });
    });
  };

  useEffect(() => {
    getuserdata();
  }, []);

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

    // Check that the bio is not too long
    if (values.bio?.length > 200) {
      errors.bio = "Max limit 200";
    }

    // Check that the name is not too long
    if (values.name?.length > 10) {
      errors.name = "Max limit 10";
    }

    return errors;
  };

  useEffect(() => {
    if (Object.keys(profileformErrors).length === 0 && isSubmit) {
      console.log("api call");
    details(profileform).then((datavalue) => {
     if(datavalue){ navigate("/profile");}
    });;

      
    } else {
      setIsSubmit(false);
    }
  }, [isSubmit, navigate, profileform, profileformErrors]);
  

  useEffect(() => {
    if (
      profileform.bio !== undefined ||
      profileform.email !== undefined ||
      profileform.name !== undefined
    )
      setProfileformErrors(validatefrorm(profileform));
  }, [profileform]);

  return (
    <div className={eform.editProfileForm}>
      <div className={eform.editform}>
        <div>
          <h3 className={eform.heading}>Profile details</h3>
        </div>
        <div>
          <h2 className={eform.formlabel}>Username</h2>
          <div className={eform.inputfieldoutline}>
            <input
              className={eform.profileinput}
              type="text"
              placeholder="Username"
              name="name"
              value={profileform.name}
              onChange={handleChange}
            />
          </div>
          <span className={eform.err}>{profileformErrors.name}</span>
          <br></br>
        </div>
        <div>
          <h2 className={eform.formlabel}>Bio</h2>
          <div className={eform.inputfieldoutline}>
            <textarea
              className={eform.profileinput}
              value={profileform.bio}
              name="bio"
              onChange={handleChange}
            ></textarea>
          </div>
        </div>
        <span className={eform.err}>{profileformErrors.bio}</span>
        <br></br>
        <div>
          <h2 className={eform.formlabel}>Email Address</h2>
          <div className={eform.inputfieldoutline}>
            <input
              className={eform.profileinput}
              type="email"
              placeholder="Email"
              name="email"
              value={profileform.email}
              onChange={handleChange}
            />
          </div>
        </div>
        <span className={eform.err}>{profileformErrors.email}</span>
        <br></br>
        <div className={eform.save} onClick={submmit}>
          save
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;
