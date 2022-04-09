import React from 'react';
import "./Player.css"
import { FaRegThumbsUp, FaRegThumbsDown } from "react-icons/fa";
import { config } from "../App";
import { Row, Col,message} from 'antd';
import c from "classnames";

import Header from "./Header"
import Video from "./Video"
import {getDate} from "./utils/dateConverter"



class Player extends React.Component{
    constructor(props){
        super(props);
        this.state = {
          hitList : [],
          like: this.props.location.state.loadVideo.votes.upVotes,
          dislike: this.props.location.state.loadVideo.votes.downVotes,
          likeActive: false,
          dislikeActive: false
        }      
    }

    performAPICall = async (vote,change) => {
      // console.log(this.props.location.state.loadVideo._id)
      let url = `${config.endpoint}/v1/videos/${this.props.location.state.loadVideo._id}/votes`;
      try {
        await fetch(url, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            vote: vote,
            change: change,
          }),
        });
      } catch (e) {
        message.error(
          "Could not update votes. Check that the internet connection and try again."
        );
      }
    };
    performAPICallViews = async () => {
      // console.log(this.props.location.state.loadVideo._id)
      let url = `${config.endpoint}/v1/videos/${this.props.location.state.loadVideo._id}/views`;
      try {
        await fetch(url, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        });
      } catch (e) {
        message.error(
          "Could not update views. Check that the internet connection and try again."
        );
      }
    };

    getVideoElement = (video) => {
        // console.log("elem",video)
        return (  
          <Col xs={24} sm={12} xl={6} key={video._id}>
            <Video 
            videos = {this.props.location.state.allVideos}
            video={video}/>
          </Col>
        );
      };
    
    setDislike() {
      this.setState({
        dislikeActive: !this.state.dislikeActive,
        dislike: this.state.dislikeActive
          ? this.state.dislike - 1
          : this.state.dislike + 1
      });
    }
    setLike() {
      this.setState({
        likeActive: !this.state.likeActive,
        like: this.state.likeActive ? this.state.like - 1 : this.state.like + 1
      });
    }
  
    handleLike() {
      if (this.state.dislikeActive) {
        this.setLike();
        this.setDislike();
        this.performAPICall("downVote","decrease")

      }
      this.setLike();
      // console.log(id)
      if(this.state.likeActive)      
        this.performAPICall("upVote","decrease")
      else      
        this.performAPICall("upVote","increase")
    }
  
    handleDislike() {
      if (this.state.likeActive) {
        this.setDislike();
        this.setLike();
        this.performAPICall("upVote","decrease")

      }
      this.setDislike();

      if(this.state.dislikeActive)      
        this.performAPICall("downVote","decrease")
      else      
        this.performAPICall("downVote","increase")
    }
    componentDidUpdate(prevProps) {
        if(this.props.location !== prevProps.location) {
          window.scrollTo(0, 0)
          // let x = this.props.location.state.loadVideo
          // x.votes.upVotes = this.state.like
          // x.votes.downVotes = this.state.dislike
          // this.props.location.state.loadVideo= x
          this.performAPICallViews()
          this.setState({like: this.props.location.state.loadVideo.votes.upVotes,
          dislike: this.props.location.state.loadVideo.votes.downVotes,
          likeActive: false,
          dislikeActive: false})
        }
    }
    render(){
      const {videoLink,viewCount,releaseDate,title,_id } = this.props.location.state.loadVideo
      let url = `${config.vidEndpoint}/v1/videos/playVideo/${videoLink}`;
      console.log(url)
      // url = "https://clickflick.blob.core.windows.net/files/E-CART.mp4"
      const iframe = <video className="player-Window" autoPlay controls><source src={url} type = "video/mp4"/></video>
      
        return(
            <>
            <Header videoPreview={true}/>
            {/* {console.log(this.props)} */}
            {/* {console.table(JSON.parse(localStorage.getItem('activeVideo')))} */}
            {/* https://www.youtube.com/embed/nx2-4l4s4Nw */}
            <div className="player-Panel">
              <div id="player">    
                <div className="iframe-parent">{iframe}</div>
                  <div className='videoPlayer-info'>
                    <div>
                      <div className='videoPlayer-title'>{title}</div>
                        <div className='videoPlayer-information'>
                          <div className='video-data'><span>{viewCount} views  • {getDate(releaseDate)}</span></div>
                        </div>
                    </div>
                    <div className="Voting">
                      <div className="Voting-button">
                        <button  
                          onClick={() => this.handleLike()}
                          className={c({ ["active"]: this.state.likeActive })}
                        >
                          <div className="Voting-button-text"><FaRegThumbsUp/> {this.state.like}</div>
                        </button>
                        </div>
                        <div className="Voting-button">
                        <button 
                          className={c({ ["active"]: this.state.dislikeActive })}
                          onClick={() => this.handleDislike()}
                        >
                          <div className="Voting-button-text"><FaRegThumbsDown/> {this.state.dislike}</div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>  
              </div>
              <hr/>  
              <div className="dashboard">
                <Row type="flex" justify="center">
                  {this.props.location.state.allVideos.length !== 0 ? (
                      this.props.location.state.allVideos.map((video) =>
                        this.getVideoElement(video))
                    ) : this.state.loading ? (
                    <div className="loading-text">Loading videos...</div>
                    ) : (
                    <div className="loading-text">No videos to list</div>
                  )}
                </Row>
              </div>
            </>
        );
    }
}
export default Player;