import React from 'react'
import axios from 'axios'
import { Link, Redirect } from 'react-router-dom'
import {CgProfile} from 'react-icons/cg'
import {IoSettingsOutline} from 'react-icons/io5'
import {BsSearch} from 'react-icons/bs'
import {RiLogoutBoxLine} from 'react-icons/ri'
import '../css/NavBar.css'

class NavBar extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			search: '',
			redirectSearchPage: false,
			redirectLogout: false,
		}
	}

	handleLogout = event => {
    event.preventDefault()
    axios.post('http://localhost:4000/api/user/logout')
    .then(res => {
			this.setState({
				redirectLogout: true
			})
    })
    .catch((err) => {
      console.log(err)
    })
  }

	handleProfil = event => {
    event.preventDefault()
  }
	
	handleSearch = (event) => {
		this.setState({
			[event.currentTarget.name]: event.currentTarget.value
		})
	}

	handleSubmitSearch = () => {
		this.setState({
			redirectSearchPage: true
		})
	}

	render() {
		if (this.state.redirectSearchPage){
			 return <Redirect to={{
				pathname: "/home/research",
				search: this.state.search,
			}} />;
		}
		if (this.state.redirectLogout){
			return <Redirect to='/'/>;
	 }
		return (
		<div className='container-nav'>
			<Link className='header-nav' to='/home'>
				TwyFl
			</Link>
			<div className="search">
				<input type="text" name='search' onChange={this.handleSearch}/>
				<button onClick={this.handleSubmitSearch}><BsSearch/></button>
			</div>
			<div className="menu-nav">
				<Link className='link-profil' to='/home/myprofil'>
					<CgProfile size='1.5em'/>
				</Link>
				<Link className='link-settings' to='/home/settings'>
					<IoSettingsOutline size='1.5em'/>
				</Link>
			</div>
			<Link className='link-logout' to='/login'>
				<button className="logout-nav" onClick={this.handleLogout}><RiLogoutBoxLine size='2em'/></button>
			</Link>
		</div>
		)	
	}
}

export default NavBar;