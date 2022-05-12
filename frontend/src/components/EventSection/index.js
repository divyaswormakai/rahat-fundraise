import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Causes from "../../api/cause";

const EventSection = (props) => {
  const ClickHandler = () => {
    window.scrollTo(10, 0);
  };

  const [campaigns, setCampaigns] = React.useState([]);

  useEffect(async () => {
    try {
      const resData = await fetch("http://localhost:8080/api/campaign", {
        method: "GET",
        // body: JSON.stringify(value),
        // headers: {
        //   "Content-Type": "application/json",
        //   Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyNzkzOTc0OWRhNDNiZDk2NTUxODlmYyIsImVtYWlsIjoicGViZXNpNTE0MkAzZG1hc3RpLmNvbSIsImFsaWFzIjoicGViZXNpNTE0MiIsImlhdCI6MTY1MjExMTc2OH0.Ih1ZAxa40vOycsm5MyHpyXClWZykmLk_pjOupheECzA`,
        // },
      }).then((res) => res.json());

      setCampaigns(resData.data);

      if (!resData?.errors?.length) {
        console.log({ resData });
      }
    } catch (error) {
      return toast.error(error.message);
    }
  });

  return (
    <div className={`wpo-campaign-area section-padding ${props.CmClass}`}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="wpo-section-title">
              <span>We Love To Help Poor</span>
              <h2>Our Featured Campaigns</h2>
              <p>
                There are many variations of passages of Lorem Ipsum available,
                but the majority have suffered alteration in some form,
              </p>
            </div>
          </div>
        </div>
        <div className="wpo-campaign-wrap">
          <div className="row">
            {Causes.map((Cause, citem) => (
              <div className="col-lg-4 col-md-6 col-12" key={citem}>
                <div className="wpo-campaign-single">
                  <div className="wpo-campaign-item">
                    <div className="wpo-campaign-img">
                      <img src={Cause.cImg} alt="" />
                      <span className="thumb">{Cause.thumb}</span>
                    </div>
                    <div className="wpo-campaign-content">
                      <div className="wpo-campaign-text-top">
                        <h2>
                          <Link
                            onClick={ClickHandler}
                            to={`/cause-single/${Cause.id}`}
                          >
                            {Cause.title}
                          </Link>
                        </h2>
                        <div className="progress-section">
                          <div className="process">
                            <div className="progress">
                              {/* <div
                                className="progress-bar"
                                style={{ width: `${Cause.process}%` }}
                              >
                                <div className="progress-value">
                                  <span>{Cause.process}</span>%
                </div>
                <div className="wpo-campaign-wrap">
                    <div className="row">
                    {Causes.slice(0, 3).map((Cause, citem) => (
                        <div className="col-lg-4 col-md-6 col-12" key={citem}>
                            <div className="wpo-campaign-single">
                                <div className="wpo-campaign-item">
                                    <div className="wpo-campaign-img">
                                        <img src={Cause.cImg} alt=""/>
                                        <span className="thumb">{Cause.thumb}</span>
                                    </div>
                                    <div className="wpo-campaign-content">
                                        <div className="wpo-campaign-text-top">
                                            <h2><Link onClick={ClickHandler} to={`/cause-single/${Cause.id}`}>{Cause.cTitle}</Link></h2>
                                            <div className="progress-section">
                                                <div className="process">
                                                    <div className="progress">
                                                        <div className="progress-bar" style={{width: `${Cause.process}%`}}>
                                                            <div className="progress-value"><span>{Cause.process}</span>%</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <ul>
                                                <li><span>Goal:</span> ${Cause.Goal}</li>
                                                <li><span>Raised:</span> ${Cause.Raised}</li>
                                            </ul>
                                            <div className="campaign-btn">
                                                <ul>
                                                    <li>
                                                        <span><img src={Cause.authorImg} alt=""/></span>
                                                        <span><Link onClick={ClickHandler} to={`/cause-single/${Cause.id}`}>{Cause.authorName}</Link></span>
                                                    </li>
                                                    <li><Link onClick={ClickHandler} className="e-btn" to="/fundraise/1">Donate Now</Link></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                              </div> */}
                            </div>
                          </div>
                        </div>
                        <ul>
                          <li>
                            <span>Goal:</span> ${Cause.Goal}
                          </li>
                          <li>
                            <span>Raised:</span> ${Cause.Raised}
                          </li>
                        </ul>
                        <div className="campaign-btn">
                          <ul>
                            <li>
                              <span>
                                <img src={Cause.authorImg} alt="" />
                              </span>
                              <span>
                                <Link
                                  onClick={ClickHandler}
                                  to={`/cause-single/${Cause.id}`}
                                >
                                  {Cause.authorName}
                                </Link>
                              </span>
                            </li>
                            <li>
                              <Link
                                onClick={ClickHandler}
                                className="e-btn"
                                to="/donate"
                              >
                                Donate Now
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventSection;
