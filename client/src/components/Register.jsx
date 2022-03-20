import React from 'react'
import axios from 'axios'
import { Link, Redirect } from 'react-router-dom'
import '../css/Register.css'

class Register extends React.Component {

  constructor(props) {
    super(props)
    this.state  = {
      name: '',
      firstname: '',
      pseudo: '',
      email: '',
      password: '',
      repassword: '',
      pwContainsNumbers: false,
      pwContainsUppercases: false,
      pwContainsSymbols: false,
      pwMoreThan10: false,
      samePW: false,
      redirect: false
    }
  }

  handleSubmit = event => {
    event.preventDefault()
    const data = {
      lastname: event.target.name.value,
      firstname: event.target.firstname.value,
      email: event.target.email.value,
      login: event.target.pseudo.value,
      password: event.target.password.value
    }
    axios.put('http://localhost:4000/api/user/insertUser', data)
    .then(res => {
      this.setState({redirect: true})
    })  
    .catch((err) => {
      console.log(err)
    })
  }

  handleChange = (event) => {
    this.setState({[event.currentTarget.name]: event.currentTarget.value})
  }

  handlePasswordChange = input => e => {
    let string = e.target.value
    var matchesNumbers = string.match(/\d+/g)
    var matchesUppercases = string.match(/[A-Z]/)
    var matchesSymbols = (new RegExp(/[^A-Za-z0-9]/)).test(string)

    this.setState({
      password: string,
      pwContainsNumbers: matchesNumbers != null ? true : false,
      pwContainsUppercases: matchesUppercases != null ? true : false,
      pwContainsSymbols: matchesSymbols ? true : false,
      pwMoreThan10: string.length >= 10 ? true : false 
    })
  }

  handleSamePassword = (event) => {
    let pw = this.state.password
    this.setState({
      [event.currentTarget.name]: event.currentTarget.value,
      samePW: pw === event.currentTarget.value && pw !== '' ? true : false
    })

  }

  render() {
    if (this.state.redirect) {
      return <Redirect push to="/" />;
    }

    let {
      pwContainsNumbers,
      pwContainsUppercases,
      pwContainsSymbols,
      pwMoreThan10,
      samePW
    } = this.state
    let button = pwContainsNumbers && pwContainsUppercases
                 && pwContainsSymbols && pwMoreThan10 && samePW ? false : true

    return <div className="container-register">
      <div className='header'>Register</div>
      <div className="line"></div>
      <form onSubmit={this.handleSubmit} className='register-form'>
        <div className="elements-line1">
          <div className="elements">
            <label htmlFor='name'>Name</label>
            <input value={this.state.name} type='text' onChange={this.handleChange} name="name" placeholder='Enter your name'/>  
          </div>
          <div className="elements">
            <label htmlFor='firstname'>First Name</label>
            <input value={this.state.firstname} type='text' onChange={this.handleChange} name="firstname" placeholder='Enter your first name'/>  
          </div>
        </div>
        <div className="elements">
          <label htmlFor='pseudo'>Pseudo *</label>
          <input value={this.state.pseudo} type='text' onChange={this.handleChange} name="pseudo" placeholder='Enter your pseudo' required/>  
        </div>
        <div className="elements">
          <label htmlFor='email'>Email *</label>
          <input value={this.state.email} type='email' onChange={this.handleChange} name="email" placeholder='Enter your mail' required/>  
        </div>
        <div className='required-pw'>
            <div className="column-left">
              <li className={pwContainsNumbers ? 'green' : 'red'}>Contains Numbers</li>
              <li className={pwContainsUppercases ? 'green' : 'red'}>Contains Uppercases</li>
            </div>
            <div className="column-right">
              <li className={pwContainsSymbols ? 'green' : 'red'}>Contains Symbols</li>
              <li className={pwMoreThan10 ? 'green' : 'red'}>More than 10 characters</li>
            </div>
        </div>
        <div className="elements">
          <label htmlFor='password'>Password *</label>
          <input value={this.state.password} type='password' onChange={this.handlePasswordChange('password')} name="password" placeholder='Enter your secret password' required/>  
        </div>
        <div className="same-pw">
          <div className={samePW ? 'green' : 'red'}>Same password</div>
        </div>
        <div className="elements">
          <label htmlFor='password'>Re-Enter Password *</label>
          <input type='password' onChange={this.handleSamePassword} name="repassword" placeholder='Re-enter your secret' required/>  
        </div>
        <button className={button ? 'desactivate' : 'activate'} disabled={button}>Send</button>
      </form>
      <div className="line2"></div>
      <div className="login">
        <p>Already have an account ?</p>
        <Link className='link-signin' to='/'>
          <button type='submit'>Sign In</button>
        </Link>
      </div>
    </div>;
  }
}

export default Register;