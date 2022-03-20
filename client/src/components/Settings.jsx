import React from 'react'
import axios from 'axios'
import '../css/Settings.css'

class Settings extends React.Component {
  
  constructor(props){
    super(props)
    this.state = {
      lastname: '',
      firstname: '',
      password: '',
      pwContainsNumbers: false,
      pwContainsUppercases: false,
      pwContainsSymbols: false,
      pwMoreThan10: false
    }
  }
  
  handleChange = (event) => {
    this.setState({[event.currentTarget.name]: event.currentTarget.value})
  }

  setLastname = (event) => {
    event.preventDefault()
    if (this.state.lastname !== ''){
      const data = {
        lastname: this.state.lastname
      }
      axios.post("http://localhost:4000/api/user/setLastname", data)
      .then(res => {
        console.log(res)
        this.setState({
          lastname: ''
        })
      })
      .catch(err => {
        console.log(err)
      })
    }
  }

  setFirstname = (event) => {
    event.preventDefault()
    if (this.state.firstname !== ''){
      console.log('nothing')
      const data = {
        firstname: this.state.firstname
      }
      axios.post("http://localhost:4000/api/user/setFirstname", data)
      .then(res => {
        console.log(res)
        this.setState({
          firstname: ''
        })
      })
      .catch(err => {
        console.log(err)
      })
    }
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

  setPassword = (event) => {
    event.preventDefault()
    if (this.state.password !== ''){
      console.log('nothing')
      const data = {
        password: this.state.password
      }
      axios.post("http://localhost:4000/api/user/setPW", data)
      .then(res => {
        console.log(res)
        this.setState({
          password: ''
        })
      })
      .catch(err => {
        alert('Password not strong !')
        console.log(err)
      })
    }
  }


  render() {
    let {
      pwContainsNumbers,
      pwContainsUppercases,
      pwContainsSymbols,
      pwMoreThan10
    } = this.state
    let button = pwContainsNumbers && pwContainsUppercases
                 && pwContainsSymbols && pwMoreThan10 ? false : true

    return (
      <div className="container-settings">
        <form onSubmit={this.setLastname} className="change-lastname">
          <label htmlFor='lastname'>Change Lastname</label>
          <input value={this.state.lastname} type='text' onChange={this.handleChange} name="lastname" placeholder='Enter new lastname'/>  
          <button type='submit'>Confirm</button>
        </form>
        <form onSubmit={this.setFirstname}  className="change-firstname">
          <label htmlFor='firstname'>Change Firstname</label>
          <input value={this.state.firstname} type='text' onChange={this.handleChange} name="firstname" placeholder='Enter new firstname'/>  
          <button type='submit'>Confirm</button>
        </form>

        <div className='required-pw-setting'>
            <div className="column-left-setting">
              <li className={pwContainsNumbers ? 'green-settings' : 'red-settings'}>Contains Numbers</li>
              <li className={pwContainsUppercases ? 'green-settings' : 'red-settings'}>Contains Uppercases</li>
            </div>
            <div className="column-right-setting">
              <li className={pwContainsSymbols ? 'green-settings' : 'red-settings'}>Contains Symbols</li>
              <li className={pwMoreThan10 ? 'green-settings' : 'red-settings'}>More than 10 characters</li>
            </div>
        </div>

        <form onSubmit={this.setPassword} className="change-password">
          <label htmlFor='password'>Change Password</label>
          <input value={this.state.password} type='password' onChange={this.handlePasswordChange('password')} name="password" placeholder='Enter new password'/>  
          <button type='submit' className={button ? 'desactivate' : 'activate'} disabled={button}>Confirm</button>
        </form>

        
      </div>
    )
  }
}

export default Settings;