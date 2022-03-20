import React from 'react'
import axios from 'axios'
import Tweet from './Tweet'
import Comment from './Comment'

import '../css/TweetPage.css'

class TweetPage extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      tweet: [],
      comments: [],
      msg_id: this.props.location.search.substring(1),
      NewComment: ''
    }
  }

  componentDidMount = async () => {
    await axios.get('http://localhost:4000/api/message/recupMsgIDMsg/'+ this.state.msg_id)
      .then(res => {
        this.setState({tweet: res.data})
      })
      .catch((err) => {
        console.log(err)
      })
    await axios.get('http://localhost:4000/api/comment/recupComment/'+ this.state.msg_id)
      .then(res => {
        this.setState({comments: res.data})
      })
      .catch((err) => {
        console.log(err)
      })
      this.setState({NewComment: ''})
  }

  handleChange = (event) => {
    this.setState({NewComment: event.currentTarget.value})
  }

  handleSubmit = async () => {
    if (this.state.NewComment !== ''){
      const data = {
        msg_id: this.state.msg_id,
        text: this.state.NewComment
      }
      await axios.put('http://localhost:4000/api/comment/insertComment', data)
      .then((data) => {
      })
      .catch((err) => {
        console.log(err)
      })
      window.location.reload()
    }
  }

  render() {
    return(
      <div className="container-tweet-page">
        <div className="container-tweet">
          <div className="title_Tweets">Tweet</div>
          {this.state.tweet.map(e => (<Tweet data={e}/>))}
        </div>
        <div className="container-new-comment">
          <div className="title-new-comment">New Comment</div>
          <textarea className="new-comment-text" name="tweet" id="" cols="50" rows="5" onChange={this.handleChange} value={this.state.NewTweet}></textarea>
          <button className="new-comment-button" type='button' onClick={() => this.handleSubmit()}>Send</button>
        </div>
        <div className="container-comments">
          <div className="title-comments">Comments</div>
          {this.state.comments.map(e => (<Comment data={e}/>))}
        </div>
      </div>
    )
  }
}

export default TweetPage;