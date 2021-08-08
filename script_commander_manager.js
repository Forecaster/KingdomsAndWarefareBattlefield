const Commander_Manager = {
	commander_manager_get_cmdr: function() {
		let name = commander_manager_name.value;
		if (name.length == 0) {
			return null;
		}
		let icon_color = "";
		if (commander_manager_icon_color_black.checked)
			icon_color = "black";
		return {
			id: name.replaceAll(" ", "_"),
			name: name,
			unit_limit: commander_manager_unit_limit.value,
			color: commander_manager_color.value,
			icon: commander_manager_icon.getAttribute("data-icon"),
			icon_color: icon_color,
		}
	},

	commander_manager_add_pc: function(commander = null) {
		if (commander == null)
			commander = Commander_Manager.commander_manager_get_cmdr();
		if (typeof commander === "undefined" || commander == null)
			return;
		commander.type = "pc";
		if (typeof commanders[commander.id] !== "undefined")
			return;
		commanders[commander.id] = commander;
		Commander_Manager.commander_manager_clear_fields();
		Commander_Manager.update_commander_manager_lists();
		Commander_Manager.update_unit_owner_styles();
		Turn_Tracker.insert_turn_tracker_entry(Generate_Element.generate_turn_tracker_entry(commander, 0));
	},

	commander_manager_add_dm: function(commander = null) {
		if (commander == null)
			commander = commander_manager_get_cmdr();
		if (typeof commander === "undefined" || commander == null)
			return;
		commander.type = "dm";
		if (typeof commanders[commander.id] !== "undefined")
			return;
		commanders[commander.id] = commander;
		Commander_Manager.commander_manager_clear_fields();
		Commander_Manager.update_commander_manager_lists();
		Commander_Manager.update_unit_owner_styles();
		Turn_Tracker.insert_turn_tracker_entry(Generate_Element.generate_turn_tracker_entry(commander, 0));
	},

	update_commander_manager_lists: function() {
		commander_manager_pc_list.innerHTML = "";
		commander_manager_dm_list.innerHTML = "";
		for (let id in commanders) {
			let commander = commanders[id];
			if (commander.type == "pc")
				commander_manager_pc_list.appendChild(Generate_Element.generate_commander_list_entry(commander));
			else
				commander_manager_dm_list.appendChild(Generate_Element.generate_commander_list_entry(commander));
		}
		if (commander_manager_pc_list.innerHTML === "")
			commander_manager_pc_list.innerText = "No commanders to list";
		if (commander_manager_dm_list.innerHTML === "")
			commander_manager_dm_list.innerText = "No commanders to list";
	},

	commander_manager_clear_fields: function() {
		commander_manager_update_commander_id.value = "";
		commander_manager_name.value = "";
		commander_manager_unit_limit.value = "2";
		commander_manager_icon.className = "turn_icon turn_icon_infinity";
		commander_manager_color.jscolor.fromString(Utility.get_random_color());
		commander_manager_color.jscolor.trigger('change input');
		commander_manager_save_buttons_new.classList.remove("hidden");
		commander_manager_save_buttons_update.classList.add("hidden");
	},

	commander_manager_update_commander: function(commander) {
		commander_manager_update_commander_id.value = commander.id;
		commander_manager_name.value = commander.name;
		commander_manager_unit_limit.value = commander.unit_limit;
		let icon_color = "";
		if (commander.icon_color == "black")
			icon_color = " icon_color_black";
		commander_manager_icon.className = "turn_icon turn_icon_" + commander.icon + icon_color;
		commander_manager_color.jscolor.fromString(commander.color);
		commander_manager_color.jscolor.trigger('change input');
		commander_manager_save_buttons_new.classList.add("hidden");
		commander_manager_save_buttons_update.classList.remove("hidden");
	},

	commander_manager_apply_commander_update: function() {
		let commander = Commander_Manager.commander_manager_get_cmdr();
		commanders[commander_manager_update_commander_id.value].name = commander.name;
		commanders[commander_manager_update_commander_id.value].unit_limit = commander.unit_limit;
		commanders[commander_manager_update_commander_id.value].icon = commander.icon;
		commanders[commander_manager_update_commander_id.value].icon_color = commander.icon_color;
		commanders[commander_manager_update_commander_id.value].color = commander.color;
		Commander_Manager.update_commander_manager_lists();
		Commander_Manager.commander_manager_clear_fields();
		Commander_Manager.update_unit_owner_styles();
	},

	update_unit_owner_styles: function() {
		unit_owner_styles.innerHTMl = "";
		for (let id in commanders) {
			let commander = commanders[id];
			unit_owner_styles.innerHTML += ".unit[commander=\"" + commander.id + "\"] { border-color: " + commander.color + "; }\n";
		}
	},

	set_random_commander_color: function() {
		commander_manager_color.jscolor.fromString(Utility.get_random_color());
		commander_manager_color.jscolor.trigger('change input');
	}
}