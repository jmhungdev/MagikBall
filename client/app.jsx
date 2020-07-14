import React from 'react';
import ReactDOM from 'react-dom';
import { config } from './config.js';
import axios from 'axios';
import jQuery from 'jquery';


let JBL = '412b04de8fb77142e9f8c0aca13bce52c27190df4dde8e61a435926a0e979294';
let internal = '050b44811f066c63dea312871594b7472738c35fed7f8559c06c126f887b47e5';

let myPreferredCameraDeviceId  =  internal;
let vizbool = true;
let audiobool = true;
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentSong: '',
            value: 'Mariah Carey',
            playlist:[],
            loadingmusic:[],
            searchResult: [],
            searchState: true
        }
        this.submitQuery = this.submitQuery.bind(this);
        this.BLT = this.BLT.bind(this);
        this.toggleViz = this.toggleViz.bind(this);
        this.toggleAudio = this.toggleAudio.bind(this);
        this.fetchMusic = this.fetchMusic.bind(this);
        this.pushSong = this.pushSong.bind(this);
    }

    componentDidMount() {

       axios.get('/playlist').then((res)=>{
        if(res.data.length!==0){
            let newPlaylist = this.state.playlist.slice(0);
            newPlaylist= newPlaylist.concat(res.data);
            this.setState({playlist:newPlaylist});}}
       )
    }

    

    submitQuery(e) {
        e.preventDefault();
        axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${this.state.value}&type=video&key=${config.API_KEY}`)
            .then(response => { 
                console.log(response); 
                let result = []; 
                response.data.items.map(el => {
                    let name = jQuery.parseHTML(el.snippet.title)[0].data;
                    let id = el.id.videoId;          
                    let obj = {name, id};
                    result.push(obj);})
                return result;})
            .then(result => { console.log(result); this.setState({ searchResult: result }) })
    //id of the video: response.data.items[0].id.videoId;
    //title of the video: response.data.items[0].snippet.title
    }

    BLT(e){
        e.preventDefault();
        // navigator.bluetooth.requestDevice({filters:[{name:'PLAYBULB sphere'}], optionalServices:["0000ff0f-0000-1000-8000-00805f9b34fb"]})
        // .then(device => {console.log(device); return device.gatt.connect()})
        // .then(server=> {console.log(server); return server.getPrimaryService('0000ff0f-0000-1000-8000-00805f9b34fb')})
        // .then(service=> service.getCharacteristic('0000fffc-0000-1000-8000-00805f9b34fb'))
        // .then(char=> { window.BLT= char; let data = new Uint8Array([ 0xff, 0x00, 0x00, 0x00]); return char.writeValue(data)})
        // .then((c)=>document.getElementById('vizplayer').src = document.getElementById('vizplayer').src)
        // .catch(function(error) {console.error('Connection failed!', error);})
       
    }

    fetchMusic(name,id){
        let newloadingmusic = this.state.loadingmusic.slice(0);
        newloadingmusic.push(name);
        this.setState({loadingmusic:newloadingmusic}, ()=>{
            axios.get(`music/${encodeURIComponent(name)}/${id}`).then(res => {
                console.log(res.data)
                if(res.data.length!==0){
                    let newPlaylist = this.state.playlist.slice(0);
                    newPlaylist= res.data;
                    this.setState({playlist:newPlaylist});
                    let doneloadingmusic = this.state.loadingmusic.filter(el=>el!==name)
                    this.setState({loadingmusic: doneloadingmusic})
            }})
        })
    }

    toggleViz(){
        
        let el = document.getElementById("viz");
        if(vizbool){
        el.classList.add("scale-out")
        } else {
        el.classList.remove("scale-out")   
        }
        document.getElementById('viz').src = document.getElementById('viz').src
        // el[0].className += 'scale-out';
        // console.log(el)
        vizbool=!vizbool;
    }
    toggleAudio(e){
        e.preventDefault();
        // navigator.mediaDevices.getUserMedia({audio:{ deviceId: myPreferredCameraDeviceId } })
        // let media = document.getElementById('vizplayer');
        // .setSinkId(myPreferredCameraDeviceId);
    }

    pushSong(string){
        console.log(string);
        let song = `/music/${string}`;
        this.setState({currentSong:song});
       
    }

    render() {

        return (
            <>
                <nav className="black">
                    <div className="nav-wrapper container">
                            <a href="#!" className="left brand-logo hide-on-large-only">DJPOTATO</a>
                            <a href="#!" className="brand-logo hide-on-med-and-down left">DJ POTATO MUSIC STATION</a>
                            
                            <ul id="nav-mobile" className="right">
                                <li><a href="#!" onClick={this.toggleViz}><i className="small material-icons">blur_on</i></a></li>
                                <li><a href="#!" onClick={this.toggleAudio}><i className="medium material-icons">speaker</i></a></li>
                                {/* <li><a href="#!" onClick={this.BLT}><i className="medium material-icons">bluetooth</i></a></li> */}
                            </ul>
                        </div>
                </nav>


                <div className="row" style={{ margin: '10px', height: '500px' }}>
                    
                    <div id="search" className="col s4" style={{border :"solid 1px grey", height:'100vh'}}>
                                <div className="input-field col s12">
                                    <i className="material-icons prefix">music_note</i>
                                    <input type="text" className="validate" style={{ color: "grey" }} onChange={(e) => { e.preventDefault(); this.setState({ value: e.target.value }) }} onKeyDown={(e) => {if(e.keyCode === 13){ this.submitQuery(e) } }} />
                                    <label htmlFor="icon_prefix">Search for a song...</label>
                                </div>
                            <div className="col s12 center">
                            <p>SEARCH RESULT</p></div>
                           

                            {/* search result bar */}
                            
                                <div className="col s12" style={{ border: "solid 1px grey", minHeight:"200px" }}>
                                    {this.state.searchResult.map((el) => (<p className="truncate"><a href="#!" onClick={(e)=>{e.preventDefault();this.fetchMusic(el.name, el.id)}}>{el.name}</a></p>))}
                                </div>
                          

                            {/* loading the music text */}
                            <div  id="loadingmusic" className="col s12 center" style={{ marginTop: "20px"}}>
                                <p>LOADING THE MUSIC</p>
                            </div>
                            <div className="col s12"  >
                            {this.state.loadingmusic.map(el=>(
                            <div className="container">
                            <p>LOADING {`${el}`}</p>
                            <div className="progress">
                            <div className="indeterminate">
                            </div>
                            </div>
                            </div>))}
                            </div>

                            
                    </div>
                    <div id="playlist" className="col s3" style={{border:"solid 1px grey", height: "100vh"}}>
                        
                        <p>YOUR PLAYLIST</p>
                        {this.state.playlist.map(el=>(
                           <p className="truncate"><a href={`./music/${el}`}><i className="small material-icons">live_tv</i></a><a href="#!" onClick={(e)=>{e.preventDefault();this.pushSong(el)}}>{el}</a></p>
                        ))}
                        
                    </div>            

                    <div id="viz" className="col s5 scale-transition">
                        <iframe id="vizplayer" src={`./av/public/index.html?music=${this.state.currentSong}`} style={{width: "100%", height:"100vh"}}></iframe>
                    </div>

                </div>









                {/* <p>rendering react</p> */}
            </>)
    }
}

ReactDOM.render(<App />, document.getElementById('apps'))
