import React from 'react';
import { ThreeDots } from 'react-loader-spinner';

export default function Loader() {
  return (


<div 
      className="spinner-container" 
      style={{ 
        position: 'absolute', 
        top: '50%', 
        left: '50%', 
        transform: 'translate(-50%, -50%)' 
      }}
    >
      <img 
        src="/assets/spinner.png"   // put your spinner image path here
        alt="Loading..." 
        style={{ width: "130px", height: "100px" }} 
      />
    </div>
  )
}
