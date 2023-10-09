import React from "react";
import '../index.css'

const ProgressBar = ({ label, value, max }) => {
  const progress = (value / max) * 100;
  

  const progressBarStyle = {
    backgroundColor: "#ccc",
    width: "100px",
    height: "20px",
    borderRadius: "10px",
    overflow: "hidden",
  };

  const progressStyle = {
    height: "100%",
    backgroundColor: "black",
    width: `${progress}%`,
    transition: "width 0.3s ease-in-out",
    
  };

  return (
    <div>
      <p>{label}</p>
      <div style={progressBarStyle}>
        <div style={progressStyle}></div>
      </div>
    </div>
  );
};

export default ProgressBar;
