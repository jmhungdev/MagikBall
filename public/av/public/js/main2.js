var pieces, radius, fft, mapMouseX, mapMouseY, audio, toggleBtn, uploadBtn, uploadedAudio, uploadAnim;
var colorPalette = ["#0f0639", "#ff006a", "#ff4f00", "#00f9d9"];
var uploadLoading = false;


var musica = window.song || "audio/DEMO_2.mp3";
console.log(window.song, 'window song from index2 main')

function connectBLT(){navigator.bluetooth.requestDevice({filters:[{name:'PLAYBULB sphere'}], optionalServices:["0000ff0f-0000-1000-8000-00805f9b34fb"]})
.then(device => {console.log(device); return device.gatt.connect()})
.then(server=> {console.log(server); return server.getPrimaryService('0000ff0f-0000-1000-8000-00805f9b34fb')})
.then(service=> service.getCharacteristic('0000fffc-0000-1000-8000-00805f9b34fb'))
.then(char=> { window.BLT= char; let data = new Uint8Array([ 0xff, 0x00, 0x00, 0x00]); return char.writeValue(data)})
.catch(function(error) {console.error('Connection failed!', error);});}

function vizToggle(value1,value2,value3){
	// console.log(value);
	// console.log(maxM);
	// console.log(mid);
	window.BLT.writeValue(new Uint8Array([0, value1, value2, value3]))
	
}

function preload() {
    audio = loadSound(musica);
}

function uploaded(file) {
    uploadLoading = true;
    uploadedAudio = loadSound(file.data, uploadedAudioPlay);
}

function uploadedAudioPlay(audioFile) {

    uploadLoading = false;

    if (audio.isPlaying()) {
        audio.pause();
    }

    audio = audioFile;
    audio.loop();
}

function setup() {

    uploadAnim = select('#uploading-animation');

    createCanvas(windowWidth, windowHeight);

    toggleBtn = createButton("Play / Pause");

    uploadBtn = createFileInput(uploaded);

    // uploadBtn.addClass("upload-btn");

    toggleBtn.addClass("toggle-btn");
    
    toggleBtn.mousePressed(toggleAudio);

    toggleBtnBLT = createButton("LIGHT BULB");
	toggleBtnBLT.addClass("upload-btn");
	toggleBtnBLT.mousePressed(connectBLT);

    fft = new p5.FFT();
    audio.loop();

    pieces = 4;
    radius = windowHeight / 4;

}

function draw() {

    // Add a loading animation for the uploaded track
    if (uploadLoading) {
        uploadAnim.addClass('is-visible');
    } else {
        uploadAnim.removeClass('is-visible');
    }

    background(colorPalette[0]);

    fft.analyze();
    var bass = fft.getEnergy("bass");
    var treble = fft.getEnergy(100, 150);
    var mid = fft.getEnergy("mid");

    var mapbass = map(bass, 0, 255, -100, 800);
    var scalebass = map(bass, 0, 255, 0.5, 1.2);

    var mapMid = map(mid, 0, 255, -radius / 4, radius * 4);
    var scaleMid = map(mid, 0, 255, 1, 1.5);

    var mapTreble = map(treble, 0, 255, -radius / 4, radius * 4);
    var scaleTreble = map(treble, 0, 255, 1, 1.5);

    
    mapMouseX = map(mouseX, 0, width, 2, 0.1);
    mapMouseY = map(mouseY, 0, height, windowHeight / 8, windowHeight / 6);

    pieces = mapMouseX;
    radius = mapMouseY;

    var mapScaleX = map(mouseX, 0, width, 1, 0);
    var mapScaleY = map(mouseY, 0, height, 0, 1);

   
///FOR THE LIGHT///
	var lightMid = map(mid, 150, 190, 0, 255);
	var lightTreble = map(treble, 100, 200, 0, 255);
	var lightbass = map(bass, 150, 190, 0, 255);

	if(window.BLT){
		if(lightMid<0){
			lightMid=0;
		} else if(lightMid>255){
			lightMid=255;
		}

		if(lightbass<0){
			lightbass=0;
		} else if(lightbass>255){
			lightbass=255;
		}

		if(lightTreble<0){
			lightTreble=0;
		} else if(lightTreble>255){
			lightTreble=255;
		}
		// console.log(lightMid);
		vizToggle(lightMid,lightTreble, lightbass);
	}
	////

    translate(width / 2, height / 2);

    for (i = 0; i < pieces; i += 0.01) {

        rotate(TWO_PI / pieces);

        /*----------  BASS  ----------*/
        push();
        strokeWeight(1);
        stroke(colorPalette[1]);
        scale(scalebass);
        rotate(frameCount * -0.5);
        line(mapbass, radius / 2, radius, radius);
        line(-mapbass, -radius / 2, radius, radius);
        pop();


        /*----------  MID  ----------*/
        push();
        strokeWeight(1);
        stroke(colorPalette[2]);
        line(mapMid, radius, radius * 2, radius * 2);
        pop();


        /*----------  TREMBLE  ----------*/
        push();
        stroke(colorPalette[3]);
        scale(scaleTreble);
        line(mapTreble, radius / 2, radius, radius);
        pop();

    }

}

function toggleAudio() {
    if (audio.isPlaying()) {
        audio.pause();
    } else {
        audio.play();
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}