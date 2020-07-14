var pieces, radius, fft, analyzer, mapMouseX, mapMouseY, audio, toggleBtn, uploadBtn, uploadedAudio, uploadAnim;
var colorPalette = ["#02073c", "#5b0ff5", "#f50fac", "#f50fac"];
var uploadLoading = false;


var musica = window.song || "audio/DEMO_5.mp3";


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

	analyzer = new p5.Amplitude();
	fft = new p5.FFT();
	// audio.loop();

}



/*=============================================
  DRAW
=============================================*/
function draw() {

	// Add a loading animation for the uploaded track
	// -----------------------------------------------
	if (uploadLoading) {
		uploadAnim.addClass('is-visible');
	} else {
		uploadAnim.removeClass('is-visible');
	}

	background(colorPalette[0]);

	translate(windowWidth / 2, windowHeight / 2);

	level = analyzer.getLevel();
	fft.analyze();

	var bass = fft.getEnergy(100, 150);
	var treble = fft.getEnergy(150, 250);
	var mid = fft.getEnergy("mid");
 
	
	

	var mapMid = map(mid, 0, 255, -100, 200);
	var scaleMid = map(mid, 0, 255, 1, 1.5);

	var mapTreble = map(treble, 0, 255, 200, 350);
	var scaleTreble = map(treble, 0, 255, 0, 1);

	var mapbass = map(bass, 0, 255, 50, 200);
	var scalebass = map(bass, 0, 255, 0.05, 1.2);

	mapMouseX = map(mouseX, 0, width, 1, 50);
	mapMouseXbass = map(mouseX, 0, width, 1, 5);
	mapMouseY = map(mouseY, 0, height, 2, 6);



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

	pieces = 20;
	radius = 100;

	for (i = 0; i < pieces; i += 0.1) {

		rotate(TWO_PI / (pieces / 2));

		noFill();

		/*----------  BASS  ----------*/
		push();
		stroke(colorPalette[1]);
		rotate(frameCount * 0.002);
		strokeWeight(0.5);
		polygon(mapbass + i, mapbass - i, mapMouseXbass * i, 3);
		pop();


		/*----------  MID  ----------*/
		push();
		stroke(colorPalette[2]);
		strokeWeight(0.2);
		polygon(mapMid + i / 2, mapMid - i * 2, mapMouseX * i, 7);
		if(window.BLT){
			// console.log(bass);
			vizToggle();
		}
		pop();


		/*----------  TREMBLE  ----------*/
		push();
		stroke(colorPalette[3]);
		strokeWeight(0.6);
		scale(mouseX * 0.0005);
		rotate((mouseX * 0.002));
		polygon(mapTreble + i / 2, mapTreble - i / 2, mapMouseY * i / 2, 3);
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

function polygon(x, y, radius, npoints) {
	var angle = TWO_PI / npoints;
	beginShape();
	for (var a = 0; a < TWO_PI; a += angle) {
		var sx = x + cos(a) * radius;
		var sy = y + sin(a) * radius;
		vertex(sx, sy);
	}
	endShape(CLOSE);
}