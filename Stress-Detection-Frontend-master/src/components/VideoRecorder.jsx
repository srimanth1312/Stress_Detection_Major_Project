import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";
import "../styles/VideoRecorder.css";
import { CiUser } from "react-icons/ci";
const VideoRecorder = () => {
  return (
    <div className="video-container">
      <p className="video-heading">
        Video Input
      </p>
    <div className="VideoRecorder">
        <img src="http://127.0.0.1:5000/video_feed" className="video" alt="" />
      <div className="user-logo">
        <CiUser size={100}/>
      </div>
    </div>
    </div>
  );
};


export default VideoRecorder;

