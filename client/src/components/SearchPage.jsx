import React from 'react'
import axios from 'axios'
import Tweet from './Tweet'
import { Redirect } from 'react-router-dom'

import '../css/SearchPage.css'


class SearchPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      listTweets: [],
      listUsers: [],
      sequence: ''
    }
  }
  componentDidMount = async () => {
    const sequence = decodeURI(this.props.location.search.substring(1))
    const data = {
      words: sequence
    }
    await axios.post('http://localhost:4000/api/message/findMsgWords', data)
    .then(res => {
      this.setState({
        sequence: sequence,
        listTweets: res.data
      })
      console.log(res.data)
    })
    .catch((err) => {
      console.log(err)
    })
    await axios.post('http://localhost:4000/api/user/getUsersWords', data)
    .then(res => {
      this.setState({
        listUsers: res.data
      })
      console.log(res.data)
    })
    .catch((err) => {
      console.log(err)
    })
  }

  handleButtonList = (event) => {
    console.log(event.currentTarget.value)
    this.setState({
      nameredirectProfil: event.currentTarget.value,
      redirectProfil: true
    })
  }
  render() {
    if (this.state.redirectProfil) {
      return <Redirect
            to={{
              pathname: "/home/profil",
              search: this.state.nameredirectProfil
            }}
            />
    }

    return(
      <div className="container-search">
        <div className="title-search">Research: {this.state.sequence}</div>
        <div className="legend">
            <div className="legend-tweet">Tweets</div>
            <div className="legend-users">Users</div>
        </div>
        <div className="results">
          <div className="tweets">
            {this.state.listTweets.map(e => (<Tweet data={e}/>))}
          </div>
          <div className="separator"></div>
          <div className="users">
            {this.state.listUsers.map(e => (<ul><button className='users-button-search' value={e.login} onClick={this.handleButtonList}>{e.login}</button></ul>))}
          </div>
        </div>
      </div>
    )
  }
}

export default SearchPage;