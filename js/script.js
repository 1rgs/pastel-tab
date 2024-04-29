var col;
var hex;
var clip;
var auto;
var speed;
var looping = false;
var lightness = "95%";

document.addEventListener('DOMContentLoaded', function() {

  //setup copy
  clip = new Clipboard('#text');

  changeColor();

  //default values
  auto = false;
  speed = 3;

  //setup stored variables
  chrome.storage.sync.get('auto', function(data) {
    auto = data.auto || auto;
    updateButtons();
  });

  chrome.storage.sync.get('speed', function(data) {
    speed = data.speed || speed;
    updateButtons();
  })

  document.querySelector('#gen').addEventListener('click', function(e) {
    e.preventDefault();
    if (!auto) {
      if (!looping) {
        changeColor(); //if it's on manual, just change
      }
    } else {
      if (speed == 5) { //max speed value
        speed = 0;
      }
      speed++;
      setSpeedBars();
      setValues();
    }
  });

  document.querySelector('#tog').addEventListener('click', function(e) {
    e.preventDefault();
    auto = !auto; //invert auto
    setValues(); //save values to Chrome
    updateButtons();
  });

  clip.on('success', function(e) { //on finish copy
    document.querySelector('#text').classList.add('copied');
  });

  document.querySelector('#clock-tog').addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector('#clock').classList.toggle('hide');
  });

  clock();
});

function clock() {
  document.querySelector('#clock').innerHTML = moment().format('h:mm A');
  setTimeout(function() { clock(); }, 500);
}

function updateButtons() {
  if (!auto) {
    document.querySelector('#auto-check').innerHTML = '';
    document.querySelector('#gen').innerHTML = 'generate';
  } else {
    document.querySelector('#auto-check').innerHTML = 'check';

    setSpeedBars();

    //start loop
    if (!looping) {
      looping = true;
      changeColor();
    }
  }
}

function setSpeedBars() {
  var sbars = "|";
  sbars = sbars.repeat(speed);
  document.querySelector('#gen').innerHTML = 'speed: ' + sbars;
}

function setValues() {
  chrome.storage.sync.set({'auto': auto });
  chrome.storage.sync.set({'speed': speed });
}

function changeColor() {
  col = parseInt(Math.random() * 360); //randomize color

  document.body.style.backgroundColor = 'hsl(' + col + ', 100%, ' + lightness + ')'; //set color

  hex = '#' + tinycolor('hsl(' + col + ', 100%, ' + lightness + ')').toHex(); //translate to hex
  document.querySelector('#text').innerHTML = hex; //set text
  document.querySelector('#text').classList.remove('copied'); //clear ' - copied'

  //auto-generate colors is option is enabled
  if (auto) {
    setTimeout(function() {

      if (auto) {
        changeColor();
      } else {
        looping = false;
      }

    }, (6 - speed)*1000);
  } else {
    looping = false;
  }
}
