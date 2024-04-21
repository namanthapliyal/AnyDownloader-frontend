import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";

function Video(props) {
  const API = `http://127.0.0.1:5000/utube/video/${props.objectId}`;
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [captions, setCaptions] = useState([]);

  const downloadCaptions = () => {
    console.log("Download captions");
  };

  const getCaptions = () => {
    axios
      .get(`${API}/captionsList`)
      .then((response) => {
        console.log(response.data);
        setCaptions(response.data);
        console.log(captions);
      })
      .catch((error) => {
        console.error("Error getting captions: ", error);
      });
  };

  useEffect(() => {
    const getTitle = async () => {
      setLoading(true);
      await axios
        .get(`${API}/getTitle/`)
        .then((response) => {
          console.log(response.data);
          setTitle(response.data.title);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error getting title: ", error);
          setLoading(false);
        });
    };

    getTitle();
  }, [API]);

  return (
    <div className="mb-4">
      <h4 className="my-3 mx-2 d-flex justify-content-center ">
        Video
        {loading ? (
          <div className="spinner-grow mx-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        ) : (
          `: ${title}`
        )}
      </h4>
      <table className="table">
        <thead>
          <tr>
            <th>Function</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Caption</td>
            <td className="d-flex justify-content ">
              <button
                className="btn btn-primary me-2" // Add 'me-2' class for spacing
                type="button"
                disabled={loading}
                onClick={getCaptions}
                style={{ width: "160px" }}
              >
                {loading ? (
                  <span>
                    <span
                      className="spinner-border spinner-border-sm"
                      aria-hidden="true"
                    ></span>
                    <span role="status">Loading...</span>
                  </span>
                ) : (
                  "Get caption"
                )}
              </button>
              <div className="dropdown">
                <button
                  className="btn btn-primary dropdown-toggle me-2" // Add 'me-2' class for spacing
                  type="button"
                  id="dropdownMenuCheckbox"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  disabled={loading || captions.length === 0}
                  style={{ width: "160px" }}
                >
                  Select Caption
                </button>
                <ul
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuCheckbox"
                >
                  {captions.map((caption, index) => (
                    <li key={index}>
                      <label className="dropdown-item">
                        <input type="checkbox" className="me-2" />
                        {caption}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                className="btn btn-primary me-2" // Add 'me-2' class for spacing
                type="button"
                disabled={true || (loading && captions.length === 0)}
                onClick={downloadCaptions}
                style={{ width: "160px" }}
              >
                {loading ? (
                  <span>
                    <span
                      className="spinner-border spinner-border-sm"
                      aria-hidden="true"
                    ></span>
                    <span role="status">Loading...</span>
                  </span>
                ) : (
                  "Download Caption"
                )}
              </button>
            </td>
          </tr>
          <tr>
            <td>Video </td>
            <td>
              <button
                className="btn btn-primary me-2"
                style={{ width: "160px" }}
              >
                Get Stream
              </button>
              <button
                className="btn btn-primary me-2"
                style={{ width: "160px" }}
              >
                Select Stream
              </button>
              <button
                className="btn btn-primary me-2"
                style={{ width: "160px" }}
              >
                Download Stream
              </button>
            </td>
          </tr>
          <tr>
            <td>Audio </td>
            <td>
              <button
                className="btn btn-primary me-2"
                style={{ width: "160px" }}
              >
                Get Stream
              </button>
              <button
                className="btn btn-primary me-2"
                style={{ width: "160px" }}
              >
                Select Stream
              </button>
              <button
                className="btn btn-primary me-2"
                style={{ width: "160px" }}
              >
                Download Stream
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Video;
