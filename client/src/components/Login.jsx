import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { Redirect } from 'react-router'

import '../css/Login.css'

class Login extends React.Component {
  
  constructor(props) {
    super(props)
    this.state = {
      login: '',
      password: '',
      redirect: false
    }
  }
  
  handleChange = (event) => {
    this.setState({[event.currentTarget.name]: event.currentTarget.value})
  }

  handleSubmit = event => {
    event.preventDefault()
    const data = {
      login: event.target.login.value,
      password: event.target.password.value
    }
    axios.post('http://localhost:4000/api/user/login', data)
    .then(res => {
      this.props.connect(this.state.login)
      this.setState({redirect: true})
    })  
    .catch((err) => {
      alert('Wrong login and/or password Retry !')
      console.log(err)
    })
  }

  render() {
    if (this.state.redirect) {
      return <Redirect push to="/home" />;
    }
    return (
      <div className="container-login">
        <div className='header'>Twouitter</div>
        <div className="line"></div>
        <form onSubmit={this.handleSubmit} className='login-form'>
            <div className="elements">
              <label htmlFor='login'>Login</label>
              <input type='text' onChange={this.handleChange} name="login" placeholder='Enter your login'/>  
            </div>
            <div className="elements">
              <label htmlFor='password'>Password</label>
              <input type='password' onChange={this.handleChange} name="password" placeholder='Enter your password'/>  
            </div>
            <button type='submit'>Sign In</button>
        </form>
        <div className="line2"></div>
        <div className='signup'>
          <p>Don't have an account ?</p>
          <Link className='link-signup' to='/register'>
            <button className='button-signup'>Sign Up</button>
          </Link>
        </div>
      </div>
    )
  }
}

export default Login;