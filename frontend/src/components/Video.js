import React from "react";
import "./Video.css";
import {Card} from 'antd';
import { Link } from "react-router-dom";
import {getDate} from "./utils/dateConverter"

class Video extends React.Component{
    onClick = ()=>{
        localStorage.setItem("activeVideo",JSON.stringify(this.props.video))
    }
    render(){
        
    return(
        <>
        {/* {console.log(this.props.video)} */}
        
        <Link className="video-tile-link" to={{pathname:"/preview/"+this.props.video._id,state: {loadVideo:this.props.video, allVideos: this.props.videos}}}>
            <div className="video-tile">
            <Card
            hoverable
            cover={<img alt={this.props.video.title} src={this.props.video.previewImage.split("?")[0]} />}
            bordered={false}
            >                
                <div className='video-title'>
                        {this.props.video.title}
                </div>
                <div className='video-pubDate'>
                {getDate(this.props.video.releaseDate)}
                
                </div>
                
            </Card>
            </div>
        </Link>
        </>
        
    )
}
}
export default Video;