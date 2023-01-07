import React, { useState } from "react";
import { login } from "../../Service/adminservice";
import { useNavigate } from "react-router-dom";
import logcss from "./adminlog.module.css";
function AdminLogin() {
  const navigate = useNavigate();
  const [logindetails, setlogindetails] = useState();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setlogindetails({ ...logindetails, [name]: value });
  };

  const submit = () => {
    login(logindetails).then((data) => {
      console.log(data);
      navigate("/notify");
    });
  };
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const validate = (value) => {
    const errors = {};
    const regExEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    const reExNumber = /^[\d]*$/;
    console.log("========>", value);
    if (!value.name || !regExEmail.test(value.price)) {
      errors.name = "Please enter a valid email or username";
    }
    if (!value.password) {
      errors.password = "password is required";
    }

    console.log(errors);
    if (Object.keys(formErrors).length !== 0) {
      setIsSubmit(false);
    }
    console.log(isSubmit);
    return errors;
  };
  return (
    <div className={logcss.logForm}>
      <h1>Admin </h1>
      <span className="fa fa-star checked"></span>
      <form className={logcss.loginForm}>
        <span className="fa fa-star checked"></span>

        <div className={logcss.flexRow}>
          <input
            id="username"
            name="email"
            className={logcss.lfInput}
            onChange={handleChange}
            placeholder="Username"
            type="text"
          />
        </div>
        <div className={logcss.flexRow}>
          <input
          name="password"
            id="password"
            className={logcss.lfInput}
            onChange={handleChange}
            placeholder="Password"
            type="password"
          />
        </div>
        <input
          className={logcss.lfSubmit}
          onClick={submit}
          type="button"
          value="LOGIN"
        />
      </form>
    </div>
  );
}

export default AdminLogin;
