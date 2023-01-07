import React, { useEffect, useState } from "react";
import emform from "./EmailForm.module.css";
import { useNavigate } from "react-router-dom";
import { createNotification } from "../../Service/adminservice";
const EmailForm = () => {
  const initialProfile = {
    subject: "",
    time: "",
    text: "",
  };
  const navigate = useNavigate();
  const [email, setEmail] = useState(initialProfile);
  const [isSubmmit, setisSubmmit] = useState(false);
  const [emailformErrors, semailformErrors] = useState({});
  const [Spinner, setSpinner] = useState(false)
  const handleChange = (e) => {
    console.log("kjhgfd");
    console.log(e.target);
    const { name, value } = e.target;
    setEmail({ ...email, [name]: value });
  };
  const submmit = (e) => {
    e.preventDefault();

    semailformErrors(validatefrorm(email));
    setisSubmmit(true);
  };
  const validatefrorm = (values) => {
    const errors = {};

    if (!values.subject) {
      errors.subject = "subject is required";
    } else if (values.subject.length > 100) {
      errors.subject = "subject is too long";
    }

    // if (values.bio?.length > 200) {
    //   errors.bio = "Max limit 200";
    // }
    if (!values.text) {
      errors.body = "body is required";
    }
    // Check that the name is not too long
    if (values.text?.length > 400) {
      errors.body = "Max limit 400";
    }

    return errors;
  };
  useEffect(() => {
    if (Object.keys(emailformErrors).length === 0 && isSubmmit) {
      setSpinner(true)
      createNotification(email).then((response) => {
        console.log(response);
        navigate("/notify");
        setisSubmmit(false);
      });
      
    } else {
      setisSubmmit(false);
    }
  }, [emailformErrors]);
  useEffect(() => {
    console.log(emailformErrors);

    console.log(email);
  }, [email, emailformErrors]);

  return (
    <div className={emform.fbody}>
      
           {Spinner && (
        <div className={emform.loading}>
        
        </div>
      )}

      <div className={emform.form}>
        <form className={emform.mainform}>
          <h3>subject</h3>
          <input
            type="text"
            name="subject"
            placeholder="subject"
            className={emform.subject}
            onChange={handleChange}
          />
          <span className={emform.err}>{emailformErrors.subject}</span>
          <h3>Date</h3>
          <input type="datetime-local" name="time" className={emform.subject} onChange={handleChange} />
          {/* <input
            type="Date"
            name="Date"
            placeholder="time"
            className={emform.subject}
            onChange={handleChange}
          />
          <h3>Time</h3>
          <input
            type="time"
            name="Time"
            placeholder="time"
            className={emform.subject}
            onChange={handleChange}
          /> */}
          <h3>body</h3>
          <textarea
            type="text"
            name="text"
            placeholder="body"
            className={emform.emailbody}
            onChange={handleChange}
          />
          <span className={emform.err}>{emailformErrors.text}</span>
          <button className={emform.emailbutton} onClick={submmit}>
            {" "}
            submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmailForm;
