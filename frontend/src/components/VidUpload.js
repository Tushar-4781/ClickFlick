import { useRef, useState, useEffect } from "react"
import React from 'react';
import Button from "@material-ui/core/Button";
import { message } from "antd";

export default function VidUpload(props) {
  const [video, setVideo] = useState()
  const [preview, setPreview] = useState()
  const [inputValue, setInputValue] = useState("");

  const fileInputRef = useRef()

  useEffect(() => {
    if (video) {
      setPreview(true)
    } else {
      setPreview(false)
    }
  },[video])

  return (
    <div style={{  
      "alignItems": "center",
      "width": "100%",
      "height": "60%",
      "borderRadius": "1.5%",
      "fontSize": "18px",
      "justifyContent": "center",
      "cursor": "pointer",
      "backgroundColor": "#f7b42c",
      "backgroundImage": "linear-gradient(315deg, #f7b42c 0%, #fc575e 74%)",
      // "background": "#e57254",
      "border": "solid",
      "display": "flex",
    }}>
    
        {preview ? (
          <Button
            style={{ "width": "100%",
            "height": "100%",
             }}
            onClick={() => {
                props.onFileChange({},2)
                setVideo(false)
            }}
          >Change</Button>
        ) : (
          <button
            style={{
              "border": "none",
              "backgroundColor": "#f7b42c",
              "backgroundImage": "linear-gradient(315deg, #f7b42c 0%, #fc575e 74%)",
              // "background": "#e57254",
              "width":"100%",
              "height":"100%"}}
            onClick={event => {
              event.preventDefault()
              fileInputRef.current.click()
            }}
          >
            {props.text}
          </button>
        )}
        <input
          type="file"
          style={{ display: "none" }}
          ref={fileInputRef}
          onClick={()=>{setInputValue("")}}
          value={inputValue}
          onChange={event => {
            const file = event.target.files[0]
            if (file && file.type.substr(0, 5) === "video") {
                props.onFileChange(event,1);
          
                setVideo(true)
            } else {
                setVideo(false)
                message.info("Only Video File Allowed!!")   
            }
          }}
        />
        
    </div>
  )
}
