import React from 'react';
import { message, Progress} from "antd";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {FormControl,FormHelperText,InputLabel,MenuItem,Select} from "@material-ui/core";

import "./UploadModal.css"
import ImgUpload from "./ImgUpload"
import VidUpload from "./VidUpload"

import {ageList, genreList} from "./utils/Lists"
import { config } from "../App";
import {BlobServiceClient} from "@azure/storage-blob"

import { ObjectID } from 'bson';

class UploadModal extends React.Component{
    constructor(props){
        super(props)
        
        this.fileInputRef = React.createRef()
        this.state = {
            videoTitle: "",
            videoGenre: "",
            videoContentRating:"",
            videoRelaseDate: "",
            imageUpload:"",
            progress : 0,
            vidFile: "",
            size: 0,
            status : 1,
            id:0,
            loading: false,
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onFileChange = this.onFileChange.bind(this);
    };
    onFileChange(event,ivToggle){
        console.log(`this is me ${ivToggle}`, event.target.files[0])
        
        if(ivToggle===0)
            this.setState({imageUpload:event.target.files[0]})    
        else if(ivToggle===1){
            this.setState({ vidFile:event.target.files[0],
                            size:event.target.files[0].size,
                            status: 2
                        });
            console.log(event.target.files[0])
        }
        else if(this.state.progress==0){
            this.setState({status:1})
        }
    }
  
    async uploadVideoFile(){
    
        const name  = new ObjectID().toString();
        console.log(name)
        this.setState({status:3})
        // console.log(this.state.name);
        let storageAccName = "clickflick";
        let sasToken = "?sv=2020-08-04&ss=bfqt&srt=sco&sp=rwdlacupitfx&se=2021-12-30T04:33:06Z&st=2021-12-24T20:33:06Z&spr=https&sig=jm%2FD9UjA9bQQPX6wjsEBfk0eOoD89rEczXxGsydfzpw%3D";
        const blobService = new BlobServiceClient(
            `https://${storageAccName}.blob.core.windows.net/${sasToken}`
        );
        

        const containerClient = blobService.getContainerClient('files')
        const blobClient = containerClient.getBlockBlobClient(name+".mp4");
        const options = { blobHTTPHeaders: { blobContentType : this.state.vidFile.type}};
        await blobClient.uploadBrowserData(this.state.vidFile,{
            blockSize: 4 * 1024 * 1024, // 4MB block size
            concurrency: 20, // 20 concurrency
            onProgress: (ev) => {
              console.log(`you have upload ${ev.loadedBytes} bytes`);
              this.setState({progress: parseInt((ev.loadedBytes / this.state.size)*100)});
            },options
        }).then(response =>{
            // console.log(response)
            if(response.errorCode !=null){
              message.error("failed")
            }
            message.success("Video Uploaded")
            this.setState({id:name})
          })

        // console.log(this.state.vidFile.name);

    }
    async uploadImgFile(){
        let storageAccName = "clickflick";
        let sasToken = "?sv=2020-08-04&ss=bfqt&srt=sco&sp=rwdlacupitfx&se=2021-12-30T04:33:06Z&st=2021-12-24T20:33:06Z&spr=https&sig=jm%2FD9UjA9bQQPX6wjsEBfk0eOoD89rEczXxGsydfzpw%3D";
        const blobService = new BlobServiceClient(
            `https://${storageAccName}.blob.core.windows.net/${sasToken}`
        );
        

        const containerClient = blobService.getContainerClient('thumbs')
        
        const blobClient = containerClient.getBlockBlobClient(this.state.imageUpload.name);
        const options = { blobHTTPHeaders: { blobContentType : this.state.imageUpload.type}};
        await blobClient.uploadBrowserData(this.state.imageUpload,{
            blockSize: 4 * 1024 * 1024, // 4MB block size
            concurrency: 20, // 20 concurrency
            options
        })
    }
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
    
        if(this.state.vidFile==="" || this.state.videoTitle==="" || this.state.videoGenre==="" || 
        this.state.imageUpload==="" || this.state.videoContentRating==="" || this.state.videoRelaseDate==="" )
           message.info("Fill all the details");
        else if(this.state.progress!==100){
            if(this.state.progress<100){
                message.info("Uploading...")
            }
            else
                message.info("Upload Video File");
        }
        else{
            // console.log(this.state.videoRelaseDate)
            this.uploadImgFile()
            const videoObject = {
                "videoLink": this.state.id.toString(),
                "title": this.state.videoTitle,
                "genre": this.state.videoGenre,
                "contentRating": this.state.videoContentRating,
                "releaseDate": this.state.videoRelaseDate,
                "previewImage": this.state.imageUpload.name
            }

            const res = this.performAPICall(videoObject);
            if(res!==null && res!==undefined){
                message.success("Video Published Successfully!")
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

    }

    render(){
        return(
            <div className='main_cont'>
                <div className="panel-1">
               
                    <ImgUpload
                    onFileChange = {this.onFileChange}
                    text = "Choose Thumbnail"
                    />
                    <div className="uploader">
                        {this.state.status===3 || this.state.status==="done" ? 
                            <Progress
                            id = "upload-progress"
                            type="circle"
                            strokeColor={{
                                '0%': '#108ee9',
                                '100%': '#87d068',
                            }}
                            percent={this.state.progress}
                        /> : null }
                        {this.state.status<3 ? 
                        <VidUpload
                        onFileChange={this.onFileChange}    
                        text = "Choose Video"/> : null}
                        {this.state.status===2 ?                     
                            <Button
                            id="upload-btn-submit"
                            style={{"backgroundColor": "#1fd1f9",
                                "backgroundImage": "linear-gradient(315deg, #1fd1f9 0%, #b621fe 74%)"
                                }}
                            type="submit"
                            variant="contained"
                            color="secondary"
                            onClick={()=>this.uploadVideoFile()}
                            >
                            Upload Video
                            </Button>
                        : null}
                        
        
                    </div>
                    
                </div>
                <div></div>
                <div className="container">
                    <form onSubmit={(e) => this.handleSubmit(e)}> 
                        
                        <TextField
                        variant="outlined"
                        style={{marginTop: '2px'}}
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
                        {/*<Input type={"file"} id="file-list" multiple onChange={(e)=>this.onFileChange(e)}/>*/}
                                    
                    
                        <div className="Modal-footer">
                            <Button
                            id="upload-btn-submit"
                            type="submit"
                            variant="contained"
                            color="secondary"
                            onClick={(e) => this.handleSubmit(e)}
                            >
                            PUBLISH
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
            </div>
        )
    }
}

export default UploadModal;