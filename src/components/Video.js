import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";

function Video(props) {
  const API = `http://127.0.0.1:5000/utube/video/${props.objectId}`;
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [captions, setCaptions] = useState([]);
  const [streams, setStreams] = useState([]);
  const [videos, setVideos] = useState([]);
  const [audios, setAudios] = useState([]);

  const downloadCaptions = () => {
    console.log("Download captions");
  };

  const getCaptions = () => {
    getStreams();
    setLoading(true);
    axios
      .get(`${API}/captionsList`)
      .then((response) => {
        console.log(response.data);
        setCaptions(response.data);
        console.log(captions);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error getting captions: ", error);
        setLoading(false);
      });
  };

  const getStreams = async () => {
    setLoading(true);
    if (streams.length === 0) {
      await axios
        .get(`${API}/getStreams/`)
        .then((response) => {
          setStreams(response.data);
          console.log(streams);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error getting streams: ", error);
          setLoading(false);
        });
    } else {
      setLoading(false);
      return streams;
    }
  };

  const getVStream = async () => {
    setLoading(true);
    if (streams.length === 0) {
      await getStreams();
    }
    let videoStreams = streams.filter((stream) => stream.type === "video");
    let temp = "";
    let videos = [];
    for (let stream of videoStreams) {
      temp = "";
      console.log(stream);
      if (stream.includes_audio_track === true) {
        temp += "A";
      }
      if (stream.includes_video_track === true) {
        temp += "V";
      }
      temp += `-${stream.resolution}.${stream.mime_type.split("/")[1]}`;
      videos.push({ [`${temp}`]: stream.itag });
    }
    setVideos(videos);
    console.log(videos);
    setLoading(false);
  };

  const getAStream = async () => {
    setLoading(true);
    if (streams.length === 0) {
      await getStreams();
    }
    let audioStreams = streams.filter((stream) => stream.type === "audio");
    console.log(audioStreams);
    let temp = "";
    let audios = [];
    for (let stream of audioStreams) {
      temp = "A";
      console.log(stream);
      temp += `-${stream.abr}.${stream.mime_type.split("/")[1]}`;
      audios.push({ [`${temp}`]: stream.itag });
    }
    setAudios(audios);
    console.log(audios);
    setLoading(false);
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

  const getEmbedCode = () => {
    const url = `${props.link}`;
    const regex = /v=([^&]+)/;
    const match = url.match(regex);
    const videoId = match ? match[1] : null;
    return videoId;
  };

  return (
    <div className="mb-5 my-3 p-2">
      <h4 className="my-3 mx-2 d-flex justify-content-center ">
        Video
        {loading ? (
          <div className="spinner-grow mx-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        ) : title ? (
          `: ${title}`
        ) : null}
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
                Download Caption
              </button>
            </td>
          </tr>
          <tr>
            <td>Video </td>
            <td className="d-flex justify-content ">
              <button
                className="btn btn-primary me-2"
                style={{ width: "160px" }}
                onClick={getVStream}
              >
                Get Stream
              </button>
              <div className="dropdown">
                <button
                  className="btn btn-primary dropdown-toggle me-2" // Add 'me-2' class for spacing
                  type="button"
                  id="dropdownMenuCheckbox"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  disabled={loading || videos.length === 0}
                  style={{ width: "160px" }}
                >
                  Select Stream
                </button>
                <ul
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuCheckbox"
                >
                  {videos.map((video, index) => (
                    <li key={index}>
                      <label className="dropdown-item">
                        <input type="checkbox" className="me-2" />
                        {Object.keys(video)[0]}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                className="btn btn-primary me-2" // Add 'me-2' class for spacing
                type="button"
                disabled={true || (loading && captions.length === 0)}
                // onClick={downloadVStream}
                style={{ width: "160px" }}
              >
                Download Stream
              </button>
            </td>
          </tr>
          <tr>
            <td>Audio </td>
            <td className="d-flex justify-content ">
              <button
                className="btn btn-primary me-2"
                style={{ width: "160px" }}
                onClick={getAStream}
              >
                Get Stream
              </button>
              <div className="dropdown">
                <button
                  className="btn btn-primary dropdown-toggle me-2" // Add 'me-2' class for spacing
                  type="button"
                  id="dropdownMenuCheckbox"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  disabled={loading || audios.length === 0}
                  style={{ width: "160px" }}
                >
                  Select Stream
                </button>
                <ul
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuCheckbox"
                >
                  {audios.map((audio, index) => (
                    <li key={index}>
                      <label className="dropdown-item">
                        <input type="checkbox" className="me-2" />
                        {Object.keys(audio)[0]}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                className="btn btn-primary me-2" // Add 'me-2' class for spacing
                type="button"
                disabled={true || (loading && audios.length === 0)}
                // onClick={downloadVStream}
                style={{ width: "160px" }}
              >
                Download Stream
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <iframe
        className="d-flex justify-content-center mx-auto my-3"
        width="560"
        height="315"
        src={`https://www.youtube.com/embed/${getEmbedCode()}`}
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
      ></iframe>
    </div>
  );
}

export default Video;
