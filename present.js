var presentArea = document.querySelector(".presentArea");

slideNum = 0;
presentContent = "";
presEnabled = false;

document.onkeyup = function(e) {
	if (presEnabled == false) {
		if (e.altKey && e.which == 80) {
			presEnabled = true;
			document.addEventListener('keydown', presCtrl);
		}
	}
}


function presCtrl(x) {
  var key = x.keycode ? x.keycode : x.which;
	if (key == 39 || key == 37) {
		presentArea.style.display = "flex";
	}
  switch (key) {
		case 39:
			if (slideNum > slides.length) {
				presentSwitch();
				break;
			}
			nextSlide();
			break;
		case 37:
			if (slideNum < 0) {
				presentSwitch();
				break;
			}
			nextSlide(true); 
  }
}

function presentSwitch() {
	if (presentArea.style.display == "none") {
		presentArea.style.display = "flex";
	} else 
		if (presentArea.style.display == "flex") {
			presentArea.style.display = "none";
			slideNum = 0;
		}
	
}

function nextSlide(reverse = false) {
	reverse ? slideNum-- : slideNum++;
	if (slideNum < 0) {
		presentSwitch();
	}
  presentContent = slides[slideNum] + "<br>";
  presentArea.innerHTML = presentContent;
  presentArea.scrollTop = presentArea.scrollHeight;
}

slides = [
"","<p>Quichua: Endangered language in S. America</p>",
"<p>Highly agglutinative with regular affixation</p>",
"<p>Media Lengua: Rare mixed language with 90% Spanish lexicon and Quichua morphology and syntax</p>",
"<p>Parser should work for both</p>",
"<p>Breaks down words and displays information about the constituent morphemes</p>",
"<p>Parsing approaches: top-down, bottom-up</p>",
"<p>Top-down: feed data, use machine learning to automatically recognize boundaries</p>",
"<p>Bottom-up: get lists of roots and affixes</p>",
"<p>1. Scanned dictionaries and imported wordlists</p>",
"<div><table><tr><td><img src=\"https://i.imgur.com/3oR4CJR.png\"></td><td><img src=\"https://i.imgur.com/yhFOE4o.png\"></td><td><img src=\"https://i.imgur.com/neV5jw2.png\"></td></tr><tr><td>Kinti-Moss (2018)</th><td>Muysken (1977)</td><td>Gualapuro et al. (2014)</td></tr><tr><td><img src=\"https://i.imgur.com/pw5Mptj.png\"></td><td><img src=\"https://i.imgur.com/vqojuza.png\"></td><td></td></tr><tr><td>Shimiyukkamu\n Diccionario (2008)</th><td>Cordero (2002)</td><td></td></tr></div>",
"<p>2. Used regular expression to extract lemmas</p>",
"<p><div><img src=\"https://i.imgur.com/GDyksch.png\"></div>",
"<p>3. Algorithm to find boundaries</p>",
"<div><img src=\"https://i.imgur.com/KrJ4sx5.png\"></div>",
"<p>Demo</p>"
];
