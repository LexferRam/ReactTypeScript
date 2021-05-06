import React, { ChangeEvent, FormEvent, useState, useEffect } from "react";
import { Video } from "./Video";
import * as videoSrevice from "./VideoService";
import { toast } from "react-toastify";
import { useHistory, useParams } from "react-router-dom";

type InputChange = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

interface Params {
  id: string;
}

function VideoForm() {
  const history = useHistory();
  const params = useParams<Params>();
  console.log(params);

  const initialState = {
    title: "",
    description: "",
    url: "",
  };

  const [video, setVideo] = useState<Video>(initialState);

  const handeInputChange = (e: InputChange) => {
    setVideo({ ...video, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!params.id) {
      const res = await videoSrevice.createVideo(video);
      toast.success("New Video Added");
      setVideo(initialState);
      console.log(res.data);
    } else {
      await videoSrevice.updateVideo(params.id, video);
    }

    history.push("/");
  };

  const getVideo = async (id: string) => {
    const res = await videoSrevice.getVideo(id);
    const { title, description, url } = res.data;
    setVideo({ title, description, url });
    console.log(res.data);
  };

  useEffect(() => {
    if (params.id) getVideo(params.id);
  }, []);

  return (
    <div className="row">
      <div className="col-md-4 offset-md-4">
        <div className="card">
          <div className="card-body">
            <h3>New Video</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  name="title"
                  placeholder="Write a title for this video"
                  className="form-control"
                  onChange={handeInputChange}
                  value={video.title}
                  autoFocus
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="url"
                  placeholder="http://somewebsite.com"
                  className="form-control"
                  onChange={handeInputChange}
                  value={video.url}
                />
              </div>
              <div className="form-group">
                <textarea
                  name="description"
                  rows={3}
                  className="form-control"
                  placeholder="Write a description"
                  onChange={handeInputChange}
                  value={video.description}
                ></textarea>
              </div>
              {params.id ? (
                <button className="btn btn-info">Update Video</button>
              ) : (
                <button className="btn btn-primary">Create</button>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoForm;
