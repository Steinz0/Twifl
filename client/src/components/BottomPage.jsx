import React from 'react'
import { Link } from 'react-router-dom'
import '../css/BottomPage.css'

class BottomPage extends React.Component {
  render() {
    return (
      <div className="container-bottom">
        <div className="elements-bottom">
          <Link push to='/home/contact-us' className="contact-us">Contact Us</Link>
          <Link push to='/home/terms' className="terms">Terms</Link>
        </div>
      </div>
    )
  }
}

export default BottomPage;