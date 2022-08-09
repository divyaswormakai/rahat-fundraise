import { toast } from "react-toastify";
import React, { useState, Fragment, useContext, useEffect } from "react";
import dayjs from "dayjs";
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import Logo from "../../images/logo.png";
import Navbar from "../../components/Navbar";
import Footer from "../../components/footer";
import PageTitle from "../../components/pagetitle";
import UserContext from "../../context/user-context";
import Scrollbar from "../../components/scrollbar";
import web3 from "web3";
import bnbImage from "../../images/icon/binance.png";
import polyImage from "../../images/icon/polymatic.jpg";
import { supportedChains } from "../../utils/chains";
import Button from "react-bootstrap/Button";

const FundraiseRegisterPage = (props) => {
  const [value, setValue] = useState({
    title: "",
    excerpt: "",
    story: EditorState.createEmpty(),
    target: "",
    expiryDate: "",
    walletType: "Binance Smart Chain Testnet",
    walletAddress: "",
  });

  const [wallets, setWallets] = useState([]);
  const [submited,setSubmited] = useState(false);

  const { user } = useContext(UserContext);

  const [image, setImage] = useState(null);

  const changeHandler = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };

  const handleFileChange = (event) => {
    setImage(event.target.files[0]);
  };

  const removeWallet = (index) => {
    const newWallets = wallets?.filter((item, idx) => index !== idx);
    setWallets(newWallets);
  };

  const handleWalletSave = (event) => {
    event.preventDefault();
    const isValidAddress = web3.utils.isAddress(value.walletAddress);
    if (isValidAddress) {
      setWallets(
        wallets.concat({
          name: value?.walletType || "Binance Smart Chain Testnet",
          walletAddress: value?.walletAddress,
        })
      );
    } else {
      toast.warning("Please enter correct wallet address.");
    }
    setValue((previous) => {
      return {
        ...previous,
        walletType: "Binance Smart Chain Testnet",
        walletAddress: "",
      };
    });
  };

  const SubmitHandler = async (e) => {
    e.preventDefault();
    setSubmited(true);
    registerFundraise(0);
  };

  const RegisterAsDraft = (e) => {
    e.preventDefault();
    registerFundraise(1);
  };

  const registerFundraise = async (saveAsDraft) => {
    if (wallets?.length <= 0) {
      toast.warning("Please add at least one wallet.");
      return;
    }
    if (value.excerpt?.length > 100) {
      toast.warning("Tagline Cannot be more than 100 words.");
      return;
    }

    if (value.title?.length <= 0) {
      toast.warning("Please enter the title");
      return;
    }
    const formData = new FormData();
    formData.append("title", value.title);
    formData.append("excerpt", value.excerpt || "");
    formData.append(
      "story",
      JSON.stringify(convertToRaw(value.story.getCurrentContent()))
    );

    formData.append("target", value.target);
    formData.append("expiryDate", dayjs(value.expiryDate).format("YYYY-MM-DD"));
    formData.append("image", image);
    formData.append("wallets", JSON.stringify(wallets));
    formData.append("status", saveAsDraft ? "DRAFT" : "PUBLISHED");

    try {
      const resData = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/campaign/add`,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${user?.data?.token}`,
          },
        }
      ).then((res) => res.json());

      if (resData?.ok) {
        props.history.push("/myfundraise");
      } else {
        setSubmited(false);
        throw new Error("Failed to register campaign.");
      }
    } catch (error) {
      setSubmited(false);
      return toast.error(error.message);
    }
  };

  return (
    <Fragment>
      <Navbar Logo={Logo} />
      <PageTitle pageTitle={"Register"} pagesub={"Register"} />
      <div className="wpo-donation-page-area section-padding">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="wpo-donate-header">
                <h2>Create your fundraising campaign</h2>
              </div>
              <div id="Donations" className="tab-pane">
                <form onSubmit={SubmitHandler}>
                  <div className="wpo-donations-details">
                    <h2>Enter details of your campaign</h2>
                    <div className="row">
                      <div className="col-lg-12 col-12 form-group clearfix">
                        <label htmlFor="fname" className="form-label">
                          <strong>Title</strong>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="title"
                          id="fname"
                          placeholder="Max 50 letters"
                          maxLength={50}
                          onChange={changeHandler}
                        />
                      </div>
                      <div className="col-lg-12 col-md-6 col-sm-6 col-12 form-group">
                        <label htmlFor="fname" className="form-label">
                          <strong>Tagline</strong>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="excerpt"
                          id="fname"
                          placeholder="Max 100 letters"
                          maxLength={100}
                          onChange={changeHandler}
                        />
                      </div>
                      <div className="col-lg-12 col-12 form-group">
                        <label htmlFor="fname" className="form-label">
                          <strong>Share Your Story</strong>
                        </label>

                        <Editor
                          editorState={value?.story}
                          wrapperClassName="border border-1 p-2"
                          editorClassName="editer-content"
                          onEditorStateChange={(editorState) => {
                            setValue((previous) => {
                              return {
                                ...previous,
                                story: editorState,
                              };
                            });
                          }}
                        />
                      </div>
                      <div className="col-lg-12 col-md-12 col-sm-12 col-12 form-group">
                        <label htmlFor="formFileSm" className="form-label mt-3">
                          Upload photo that best defines your fundraiser
                          campaign
                        </label>
                        <input
                          className="form-control form-control-sm"
                          id="formFileSm"
                          type="file"
                          accept=".jpg,.jpeg,.png"
                          onChange={handleFileChange}
                        />
                      </div>

                      <div className="row align-items-center">
                        <div
                          className="col-lg-5 col-md-5 col-sm-5 col-12"
                          style={{ marginBottom: "30px" }}
                        >
                          <label htmlFor="fname" className="form-label">
                            <strong>Your blockchain network</strong>
                          </label>
                          <select
                            id="inputState"
                            className="form-select"
                            name="walletType"
                            value={value?.walletType}
                            onChange={changeHandler}
                          >
                            {Object.keys(supportedChains).map((el, i) => {
                              return <option key={i} value={supportedChains[el].chainName}>{supportedChains[el].chainName}</option>;
                            })}
                          </select>
                        </div>
                        <div
                          className="col-lg-5 col-md-5 col-sm-5 col-7"
                          style={{ marginBottom: "30px" }}
                        >
                          <label htmlFor="fname" className="form-label">
                            <strong>Your Wallet address</strong>
                          </label>
                          <input
                            type="text"
                            placeholder="Wallet address"
                            className=" my-auto"
                            name="walletAddress"
                            value={value?.walletAddress}
                            onChange={changeHandler}
                            style={{ height: 35 }}
                          />
                        </div>
                        <div className="col-lg-2 col-md-2 col-sm-2 col-5">
                          <button
                            className="btn btn-primary submit-btn"
                            onClick={handleWalletSave}
                          >
                            Add
                          </button>
                        </div>
                      </div>

                      <div className="mt-3">
                        <div className="mb-2">
                          <strong>Linked Wallets</strong>
                        </div>
                        {wallets?.map((wallet, index) => (
                          <p className="mb-0" key={index}>
                            <small>
                              {" "}
                              <img
                                src={wallet?.name?.includes('Binance')?bnbImage:polyImage}
                                height={20}
                                style={{ marginTop: "-0.3rem" }}
                                alt=""
                              />
                              &nbsp;<strong>{wallet?.name}</strong>: {wallet?.walletAddress}
                            </small>
                            <span
                              className="text-danger c-p"
                              onClick={() => removeWallet(index)}
                            >
                              &nbsp; <i className="fa fa-trash"></i>
                            </span>
                          </p>
                        ))}
                      </div>
                    </div>
                    <div className="row mt-4">
                      <div className="col-lg-6 col-12 form-group">
                        <label htmlFor="fname" className="form-label">
                          <strong>How much do you want to raise?</strong>
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          name="target"
                          id="fname"
                          placeholder="Enter amount in BNB"
                          onChange={changeHandler}
                        />
                      </div>
                      <div className="col-lg-6 col-12 form-group">
                        <label htmlFor="fname" className="form-label">
                          <strong>Campaign End Date</strong>
                        </label>
                        <input
                          type="date"
                          min={dayjs().add("1", "day").format("YYYY-MM-DD")}
                          className="form-control"
                          name="expiryDate"
                          id="expiryDate"
                          onChange={changeHandler}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="submit-area" disabled={submited}>
                    <Button disabled={submited} type="submit" className="theme-btn submit-btn mx-2">
                      Publish Campaign
                    </Button>
                    <Button
                        disabled={submited}
                      className="theme-btn submit-btn mx-2"
                      onClick={RegisterAsDraft}
                    >
                      Save As Draft
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <Scrollbar />
    </Fragment>
  );
};
export default FundraiseRegisterPage;
