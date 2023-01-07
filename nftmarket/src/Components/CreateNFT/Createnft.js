import React, { useEffect, useState } from "react";
import cr from "./createnft.module.css";
import imageicon from "../../Assets/imgicon.png";
import { uploadImageToIpfs, createNft } from "../../Service/nftService";
import { useNavigate } from "react-router-dom";
import Marketplace from "../../Marketplace.json";



const Createnft = () => {
  const navigate = useNavigate();
  const [nftdetails, setnftdetails] = useState();
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  const ethers = require("ethers");
  const [Spinner, setSpinner] = useState(false);
  const [formErrors, setformErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [created, setcreate] = useState(true);
  
  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setnftdetails({ ...nftdetails, [name]: value });
  };

  const uploadPhoto = (e) => {
    setSelectedFile(e.target.files[0]);
    if (e.target.files.length) {
      const file = e.target.files[0];
      const fileType = file.type.split("/")[0];
      if (fileType === "image") {
        // Only set the image if it is an image file
        setnftdetails({ ...nftdetails, image: e.target.files });
      } else {
        // Display an error message if the file is not an image
        alert("Only image files are allowed");
      }
    }
  };

  const validateform = (values) => {
    const errors = {};

    // Check that an image has been selected
    if (!values.image) {
      errors.image = "Image required";
    } else {
      // Check that the selected file is an image
      const file = values.image[0];
      const fileType = file.type.split("/")[1];
      if (!["jpeg", "jpg", "png", "gif"].includes(fileType)) {
        errors.image = "Only JPEG, JPG, PNG, and GIF images are allowed";
      } else {
        // Check the size of the file
        if (file.size > 20 * 1024 * 1024) {
          errors.image =
            "The selected file is too large (maximum size is 20 MB)";
        }
      }
    }

    if (!values.name) {
      errors.name = "Name required";
    } else if (values.name.length > 20) {
      errors.name = "Max limit 20";
    }

    if (values.description?.length > 200) {
      errors.description = "Max limit 200";
    }

    return errors;
  };

  const submit = async () => {
    setnftdetails({ ...nftdetails, nft_id: "4" });
    setformErrors(validateform(nftdetails));
    setIsSubmit(true);
  };


  useEffect(() => {
    if (nftdetails !== undefined) setformErrors(validateform(nftdetails));
  }, [nftdetails]);


  useEffect(() => {
    const create = async () => {
      try {
        // Validate the form
        const errors = validateform(nftdetails);
        if (Object.keys(errors).length > 0) {
          // If there are errors, display an error message and return early
          alert("Please fix the errors in the form.");
          return;
        }
        const fd = new FormData();
        fd.append("file", nftdetails.image[0]);
        setSpinner(true);
  
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
  
        let data = await uploadImageToIpfs(fd);
        if (data != null) {
          console.log(data);
          const nftDetails = {
            image: data,
            nftName: nftdetails.name,
            description: nftdetails.description,
            price: "0.01",
          };
          console.log(nftDetails);
          let contract = new ethers.Contract(
            Marketplace.address,
            Marketplace.abi,
            signer
          );
          const price = ethers.utils.parseUnits(nftDetails.price, "ether");
          let listingPrice = await contract.getListPrice();
          listingPrice = listingPrice.toString();
  
          let transaction = await contract.createToken(nftDetails, price, {
            value: listingPrice,
          });
          let trans = await transaction.wait();
          console.log(trans);
          if (trans) {
            let value = trans.events[0].args[2]._hex;
            let key = "nft_id";
            nftDetails[key] = value;
            createNft(nftDetails)
              .then((data) => {
                if (data != null) {
                  navigate("/profile");
                  alert("Sucessfully listed your NFT");
                  window.location.replace("/");
                } else {
                  alert("Something went wrong");
                }
              })
              .catch((error) => {
                console.error(error);
                alert(
                  "An error occurred while trying to list the NFT. Please try again."
                );
              })
              .finally(() => {
                // Stop the spinner
                setSpinner(false);
              });
          }
        } else {
          alert("Error uploading image to IPFS.");
          setSpinner(false);
          return;
        }
      } catch (e) {
        console.error(e);
        // Set the spinner to false to hide the loading spinner
        setSpinner(false);
  
        // Check the error code and display an appropriate error message
        if (e.operation === "getAddress") {
          alert("User address cannot be found. Please login.");
        } else if (e.code === "INSUFFICIENT_FUNDS") {
          alert("Insufficient balance.");
        } else if (e.code === "ACTION_REJECTED") {
          alert("Payment rejected.");
        } else if (e.code === "NETWORK_ERROR") {
          alert(
            "An error occurred while communicating with the Ethereum network. Please try again."
          );
        } else if (e.code === "UNSUPPORTED_OPERATION") {
          alert(
            "This operation is not supported by the Ethereum provider. Please try again."
          );
        } else if (e.code === "INVALID_ARGUMENT") {
          alert(
            "An invalid argument was passed to a function. Please check your input and try again."
          );
        } else if (e.code === "REVERT") {
          alert(
            "The contract call has been reverted. This could be due to unmet conditions. Please check your input and try again."
          );
        } else if (e.code === "CALL_EXCEPTION") {
          alert("Please switch to the Goerli test network.");
        } else {
          alert("An error occurred. Please try again.");
        }
      }
    };
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      if (created) {

        create();
        setcreate(false);
      }
    } else {
      setIsSubmit(false);
    }
  }, [created, ethers.Contract, ethers.providers.Web3Provider, ethers.utils, formErrors, isSubmit, navigate, nftdetails]);


  return (
    <div className={cr.createform}>
      {Spinner && (
        <div className={cr.loading}>
          {/* <SpinnerDotted className={cr.loading} size={90} thickness={180} speed={100} color="#36ad47" enabled={Spinner} /> */}
        </div>
      )}

      <div className={cr.form}>
        <h3>Create New Item</h3>
        <h2 className={cr.formlabel}>
          Image <span className={cr.err}>*</span>
        </h2>
        <label htmlFor="file-input">
          <div className={cr.uploadFilesContainer}>
            {selectedFile ? (
              <img className={cr.uploadimagePreview} src={preview} alt="" />
            ) : (
              <img className={cr.uploadimageContainer} src={imageicon} alt="" />
            )}
          </div>
        </label>
        <input
          required
          id="file-input"
          name="file"
          type="file"
          style={{ display: "none" }}
          accept="image/*"
          onChange={uploadPhoto}
          alt=""
        />
        <br></br>
        <span className={cr.err}>{formErrors.image}</span>
        <br />
        <div>
          <h2 className={cr.formlabel}>
            Name <span className={cr.err}>*</span>
          </h2>

          <div className={cr.inputfieldoutline}>
            <input
              required
              className={cr.profileinput}
              type="text"
              placeholder="Name"
              name="name"
              onChange={handleChange}
            />
          </div>
        </div>
        <span className={cr.err}>{formErrors.name}</span>
        <br />
        <div>
          <h2 className={cr.formlabel}>Description</h2>
          <div className={cr.inputfieldoutline}>
            <textarea
              required
              className={cr.profileinput}
              type="text"
              placeholder="Description"
              name="description"
              onChange={handleChange}
            />
          </div>
        </div>
        <span className={cr.err}>{formErrors.description}</span>
        <br />
        <div className={cr.save} onClick={submit}>
          create
        </div>
      </div>
    </div>
  );
};

export default Createnft;
