import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

function Video(props) {
  const API = `http://127.0.0.1:5000/utube/video/${props.objectId}`;
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [captions, setCaptions] = useState([]);
  const [streams, setStreams] = useState([]);
  const [videos, setVideos] = useState([]);
  const [audios, setAudios] = useState([]);
  const [selectedCaptions, setSelectedCaptions] = useState([]);
  const [captionProgress, setCaptionProgress] = useStateWithPromise(0);

  const handleCaptionChange = (caption, checked) => {
    if (checked) {
      setSelectedCaptions((prev) => [...prev, caption]);
    } else {
      setSelectedCaptions((prev) => prev.filter((c) => c !== caption));
    }
  };

  function useStateWithPromise(initialState) {
    const [state, setState] = useState(initialState);

    const setStateWithPromise = (newState) => {
      return new Promise((resolve) => {
        setState(newState);
        resolve(newState);
      });
    };

    return [state, setStateWithPromise];
  }

  const downloadCaptions = async () => {
    await setCaptionProgress(0);
    setLoading(true);
    console.log(selectedCaptions);
    if (selectedCaptions.length === 0) {
      setLoading(false);
      return alert("Please select a caption to download");
    }

    if (selectedCaptions.length === 1) {
      console.log(selectedCaptions);
      axios
        .get(
          `${API}/captionsList/download/?caption_lang=${selectedCaptions[0]}`,
          {
            onDownloadProgress: async (progressEvent) => {
              let percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              await setCaptionProgress(percentCompleted);
              console.log(percentCompleted);
              // Update your progress bar with percentCompleted
            },
          }
        )
        .then((response) => {
          const contentDisposition = response.headers["content-disposition"];
          const filename = contentDisposition.match(/filename="(.+)"/)[1];
          saveAs(new Blob([response.data]), filename);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error getting captions: ", error);
          setLoading(false);
        });
    } else {
      let totalDownloaded = 0; // Total bytes downloaded
      let totalSize = 0; // Total size of all files
      const zip = new JSZip();
      const sizeRequests = selectedCaptions.map((caption) => {
        return axios
          .head(`${API}/captionsList/download/?caption_lang=${caption}`)
          .then((response) => {
            totalSize += parseInt(response.headers["content-length"]);
          });
      });
      Promise.all(sizeRequests)
        .then(() => {
          const requests = selectedCaptions.map((caption) => {
            console.log("Downloading: " + caption);
            return axios
              .get(`${API}/captionsList/download/?caption_lang=${caption}`, {
                onDownloadProgress: async (progressEvent) => {
                  totalDownloaded += progressEvent.loaded;
                  let percentCompleted = Math.round(
                    (totalDownloaded * 100) / totalSize
                  );
                  await setCaptionProgress(percentCompleted);
                },
              })
              .then((response) => {
                const contentDisposition =
                  response.headers["content-disposition"];
                const filename = contentDisposition.match(/filename="(.+)"/)[1];
                console.log(filename);
                zip.file(filename, response.data);
              })
              .catch((error) => {
                console.error("Error getting captions: ", error);
              });
          });

          Promise.all(requests)
            .then(() => {
              return zip.generateAsync({ type: "blob" });
            })
            .then((blob) => {
              saveAs(blob, "captions.zip");
              setLoading(false);
            })
            .catch((error) => {
              console.error("Error generating zip file: ", error);
              setLoading(false);
            });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const getCaptions = () => {
    getStreams();
    setLoading(true);
    axios
      .get(`${API}/captionsList`)
      .then((response) => {
        console.log("captions: " + response.data);
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
      // console.log(stream);
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
    const getTitle = () => {
      setLoading(true);
      axios
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
      <h4 className="my-3 mx-2 d-flex  ">
        Video
        {title ? `: ${title}` : null}
        {loading ? (
          <div className="spinner-grow mx-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        ) : null}
      </h4>
      <table className="table table-bordered ">
        <colgroup>
          <col style={{ width: "15%" }} />
          <col style={{ width: "15%" }} />
          <col style={{ width: "70%" }} />
        </colgroup>
        <thead>
          <tr>
            <th>Function</th>
            <th>Action</th>
            <th>Progress</th>
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
                Get caption
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
                  {Object.entries(captions).map(([key, value]) => (
                    <li key={key}>
                      <label className="dropdown-item">
                        <input
                          type="checkbox"
                          className="me-2"
                          onChange={(e) =>
                            handleCaptionChange(key, e.target.checked)
                          }
                        />
                        {value}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                className="btn btn-primary me-2" // Add 'me-2' class for spacing
                type="button"
                disabled={loading || captions.length === 0}
                onClick={downloadCaptions}
                style={{ width: "160px" }}
              >
                Download Caption
              </button>
            </td>
            <td>
              <div
                className="progress"
                role="progressbar"
                aria-label="Example with label"
                aria-valuenow="25"
                aria-valuemin="0"
                aria-valuemax="100"
              >
                <div
                  className="progress-bar"
                  style={{ width: `${captionProgress}%` }}
                >
                  {captionProgress}%
                </div>
              </div>
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
            <td>
              <div
                className="progress"
                role="progressbar"
                aria-label="Example with label"
                aria-valuenow="25"
                aria-valuemin="0"
                aria-valuemax="100"
              >
                <div className="progress-bar" style={{ width: "0%" }}>
                  0%
                </div>
              </div>
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
            <td>
              <div
                className="progress"
                role="progressbar"
                aria-label="Example with label"
                aria-valuenow="25"
                aria-valuemin="0"
                aria-valuemax="100"
              >
                <div className="progress-bar" style={{ width: "0%" }}>
                  0%
                </div>
              </div>
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
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      ></iframe>
    </div>
  );
}

export default Video;
