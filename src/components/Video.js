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
  const [streams, setStreams] = useStateWithPromise([]);
  const [videos, setVideos] = useStateWithPromise([]);
  const [audios, setAudios] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [selectedAudios, setSelectedAudios] = useState([]);
  const [selectedCaptions, setSelectedCaptions] = useState([]);
  const [captionProgress, setCaptionProgress] = useStateWithPromise(0);
  const [videoProgress, setVideoProgress] = useStateWithPromise(0);
  const [audioProgress, setAudioProgress] = useStateWithPromise(0);

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

  const handleVideoChange = (video, checked) => {
    if (checked) {
      setSelectedVideos((prev) => [...prev, video]);
    } else {
      setSelectedVideos((prev) => prev.filter((v) => v !== video));
    }
  };

  const handleAudioChange = (audio, checked) => {
    if (checked) {
      setSelectedAudios((prev) => [...prev, audio]);
    } else {
      setSelectedAudios((prev) => prev.filter((a) => a !== audio));
    }
  };

  const handleCaptionChange = (caption, checked) => {
    if (checked) {
      setSelectedCaptions((prev) => [...prev, caption]);
    } else {
      setSelectedCaptions((prev) => prev.filter((c) => c !== caption));
    }
  };

  const downloadAudios = async () => {
    setLoading(true);
    if (selectedAudios.length === 0) {
      setLoading(false);
      return alert("Please select an audio to download");
    }
    if (selectedAudios.length === 1) {
      const tempAud = audios.filter((audio) => {
        return Object.keys(audio)[0] === selectedAudios[0];
      });
      const itag = tempAud[0][selectedAudios[0]];
      axios
        .get(`${API}/download/${itag}`, {
          onDownloadProgress: async (progressEvent) => {
            let percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            await setAudioProgress(percentCompleted);
          },
          responseType: "blob",
        })
        .then((response) => {
          const contentDisposition = response.headers["content-disposition"];
          const filename = contentDisposition.match(/filename="(.+)"/)[1];
          saveAs(new Blob([response.data]), filename);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error getting audio: ", error);
          setLoading(false);
        });
    } else {
      let totalDownloaded = 0; // Total bytes downloaded
      let totalSize = 0; // Total size of all files
      const zip = new JSZip();
      const sizeRequests = selectedAudios.map((audio) => {
        const tempAud = audios.filter((a) => {
          return Object.keys(a)[0] === audio;
        });
        const itag = tempAud[0][audio];
        return axios.head(`${API}/download/${itag}`).then((response) => {
          totalSize += parseInt(response.headers["content-length"]);
        });
      });
      Promise.all(sizeRequests)
        .then(() => {
          const requests = selectedAudios.map((audio) => {
            const tempAud = audios.filter((a) => {
              return Object.keys(a)[0] === audio;
            });
            const itag = tempAud[0][audio];
            return axios
              .get(`${API}/download/${itag}`, {
                onDownloadProgress: async (progressEvent) => {
                  totalDownloaded += progressEvent.loaded;
                  let percentCompleted = Math.round(
                    (totalDownloaded * 100) / totalSize
                  );
                  await setAudioProgress(percentCompleted);
                },
                responseType: "blob",
              })
              .then((response) => {
                const contentDisposition =
                  response.headers["content-disposition"];
                const filename = contentDisposition.match(/filename="(.+)"/)[1];
                zip.file(filename, response.data);
              });
          });
          return Promise.all(requests);
        })
        .then(() => {
          setLoading(true); // Add this line to show the loading spinner when downloading multiple files
          return zip.generateAsync({ type: "blob" });
        })
        .then((content) => {
          saveAs(content, "audios.zip");

          setLoading(false); // Hide the loading spinner after download is complete
        });
    }
  };

  const downloadVideos = async () => {
    setLoading(true);
    await setVideoProgress(0);
    if (selectedVideos.length === 0) {
      setLoading(false);
      return alert("Please select a video to download");
    }
    if (selectedVideos.length === 1) {
      const tempVid = videos.filter((video) => {
        return Object.keys(video)[0] === selectedVideos[0];
      });
      const itag = tempVid[0][selectedVideos[0]];
      console.log("itag: " + itag);
      axios
        .get(`${API}/download/${itag}`, {
          onDownloadProgress: async (progressEvent) => {
            let percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            await setVideoProgress(percentCompleted);
          },
          responseType: "blob",
        })
        .then((response) => {
          const contentDisposition = response.headers["content-disposition"];
          const filename = contentDisposition.match(/filename="(.+)"/)[1];
          saveAs(new Blob([response.data]), filename);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error getting video: ", error);
          setLoading(false);
        });
    } else {
      let totalDownloaded = 0; // Total bytes downloaded
      let totalSize = 0; // Total size of all files
      const zip = new JSZip();
      const sizeRequests = selectedVideos.map((video) => {
        const tempVid = videos.filter((v) => {
          return Object.keys(v)[0] === video;
        });
        const itag = tempVid[0][video];
        return axios.head(`${API}/download/${itag}`).then((response) => {
          totalSize += parseInt(response.headers["content-length"]);
        });
      });
      Promise.all(sizeRequests)
        .then(() => {
          const requests = selectedVideos.map((video) => {
            const tempVid = videos.filter((v) => {
              return Object.keys(v)[0] === video;
            });
            const itag = tempVid[0][video];
            return axios
              .get(`${API}/download/${itag}`, {
                onDownloadProgress: async (progressEvent) => {
                  totalDownloaded += progressEvent.loaded;
                  let percentCompleted = Math.round(
                    (totalDownloaded * 100) / totalSize
                  );
                  await setVideoProgress(percentCompleted);
                },
                responseType: "blob",
              })
              .then((response) => {
                const contentDisposition =
                  response.headers["content-disposition"];
                const filename = contentDisposition.match(/filename="(.+)"/)[1];
                zip.file(filename, response.data);
              })
              .catch((error) => {
                console.error("Error getting video: ", error);
              });
          });

          Promise.all(requests)
            .then(() => {
              return zip.generateAsync({ type: "blob" });
            })
            .then((blob) => {
              saveAs(blob, "videos.zip");
              setLoading(false); // Add this line
            })
            .catch((error) => {
              console.error("Error generating zip file: ", error);
              setLoading(false); // Add this line
            });
        })
        .catch((error) => {
          console.error(error);
        });
    }
    setLoading(false);
  };

  const downloadCaptions = async () => {
    await setCaptionProgress(0);
    setLoading(true);
    //console.log(selectedCaptions);
    if (selectedCaptions.length === 0) {
      setLoading(false);
      return alert("Please select a caption to download");
    }

    if (selectedCaptions.length === 1) {
      //console.log(selectedCaptions);
      axios
        .get(
          `${API}/captionsList/download/?caption_lang=${selectedCaptions[0]}`,
          {
            onDownloadProgress: async (progressEvent) => {
              let percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              await setCaptionProgress(percentCompleted);
              //console.log(percentCompleted);
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
            //console.log("Downloading: " + caption);
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
                //console.log(filename);
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
    setLoading(true);
    axios
      .get(`${API}/captionsList`)
      .then((response) => {
        //console.log("captions: " + response.data);
        setCaptions(response.data);
        //console.log(captions);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error getting captions: ", error);
        setLoading(false);
      });
  };

  const getVStream = async () => {
    setLoading(true);
    let videoStreams = streams.filter((stream) => {
      return Object.keys(stream)[0].includes("V");
    });
    //console.log("vstreams: " + videoStreams);
    // Sorting the resolution in ascending order
    videoStreams.sort((a, b) => {
      const aKey = Object.keys(a)[0];
      const bKey = Object.keys(b)[0];

      const aExtension = aKey.split(".").pop();
      const bExtension = bKey.split(".").pop();

      if (aExtension !== bExtension) {
        return aExtension.localeCompare(bExtension);
      }

      const aType = aKey.split("-")[0];
      const bType = bKey.split("-")[0];

      if (aType !== bType) {
        return bType.localeCompare(aType); // 'V' and 'AV' should come before 'A'
      }

      const aResolution = parseInt(aKey.split("-")[1]);
      const bResolution = parseInt(bKey.split("-")[1]);

      return aResolution - bResolution; // sort by resolution in ascending order
    });
    await setVideos(videoStreams);
    setLoading(false);
  };

  const getAStream = async () => {
    setLoading(true);
    let audioStreams = streams.filter((stream) => {
      let key = Object.keys(stream)[0];
      return key.includes("A") && !key.includes("V") && key.startsWith("A");
    });
    audioStreams.sort((a, b) => {
      const aKey = Object.keys(a)[0];
      const bKey = Object.keys(b)[0];

      const aExtension = aKey.split(".").pop();
      const bExtension = bKey.split(".").pop();

      if (aExtension !== bExtension) {
        return aExtension.localeCompare(bExtension);
      }

      const aResolution = parseInt(aKey.split("-")[1]);
      const bResolution = parseInt(bKey.split("-")[1]);

      return aResolution - bResolution; // sort by resolution in ascending order
    });
    setAudios(audioStreams);
    setLoading(false);
  };

  useEffect(() => {
    const setS = async () => {
      if (streams.length === 0) {
        // Only make the axios call if streams is empty
        console.log("Getting streams");
        await axios.get(`${API}/getStreams/`).then(async (response) => {
          let tempStream = [];
          let temp = "";
          for (let stream of response.data) {
            temp = "";
            if (stream.type === "video") {
              if (stream.includes_audio_track === true) {
                temp += "A";
              }
              if (stream.includes_video_track === true) {
                temp += "V";
              }
              temp += `-${stream.resolution}.${stream.mime_type.split("/")[1]}`;
            } else if (stream.type === "audio") {
              temp = "A";
              temp += `-${stream.abr}.${stream.mime_type.split("/")[1]}`;
            }
            tempStream.push({ [temp]: stream.itag });
          }
          console.log("temp streams: " + tempStream);
          await setStreams(tempStream);
        });
      }
    };

    setS();
  }, [API, streams, setStreams, setLoading, loading]);

  useEffect(() => {
    const getTitle = () => {
      setLoading(true);
      if (!title) {
        axios
          .get(`${API}/getTitle/`)
          .then((response) => {
            //console.log(response.data);
            setTitle(response.data.title);
            setLoading(false);
          })
          .catch((error) => {
            console.error("Error getting title: ", error);
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    };

    getTitle();
  }, [API, title]);

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
                  {console.log(videos)}
                  {videos.map((i) => {
                    return (
                      <li key={Object.keys(i)[0]}>
                        <label className="dropdown-item">
                          <input
                            type="checkbox"
                            className="me-2"
                            onChange={(e) =>
                              handleVideoChange(
                                Object.keys(i)[0],
                                e.target.checked
                              )
                            }
                          />
                          {Object.keys(i)[0]}
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <button
                className="btn btn-primary me-2" // Add 'me-2' class for spacing
                type="button"
                disabled={loading || videos.length === 0}
                onClick={downloadVideos}
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
                <div
                  className="progress-bar"
                  style={{ width: `${videoProgress}%` }}
                >
                  {videoProgress}%
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
                  {audios.map((i) => {
                    return (
                      <li key={Object.keys(i)[0]}>
                        <label className="dropdown-item">
                          <input
                            type="checkbox"
                            className="me-2"
                            onChange={(e) =>
                              handleAudioChange(
                                Object.keys(i)[0],
                                e.target.checked
                              )
                            }
                          />
                          {Object.keys(i)[0]}
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <button
                className="btn btn-primary me-2" // Add 'me-2' class for spacing
                type="button"
                disabled={loading || audios.length === 0}
                onClick={downloadAudios}
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
                <div
                  className="progress-bar"
                  style={{ width: `${audioProgress}%` }}
                >
                  {audioProgress}%
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
