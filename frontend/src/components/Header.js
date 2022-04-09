import { Input,Modal, Button } from "antd";
import React from "react";
import {Navbar} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./Header.css";
import { MdFileUpload } from "react-icons/md"
import { Typography } from "@material-ui/core"
import { Link } from 'react-router-dom';
import UploadModal from "./UploadModal"
import {BlobServiceClient} from "@azure/storage-blob"

class Header extends React.Component{
    constructor(props){
      super(props)
      this.state = {
        modal2Visible: false,
        file: null
      };
      this.uploadVideoFile = this.uploadVideoFile.bind(this)
      this.onFileChange = this.onFileChange.bind(this)
    

    }
    onFileChange(event){
      console.log(event.target.files)
      this.setState({file:event.target.files[0]});
    }

    async uploadVideoFile(){
        console.log(this.state.file);
        let storageAccName = "clickflick";
        let sasToken = "?sv=2020-08-04&ss=bfqt&srt=sco&sp=rwdlacupitfx&se=2021-12-30T04:33:06Z&st=2021-12-24T20:33:06Z&spr=https&sig=jm%2FD9UjA9bQQPX6wjsEBfk0eOoD89rEczXxGsydfzpw%3D";
        const blobService = new BlobServiceClient(
            `https://${storageAccName}.blob.core.windows.net/${sasToken}`
        );

        const containerClient = blobService.getContainerClient('files')
        // await containerClient.createIfNotExists({
        //     access: 'container',
        // })
        const blobClient = containerClient.getBlockBlobClient(this.state.file.name);
        const options = { blobHTTPHeaders: { blobContentType : this.state.file.type}};
        await blobClient.uploadBrowserData(this.state.file,options);

    }
  
    search = (text) => {
        let txt=text.toLowerCase();
        let ls=[]
        this.props.videos.forEach(el=>{
          let Name=el.title.toLowerCase();
          if(Name.search(txt)>=0){
            ls.push(el);
          }
        })

        this.props.setState({filteredVideos:ls})
      };

    debounceSearch = (event) => {
      let searchText=event.target.value;
      if(this.debounceTimeout){
        clearTimeout(this.debounceTimeout);
      }
      this.debounceTimeout = setTimeout(
        function(){
          this.search(searchText);
      }.bind(this),300);  
    };
    
    setModal2Visible(modal2Visible) {
      this.setState({ modal2Visible });
    }
    
    
    render(){
        return(
    <>
        <div className="header">
            <Navbar bg="dark" variant="dark" className="Navbar">
                <Navbar.Brand  as={Link} to="/">
                    <div className="header-title">
                        <div id="Logo_bigX">
                            Click
                        </div>
                        <div id="Logo_flix">
                        Flick
                        </div>
                    </div>
                </Navbar.Brand>

                {this.props.videoPreview ? null : (
                  <>
                  
                  <Input.Search
                    placeholder="Search"
                    onSearch={this.search}
                    onChange={this.debounceSearch}
                    enterButton={true}
                  /> 
                  <div className="navbar-elements">
                  
                  <Button id="upload-btn" className="Upload-Button ml-auto" onClick={()=>this.setModal2Visible(true)}>
                    <Typography
                      fontFamily= "Roboto"
                      fontSize= "12px"
                      fontStyle= "normal"
                      fontWeight= "400"
                      line-height= "14px"
                      letterSpacing= "0px"
                      text-align= "center"
                      >
                      <MdFileUpload/>Upload
                    </Typography>        
                </Button>

                </div>
                </>)}
            </Navbar>
          </div>
          {this.state.modal2Visible ? 
            <Modal
              title="Upload Video"
              // centered
              visible={this.state.modal2Visible}
              onOk={() => this.setModal2Visible(false)}
              onCancel={() => this.setModal2Visible(false)}
              footer={[]}
            >
             <UploadModal 
                ref = {ref => (this.child = ref)}
                setState = {state => this.setState(state)}
                setModal2Visible={this.setModal2Visible}/> 
            </Modal> : null}

        </>)
  }
};

export default Header;