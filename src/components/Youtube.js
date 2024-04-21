// Date: 03/08/2021
// Description: Youtube component
import React from "react";
import axios from "axios";
import { useState } from "react";
import Playlist from "./Playlist";
import Video from "./Video";

const API = "http://127.0.0.1:5000/utube";

const Youtube = () => {
  const [dLink, setdLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  //const [fileUrl, setFileUrl] = useState("");
  const [objectId, setObjectId] = useState("");
  const [eDownload, setEDownload] = useState(false);
  const [mtype, setmtype] = useState("");

  const handleDownload = () => {
    //console.log("Download object:" + objectId);
    axios
      .get(`${API}${objectId}/download`, { responseType: "blob" })
      .then((response) => {
        // Create a Blob from the PDF Stream
        const file = new Blob([response.data], {
          type: response.headers["content-type"],
        });
        const fileURL = URL.createObjectURL(file);

        // Create a link and click it to download the file
        const link = document.createElement("a");
        link.href = fileURL;
        link.setAttribute("download", "file");
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => {
        console.error("Error downloading file: ", error);
      });
  };

  const handleClick = () => {
    var playlistPattern =
      /^(https?:\/\/)?(www\.)?(youtube\.com\/playlist\?list=)/;
    var videoPattern = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=)/;
    // Perform additional processing or validation
    if (dLink.trim() === "") {
      alert("Please enter a URL.");
      return;
    } else {
      console.log("Given URL: ", dLink);
      if (playlistPattern.test(dLink)) {
        setmtype("playlist");
      } else if (videoPattern.test(dLink)) {
        setmtype("video");
      } else {
        alert("Invalid URL, not of youtube.");
        return;
      }
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true);
    if (dLink.trim() === "") {
      setIsLoading(false);
      return;
    } else {
      const formData = new FormData();
      formData.append("url", dLink);

      axios
        .post(API, formData)
        .then((response) => {
          if (response.status === 200) {
            if (
              typeof response.data.id === "number" &&
              Number.isInteger(response.data.id)
            ) {
              setObjectId(response.data.id);
              setEDownload(true);
            } else {
              throw new Error("response.data.id is not an integer");
            }
          }
          setIsLoading(false);
          console.log("Object ID: ", response.data.id);
        })
        .catch((error) => {
          // Handle the error
          console.error("Error fetching data: ", error);
          setIsLoading(false);
          setEDownload(false);
        });
    }
  };
  return (
    <>
      <div className="mb-4" style={{ display: "flex", alignItems: "center" }}>
        <img
          src={process.env.PUBLIC_URL + "/youtube.png"}
          alt="YouTube"
          style={{
            display: "inline-block",
            margin: "0px",
            maxWidth: "10%",
            height: "20%",
          }}
        />
        <h1
          style={{
            display: "inline-block",
            marginLeft: "10px",
            fontSize: "60px",
            fontFamily: "Monotype Corsiva",
          }}
        >
          YouTube
        </h1>
      </div>
      <hr />
      <div>
        <form
          style={{ padding: "15px", margin: "15px" }}
          onSubmit={handleSubmit}
        >
          <div className="mb-4">
            <label htmlFor="exampleInputLink" className="form-label">
              Youtube URL Link
            </label>
            <input
              type="text"
              className="form-control"
              id="exampleInputLink"
              aria-describedby="linkHelp"
              placeholder="Paste the link here"
              value={dLink}
              onChange={(e) => setdLink(e.target.value)}
            />
            <div id="linkHelp" className="form-text">
              We'll never share your link with anyone else.
            </div>
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            onClick={handleClick}
          >
            Submit
          </button>
        </form>
      </div>
      <hr />
      <div className="mx-4">
        {isLoading ? (
          <div className="spinner-border text-secondary my-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        ) : (
          <>
            {mtype === "playlist" ? (
              <Playlist objectId={objectId} />
            ) : mtype === "video" ? (
              <Video objectId={objectId} />
            ) : null}
          </>
        )}
      </div>
    </>
  );
};

export default Youtube;
