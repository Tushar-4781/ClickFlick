import { Input,Modal, Button } from "antd";
import React from "react";


import { MdFileUpload } from "react-icons/md"
import { Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import UploadModal from "./UploadModal"
import "./Header.css";
import { Navbar } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

class Header extends React.Component{
    constructor(props){
      super(props)
      this.state = {
        modal2Visible: false,
      };

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
                            X
                        </div>
                        <div id="Logo_flix">
                            Flix
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
                <Button id="upload-btn" className="Upload-Button ml-auto" onClick={() => this.setModal2Visible(true)}>
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