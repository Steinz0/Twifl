import React from 'react'
import axios from 'axios'
import { Redirect } from 'react-router-dom'
import {BsTrash} from 'react-icons/bs'
import {BiCommentDetail} from 'react-icons/bi'

import '../css/Tweet.css'

class Tweet extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      redirectCmt: false,
      redirectHome: false,
      redirectProfil: false,
      date: `${this.props.data.day}/${this.props.data.month}/${this.props.data.year}`,
      time: `${this.props.data.hour}h${this.props.data.min}`
    }
  }

  handleNewComment = () => {
    this.setState({
      redirectCmt: true
    })
  }

  handleDelete = () => {
    axios.delete('http://localhost:4000/api/comment/deleteCommentsByMsgID/' + this.props.data._id)
    .then((data) => {
      console.log(data)
      axios.delete('http://localhost:4000/api/message/deleteMsg/' + this.props.data._id)
      .then((data) =>{
        console.log(data)
        this.setState({
          redirectHome: true
        })
      })
      .catch((err) => {
        console.log(err)
      })
    })
    .catch((err) => {
      console.log(err)
    })
  }

  handleProfil = () => {
    this.setState({
      redirectProfil: true
    })
  }

  render() {
    if (this.state.redirectCmt) {
      return <Redirect
            to={{
              pathname: "/home/tweetpage",
              search: this.props.data._id
            }}
    />
    }else if (this.state.redirectHome) {
      return <Redirect push to='/home'/>
    }
    else if (this.state.redirectProfil) {
      return <Redirect
            to={{
              pathname: "/home/profil",
              search: this.props.data.user_id
            }}
    />
    }
    return(
      <div className="container-tweet">
        <div className="tweet">
          <div className="info_tweet">
            <a href='' className="user_id" onClick={this.handleProfil}>{this.props.data.user_id}</a>
            <div className="date">{("0" + this.props.data.day).slice(-2)}/{("0" + this.props.data.month).slice(-2)}/{this.props.data.year}</div>
            <div className="time">{this.props.data.hour}H{("0" + this.props.data.min).slice(-2)}</div>
          </div>
          <div className="msg">{this.props.data.msg.text}</div>
          
          <div className="button_tweet">
            <button className="btn_comment" onClick={this.handleNewComment}><BiCommentDetail/></button>
            <button className="btn_trash" onClick={this.handleDelete}><BsTrash/></button>
          </div>
        </div>
      </div>
    )
  }
}

export default Tweet;