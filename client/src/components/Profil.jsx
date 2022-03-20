import React from 'react'
import Tweet from './Tweet'
import axios from 'axios'
import { Redirect } from 'react-router-dom'

import '../css/Profil.css'

class Profil extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      login: '',
      lastname: '',
      firstname: '',
      email: '',
      myTweets: [],
      ListFollwers: [],
      ListFollwing: [],
      openFollower: false,
      openFollowing: false,
      mainuser: false,
      redirectProfil: false,
      nameredirectProfil: '',
      exists: false
    }
  }

  componentDidMount = async () => {

    await axios.get('http://localhost:4000/api/user/MyUser')
      .then(res => {
        if (this.props.mainuser ||  res.data.login === this.props.location.search.substring(1)){
          this.setState({
            login: res.data.login,
            lastname: res.data.lastname,
            firstname: res.data.firstname,
            email: res.data.email,
            mainuser: true
          })
        }
        console.log(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
    if (!this.props.mainuser){
      const log = this.props.location.search.substring(1)
      console.log(log)
      await axios.get('http://localhost:4000/api/user/getUser/'+log)
      .then(res => {
        this.setState({
          login: res.data.login,
          lastname: res.data.lastname,
          firstname: res.data.firstname,
          email: res.data.email
        })
        console.log(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
    }
    await axios.post('http://localhost:4000/api/follow/exists', {followed: this.state.login})
    .then(res => {
      this.setState({exists: res.data})
    })
    
    await axios.get('http://localhost:4000/api/follow/getFollowing/'+this.state.login)
    .then(res => {
      console.log('Following')
      console.log(res.data)
      this.setState({ListFollwing: res.data})
    })
    .catch((err) => {
      console.log(err)
    })

    await axios.get('http://localhost:4000/api/follow/getFollower/'+this.state.login)
    .then(res => {
      console.log('Follower')
      this.setState({ListFollwers: res.data})
      console.log(this.state.ListFollwers)
    })
    .catch((err) => {
      console.log(err)
    })

    await axios.get('http://localhost:4000/api/message/recupMsg/'+this.state.login)
    .then(res => {
      this.setState({myTweets: res.data})
      console.log("Message")
      console.log(this.state.myTweets)

    })
    .catch((err) => {
      console.log(err)
    })
    
  }

  handleFollow = async () => {
    const data = {
      followed: this.state.login
    }
    let already = false

    await axios.post('http://localhost:4000/api/follow/exists', data)
    .then(res => {
      already = res.data
    })
    if (!already){
      await axios.put('http://localhost:4000/api/follow', data)
      .then(res => {
        console.log('PUT FOLLOW')
        console.log(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
    }
    else{
      console.log(data)
      await axios.delete('http://localhost:4000/api/follow/delete', {data: data})
      .then(res => {
        console.log('DELETE FOLLOW')
        console.log(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
    }
    window.location.reload()
  }

  getFollower = () => {
    this.setState({openFollower: !this.state.openFollower})
  }

  getFollowing = () => {
    this.setState({openFollowing: !this.state.openFollowing})
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

    var ListFollwing = []
    var ListFollwers = []
    var Follwing = ''
    var Follwers = ''
    if (this.state.openFollowing === true){
      Follwing = 'Following'
      ListFollwing = this.state.ListFollwing.map((d) => <ul className='list-following' key={d.followed}><button value={d.followed} onClick={this.handleButtonList}>{d.followed}</button></ul>);
    }
    if (this.state.openFollower === true){
      Follwers = 'Followers'
      ListFollwers = this.state.ListFollwers.map((d) => <ul className='list-follower' key={d.follower}><button value={d.follower} onClick={this.handleButtonList}>{d.follower}</button></ul>);
    }

    return(
      
      <div className="container-profil">
        {console.log(this.props)}
        <div className="header-profil">
          <div className="header-profil-left">
            <div>{this.state.login}</div>
            <div>{this.state.lastname}</div>
            <div>{this.state.firstname}</div>
            <div>{this.state.email}</div>
          </div>
          <div className="header-profil-right">
            <div className="list-follows">
              <button onClick={this.getFollower}>{this.state.ListFollwers.length} Followers</button>
              <button onClick={this.getFollowing}>{this.state.ListFollwing.length} Following</button>
            </div>
            <button className={this.state.mainuser ? "button-follow-disabled" : "button-follow"} onClick={this.handleFollow}>{this.state.exists ? 'UnFollow' : "Follow"}</button>
          </div>
        </div>
        <div className="list-follows-list">
          <div className="list-following">
            <div className="title">{Follwing}</div>
            {ListFollwing }
          </div>
          <div className="list-followers">
            <div className="title">{Follwers}</div>
            {ListFollwers }
          </div>
        </div>
        <div className="mytweets-profil">
          <div className="title_Tweets">My tweets</div>
          {this.state.myTweets.map(e => (<Tweet data={e}/>))}
        </div>
      </div>
    )
  }
}

export default Profil;