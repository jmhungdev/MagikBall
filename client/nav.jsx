


const Nav = (props) => (
  <nav className="black">
    <div className="nav-wrapper container">
      <a href="#!" className="left brand-logo hide-on-large-only">DJPOTATO</a>
      <a href="#!" className="brand-logo hide-on-med-and-down left">DJ POTATO MUSIC STATION</a>
      
      <ul id="nav-mobile" className="right">
          <li><a href="#!" onClick={props.toggleViz}><i className="small material-icons">blur_on</i></a></li>
          <li><a href="#!" onClick={props.toggleAudio}><i className="medium material-icons">speaker</i></a></li>
          {/* <li><a href="#!" onClick={this.BLT}><i className="medium material-icons">bluetooth</i></a></li> */}
      </ul>
    </div>
  </nav>
)


export default Nav;