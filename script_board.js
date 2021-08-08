const Board = {
	Events: {
// <editor-fold desc="Events">
		current_drop_target: null,
		drag_source_element: null,
		drag_source_center_point: null,
		current_move_is_valid: true,
		move_fail_reason: null,
		on_drag_enter: function(event) {
			Board.Events.current_move_is_valid = true;
			let space = Board.find_parent_out_of_formation(event.target);
			if (space != null) { // Target is out of formation box
				space = space.querySelector("#out_of_formation_units");
			} else {
				space = Board.find_parent_space(event.target);
				if (space == null) {
					Board.Events.current_move_is_valid = false;
					Board.Events.move_fail_reason = "Target is not a valid space.";
				}
				let rank = Board.find_parent_rank(space);
				if (rank.classList.contains("rank_collapsed")) {
					Board.Events.current_move_is_valid = false;
					Board.Events.move_fail_reason = "Unable to move unit into collapsed rank.";
				}
				if (Board.is_space_occupied(space)) {
					Board.Events.current_move_is_valid = false;
					Board.Events.move_fail_reason = "Unable to move unit into occupied space";
				}
			}
			Board.Events.current_drop_target = space;
			if (Board.Events.current_move_is_valid) {
				Utility.draw_line_between_elements(Board.Events.drag_source_center_point, Board.Events.current_drop_target, "lawngreen");
			} else {
				Utility.draw_line_between_elements(Board.Events.drag_source_center_point, Board.Events.current_drop_target, "red");
			}
		},

		on_drag_start: function(event) {
			if (Board.Events.current_drop_target != null)
				return false;
			Board.Events.drag_source_element = event.target.parentElement;
			Board.Events.drag_source_center_point = event.target;
		},

		on_drag_end: function(event) {
			if (Board.Events.current_drop_target == Board.Events.drag_source_element) {
				console.debug("Canceled move because destination equals origin");
				Board.Events.reset_drag_state();
				return;
			}
			if (!Board.Events.current_move_is_valid || Board.Events.current_drop_target == null) {
				if (Board.Events.move_fail_reason != null)
					Chat.send_chat_error(Board.Events.move_fail_reason);
				else
					console.debug("Movement invalid for unspecified reason");
				Board.Events.reset_drag_state();
				return;
			}
			let target = event.target;

			let space = Board.find_parent_out_of_formation(Board.Events.current_drop_target);
			if (space != null) {
				space = Board.Events.current_drop_target;
			} else {
				space = Board.find_parent_space(Board.Events.current_drop_target);

				if (space == null) {
					Chat.send_chat_error("Target is not a valid move target.");
					Board.Events.reset_drag_state();
					return;
				}
				if (Board.is_space_occupied(space)) {
					Board.Events.reset_drag_state();
					Chat.send_chat_error("Unable to move unit into occupied space");
					return;
				}
				if (Board.find_parent_rank(space).classList.contains("rank_collapsed")) {
					Board.Events.reset_drag_state();
					Chat.send_chat_error("Unable to move unit into collapsed rank.");
					return;
				}
			}
			if (Board.Events.drag_source_element.id == "menu_panel_unit_container") {
				let commander_id = Turn_Tracker.get_current_turn_commander_id();
				if (commander_id == null) {
					Board.Events.reset_drag_state();
					Chat.send_chat_error("Unable to place units out of turn. Add a commander first.");
					return;
				}
				let clone = target.cloneNode(true);
				Generate_Element.set_unit_events(clone);
				clone.setAttribute("commander", commander_id)
				Board.Events.current_drop_target.appendChild(clone);
				Board.update_space_unit_counter(Board.Events.current_drop_target);
				Board.Events.reset_drag_state();
				Board.update_board_tier_total_counter();
			} else {
				let target_rank_is_reserve = Board.rank_is_type(Board.Events.current_drop_target, "reserve");
				let origin = Board.Events.drag_source_element.getBoundingClientRect();
				let destination = Board.Events.current_drop_target.getBoundingClientRect();
				if (!target_rank_is_reserve) {
					target.style.top = -(destination.y - origin.y) + "px";
					target.style.left = -(destination.x - origin.x) + "px";
					Board.Events.current_drop_target.appendChild(target);
					Board.update_space_unit_counter(Board.Events.drag_source_element);
					Board.update_space_unit_counter(Board.Events.current_drop_target);
				} else {
					target.style.top = "0";
					target.style.left = "0";
				}
				target.style.zIndex = window.getComputedStyle(target)["z-index"] + 100;
				target.style.transitionDuration = "1s";
				setTimeout(function() {
					if (!target_rank_is_reserve) {
						target.style.top = "0";
						target.style.left = "0";
					} else {
						target.style.top = (destination.y - origin.y) + "px";
						target.style.left = (destination.x - origin.x) + "px";
					}
					setTimeout(function() {
						if (target_rank_is_reserve) {
							Board.Events.current_drop_target.appendChild(target);
							Board.update_space_unit_counter(Board.Events.drag_source_element);
							Board.update_space_unit_counter(Board.Events.current_drop_target);
						}
						target.style.top = null;
						target.style.left = null;
						target.style.zIndex = null;
						target.style.transitionDuration = null;
						Board.Events.reset_drag_state();
					}, parseInt(window.getComputedStyle(target)["transition-duration"]) * 1000);
				}, 100);
			}
		},

		reset_drag_state: function() {
			// Board.Events.drop_target_clear_key = setTimeout(function() {
				Board.Events.current_drop_target = null;
				Board.Events.drag_source_element = null;
				Board.Events.drag_source_center_point = null;
				Board.Events.move_fail_reason = null;
				Board.Events.current_move_is_valid = true;
				let context = canvas.getContext("2d");
				context.clearRect(0, 0, window.innerWidth, window.innerHeight);
			// }, 10);
		},

		selected_unit: null,
		select_unit: function(event) {
			Board.selected_unit = event.target;
		},

		toggle_unit_expand: function(event) {
			let unit = Board.find_parent_unit(event.target)
			if (unit != null) {
				if (unit.classList.contains("expanded")) {
					unit.classList.remove("expanded");
					unit.style.zIndex = null;
				} else {
					unit.classList.add("expanded");
					unit.style.zIndex = "2000";
				}
			}
			event.preventDefault();
			event.stopPropagation();
		},
	},
// </editor-fold>

	replace_battlefield: function(new_battlefield) {
		battlefield.replaceWith(new_battlefield);
		battlefield = new_battlefield;
	},

	find_parent_unit(element) {
		if (typeof element === "undefined" || element == null)
			return null;
		while (!element.classList.contains("unit") && element.parentElement != null) {
			element = element.parentElement;
		}
		if (element.tagName == "HTML" || element.tagName == "BODY")
			return null;
		return element;
	},

	find_parent_out_of_formation(element) {
		if (typeof element === "undefined" || element == null)
			return null;
		if (element.classList.contains("out_of_formation"))
			return element;
		while (!element.classList.contains("out_of_formation") && element.parentElement != null) {
			element = element.parentElement;
		}
		if (element.tagName == "HTML" || element.tagName == "BODY")
			return null;
		return element;
	},

	find_parent_space: function(element) {
		if (typeof element === "undefined" || element == null)
			return null;
		if (element.classList.contains("space"))
			return element;
		while (!element.classList.contains("space") && element.parentElement != null) {
			element = element.parentElement;
		}
		if (element.tagName == "HTML" || element.tagName == "BODY")
			return null;
		return element;
	},

	find_parent_rank: function(element) {
		while (!element.classList.contains("rank") && element.parentElement != null) {
			element = element.parentElement;
		}
		if (element.tagName == "HTML" || element.tagName == "BODY")
			return null;
		return element;
	},

	rank_is_type(element, rank) {
		element = Board.find_parent_rank(element);
		return rank != null && element.classList.contains(rank);
	},

	find_previous_rank: function(rank) {
		if (!rank.classList.contains("rank"))
			return null;
		let counter = 0;
		let timeout = 100;
		while (counter < timeout) {
			let next_rank = rank.previousElementSibling;
			if (next_rank.classList.contains("rank") && !next_rank.classList.contains("rank_collapsed"))
				return next_rank;
			counter++;
		}
		return null;
	},

	find_next_rank: function(rank) {
		if (!rank.classList.contains("rank"))
			return null;
		let counter = 0;
		let timeout = 100;
		while (counter < timeout) {
			let next_rank = rank.nextElementSibling;
			if (next_rank.classList.contains("rank") && !next_rank.classList.contains("rank_collapsed"))
				return next_rank;
			counter++;
		}
		return null;
	},

	get_unit_column_index: function(unit_element) {
		let space = Board.find_parent_space(unit_element);
		let rank = Board.find_parent_rank(unit_element);
		if (space == null)
			return null;
		for (let i = 0; i < rank.children.length; i++) {
			if (rank.children[i] == space)
				return i;
		}
		return null;
	},

	is_space_occupied: function(space) {
		let rank = Board.find_parent_rank(space);
		if (round_counter == 0) {
			if (rank.classList.contains("reserve"))
				return false;
		}
		return Board.count_units_in_space(space) > 0;
	},

	count_units_in_rank: function(rank) {
		return rank.querySelectorAll(".unit").length;
	},

	count_units_in_space: function(space) {
		return space.querySelectorAll(".unit").length;
	},

	collapse_unoccupied_ranks: function() {
		let boards = battlefield.children
		for (let i = 0; i < boards.length; i++) {
			let ranks = boards[i].children;
			for (let y = 0; y < ranks.length; y++) {
				if (Board.count_units_in_rank(ranks[y]) == 0)
					ranks[y].classList.add("rank_collapsed");
			}
		}
	},

	increment_unit_health: function(unit) {
		if (!unit.classList.contains("unit"))
			return;
		let casualties = unit.querySelector(".casualties");
		let hp = parseInt(casualties.innerText) + 1;
		casualties.innerText = hp.toString();
		let size = parseInt(unit.querySelector(".unit_size").innerText.replace("/", ""));
		if (hp <= (size / 2))
			unit.classList.add("diminished");
		else
			unit.classList.remove("diminished");
		Board.update_board_tier_total_counter();
	},

	decrement_unit_health: function(unit) {
		if (!unit.classList.contains("unit"))
			return;
		let casualties = unit.querySelector(".casualties");
		let hp = parseInt(casualties.innerText) - 1;
		casualties.innerText = hp.toString();
		let size = parseInt(unit.querySelector(".unit_size").innerText.replace("/", ""));
		if (hp <= (size / 2))
			unit.classList.add("diminished");
		else
			unit.classList.remove("diminished");
		Board.update_board_tier_total_counter();
	},

	toggle_unit_activated: function(unit) {
		if (typeof unit === "undefined" || unit == null)
			return;
		if (unit.classList.contains("activated"))
			unit.classList.remove("activated");
		else
			unit.classList.add("activated");
	},

	units_de_activate_all: function() {
		let units = document.body.querySelectorAll(".unit");
		for (let i in units) {
			if (typeof units[i].classList !== "undefined")
				units[i].classList.remove("activated");
		}
	},

	update_space_unit_counter(space) {
		if (!space.classList.contains("space"))
			return;
		let counter = space.querySelector(".space_unit_counter");
		let count = Board.count_units_in_space(space);
		counter.innerText = "x" + count;
		if (count >= 2)
			counter.classList.remove("hidden");
		else
			counter.classList.add("hidden");
	},

	get_tier_total_left: function() {
		let results = {};

		let units = Array.from(battlefield.querySelectorAll(".unit"));
		units = units.concat(Array.from(out_of_formation.querySelectorAll(".unit")));

		for (let i = 0; i < units.length; i++) {
			let unit_element = units[i];
			let casualties = parseFloat(unit_element.querySelector(".casualties").innerText);
			let commander = unit_element.getAttribute("commander");
			let unit = unit_store[unit_element.getAttribute("data-index")]

			if (casualties > 0) {
				if (results.hasOwnProperty(commander))
					results[commander] += parseFloat(unit.tier);
				else
					results[commander] = parseFloat(unit.tier);
			}
		}
		return results;
	},

	update_board_tier_total_counter: function() {
		let counts = Board.get_tier_total_left();

		let pc = "";
		let pc_total = 0;
		let npc = "";
		let npc_total = 0;
		for (let i in counts) {
			let commander = commanders[i];
			if (commander.type == "pc") {
				pc_total += counts[i];
				pc += "<div class='commander_tiers' style='color: " + commander.color + "; background-color: " + (commander.icon_color == "" ? "white" : commander.icon_color) + ";'><b>" + commander.name + "</b> - " + counts[i] + "</div>";
			} else {
				npc_total += counts[i];
				npc += "<div class='commander_tiers' style='color: " + commander.color + "; background-color: " + (commander.icon_color == "" ? "white" : commander.icon_color) + ";'><b>" + commander.name + "</b> - " + counts[i] + "</div>";
			}
		}
		if (pc == "")
			pc = "<div>No players on the board</div>";
		if (npc == "")
			npc = "<div>No NPCs on the board</div>";
		let div_pc_total = "<div class='total' " + ((pc_total > (npc_total * 2)) ? " style='color: #5bff5b;'" : "") + ">" + pc_total + "</div>";
		let div_npc_total = "<div class='total' " + ((npc_total > (pc_total * 2)) ? " style='color: #5bff5b;'" : "") + ">" + npc_total + "</div>";
		tier_list.innerHTML = pc + div_pc_total + npc + div_npc_total;
	},
}