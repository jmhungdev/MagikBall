var pieces, radius, fft, analyzer, mapMouseX, mapMouseY, audio, toggleBtn, uploadBtn, uploadedAudio, uploadAnim;
var colorPalette = ["#676767", "#232D22", "#C1C1C2", "#FFF903"];
var uploadLoading = false;

/*=============================================
	SETUP
=============================================*/


navigator.bluetooth.requestDevice({filters:[{name:'PLAYBULB sphere'}], optionalServices:["0000ff0f-0000-1000-8000-00805f9b34fb"]})
.then(device => {console.log(device); return device.gatt.connect()})
.then(server=> {console.log(server); return server.getPrimaryService('0000ff0f-0000-1000-8000-00805f9b34fb')})
.then(service=> service.getCharacteristic('0000fffc-0000-1000-8000-00805f9b34fb'))
.then(char=> { window.BLT= char; let data = new Uint8Array([ 0xff, 0x00, 0x00, 0x00]); return char.writeValue(data)})
.catch(function(error) {console.error('Connection failed!', error);});

function vizToggle(value1,value2,value3){
	// console.log(value);
	// console.log(maxM);
	// console.log(mid);
	window.BLT.writeValue(new Uint8Array([0, value1, value2, value3]))
	
}


function preload() {
    audio = loadSound("audio/DEMO_4.mp3");
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

    analyzer = new p5.Amplitude();
    fft = new p5.FFT();
    audio.loop();

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

    var bass = fft.getEnergy("bass");
    var treble = fft.getEnergy(2, 250);
    var mid = fft.getEnergy(1, 250);


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

    if (!audio.isPlaying()) {
        var mapBassX = map(mouseX, 0, width, 400, 1200);

        for (var b = 0; b < 70; b++) {

            push();
            noFill();
            stroke(colorPalette[1]);
            rotate(b);
            var mapScale = map(b, 0, 100, 0, 3);
            strokeWeight(1);
            bezier(mapBassX - b, 20, 10, 20, 100, 50, mouseY, mouseY);
            pop();

        }
    } else {

        /*----------  BASS  ----------*/
        var _mapBassX = map(mouseX, 0, width, 400, 1200);
        for (var b = 0; b < bass; b++) {
            var _mapScale = map(b, 0, bass, 0, 3);
            push();
            noFill();
            stroke(colorPalette[1]);
            rotate(b * frameCount);
            strokeWeight(_mapScale);
            bezier(_mapBassX - b, 20, 10, 20, 100, 50, mouseY, mouseY);
            pop();
        }


        /*----------  MID  ----------*/
        for (var m = 0; m < mid; m += 20) {

            var angle = m * 3 * random();
            strokeWeight(1);
            push();

            fill(random(100, 255), random(100, 255), random(100, 255), random(0, 255));
            fill(colorPalette[2]);
            rotate(angle * 5);
            scale(level / 2);

            if (audio.currentTime() > 5) {
                rect(mouseX + m * 10, mouseY + m * 50, m * 7, m * 7);
            }

            pop();

        }


        /*----------  TREMBLE  ----------*/
        for (var j = 5; j < treble; j += 20) {

            var angleT = j * 3 * random();
            strokeWeight(1);
            push();
            fill(colorPalette[3]);
            rotate(angleT * 5);
            scale(level / 4);

            if (audio.currentTime() > 7) {
                rect(mouseX * j + 10, mouseY * j, 200 * j, j * 5);
            }
            pop();

        }

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