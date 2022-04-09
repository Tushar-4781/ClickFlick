import { useRef, useState, useEffect } from "react"
import React from 'react';
import { message } from "antd";

export default function ImgUpload(props) {
  const [image, setImage] = useState()
  const [preview, setPreview] = useState()
  const [inputValue, setInputValue] = useState("");

  const fileInputRef = useRef()

  useEffect(() => {
    if (image) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(image)
    } else {
      setPreview(null)
    }
  }, [image])

  return (
    <div style={{  
      "alignItems": "center",
      "width": "100%",
      "height": "60%",
      "borderRadius": "1.5%",
      "fontSize": "18px",
      "justifyContent": "center",
      "cursor": "pointer",
      "backgroundColor": "#7ee8fa",
      "backgroundImage": "linear-gradient(315deg, #7ee8fa 0%, #80ff72 74%)",
      // "background": "#52d273",
      "border": "solid",
      "display": "flex",
    }}>
    
        {preview ? (
          <img
            alt="thumbnail"
            src={preview}
            style={{ "width": "100%",
            "height": "100%",
             }}
            onClick={() => {
              setImage(null)
            }}
          />
        ) : (
          <button
            style={{
              "border": "none",
              "backgroundColor": "#7ee8fa",
              "backgroundImage": "linear-gradient(315deg, #7ee8fa 0%, #80ff72 74%)",        
              // "background": "#52d273",
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
          value={inputValue}
          onClick={()=>{setInputValue("")}}
          onChange={event => {
            const file = event.target.files[0]
            if (file && file.type.substr(0, 5) === "image") {
              props.onFileChange(event,0);
              setImage(file)
            } else {
              setImage(null)
              message.info("Only Image File Allowed!!")   

            }
          }}
        />
        
    </div>
  )
}
