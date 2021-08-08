const Chat = {
	send_message: function(msg, sender, type) {
		let container = document.createElement("div");
		container.className = "chat_message_container";
		container.classList.add(type);

		if (sender != null) {
			let by = document.createElement("div");
			by.className = "chat_sender";
			by.innerText = sender;
			container.appendChild(by);
		}

		let message = document.createElement("div");
		message.className = "chat_message";
		message.innerText = msg;
		container.appendChild(message);

		chat_panel_messages.appendChild(container);
	},

	send_chat_message: function(msg, sender) {
		Chat.send_message(msg, sender, "chat");
	},

	send_chat_error: function(msg, source) {
		Chat.send_message("Error: " + msg, source, "error");
	},

	send_error_global: function(msg, source) {
		Chat.send_chat_error(msg, source)
	},

	chatbox_submit: function () {
		this.send_chat_message(chat_panel_input.value, nickname);
		chat_panel_input.value = "";
	},

	on_chat_key_down: function(event) {
		if (event.key == "Enter" && !event.shiftKey) {
			this.send_chat_message(chat_panel_input.value, nickname);
			chat_panel_input.value = "";
		}
	},
}