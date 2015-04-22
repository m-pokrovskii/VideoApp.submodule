'use strict';
var appnextAPP = (function(){	

	var app;

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

	function calculateAspectRatioFit(srcWidth, srcHeight, availableWidth, availableHeight) {
		for (var i = availableWidth; i>0; i--)
		{
			var y = srcHeight*i/srcWidth;
			if ( y == parseInt(y))
			{
				return { width: i, height: y };
				break;
			}				
	 }
	}



	function render () {
		document.body.onload = function() {
			var sprite          = qs('.sprite-animation__video');			
			if (sprite) {
				var spriteContainer     = qs('#sprite-animation'),
						frameWidth          = 640,
						frameHeight         = 360,
						naturalSpriteHeight = 36000,
						spriteHeight        = 0,
						frameStep           = 0,
						newSizes            = {},
						arrImages           = [
							'images/sprite/output_1.jpg',
							'images/sprite/output_2.jpg',
							'images/sprite/output_3.jpg',
							'images/sprite/output_4.jpg',
							'images/sprite/output_5.jpg',
							],

						setupNewSizes = function() {
							spriteContainer.style.width  = "auto";
							spriteContainer.style.height = "auto";
							animation.resetSprite();
							newSizes = calculateAspectRatioFit(frameWidth, frameHeight, spriteContainer.offsetWidth, spriteContainer.offsetHeight);
							spriteContainer.style.width  = newSizes.width + "px";
							spriteContainer.style.height = newSizes.height + "px";

							spriteHeight = naturalSpriteHeight*newSizes.height/frameHeight;	
						};

						var animation = {
							resetSprite: function() {
								frameStep        = 0;
								sprite.style.top = 0;
							},
							runAnimation: function() {
								var animateFun = setInterval(function() {
										if (frameStep >= spriteHeight) {
											animation.resetSprite();
										};
										frameStep = frameStep + newSizes.height;						
										sprite.style.top = '-'+frameStep+'px';
									}, 60);							
							}
						};

					var seqImages = function (images, index, callback) {
						var index = index || 0;
						var callback = callback || function() {};
						var img = document.createElement('img');
						img.src = images[index];
						sprite.appendChild(img);
						console.log(img);
						img.onload = function() {
							if (index == 0) { callback() };
							if (images.length-1 == index) { return };
							index += 1;
							seqImages(images, index);
						};
					};

					var imageLoader = function (images, firstLoadCount) {
						var restImages = images.splice(firstLoadCount, images.length);
						var loadedImages = [],
								count = 0;
						firstLoadCount = firstLoadCount-1;
						for (var i = 0; i <= firstLoadCount; i++) {
							loadedImages[i] = document.createElement('img');
							loadedImages[i].src = images[i];
							loadedImages[i].style.display = "none";
							sprite.appendChild(loadedImages[i]);
							console.log(loadedImages[i]);
							loadedImages[i].onload = function () {
								count = count+1;
								if (count >= images.length) {
									loadedImages.forEach(function(element, index){
										element.style.display = "block";
									});
									animation.runAnimation();
									seqImages(restImages);
								};
							};
						};
					};

				setupNewSizes();
				imageLoader(arrImages, 2);
				window.addEventListener('resize', function(event){
					setupNewSizes();
					starRating(starsHover, starsHoverImage, defaultStarsImage, starsRating);
				});
			};
		};
	};
	
	return {
		render: render
	}

}());
ready(function() {
	appnextAPP.render();
});