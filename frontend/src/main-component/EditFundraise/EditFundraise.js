import { toast } from 'react-toastify';
import React, { useState, Fragment, useEffect, useContext } from 'react';
import dayjs from 'dayjs';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
// import { stateToHTML } from 'draft-js-export-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import Logo from '../../images/logo.png';
import Navbar from '../../components/Navbar';
import Footer from '../../components/footer';
import PageTitle from '../../components/pagetitle';
import Scrollbar from '../../components/scrollbar';
import UserContext from '../../context/user-context';
import { isJson } from '../../helper/helper';
import web3 from'web3';
import bnbImage from '../../images/icon/binance.png'
import {Button} from "reactstrap";
import { useHistory } from 'react-router-dom';

const EditFundraise = (props) => {
  const [value, setValue] = useState({
    title: '',
    excerpt: '',
    status: '',
    story: EditorState.createEmpty(),
    target: '',
    expiryDate: '',
    wallets: [],
    walletType: 'Binance',
    walletAddress: '',
    image: '',
  });
  const [image, setImage] = useState(null);
  const [buttonDisable, setButtonDisabled] = useState(false);

  const history = useHistory();

  const campaignId = props.match.params.id;
  // const [wallets, setWallets] = useState([]);

  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchSingleCampaign = async () => {
      try {
        const resData = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/api/campaign/get-by-id/${campaignId}`,
        ).then((res) => res.json());
        if (user?.data?.id !== resData?.data?.creator?.id) {
          toast.info("You don't have sufficient priviledges.");
          history.push('/');
        }
        setValue({
          title: resData.data.title,
          excerpt: resData.data.excerpt,
          story: isJson(resData?.data?.story)
            ? EditorState.createWithContent(
                convertFromRaw(JSON.parse(resData?.data?.story)),
              )
            : EditorState.createEmpty(),
          target: resData.data.target,
          expiryDate: resData.data.expiryDate,
          wallets: resData.data.wallets || [],
          status: resData?.data?.status?.toLowerCase() || 'Published',
          image: resData?.data?.image,
        });
      } catch (error) {
        toast.error(error.message);
      }
    };

    if (campaignId && user?.isLoggedIn && user?.data?.token) {
      fetchSingleCampaign();
    }
  }, [user, campaignId]);

  const handleWalletSave = (event) => {
    event.preventDefault();
    const isValidAddress = web3.utils.isAddress(value.walletAddress);
    if (isValidAddress) {
      setValue((previous) => {
        return {
          ...previous,
          wallets: previous?.wallets?.concat({
            name: previous?.walletType || 'Binance',
            walletAddress: previous?.walletAddress,
          }),
          walletType: 'Binance',
          walletAddress: '',
        };
      });
    } else {
      toast.warning('Please enter correct wallet address.');
    }
  };

  const removeWallet = (index) => {
    const newWallets = value.wallets?.filter((item, idx) => index !== idx);
    setValue((previous) => {
      return {
        ...previous,
        wallets: newWallets,
      };
    });
  };

  const changeHandler = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };

  const handleFileChange = (event) => {
    setImage(event.target.files[0]);
  };

  const SubmitHandler = async (e) => {
    e.preventDefault();

    if (value.wallets?.length <= 0) {
      toast.info('Please have at least one wallet.');
      return;
    }

    const formData = new FormData();
    formData.append('title', value.title);
    formData.append('excerpt', value.excerpt);
    formData.append(
      'story',
      JSON.stringify(convertToRaw(value.story.getCurrentContent())),
    );
    formData.append('target', value.target);
    formData.append('expiryDate', value.expiryDate);
    formData.append('image', image);
    formData.append('wallets', JSON.stringify(value.wallets));

    try {
      const resData = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/campaign/${campaignId}/update`,
        {
          method: 'POST',
          body: formData,
          headers: {
            Authorization: `Bearer ${user?.data?.token}`,
          },
        },
      ).then((res) => res.json());

      if (resData.ok) {
        toast.success('Saved Updates.');
      } else {
        throw new Error(resData?.msg || 'Something went wrong.');
      }
    } catch (error) {
      return toast.error(error.message);
    }
  };

  const PublishCampaign = async (e) => {
    setButtonDisabled(true);
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('status', 'PUBLISHED');

      const resData = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/campaign/${campaignId}/update-status`,
        {
          method: 'POST',
          body: formData,
          headers: {
            Authorization: `Bearer ${user?.data?.token}`,
          },
        },
      ).then((res) => res.json());

      if (resData?.ok) {
        setButtonDisabled(false);

        setValue((previous) => {
          return {
            ...previous,
            status: 'Published',
          };
        });
        toast.success('Published Campaign.');
        SubmitHandler(e);
      } else {
        throw new Error('Could not complete action.');
      }
    } catch (error) {
      return toast.error(error.message);
    }
  };

  const MoveToDraft = async (e) => {
    e.preventDefault();
    setButtonDisabled(true);
    try {
      const formData = new FormData();
      formData.append('status', 'DRAFT');

      const resData = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/campaign/${campaignId}/update-status`,
        {
          method: 'POST',
          body: formData,
          headers: {
            Authorization: `Bearer ${user?.data?.token}`,
          },
        },
      ).then((res) => res.json());

      if (resData?.ok) {
        setButtonDisabled(false);

        setValue((previous) => {
          return {
            ...previous,
            status: 'Draft',
          };
        });
        toast.success('Moved Campaign to draft.');
      } else {
        throw new Error('Could not complete action.');
      }
    } catch (error) {
      return toast.error(error.message);
    }
  };

  const MoveToArchive = async (e) => {
    e.preventDefault();
    setButtonDisabled(true);

    try {
      const formData = new FormData();
      formData.append('status', 'ARCHIVE');

      const resData = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/campaign/${campaignId}/update-status`,
        {
          method: 'POST',
          body: formData,
          headers: {
            Authorization: `Bearer ${user?.data?.token}`,
          },
        },
      ).then((res) => res.json());

      if (resData?.ok) {
        setButtonDisabled(false);

        setValue((previous) => {
          return {
            ...previous,
            status: 'Archive',
          };
        });
        toast.success('Moved Campaign to Archive.');
      } else {
        throw new Error('Could not complete action.');
      }
    } catch (error) {
      return toast.error(error.message);
    }
  };

  const CloseCampaign = async (e) => {
    e.preventDefault();
    setButtonDisabled(true);

    try {
      const formData = new FormData();
      formData.append('status', 'CLOSED');
      const resData = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/campaign/${campaignId}/update-status`,
        {
          method: 'POST',
          body: formData,
          headers: {
            Authorization: `Bearer ${user?.data?.token}`,
          },
        },
      ).then((res) => res.json());

      if (resData?.ok) {
        setButtonDisabled(false);

        setValue((previous) => {
          return {
            ...previous,
            status: 'Closed',
          };
        });
        toast.success('Closed Campaign');
      } else {
        throw new Error('Could not complete action.');
      }
    } catch (error) {
      return toast.error(error.message);
    }
  };

  return (
    <Fragment>
      <Navbar Logo={Logo} />
      <PageTitle pageTitle={'Edit Campaign'} pagesub={'Edit Campaign'} />
      {value?.title?.length > 0 && (
        <div className="wpo-donation-page-area section-padding">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div className="wpo-donate-header">
                  <h2>Edit your campaign</h2>
                </div>
                <div id="Donations" className="tab-pane">
                  <form onSubmit={SubmitHandler}>
                    <div className="wpo-donations-details">
                      <h2>Enter details of your campaign</h2>
                      <div className="row">
                        <div className="col-lg-12 col-md-6 col-sm-6 col-12 form-group clearfix">
                          <label htmlFor="fname" className="form-label">
                            Title
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="title"
                            id="fname"
                            placeholder="Max 50 words"
                            value={value.title}
                            onChange={changeHandler}
                          />
                        </div>
                        <div className="col-lg-12 col-md-6 col-sm-6 col-12 form-group">
                          <label htmlFor="fname" className="form-label">
                            Tagline
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="excerpt"
                            id="fname"
                            placeholder="Max 100 words"
                            value={value.excerpt}
                            onChange={changeHandler}
                          />
                        </div>
                        <div className="col-lg-12 col-12 form-group">
                          <label htmlFor="fname" className="form-label">
                            Share Your Story
                          </label>
                          <Editor
                            editorState={value?.story}
                            wrapperClassName="border border-1 p-2 mb-5"
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
                        <div>
                          <img
                            height={200}
                            width="auto"
                            src={`${process.env.REACT_APP_API_BASE_URL}${value.image}`}
                            alt="campaign"
                          />
                        </div>
                        <div className="col-lg-12 col-md-6 col-sm-6 col-12 form-group">
                          <label htmlFor="formFileSm" className="form-label">
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
                          <div className="col-lg-5 col-md-5 col-sm-5 col-5">
                            <select
                              id="inputState"
                              className="form-select"
                              name="walletType"
                              value={value?.walletType}
                              onChange={changeHandler}
                            >
                              <option>Binance</option>
                            </select>
                          </div>
                          <div className="col-lg-5 col-md-5 col-sm-5 col-5 ">
                            <input
                              type="text"
                              placeholder="Wallet Address"
                              className=" my-auto"
                              name="walletAddress"
                              value={value?.walletAddress}
                              onChange={changeHandler}
                              style={{ height: 35 }}
                            />
                          </div>
                          <div className="col-lg-2 col-md-2 col-sm-2 col-2">
                            <button
                              className="btn btn-primary submit-btn"
                              onClick={handleWalletSave}
                            >
                              Add Wallet
                            </button>
                          </div>
                        </div>

                        <div className="mt-3">
                          <div className="mb-2">Linked Wallets</div>
                          {value?.wallets?.map((wallet, index) => (
                            <p className="mb-0" key={index}>
                              <small>
                                {' '}
                                <img
                                  src={bnbImage}
                                  height={20}
                                  style={{ marginTop: '-0.3rem' }}
                                  alt=""
                                />
                                &nbsp;{wallet?.name}: {wallet?.walletAddress}
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
                        <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                          <label htmlFor="fname" className="form-label">
                            Target Amount
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="target"
                            id="fname"
                            placeholder=""
                            value={value.target}
                            onChange={changeHandler}
                          />
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                          <label htmlFor="expiryDate" className="form-label">
                            Campaign End Date
                          </label>
                          <input
                            type="date"
                            min={dayjs().add('1', 'day').format('YYYY-MM-DD')}
                            className="form-control"
                            name="expiryDate"
                            id="expiryDate"
                            placeholder=""
                            value={value.expiryDate}
                            onChange={changeHandler}
                          />
                        </div>
                      </div>
                      <div className="row mt-4">
                        <div className="mt-3">
                          <div className="mb-2">
                            Campaign Status:{' '}
                            <span className="fw-bold">
                              {value?.status?.toUpperCase()}
                            </span>
                          </div>
                        </div>

                        <div className="d-flex flex-row mt-4 flex-wrap">
                          <Button
                              disabled={buttonDisable}
                            className="btn btn-success me-3 my-2"
                            onClick={PublishCampaign}
                          >
                            Publish Campaign
                          </Button>
                          <Button
                              disabled={buttonDisable}
                            className="btn btn-primary me-3 my-2"
                            onClick={MoveToDraft}
                          >
                            Move to Draft
                          </Button>
                          <Button
                              disabled={buttonDisable}
                              className="btn btn-primary me-3 my-2"
                            onClick={MoveToArchive}
                          >
                            Move to Archive
                          </Button>
                          <Button
                              disabled={buttonDisable}
                              className="btn btn-primary me-3 my-2"
                            onClick={CloseCampaign}
                          >
                            Close Campaign
                          </Button>
                        </div>
                      </div>
                    </div>
                    {/*
                    <div className="submit-area">
                      <button type="submit" className="theme-btn submit-btn">
                        Save
                      </button>
                    </div> */}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
      <Scrollbar />
    </Fragment>
  );
};
export default EditFundraise;
