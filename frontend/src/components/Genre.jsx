import React from 'react';

import { Tag } from 'antd';
import { Typography } from '@mui/material';
import {ageList, genreList} from "./utils/Lists"

import "./Genre.css"

const CheckableTag = Tag.CheckableTag;

class Genre extends React.Component{
  constructor(props){
    super(props);
    this.handleSortClick = this.handleSortClick.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
  }
  handleFilterChange(tag,checked,genreChange){
    if(genreChange){
      // console.log(tag,checked);
      let updatedSelectedGenre = [];
      if(tag===genreList[0]  && checked)
        updatedSelectedGenre = [genreList[0]];
      else{
        updatedSelectedGenre = checked ? [...this.props.selectedGenres,tag] : this.props.selectedGenres.filter(function (t) {
          return (t!==tag && t!==genreList[0])
        });
        if(updatedSelectedGenre[0]===genreList[0])
          updatedSelectedGenre.shift();
      }
      if(updatedSelectedGenre.length===0)
        updatedSelectedGenre = [genreList[0]];
        
      this.props.setState({
        selectedGenres: updatedSelectedGenre
      });
      
    }
    else{
      let updatedSelectedAge = [];
      if(tag===ageList[0]  && checked)
        updatedSelectedAge = [ageList[0]]
      else{
        updatedSelectedAge = checked ? [...this.props.selectedAges,tag] : this.props.selectedAges.filter(function (t) {
          return (t!==tag && t!==ageList[0])
        });
        if(updatedSelectedAge[0]===ageList[0])
        updatedSelectedAge.shift();
      }
      if(updatedSelectedAge.length===0) 
      updatedSelectedAge = [ageList[0]];
      updatedSelectedAge.sort((a,b)=>(parseInt(a.slice(0,-1))<parseInt(b.slice(0,-1)) ? 1 : -1))

      this.props.setState({
        selectedAges: [...updatedSelectedAge]
      });
    }
  }
  handleSortClick(){
    this.props.setState({
      isToggleOn: !this.props.isToggleOn
    })
  }

  
  componentDidUpdate(prevProps){
    if(this.props.isToggleOn!==prevProps.isToggleOn || this.props.selectedAges!==prevProps.selectedAges || this.props.selectedGenres!==prevProps.selectedGenres){
      this.props.getVideos();
    }
  }
  render(){
    return(
      <>
      <div className="genre-Panel">
        
        <div className="genre-Filter">
          {genreList.map(tag=>(
            <CheckableTag className="genre-btn"
            key={tag}
            checked={this.props.selectedGenres.indexOf(tag)>-1}
            onChange={checked=>this.handleFilterChange(tag,checked,true)}
            >
            <Typography
            //styleName: Body 2;
            fontFamily= "Roboto"
            fontStyle= "normal"
            fontWeight= "400"
            line-height= "20px"
            letterSpacing= "0.25px"
            text-align= "left" >
            {tag}
            </Typography>
              
            </CheckableTag>
          ))}
            <div>
            <select
              className="sort-btn sort-select"
              name="sortBy"
              defaultValue={"Release Date"}
              onChange={this.handleSortClick}
            >
              
            <option
              id="release-date-option"
              value="Release Date"
              // hidden = {!this.props.isToggleOn}
              >Release Date</option>
            <option
              id="view-count-option"
              value="View Count"
              // hidden = {this.props.isToggleOn}
              >View Count</option>
          </select>
          </div>
          
        </div>
        <div className="age-Filter">
          {ageList.map(tag=>(
            <CheckableTag className="content-rating-btn"
            key={tag}
            checked={this.props.selectedAges.indexOf(tag)>-1}
            onChange={checked=> this.handleFilterChange(tag,checked,false)}
            >
            <Typography
            //styleName: Body 2;
            fontFamily= "Roboto"
            fontStyle= "normal"
            fontWeight= "400"
            line-height= "20px"
            letterSpacing= "0.25px"
            text-align= "left" >
            {tag}
            </Typography>
            </CheckableTag>
          ))}
          </div>
        </div>
        
        </>
    )
  }
}
export default Genre;
