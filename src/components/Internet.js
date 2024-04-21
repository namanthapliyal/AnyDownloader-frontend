// Date: 03/08/2021
// Description: Internet component
// Date: 03/08/2021
// Description: Internet component
import React from "react";
import axios from "axios";
import { useState } from "react";

const API = "http://127.0.0.1:5000/internet/";

const Internet = () => {
  const [dLink, setdLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  //const [fileUrl, setFileUrl] = useState("");
  const [objectId, setObjectId] = useState("");
  const [eDownload, setEDownload] = useState(false);
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
        link.setAttribute("download", "file"); // replace 'file' with your file name
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => {
        console.error("Error downloading file: ", error);
      });
  };

  const handleClick = () => {
    // Perform additional processing or validation
    if (dLink.trim() === "") {
      alert("Please enter a URL.");
      return;
    } else {
      console.log("Given URL: ", dLink);
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
          // Handle the response
          //console.log("Response:", response);
          if (response.status === 200) {
            if (
              typeof response.data.id === "number" &&
              Number.isInteger(response.data.id)
            ) {
              setObjectId(response.data.id);
              setEDownload(true);
              //console.log("Object ID: ", response.data.id);
            } else {
              throw new Error("response.data.id is not an integer");
            }

            // Log the request made by axios
            //console.log("Request:", response.config);

            //console.log(response.data.id);
            // const file = new Blob([response.data]);
            // const fileURL = URL.createObjectURL(file);
            // setFileUrl(fileURL);
            // console.log(fileUrl);
          }
          setIsLoading(false);
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
          src={process.env.PUBLIC_URL + "/internet.jpg"}
          alt="Internet"
          style={{
            display: "inline-block",
            margin: "0px 20px",
            maxWidth: "10%",
            height: "20%",
            padding: "0px",
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
          Internet
        </h1>
        <div>
          {isLoading ? (
            <div className="spinner-border text-secondary mx-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          ) : null}
        </div>
      </div>
      <hr />
      <div>
        <form
          style={{
            padding: "15px",
            margin: "15px",
          }}
          onSubmit={handleSubmit}
        >
          <div className="mb-4">
            <label htmlFor="exampleInputLink" className="form-label">
              Internet URL Link
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
          <div className="d-flex justify-content-center">
            <button
              type="submit"
              className="btn btn-primary mx-2"
              onClick={handleClick}
            >
              Submit
            </button>
            <button
              type="submit"
              className="btn btn-primary mx-2"
              onClick={handleDownload}
              disabled={!eDownload}
            >
              Download
            </button>
          </div>
        </form>
      </div>
      <hr />
    </>
  );
};

export default Internet;
