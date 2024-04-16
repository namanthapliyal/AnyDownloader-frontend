// Date: 03/08/2021
// Description: Instagram component
import React from "react";
import axios from "axios";

const API = "http://127.0.0.1:5000/utube";

const Instagram = () => {
  const handleSubmit = (e) => {
    // event.preventDefault();
    axios
      .get(API)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  };
  return (
    <>
      <div className="mb-4" style={{ display: "flex", alignItems: "center" }}>
        <img
          src={process.env.PUBLIC_URL + "/insta.jpg"}
          alt="Instagram"
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
          Instagram
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
              Instagram URL Link
            </label>
            <input
              type="text"
              className="form-control"
              id="exampleInputLink"
              aria-describedby="linkHelp"
              placeholder="Paste the link here"
            />
            <div id="linkHelp" className="form-text">
              We'll never share your link with anyone else.
            </div>
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </form>
      </div>
      <hr />
      <div></div>
    </>
  );
};

export default Instagram;
