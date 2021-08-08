const Events = {
//<editor-fold desc="EVENTS">
	onclick_host: function(event) {
		host = true;
		hide_modal("host_or_client");
		register_host();
		show_modal("connect_host");
	},

	onclick_client: function(event) {
		hide_modal("host_or_client");
		show_modal("connect_client");
	},

	big_game_button: function() {
		if (host) {
			host_send_data_to_clients("big_game_button_host");
		} else {
			host_connection.send("big_game_button_client");
		}
	},

	num_increment_decrement: function(event) {
		if (event.key === "ArrowUp" || event.key === "+") {
			event.target.value = Math.min(event.target.max || Number.MAX_SAFE_INTEGER, parseInt(event.target.value) + 1);
			event.preventDefault();
		} else if (event.key === "ArrowDown" || event.key === "-") {
			event.target.value = Math.max(0, event.target.min, parseInt(event.target.value) - 1);
			event.preventDefault();
		}
	},

	field_auto_select: function(event) {
		event.target.select();
	},

	on_window_resize: function(event) {
		canvas.setAttribute("height", window.innerHeight + "px");
		canvas.setAttribute("width", window.innerWidth + "px");
	}
//</editor-fold>
}