import React from 'react';

import {ageList, genreList} from "./utils/Lists"
import { config } from "../App";
import { TextField, Button, FormControl,FormHelperText,InputLabel,MenuItem,Select } from '@mui/material';

import "./UploadModal.css"
import { message } from 'antd';

class UploadModal extends React.Component{
    constructor(props){
        super(props)
        
        this.state = {
            videoLink: "",
            imageLink: "",
            videoTitle: "",
            videoGenre: "",
            videoContentRating:"",
            videoRelaseDate: "",
            loading: false
        }
        this.handleSubmit = this.handleSubmit.bind(this);

    };
    validateResponse = (errored, response) => {
        if (errored) {
          message.error("Error while uploading. Make sure your internet is working and try again.");
          return false;
        }
        else if (response && response.code) {
          message.error(response.message || "Failed to upload");
          return false;
        }
         
        return true;
    };
    performAPICall = async (videoObject) => {
        var response = {};
        var errored = false;
        
        this.setState({loading: true})
      
        try {
            response = await( await fetch(`${config.endpoint}/v1/videos`, {
              method: "POST",
              headers: {
                    "Content-Type": "application/json",
                },
              body: JSON.stringify(videoObject),
              })
            ).json();
        } catch (e) {
          errored = true;
        }
        
        this.setState({loading: false})

        if (this.validateResponse(errored, response)) {
          return true;
        }
      };
      handleSubmit = async(e)=>{
        e.preventDefault();
        // console.log(this.state.videoRelaseDate)
        const videoObject = {
            "videoLink": this.state.videoLink,
            "title": this.state.videoTitle,
            "genre": this.state.videoGenre,
            "contentRating": this.state.videoContentRating,
            "releaseDate": this.state.videoRelaseDate,
            "previewImage": this.state.imageLink
        }
        const res = this.performAPICall(videoObject);
        if(res!==null && res!==undefined){
            message.success("Video Uploaded Successfully!")
            this.setState({
                videoLink: " ",
                imageLink: " ",
                videoTitle: " ",
                videoGenre: " ",
                videoContentRating: " ",
                videoRelaseDate: " ",
            });
            this.props.setModal2Visible(false)
        }

    }

    render(){
        return(
            <div className="container">
                <form onSubmit={(e) => this.handleSubmit(e)}>  
                    <TextField
                    variant="outlined"
                    style={{marginTop: '12px'}}
                    required
                    fullWidth
                    id="video-link"
                    label="Video Link"
                    name="video-link"
                    helperText="This link will be used to deliver the video"
                    defaultValue={this.state.videoLink}
                    onChange={(e) => this.setState({videoLink: e.target.value})}
                    />
                    <TextField
                    variant="outlined"
                    style={{marginTop: '12px'}}
                    required
                    fullWidth
                    id="thumbnail-link"
                    label="Thumbnail Image Link"
                    name="thumbnail-link"
                    helperText="This link will be used to preview the thumbnail for the video"
                    defaultValue={this.state.imageLink}
                    onChange={(e) => this.setState({imageLink: e.target.value})}
                    
                    />
                    <TextField
                    variant="outlined"
                    style={{marginTop: '12px'}}
                    required
                    fullWidth
                    id="title"
                    label="Title"
                    name="title"
                    helperText="The title will be the representation text for the video"
                    defaultValue={this.state.videoTitle}
                    onChange={(e) => this.setState({videoTitle: e.target.value})}
                    />
                    <FormControl variant="outlined" required fullWidth style={{marginTop: '12px'}}>
                        <InputLabel id="genre-label">Genre</InputLabel>

                        <Select
                            labelId="genre-label"
                            id="genre-select"
                            name="genre"
                            // style={{marginTop: '12px'}}
                            required
                            fullWidth
                            defaultValue={this.state.videoGenre}
                            label="Genre"
                            onChange={(e) => this.setState({videoGenre: e.target.value})}
                        >
                            {genreList.map((genre) => (
                            <MenuItem key={genre} value={genre}>{genre}</MenuItem>
                            ))}
                        </Select>
                        <FormHelperText>
                            Genre will help in categorizing your videos
                        </FormHelperText>
                    </FormControl>

                    <FormControl variant="outlined" required fullWidth style={{marginTop: '12px'}}>
                        <InputLabel id="age-label">Suitable age group</InputLabel>
                        <Select
                            labelId="age-label"
                            id="age-select"
                            // style={{marginTop: '12px'}}
                            required
                            fullWidth
                            defaultValue={this.state.videoContentRating}
                            label="Suitable age group"
                            onChange={(e) => this.setState({videoContentRating: e.target.value})}

                        >
                            {ageList.map((age) => (
                            <MenuItem key={age} value={age}>{age}</MenuItem>
                            ))}
                        </Select>
                        <FormHelperText>
                            This will be used to filter videos on age group suitability
                        </FormHelperText>
                    </FormControl>
                    <TextField
                    id="date"
                    label="Upload and publish Date"
                    type="date"
                    name="date"
                    variant="outlined"
                    style={{marginTop: '20px'}}
                    required
                    fullWidth
                    helperText="This will be used to sort videos"
                    InputLabelProps={{shrink: true,}}
                    defaultValue={this.state.videoRelaseDate}
                    onChange={(e) => this.setState({videoRelaseDate: e.target.value})}

                    />
                    <div className="Modal-footer">
                        <Button
                        id="upload-btn-submit"
                        type="submit"
                        variant="contained"
                        color="secondary"
                        onClick={(e) => this.handleSubmit(e)}
                        >
                        Upload Video
                        </Button>
                        <Button
                        variant="contained"
                        id="upload-btn-cancel"
                        onClick={()=>this.props.setModal2Visible(false)}
                        >
                        Cancel
                        </Button>
                    </div>
                </form>
            </div>
        )
    }
}

export default UploadModal;