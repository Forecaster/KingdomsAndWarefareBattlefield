const Utility = {
//<editor-fold desc="MISC FUNCTIONS">
	random_id: function() {
		return (Math.random() * 10000).toString(36).replace(/[^a-z]+/g, '');
	},

	get_element_center: function(element) {
		if (typeof element === "undefined" || element == null)
			return null;
		element = element.getBoundingClientRect();
		return {x: element.x + (element.width / 2), y: element.y + (element.height / 2)};
	},

	draw_line_between_elements: function(element1, element2, color = "blue") {
		let source = Utility.get_element_center(element1);
		let target = Utility.get_element_center(element2);
		if (source == null || target == null) {
			if (source == null)
				console.warn("draw_line_between_elements: source is null");
			if (target == null)
				console.warn("draw_line_between_elements: target is null");
			return;
		}
		let context = canvas.getContext("2d");
		context.clearRect(0, 0, window.innerWidth, window.innerHeight);
		context.beginPath();
		context.moveTo(source.x, source.y);
		context.lineTo(target.x, target.y);
		context.closePath();
		context.lineWidth = 10;
		context.strokeStyle = color;
		context.lineCap = 'round';
		context.stroke();
	},

	/**
	 * Returns a random number between min (inclusive) and max (exclusive)
	 */
	getRandomArbitrary: function(min, max) {
		return Math.random() * (max - min) + min;
	},

	/**
	 * Returns a random integer between min (inclusive) and max (inclusive).
	 * The value is no lower than min (or the next integer greater than min
	 * if min isn't an integer) and no greater than max (or the next integer
	 * lower than max if max isn't an integer).
	 * Using Math.round() will give you a non-uniform distribution!
	 */
	getRandomInt: function(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},

	get_random_color: function() {
		return "#" + Utility.getRandomInt(0, 255).toString(16) + Utility.getRandomInt(0, 255).toString(16) + Utility.getRandomInt(0, 255).toString(16);
	},

	cookie_functions_version: "1.0",
	/**
	 * Returns value of cookie
	 * @param name {String}
	 * return {String}
	 */
	getCookie: function(name) {
		let cName = "";
		let pCOOKIES;
		pCOOKIES = document.cookie.split('; ');
		for (let bb = 0; bb < pCOOKIES.length; bb++)
		{
			let NmeVal = [];
			NmeVal = pCOOKIES[bb].split('=');
			if (NmeVal[0] == name)
			{
				cName = unescape(NmeVal[1]);
			}
		}
		return cName;
	},

	/**
	 * Sets cookie, expires is seconds from execution the cookie will expire
	 * @param name {String}
	 * @param value {String}
	 * @param expires {Number=}
	 * @param path {String=}
	 * @param domain {String=}
	 * @param secure {String=}
	 */
	setCookie: function(name, value, expires, path, domain, secure) {
		let date;
		if (expires) {
			date = new Date();
			let time = date.getTime();
			date.setTime(time + (expires * 1000));
		}

		document.cookie = name + "=" + escape(value) +
			((expires) ? ";expires=" + date.toGMTString() : "" ) +
			((path) ? ";path=" + path : "" ) +
			((domain) ? ";domain=" + domain : "" ) +
			((secure) ? ";secure" : "" );
	},
//</editor-fold>
}