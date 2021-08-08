const Turn_Tracker = {
	advance_turn: function() {
		if (turn_tracker_entries.children.length <= 1)
			return turn_counter;
		turn_counter++;
		if (turn_counter == turn_tracker_entries.children.length) {
			turn_counter = 0;
			round_counter++;
			turn_indicator.style.left = null;
			Board.collapse_unoccupied_ranks();
		} else {
			turn_indicator.style.left = parseInt(window.getComputedStyle(turn_indicator)["left"]) + 61 + "px";
		}
		Turn_Tracker.update_turn_display();
		Turn_Tracker.update_round_display();
		Turn_Tracker.update_unit_turn_styles();
		Board.units_de_activate_all();
		return turn_counter;
	},

	get_current_turn_commander_id: function() {
		if (turn_tracker_entries.children.length == 0)
			return null;
		return turn_tracker_entries.children[turn_counter].getAttribute("commander");
	},

	get_current_turn_commander: function() {
		return commanders[Turn_Tracker.get_current_turn_commander_id()];
	},

	update_turn_display: function() {
		turn_display.innerText = "Turn " + (turn_counter + 1);
	},

	update_round_display: function() {
		if (round_counter === 0)
			round_display.innerText = "Round 0 (Deployment)";
		else
			round_display.innerText = "Round " + round_counter;
	},

	insert_turn_tracker_entry: function(entry) {
		let initiative = parseFloat(entry.querySelector(".turn_tracker_initiative").innerText);
		let inserted = false;
		for (let i = 0; i < turn_tracker_entries.children.length; i++) {
			let ref_entry = turn_tracker_entries.children[i];
			let ref_initiative = parseFloat(ref_entry.querySelector(".turn_tracker_initiative").innerText);
			if (initiative > ref_initiative && !inserted) {
				turn_tracker_entries.insertBefore(entry, ref_entry);
				inserted = true;
			}
		}
		if (!inserted)
			turn_tracker_entries.appendChild(entry);
	},

	sort_turn_tracker_entries: function() {
		let temp_container = document.createElement("div");
		temp_container.innerHTML = turn_tracker_entries.innerHTML;
		turn_tracker_entries.innerHTML = "";

		while (temp_container.children.length > 0) {
			let entry = temp_container.children[0];
			Turn_Tracker.insert_turn_tracker_entry(entry);
			Generate_Element.append_turn_tracker_initiative_update_event(entry);
		}
	},

	update_initiative: function(event) {
		let parent = event.target.parentElement;
		let new_initiative = event.target.value;
		parent.innerHTML = "";
		parent.innerText = new_initiative;
		Turn_Tracker.sort_turn_tracker_entries();
	},

	update_unit_turn_styles: function() {
		let id = Turn_Tracker.get_current_turn_commander_id();
		unit_owner_turn_styles.innerHTML = ".unit[commander=\"" + id + "\"] {  }\n";
	}
}