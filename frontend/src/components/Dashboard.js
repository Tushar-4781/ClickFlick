import React from 'react';

import { config } from "../App";
import { Row, Col,message} from 'antd';

import "./Dashboard.css"
import 'antd/dist/antd.css';
// import { withRouter } from "react-router-dom";
import Video from "./Video"
import Genre from "./Genre"
import Header from "./Header"
import {ageList, genreList} from "./utils/Lists"



class Dashboard extends React.Component{
    constructor(){
        super();

        this.videos = []
        this.state = {
          filteredVideos: [],
          selectedGenres: ['All Genre'],
          selectedAges: ['Any Age Group'],
          isToggleOn: true,
          loading: false,
        }

    }

    
  validateResponse = (errored, response) => {
    if (!response || errored || (!response.videos.length && !response.videos.message)) {
      message.error(
        "Could not fetch Videos. Check that the backend is running, reachable and returns valid JSON."
      );
      return false;
    }
    else if(response.videos.message){
      message.error(response.videos.message)
      return false
    }
    else if (!response.videos.length) {
      message.error(response.message || "No Videos found in database");
      return false;
    }
    return true;
  };

  perfromAPICall = async()=>{
    var response;
    var errored = false;
    let queries = ""
    if(!this.state.selectedGenres.includes(genreList[0])){
      queries+=`?genres=${this.state.selectedGenres}`
    }
    if(!this.state.selectedAges.includes(ageList[0])){
      queries!=="" ? queries+='&': queries+='?'
      queries+=`contentRating=${this.state.selectedAges[0].slice(0,-1)}%2B`
    }
    if(!this.state.isToggleOn){
      queries!=="" ? queries+='&': queries+='?'
      queries+="sortBy=viewCount"
    }
    
    let URL = `${config.endpoint}/v1/videos${queries}`
    console.log(URL)
    this.setState({loading:true});
  
    try{
        response = await (await(fetch(URL))).json()
    }
    catch(err){
        errored=true;
    }
    this.setState({
        loading:false
    });
    
    if (this.validateResponse(errored, response)) {
        return response.videos;
    }
  };

  getVideos = async()=>{
    const responseData = await this.perfromAPICall();
    if(responseData!==null && responseData!==undefined){
        this.videos = [...responseData];
        this.setState({
            filteredVideos:[...this.videos]
        })
        
    }
  }; 
  

  componentDidMount(){
    this.getVideos();
  };

  getVideoElement = (video) => {
      // console.log("elem",video)
      return (
        <Col xs={24} sm={12} xl={6} key={video._id}>
          <Video 
          videos = {this.videos}
          video={video}/>
        </Col>
      );
    };

    render(){
        return(
            <>
                <Header
                  ref = {ref => (this.child = ref)}
                  setState = {state => this.setState(state)}
                  filteredVideos = {this.state.filteredVideos}
                  videos = {this.videos}
                  videoPreview={false}
                />
                 <Genre 
                  ref = {ref => (this.child = ref)}
                  setState = {state => this.setState(state)}
                  selectedGenres = {this.state.selectedGenres}
                  selectedAges = {this.state.selectedAges}
                  isToggleOn = {this.state.isToggleOn}
                  filteredVideos = {this.state.filteredVideos}
                  getVideos = {this.getVideos}
                />
                
                {/* <Genre Videos={this.state.filteredVideos}/> */}
                <div className="dashboard">
                  <Row type="flex" justify="center">
                  {this.videos.length !== 0 ? (
                      this.state.filteredVideos.map((video) =>
                        this.getVideoElement(video))
                    ) : this.state.loading ? (
                    <div className="loading-text">Loading videos...</div>
                    ) : (
                    <div className="loading-text">No videos to list</div>
                  )}
                  </Row>
                </div>
            </>
        )
    }
}

export default Dashboard;