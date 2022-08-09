import React, { useEffect, useState } from 'react';

import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { stateToHTML } from 'draft-js-export-html';
import { convertFromRaw } from 'draft-js';
import {
  Col,
  Nav,
  Row,
  TabPane,
  NavItem,
  NavLink,
  TabContent,
} from 'reactstrap';
import classnames from 'classnames';
import { Dropdown } from 'react-bootstrap';
import {
  FacebookShareButton,
  RedditShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  TelegramShareButton,
  ViberShareButton,
  FacebookMessengerShareButton,
  EmailShareButton,
} from 'react-share';
import {
  FacebookIcon,
  FacebookMessengerIcon,
  LinkedinIcon,
  RedditIcon,
  TelegramIcon,
  TwitterIcon,
  ViberIcon,
  EmailIcon,
  LivejournalIcon,
} from 'react-share';

import cmt1 from '../../images/blog-details/comments-author/img-1.jpg';
import cmt2 from '../../images/blog-details/comments-author/img-2.jpg';
import cmt3 from '../../images/blog-details/comments-author/img-3.jpg';
import dayjs from 'dayjs';
import { isJson, shortenString } from '../../helper/helper';

const CauseTabs = ({ campaign, donated }) => {
  const [activeTab, setActiveTab] = useState('1');
  const [donations, setDonations] = React.useState([]);

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const SubmitHandler = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const resData = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/api/donation/campaign/${campaign.id}`,
        ).then((res) => res.json());

        setDonations(resData?.data);
      } catch (error) {
        toast.error(error.message);
      }
    };
    campaign.id && fetchDonations();
  }, [campaign?.id, donated]);

  const arrayToCsv = (data) => {
    return data
      .map(
        (row) =>
          row
            .map(String) // convert every value to String
            .map((v) => v.replaceAll('"', '""')) // escape double colons
            .map((v) => `"${v}"`) // quote it
            .join(','), // comma-separated
      )
      .join('\r\n'); // rows starting on new lines
  };

  const downloadCSV = () => {
    // Create a blob
    let values = [
      ['Wallet Address', 'Amount', 'Donation Date', 'Transaction ID'],
    ];
    for (const donation of donations) {
      values.push([
        donation?.walletAddress,
        donation?.amount,
        dayjs(donation?.createdDate)?.format('YYYY-MM-DD'),
        donation?.transactionId,
      ]);
    }
    let csv = arrayToCsv(values);

    const filename = `${campaign?.title}-${dayjs().format(
      'YYYY-MM-DD-hh-mm',
    )}.csv`;
    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    var url = URL.createObjectURL(blob);

    // Create a link to download it
    var pom = document.createElement('a');
    pom.href = url;
    pom.setAttribute('download', filename);
    pom.click();
  };

  const convertCommentFromJSONToHTML = (text) => {
    if (isJson(text)) {
      return stateToHTML(convertFromRaw(JSON.parse(text)));
    }
  };

  const copyAddress = (address) => {
    navigator.clipboard.writeText(address);
    toast.success('Copied to Clipboard.');
  };

  if (!campaign) return <>No Campaign</>;

  return (
    <div>
      {campaign?.id && (
        <>
          <div className="wpo-case-details-tab d-flex justify-content-between align-items-center">
            <Nav tabs>
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === '1' })}
                  onClick={() => {
                    toggle('1');
                  }}
                >
                  Description
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === '2' })}
                  onClick={() => {
                    toggle('2');
                  }}
                >
                  Donations
                </NavLink>
              </NavItem>
              {/* <NavItem>
            <NavLink
              className={classnames({ active: activeTab === "3" })}
              onClick={() => {
                toggle("3");
              }}
            >
              Comments
            </NavLink>
          </NavItem> */}
            </Nav>
            <div>
              <Dropdown>
                <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                  Share
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item>
                    <FacebookShareButton url={window.location.href}>
                      <FacebookIcon size={32} round={true} className="mx-1" />{' '}
                      Facebook
                    </FacebookShareButton>
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <RedditShareButton url={window.location.href}>
                      <RedditIcon size={32} round={true} className="mx-1" />{' '}
                      Reddit
                    </RedditShareButton>
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <TwitterShareButton url={window.location.href}>
                      <TwitterIcon size={32} round={true} className="mx-1" />{' '}
                      Twitter
                    </TwitterShareButton>
                  </Dropdown.Item>

                  <Dropdown.Item>
                    <LinkedinShareButton url={window.location.href}>
                      <LinkedinIcon size={32} round={true} className="mx-1" />{' '}
                      LinkedIn
                    </LinkedinShareButton>
                  </Dropdown.Item>

                  <Dropdown.Item>
                    <TelegramShareButton url={window.location.href}>
                      <TelegramIcon size={32} round={true} className="mx-1" />
                    </TelegramShareButton>{' '}
                    Telegram
                  </Dropdown.Item>

                  <Dropdown.Item>
                    <ViberShareButton url={window.location.href}>
                      <ViberIcon size={32} round={true} className="mx-1" />
                    </ViberShareButton>{' '}
                    Viber
                  </Dropdown.Item>

                  <Dropdown.Item>
                    <FacebookMessengerShareButton url={window.location.href}>
                      <FacebookMessengerIcon
                        size={32}
                        round={true}
                        className="mx-1"
                      />
                    </FacebookMessengerShareButton>{' '}
                    Messenger
                  </Dropdown.Item>

                  <Dropdown.Item>
                    <EmailShareButton url={window.location.href}>
                      <EmailIcon size={32} round={true} className="mx-1" />
                    </EmailShareButton>{' '}
                    Email
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => copyAddress(window.location.href)}
                  >
                    <LivejournalIcon size={32} round={true} className="mx-1" />
                    Copy Link
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
          <div className="wpo-case-details-text">
            <TabContent activeTab={activeTab}>
              <TabPane tabId="1">
                <Row>
                  <Col sm="12">
                    <div className="wpo-case-content">
                      <div className="wpo-case-text-top">
                        <h2>{campaign?.title}</h2>
                        <p className="text-break">{campaign?.excerpt}</p>
                        <div className="progress-sub">
                          <div className="progress-section">
                            <div className="process">
                              <div className="progress">
                                <div
                                  className="progress-bar"
                                  style={{
                                    width: `${
                                      (campaign?.amount / campaign?.target) >1? 100:(campaign?.amount / campaign?.target) *
                                      100
                                    }%`,
                                  }}
                                >
                                  <div className="progress-value">
                                    <span>
                                      {(campaign?.amount / campaign?.target) >1? 100:(
                                        (campaign?.amount / campaign?.target) *
                                        100
                                      ).toFixed(2)}
                                    </span>
                                    %
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <ul>
                            <li>
                              <span className="pe-1">Raised: </span>
                              {campaign?.amount} BNB
                            </li>
                            <li>
                              <span className="pe-1">Goal: </span>
                              {campaign?.target} BNB
                            </li>
                            {console.log(campaign)}
                            <li>
                              <span>Donor: </span> {donations?.length}
                            </li>
                          </ul>
                        </div>
                        <div className="case-b-text">
                          {isJson(campaign?.story) ? (
                            <div
                              className="text-break"
                              dangerouslySetInnerHTML={{
                                __html: convertCommentFromJSONToHTML(
                                  campaign?.story,
                                ),
                              }}
                            />
                          ) : (
                            <p className="text-wrap">{campaign?.story}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tabId="2">
                <Row>
                  <Col sm="12">
                    <div id="Donations" className="tab-pane">
                      <div className="wpo-donations-details">
                        <div>
                          <button
                            className="btn btn-primary mb-4"
                            onClick={downloadCSV}
                          >
                            Export as CSV
                          </button>
                        </div>
                        <div className="row">
                          <table>
                            <thead>
                              <tr>
                                <th>Wallet Address</th>
                                <th>Amount</th>
                                <th>Donation Date</th>
                                <th>Transaction Id</th>
                              </tr>
                            </thead>
                            <tbody>
                              {/* <hr
                              style={{
                                height: '2px',
                                width: '100%',
                                color: '#217ec2',
                              }}
                            /> */}
                              {donations?.map((donation) => (
                                <tr key={donation.id}>
                                  <td>
                                    <span
                                      onClick={() =>
                                        copyAddress(donation.walletAddress)
                                      }
                                      className="c-p-primary"
                                    >
                                      {shortenString(donation.walletAddress)}
                                      <span className=" ps-1">
                                        <i className="fa fa-copy "></i>
                                      </span>
                                    </span>
                                  </td>
                                  <td>{`$${donation.amount}`}</td>
                                  <td>
                                    {
                                      new Date(donation.createdDate)
                                        .toISOString()
                                        .split('T')[0]
                                    }
                                  </td>
                                  <td>
                                    <a
                                      href={`https://testnet.bscscan.com/tx/${
                                        donation.transactionId
                                          ? donation.transactionId
                                          : ''
                                      }`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-decoration-underline text-default"
                                    >
                                      {shortenString(donation.transactionId)}
                                      <span className=" ps-1">
                                        <i className="fa fa-paperclip"></i>
                                      </span>
                                    </a>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tabId="3">
                <Row>
                  <Col sm="12">
                    <div
                      id="Comments"
                      className="tab-pane wpo-blog-single-section"
                    >
                      <div className="comments-area">
                        <div className="comments-section">
                          <h3 className="comments-title">Comments</h3>
                          <ol className="comments">
                            <li
                              className="comment even thread-even depth-1"
                              id="comment-1"
                            >
                              <div id="div-comment-1">
                                <div className="comment-theme">
                                  <div className="comment-image">
                                    <img src={cmt1} alt="" />
                                  </div>
                                </div>
                                <div className="comment-main-area">
                                  <div className="comment-wrapper">
                                    <div className="comments-meta">
                                      <h4>
                                        John Abraham{' '}
                                        <span className="comments-date">
                                          Octobor 28,2021 At 9.00am
                                        </span>
                                      </h4>
                                    </div>
                                    <div className="comment-area">
                                      <p>
                                        I will give you a complete account of
                                        the system, and expound the actual
                                        teachings of the great explorer of the
                                        truth,{' '}
                                      </p>
                                      <div className="comments-reply">
                                        <Link
                                          className="comment-reply-link"
                                          to="/cause-single/1"
                                        >
                                          <i
                                            className="fa fa-reply"
                                            aria-hidden="true"
                                          ></i>
                                          <span> Reply</span>
                                        </Link>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <ul className="children">
                                <li className="comment">
                                  <div>
                                    <div className="comment-theme">
                                      <div className="comment-image">
                                        <img src={cmt2} alt="" />
                                      </div>
                                    </div>
                                    <div className="comment-main-area">
                                      <div className="comment-wrapper">
                                        <div className="comments-meta">
                                          <h4>
                                            Lily Watson{' '}
                                            <span className="comments-date">
                                              Octobor 28,2021 At 9.00am
                                            </span>
                                          </h4>
                                        </div>
                                        <div className="comment-area">
                                          <p>
                                            I will give you a complete account
                                            of the system, and expound the
                                            actual teachings of the great
                                            explorer of the truth,{' '}
                                          </p>
                                          <div className="comments-reply">
                                            <Link
                                              className="comment-reply-link"
                                              to="/cause-single/1"
                                            >
                                              <span>
                                                <i
                                                  className="fa fa-reply"
                                                  aria-hidden="true"
                                                ></i>{' '}
                                                Reply
                                              </span>
                                            </Link>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <ul>
                                    <li className="comment">
                                      <div>
                                        <div className="comment-theme">
                                          <div className="comment-image">
                                            <img src={cmt3} alt="" />
                                          </div>
                                        </div>
                                        <div className="comment-main-area">
                                          <div className="comment-wrapper">
                                            <div className="comments-meta">
                                              <h4>
                                                John Abraham{' '}
                                                <span className="comments-date">
                                                  Octobor 28,2021 At 9.00am
                                                </span>
                                              </h4>
                                            </div>
                                            <div className="comment-area">
                                              <p>
                                                I will give you a complete
                                                account of the system, and
                                                expound the actual teachings of
                                                the great explorer of the truth,{' '}
                                              </p>
                                              <div className="comments-reply">
                                                <Link
                                                  className="comment-reply-link"
                                                  to="/cause-single/1"
                                                >
                                                  <span>
                                                    <i
                                                      className="fa fa-reply"
                                                      aria-hidden="true"
                                                    ></i>{' '}
                                                    Reply
                                                  </span>
                                                </Link>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </li>
                                  </ul>
                                </li>
                              </ul>
                            </li>
                          </ol>
                        </div>
                      </div>
                      <div className="comment-respond">
                        <h3 className="comment-reply-title">Leave a Comment</h3>
                        <form
                          method="post"
                          id="commentform"
                          className="comment-form"
                          onSubmit={SubmitHandler}
                        >
                          <div className="form-inputs">
                            <input placeholder="Name" type="text" />
                            <input placeholder="Email" type="email" />
                            <input placeholder="Website" type="url" />
                          </div>
                          <div className="form-textarea">
                            <textarea
                              id="comment"
                              placeholder="Write Your Comments..."
                            ></textarea>
                          </div>
                          <div className="form-submit">
                            <input id="submit" value="Reply" type="submit" />
                          </div>
                        </form>
                      </div>
                    </div>
                  </Col>
                </Row>
              </TabPane>
            </TabContent>
          </div>
        </>
      )}
    </div>
  );
};

export default CauseTabs;
