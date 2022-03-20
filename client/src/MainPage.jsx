import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom'
import Login from './components/Login'
import NavBar from './components/NavBar';
import Register from './components/Register'
import BottomPage from './components/BottomPage'
import HomePage from './components/HomePage';
import TweetPage from './components/TweetPage';
import Profil from './components/Profil';
import SearchPage from './components/SearchPage';
import Settings from './components/Settings';
import Contact from './components/Contact';
import Terms from './components/Terms';

class MainPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isConnected: false,
      login: ''
    }
  }

  isConnected = async (value) => {
    await this.setState({
      isConnected: true,
      login: value
    });
  }

  render() {
    return <div>
      <Router forceRefresh={true}>
        <Route path='/home' component={NavBar}></Route>
        <Route path='/' component={BottomPage}></Route>
        <Route exact path='/' render={(props) => <Login {...props} connect={this.isConnected}/>}></Route>
        <Route exact path='/register' render={(props) => <Register {...props} connect={this.isConnected}/>}></Route>
        <Route exact path='/home' component={HomePage}></Route>
        <Route exact path='/home/tweetpage' component={TweetPage}></Route>
        <Route exact path='/home/myprofil' render={(props) => <Profil {...props} mainuser={true} value={this.state.login}/>}></Route>
        <Route exact path='/home/profil' render={(props) => <Profil {...props} mainuser={false}/>}></Route>
        <Route exact path='/home/settings' component={Settings}></Route>
        <Route exact path='/home/research' component={SearchPage}></Route>
        <Route exact path='/home/contact-us' component={Contact}></Route>
        <Route exact path='/home/terms' component={Terms}></Route>
      </Router>
    </div>;
  }  
}

export default MainPage;