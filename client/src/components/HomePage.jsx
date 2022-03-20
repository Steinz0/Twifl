import React from 'react'
import axios from 'axios'
import Tweet from './Tweet'
import '../css/HomePage.css'


class HomePage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      listTweets: [],
      NewTweet: ''
    }
  }
  componentDidMount = async () => {
    await axios.get('http://localhost:4000/api/message/recupMsg')
    .then(res => {
      this.setState({listTweets: res.data})
    })
    .catch((err) => {
      console.log(err)
    })
  }

  handleChange = (event) => {
    this.setState({NewTweet: event.currentTarget.value})
  }

  handleSubmit = async () => {
    if (this.state.NewTweet !== ''){
      const data = {
        text: this.state.NewTweet
      }
      await axios.put('http://localhost:4000/api/message/insertMsg', data)
      .then((res) => {
        console.log(res)
      })
      .catch((err) => {
        console.log(err)
      })
      window.location.reload()
    }
  }

  handleTweets = async () => {
    await axios.post('http://localhost:4000/api/message/getMsgFollower')
    .then((res) =>{
      this.setState({listTweets: res.data})
    })
    .catch((err) => {
      console.log(err)
    })
  }

  formSubmitExactDate = async (event) => {
    event.preventDefault();
    const date = event.currentTarget.date_value.value.split('-')
    const data = {
      day: date[2],
      month: date[1],
      year: date[0]
    }
    await axios.post('http://localhost:4000/api/message/findMsgExactDate', data)
    .then((res) =>{
      this.setState({listTweets: res.data})
    })
    .catch((err) => {
      console.log(err)
    })
    console.log(this.state.listTweets)
  }

  formSubmitRangeDate = async (event) => {
    event.preventDefault();
    console.log(event.currentTarget.input_range_date.value)
    const time = event.currentTarget.input_range_date.value
    if (time === 'All'){
      window.location.reload()
    }
    if (time === 'Hour'){
      await axios.post('http://localhost:4000/api/message/findMsgLess1Hour')
      .then((res) =>{
        this.setState({listTweets: res.data})
      })
      .catch((err) => {
        console.log(err)
      })
    } 
    else if (time === 'Day'){
      await axios.post('http://localhost:4000/api/message/findMsgLess1Day')
      .then((res) =>{
        this.setState({listTweets: res.data})
      })
      .catch((err) => {
        console.log(err)
      })
    }
    else if (time === 'Week'){
      await axios.post('http://localhost:4000/api/message/findMsgLess1Week')
      .then((res) =>{
        this.setState({listTweets: res.data})
      })
      .catch((err) => {
        console.log(err)
      })
    }
    else if (time === 'Month'){
      await axios.post('http://localhost:4000/api/message/findMsgLess1Month')
      .then((res) =>{
        this.setState({listTweets: res.data})
      })
      .catch((err) => {
        console.log(err)
      })
    }
  }

  render() {
    return(
      <div className="container-home">
        <form className="new-tweet-form">
          <label htmlFor="tweet">New Tweet</label>
          <textarea name="tweet" id="" cols="30" rows="10" onChange={this.handleChange} value={this.state.NewTweet}></textarea>
          <button type='button' onClick={this.handleSubmit}>Submit</button>
        </form>
        <div className="tweets">
          <div className="title_Tweets">Tweets</div>
          <div className="filter">
            <button type='button' className="following_tweets" onClick={this.handleTweets}>Following Tweets</button>
            <form onSubmit={this.formSubmitExactDate} className="exact_date">
              <div className="title_exact_date">All Tweets from : </div>
              <input type="date" className="date_value" name="date_value"/>
              <button type='submit'>Confirm</button>
            </form>
            <form onSubmit={this.formSubmitRangeDate} className="range_date">
              <div className="title_range_date">All Tweets less than : </div>
              <div>
                <input type="radio" value="Hour" name="input_range_date" /> 1 Hour
                <input type="radio" value="Day" name="input_range_date" /> 1 Day
                <input type="radio" value="Week" name="input_range_date" /> 1 Week
                <input type="radio" value="Month" name="input_range_date" /> 1 Month
                <input type="radio" value="All" name="input_range_date" /> All
              </div>
              <button type='submit' className="range_button_submit">Confirm</button>
            </form>
          </div>
          
          {this.state.listTweets.map(e => (<Tweet data={e}/>))}
        </div>
      </div>
    )
  }
}

export default HomePage;