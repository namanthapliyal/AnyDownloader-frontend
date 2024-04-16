import React from "react";
import "./Theme.css";

export default function Home(props) {
  let accordianStyle = {
    color: props.mode === "dark" ? "#fff" : "#000",
    backgroundColor: props.mode === "dark" ? "#2b3035" : "#fff",
    textAlign: "left",
  };

  return (
    <div className={`text-center my-5 ${props.mode}`}>
      <h1>Welcome to AnyDownloader!</h1>
      <img
        src="/anydownloader_logo.png"
        alt="AnyDownloader Logo"
        className="img-fluid mt-4 mb-4"
        style={{ maxWidth: "400px", maxHeight: "200px" }}
      />
      <p className="lead px-3">
        This application provides the utility for downloading media from
        different websites or social media platforms like Instagram, YouTube,
        and the internet. We are constantly working to enhance its services and
        add more social media platforms like Facebook, scraping of websites
        based on given web addresses/URLs. We hope you enjoy using this app.
      </p>
      <div
        className="accordion my-4 mx-2"
        id="accordionExample"
        style={accordianStyle}
      >
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className="accordion-button"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseOne"
              aria-expanded="true"
              aria-controls="collapseOne"
              style={accordianStyle}
            >
              Instagram
            </button>
          </h2>
          <div
            id="collapseOne"
            className="accordion-collapse collapse show"
            data-bs-parent="#accordionExample"
          >
            <div className="accordion-body" style={accordianStyle}>
              <strong>
                Instagram utility of AnyDownloader the reels, clips, images or
                albums from the instagram posts. Please follow the instructions
                given below:
              </strong>
              <br></br>
              <ul>
                <li>
                  Copy the url of the instagram post from{" "}
                  <a href="https://www.instagram.com/">Instagram</a>.
                </li>
                <li>Navigate to the instagram section of AnyDownloader.</li>
                <li>Paste the media url of the instagram post in the app.</li>
                <li>Select download.</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseTwo"
              aria-expanded="false"
              aria-controls="collapseTwo"
              style={accordianStyle}
            >
              Youtube
            </button>
          </h2>
          <div
            id="collapseTwo"
            className="accordion-collapse collapse"
            data-bs-parent="#accordionExample"
          >
            <div className="accordion-body " style={accordianStyle}>
              <strong>
                Youtube utility of AnyDownloader helps to download only video,
                their subtitle as well as entire playlist. Follow the
                instructions given below to download from instagram:
              </strong>
              <ol>
                <li>To download the video or its subtitle:</li>
                <ul>
                  <li>
                    Copy the video url from the{" "}
                    <a href="https://www.youtube.com/">Youtube</a>.
                  </li>
                  <li>
                    Navigate to the youtube section of AnyDownloader and paste
                    the video url in the form
                  </li>
                  <li>
                    For video it will give resolutions available to download,
                    subtitle, audio only for download.
                  </li>
                </ul>
                <li>To download the entire playlist:</li>
                <ul>
                  <li>
                    Copy the playlist url from the{" "}
                    <a href="https://www.youtube.com/">Youtube</a>.
                  </li>
                  <li>
                    Navigate to the youtube section of AnyDownloader and paste
                    the playlist url in the form.
                  </li>
                  <li>
                    It will give you options for the common available
                    resolutions available for the videos. Select any resolution
                    and click on download button. You will receive the download
                    of playlist in the form of a zip file containing all the
                    videos.
                  </li>
                </ul>
              </ol>
            </div>
          </div>
        </div>
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseThree"
              aria-expanded="false"
              aria-controls="collapseThree"
              style={accordianStyle}
            >
              Internet
            </button>
          </h2>
          <div
            id="collapseThree"
            className="accordion-collapse collapse"
            data-bs-parent="#accordionExample"
          >
            <div className="accordion-body" style={accordianStyle}>
              <strong>
                Internet utility of AnyDownloader helps to download only images
                or videos openly availabe on internet. Follow the instructions
                given below to download from internet:
              </strong>
              <ul>
                <li>Copy the media link from the internet.</li>
                <li>Navigate to the internet section of AnyDownloader.</li>
                <li>Paste the link in the form and click download.</li>
                <li>It will download the media.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
