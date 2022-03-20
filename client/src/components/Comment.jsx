import React from 'react'
import axios from 'axios'
import { Redirect } from 'react-router-dom'
import {BsTrash} from 'react-icons/bs'

import '../css/Tweet.css'

class Comment extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      redirectProfil: false
    }
  }

  handleProfil = () => {
    this.setState({
      redirectProfil: true
    })
  }

  handleDelete = async () => {
    await axios.delete('http://localhost:4000/api/comment/deleteComment/' + this.props.data._id)
    .then((data) => {
      console.log(data)
    })
    .catch((err) => {
      console.log(err)
    })
    window.location.reload();
  }

  render() {
    if (this.state.redirectProfil) {
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
            <a className="user_id" onClick={this.handleProfil}>{this.props.data.user_id}</a>
            <div className="date">{("0" + this.props.data.day).slice(-2)}/{("0" + this.props.data.month).slice(-2)}/{this.props.data.year}</div>
            <div className="time">{this.props.data.hour}H{("0" + this.props.data.min).slice(-2)}</div>
          </div>
          <div className="msg">{this.props.data.msg}</div>
          <div className="button_tweet">  
            <button className="btn_trash_comment" onClick={this.handleDelete}><BsTrash/></button>
          </div>
        </div>
      </div>
    )
  }
}

export default Comment;