'use strict';
var appnextAPP = (function(){	

	var q = parseURL(),
			app;

	var Viewport = function() {
		var vp;
		
		function addViewport () {
			vp         = document.createElement('meta');
			vp.name    = "viewport";
			vp.id      = "customViewportAppNext";
			vp.content = "width=device-width, initial-scale=1";
			document.getElementsByTagName('head')[0].appendChild(vp);
		}

		function removeViewport () {
			vp.parentNode.removeChild(vp);
		}

		return {
			add:    addViewport,
			remove: removeViewport,
		}
	}();


	function loadJSONP (url, callback, context) {
		var unique = 0;
		var name = "_jsonp_" + unique++;

		if (url.match(/\?/)) url += "&callback="+name;
		else url += "?callback="+name;

		// Create script
		var script  = document.createElement('script');
		script.type = 'text/javascript';
		script.src  = url;

		// Setup handler
		window[name] = function(data){
			callback.call((context || window), data);
			document.getElementsByTagName('head')[0].removeChild(script);
			script = null;
			delete window[name];
		};

		// Load JSON
		document.getElementsByTagName('head')[0].appendChild(script);
	}


	function success_jsonp (data) {
		Viewport.add();
		render(data.apps);
	}

	function parseURL (url) {
		var query = {};
		var scriptTag = qs('#videoAppScript');

		return query = {
			id:                scriptTag.getAttribute('data-id') || "",
			cnt:               scriptTag.getAttribute('data-count') || "20",
			cat:               scriptTag.getAttribute('data-category') || "",
			pbk:               scriptTag.getAttribute('data-postback') || "",
			bcolor:            scriptTag.getAttribute('data-buttonColor') || "",
			btext:             scriptTag.getAttribute('data-buttonText') || "Download",
			skipText:          scriptTag.getAttribute('data-skipText') || "Skip",
			showSkipTimeAfter: scriptTag.getAttribute('data-skipTimeAfter') || "1",
			countdown:         scriptTag.getAttribute('data-contdown') || "5",
		}
	};

	function getVideoApp (apps) {
		for (var i = 0; i < apps.length; i++) {
			if (apps[i].urlVideo) {
				return apps[i];
			};
		};
	}

	function vdoFakeClick (a) {
		if (document.createEvent) {
			var b = document.createElement("a");
			document.getElementsByTagName("body")[0].appendChild(b);
			b.addEventListener("click", function(b) {
				b.preventDefault();
				a()
			}, !1);
			var evt = document.createEvent("MouseEvents");
			evt.initMouseEvent && (evt.initMouseEvent("click", !0, !0, window, 0, 0, 0, 0, 0, !1, !1, !1, !1, 0, null), b.dispatchEvent(evt))
		} else a()
	};

	function randomNumber (min, max) {
		return Math.floor(Math.random() * (max - min) + min);
	}

	function numberWithCommas(x) {
	    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

	function starRating (starsHover, starsHoverImage, defaultStarsImage, starsRating) {
		starsHoverImage.style.width = defaultStarsImage.width + 'px';
		starsHover.style.width      = (starsRating/5)*100 + "%";
	};

	function render (apps) {
		app = getVideoApp(apps);
		// console.log(Object.prototype.toString.call(apps));
		var iframe = createIframe();
		iframe.onload = function() {
			var i           = this.contentWindow.document,
					iframe          = this,
					title           = qs('.title', i),
					description     = qs('.description', i),
					video           = qs('#video-player', i),
					sprite          = qs('.sprite-animation__video', i),
					image           = qs('.small-image > img', i),
					skipBlock       = qs('.skip-block', i),
					skipLink        = qs('.skip-link', i),
					downloadNumbers = qs('.rating-download-numbers', i),
					stars           = qs('.stars', i),
					appDOM          = qs('.app', i);

			if (title) {
				title.innerHTML = app.title;	
			};
			
			if (description) {
				description.innerHTML = app.desc;	
			};
			
			if (stars) {
				var starsHover        = qs('.stars__hover', i),
						starsHoverImage   = qs('.stars__hover img', i),
						defaultStarsImage = qs('.stars__default img', i),
						starsRating       = Math.round((Math.random() * (5 - 3.5) + 3.5)*2)/2;
	
					starRating(starsHover, starsHoverImage, defaultStarsImage, starsRating);
					window.addEventListener('resize', function(event){
				  starRating(starsHover, starsHoverImage, defaultStarsImage, starsRating);
				});
			};


			if (downloadNumbers) {
				downloadNumbers.innerHTML = randomNumber(10000, 2000000).toLocaleString();
			};

			if (sprite) {
				var frameHeight = qs('.sprite-animation__placeholder', i).height,
						frameStep    = 0,
						spriteHeight = sprite.height;
				
			var animateFun = setInterval(function() {
					console.log(frameStep);
					if (frameStep >= spriteHeight-frameHeight) {
						clearInterval(animateFun);
						return;
					};
					frameStep = frameStep + frameHeight;
					sprite.style.top = '-'+frameStep+'px';
				}, 60)
			};

			if (video) {
				video.setAttribute('src', app.urlVideo);
				// remove on production
				// video.pause();
				// uncomment on production 
				// video.play();
				vdoFakeClick(function() {
					video.load();
					video.play();
				})
			};

			if (image) {
				image.src = app.urlImg;
				image.setAttribute('alt', app.title);				
			};

			appDOM.addEventListener('click', function() {
				// uncomment on production
				// window.location = app.urlApp;
			});

			skipLink.addEventListener('click', function() {
				iframe.parentNode.removeChild(iframe);
				Viewport.remove();
			});


			setTimeout(function() {
				skipBlock.style.display = "block";
				runCoundown(i);
			}, seconds(q.showSkipTimeAfter))
		};
	};


	function runCoundown(iframe) {
		var timer       = qs('.countdown', iframe);
		var seconds     = q.countdown;
		timer.innerHTML = seconds;
		var countdowner = setInterval(function() {
			seconds--;
			timer.innerHTML = seconds;
			if (seconds == 0) {
				// uncomment on production
				// window.location = app.urlApp;
				clearInterval(countdowner)
			};
		}, 1000)

	};

	function seconds (time) {
		return time*1000;
	}

	function createIframe () {
		var iframe = document.createElement('iframe');
		
		iframe.src = 'iframe.html';
		iframe.id  = "videoIframe";
		iframe.setAttributes({
			styles: {
				position:    'fixed',
				top:         "0",
				right:       "0",
				bottom:      "0",
				left:        "0",
				borderStyle: 'none',
				width:       '100%',
				height:      '100%',
			}
		});
		document.body.appendChild(iframe);
		return iframe;
	}

	function init() {
		if (!q.id) {
			return
		};
		loadJSONP("https://admin.appnext.com/offerWallApi.aspx?&vs=1&id="+q.id+"&cnt="+q.cnt+"&cat="+q.cat, success_jsonp);
	}

	return {
		init: init
	}

}());
ready(function() {
	appnextAPP.init();
});