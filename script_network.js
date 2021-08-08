const Network = {
	//<editor-fold desc="DATA COMMUNICATION HANDLERS">
	onDataReceived: function(data) {
		console.info("onDataReceived");
		console.info(data);

		if (data === "game_start") {
			hide_modal("standby_client");
			show_modal("game_window");
		}
	},

	host_send_data_to_clients: function(data) {
		for (let client_id in clients) {
			clients[client_id].connection.send({id: id, data: data});
		}
	},

	client_send_data_to_host: function(data) {
		host_connection.send({id: id, data: data});
	},

	//</editor-fold>

	//<editor-fold desc="HOST">
	register_host: function() {
		id = peer.id
		host_id_output.value = id;

		jQuery.post(signal_url, {mode: "register_host", id: id})
			.done(function () {
				interval_client_scan = setInterval(function () {
					jQuery.post(signal_url, {mode: "get_clients", id: id})
						.done(function (payload) {
							payload = JSON.parse(payload);
							if (payload.result === 0) {
								console.info(payload);
								for (let i = 0; i < payload.data.length; i++) {
									let client = payload.data[i];
									client.connection = peer.connect(client.id);
									client.connection.on('data', onDataReceived);
									clients[client.id] = client;
									host_clients_wait.classList.add("hidden");
									host_clients_connected.classList.remove("hidden");
									host_clients_list.innerHTML += "<li>" + client.nickname + "</li>";
								}
							}
						})
				}, 2000);
			})
	},

	start_game: function() {
		if (interval_client_scan != null)
			clearInterval(interval_client_scan);
		for (let client_id in clients) {
			clients[client_id].connection.send("game_start");
		}
		hide_modal("connect_host");
		show_modal("game_window");
		console.info(clients);
	},

	//</editor-fold>

	//<editor-fold desc="CLIENT">
	register_client: function() {
		id = peer.id;
		host_id = host_id_input.value;
		nickname = nickname_input.value;

		if (host_id === "" || nickname === "") {
			client_error_output.classList.remove("hidden");
			if (host_id === "")
				client_error_output.innerText = "Enter a host ID";
			if (nickname === "")
				client_error_output.innerText = "Enter a nickname";
			return false;
		}

		jQuery.post(signal_url, {mode: "register_client", id: id, host_id: host_id, nickname: nickname})
			.done(function () {
				host_connection = peer.connect(host_id);
				hide_modal("connect_client");
				show_modal("standby_client");
			})
			.fail(function () {
				client_error_output.classList.remove("hidden");
				client_error_output.innerText = "An error occurred during signal communication";
			});
	}
	//</editor-fold>
}