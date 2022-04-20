var canvas = document.getElementById('canvas'),
  context = canvas.getContext('2d'),
  canvasWidth = (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth),
  canvasHeight = (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight),
  requestAnimationFrame = window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.msRequestAnimationFrame;
var persons = [],
  numberOfFirefly = 30,
  birthToGive = 25;

var colors = [];
/* Galactic Tea - http://www.colourlovers.com/palette/1586746/Galactic_Tea*/
colors[2] = [];
colors[2]['background'] = '#2F294F';
colors[2][1] = 'rgba(74,49,89,';
colors[2][2] = 'rgba(130,91,109,';
colors[2][3] = 'rgba(185,136,131,';
colors[2][4] = 'rgba(249,241,204,';

var colorTheme = 2, //getRandomInt(0,colors.length-1);
  mainSpeed = 1;

function getRandomInt(min, max, exept) {
  var i = Math.floor(Math.random() * (max - min + 1)) + min;
  if (typeof exept == "undefined") return i;
  else if (typeof exept == 'number' && i == exept) return getRandomInt(min, max, exept);
  else if (typeof exept == "object" && (i >= exept[0] && i <= exept[1])) return getRandomInt(min, max, exept);
  else return i;
}

function isEven(n) {
  return n == parseFloat(n) ? !(n % 2) : void 0;
}

function degToRad(deg) {
  return deg * (Math.PI / 180);
}

function Firefly(id) {
  this.id = id;
  this.width = getRandomInt(3, 6);
  this.height = this.width;
  this.x = getRandomInt(0, (canvas.width - this.width));
  this.y = getRandomInt(0, (canvas.height - this.height));
  this.speed = (this.width <= 10) ? 2 : 1;
  this.alpha = 1;
  this.alphaReduction = getRandomInt(1, 3) / 1000;
  this.color = colors[colorTheme][getRandomInt(1, colors[colorTheme].length - 1)];
  this.direction = getRandomInt(0, 360);
  this.turner = getRandomInt(0, 1) == 0 ? -1 : 1;
  this.turnerAmp = getRandomInt(1, 2);
  this.isHit = false;
  this.stepCounter = 0;
  this.changeDirectionFrequency = getRandomInt(1, 200);
  this.shape = 2; //getRandomInt(2,3);
  this.shadowBlur = getRandomInt(5, 25);
}

Firefly.prototype.stop = function() {
  this.update();
}

Firefly.prototype.walk = function() {
  var next_x = this.x + Math.cos(degToRad(this.direction)) * this.speed,
    next_y = this.y + Math.sin(degToRad(this.direction)) * this.speed;

  // Canvas limits
  if (next_x >= (canvas.width - this.width) && (this.direction < 90 || this.direction > 270)) {
    next_x = canvas.width - this.width;
    this.direction = getRandomInt(90, 270, this.direction);
  }
  if (next_x <= 0 && (this.direction > 90 && this.direction < 270)) {
    next_x = 0;
    var exept = [90, 270];
    this.direction = getRandomInt(0, 360, exept);
  }
  if (next_y >= (canvas.height - this.height) && (this.direction > 0 && this.direction < 180)) {
    next_y = canvas.height - this.height;
    this.direction = getRandomInt(180, 360, this.direction);
  }
  if (next_y <= 0 && (this.direction > 180 && this.direction < 360)) {
    next_y = 0;
    this.direction = getRandomInt(0, 180, this.direction);
  }

  this.x = next_x;
  this.y = next_y;

  this.stepCounter++;

  if (this.changeDirectionFrequency && this.stepCounter == this.changeDirectionFrequency) {
    this.turner = this.turner == -1 ? 1 : -1;
    this.turnerAmp = getRandomInt(1, 2);
    this.stepCounter = 0;
    this.changeDirectionFrequency = getRandomInt(1, 200);
  }

  this.direction += this.turner * this.turnerAmp;

  this.update();
}

Firefly.prototype.takeOppositeDirection = function() {
  // Right -> Left
  if ((this.direction >= 0 && this.direction < 90) || (this.direction > 270 && this.direction <= 360)) {
    this.direction = getRandomInt(90, 270);
    return;
  }
  // Left -> Right
  if (this.direction > 90 && this.direction < 270) {
    var exept = [90, 270];
    this.direction = getRandomInt(0, 360, exept);
    return;
  }
  // Down -> Up
  if (this.direction > 0 && this.direction < 180) {
    this.direction = getRandomInt(180, 360);
    return;
  }
  // Up -> Down
  if (this.direction > 180) {
    this.direction = getRandomInt(0, 180);
  }
}

Firefly.prototype.update = function() {

  context.beginPath();

  context.fillStyle = this.color + this.alpha + ")";
  context.arc(this.x + (this.width / 2), this.y + (this.height / 2), this.width / 2, 0, 2 * Math.PI, false);
  context.shadowColor = this.color + this.alpha + ")";
  context.shadowBlur = this.shadowBlur;
  context.shadowOffsetX = 0;
  context.shadowOffsetY = 0;
  context.fill();

  if (this.id > 15) {
    this.alpha -= this.alphaReduction;
    if (this.alpha <= 0) this.die();
  }

}

Firefly.prototype.die = function() {
  persons[this.id] = null;
  delete persons[this.id];
}

window.onload = function() {
  canvas.setAttribute('width', canvasWidth);
  canvas.setAttribute('height', canvasHeight);

  start();
}

function start() {
  instantiatePopulation();
  animate();
}

function instantiatePopulation() {
  var i = 0;
  while (i < numberOfFirefly) {
    persons[i] = new Firefly(i);
    i++;
  }
}

function animate() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  context.beginPath();

  // Création d'une copie de l'array persons
  persons_order = persons.slice(0);
  // Tri par ordre de position sur l'axe y (afin de gérer les z-index)
  persons_order.sort(function(a, b) {
    return a.y - b.y
  });

  // Paint les instances dans l'ordre trié
  for (var i in persons_order) {
    var u = persons_order[i].id;
    persons[u].walk();
  }

  requestAnimationFrame(animate);
}

canvas.onclick = function(e) {
  giveBirth(e, birthToGive);
}

function giveBirth(e, u) {
  var i = persons.length;
  persons[i] = new Firefly(i);
  persons[i].x = e.layerX;
  persons[i].y = e.layerY;

  if (u > 1) giveBirth(e, u - 1);
}




//forma

/**
* Switch out the php url for your own. Very simplified example PHP found at the bottom of this script
*/
var phpURL = "YOUR PHP URL GOES HERE";

$(".contact-icon").on("click", toggleContactForm);
$(".cross").on("click", closeForm);

//Show/Hide
function toggleContactForm(){
	var form = $(".contact-form");
	var bottom = $(form).css("bottom");

	if(bottom == "0px"){
		$(form).css("bottom", "-400px");
	}
	else{
		$(form).css("bottom", "0px");
	}
}

function closeForm(){
		$(".contact-form").css("bottom", "-400px");
}

//Resize
$(window).on('resize', onResize);
onResize();

function onResize(){
	var buttonPos = $(".submit")[0].getBoundingClientRect();
	console.log("POS:", buttonPos);

	var width = ($(window).width() - buttonPos.right) - 26;

	$(".horline").css("left", buttonPos.right);
	$(".horline").css("width", width);

	$(".vertline").css("left", buttonPos.right + width);
}


//Focus
$("input[type=text]").focus(onFocus);
$("input[type=email]").focus(onFocus);
$("textarea").focus(onFocus);

$("input[type=text]").focusout(onFocusOut);
$("input[type=email]").focusout(onFocusOut);
$("textarea").focusout(onFocusOut);

function onFocus(){
		$(this).parent().find("label").addClass("active");
}

function onFocusOut(){
	if($(this).val() === "")
		$(this).parent().find("label").removeClass("active");
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function validateForm(){

		var email = $("input[type=email]").val();
		var validEmail = validateEmail(email);
		var validName = $("input[type=text]").val() ? true : false;
		var validMsg = $("textarea").val() ? true : false;

		var nameError = $("input[type=text]").parent().find(".error-mark");
		var emailError = $("input[type=email]").parent().find(".error-mark");
		var msgError = $("textarea").parent().find(".error-mark");

		TweenLite.to(nameError, 0.5, {opacity: validName ? 0 : 1});
		TweenLite.to(emailError, 0.5, {opacity: validEmail ? 0 : 1});
		TweenLite.to(msgError, 0.5, {opacity: validMsg ? 0 : 1});

	return (validEmail && validName && validMsg);
}

function sentAnimation(message, color) {

		flashButton(color);
		var sentElement = $(".result-message");
		$(sentElement).text(message);
		var sentTween = new TimelineLite();
		sentTween.fromTo(sentElement, 0.6, {x:0},{ x:100});
		sentTween.to(sentElement, 0.6, {x:200, delay:1});

		var envelopeElement = $(".submit-icon");
		var envelopeTween = new TimelineLite();
		envelopeTween.fromTo(envelopeElement, 0.6, {x:0}, {x:100});
		envelopeTween.fromTo(envelopeElement, 0.6, {x:-100}, {x:0, delay:1});

}

function flashButton(color){
	var originalColor = $(".submit").css("background-color");

	setTimeout(function(){
		$(".submit").css("background-color", color);
	},300);

	setTimeout(function(){
		$(".submit").css("background-color", originalColor);
	},1000);

}

function clearForm(){
	$("input[type=email]").val("");
	$("input[type=text]").val("");
	$("textarea").val("");

	$("input[type=text]").focusout();
	$("input[type=email]").focusout();
	$("textarea").focusout();
}

$(function() {
  $('#contact').submit(function(event) {
    event.preventDefault();

		if(validateForm()){
			sentAnimation("Sent", "green");

			//post form
			var formEl = $(this);
			console.log(formEl.serialize());
			var submitButton = $('input[type=submit]', formEl);

			$.ajax({
				type: 'POST',
				url: phpURL,
				accept: {
					javascript: 'application/javascript'
				},
				data: formEl.serialize(),
				beforeSend: function() {
					submitButton.prop('disabled', 'disabled');
				}
			}).done(function(data) {
				submitButton.prop('disabled', false);
			});

			clearForm();

		}
		else{
			sentAnimation("Error", "red");
		}
  });
});


/** Drop this PHP script on the server

 <?php
	$email_to = "[YOUR EMAIL GOES HERE]";
	$email_subject = "[YOUR SUBJECT GOES HERE]";
	$name = $_POST['name'];
	$email_from = $_POST['email'];
	$msg = $_POST['msg'];
	$email_msg = "
		Form Details

		Name:$name
		Email:$email_from
		Message:

		$msg
	";
	$headers = 'From: '.$email_from."\r\n".
 	'Reply-To: '.$email_from."\r\n" .
 	'X-Mailer: PHP/' . phpversion();

	($email_to, $email_subject, $email_msg, $headers);
?>

**/
// bubbly button


var animateButton = function(e) {

  e.preventDefault;
  //reset animation
  e.target.classList.remove('animate');

  e.target.classList.add('animate');
  setTimeout(function(){
    e.target.classList.remove('animate');
  },700);
};

var bubblyButtons = document.getElementsByClassName("bubbly-button");

for (var i = 0; i < bubblyButtons.length; i++) {
  bubblyButtons[i].addEventListener('click', animateButton, false);
}
