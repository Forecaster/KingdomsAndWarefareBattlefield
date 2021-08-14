const Generate_Element = {
//<editor-fold desc="Element creation">
	generate_rank: function(width = 5, type) {
		if (type.toLowerCase() == "flank")
			type = "Flank";
		else if (type.toLowerCase() == "center")
			type = "Center";
		else if (type.toLowerCase() == "vanguard")
			type = "Vanguard";
		else
			type = "Reserve";
		let rank = document.createElement("div");
		rank.className = "rank " + type.toLowerCase();
		let title = document.createElement("div");
		title.className = "title";
		title.innerHTML = "<div>" + type + "</div>";
		title.title = type + " rank";
		title.ondblclick = function() {
			rank.classList.remove("rank_collapsed");
		}
		rank.appendChild(title);
		rank.innerHTML += '<div class="space" ondragenter="Board.Events.on_drag_enter(event)"><div class="space_unit_counter hidden"></div></div>'.repeat(width);
		return rank;
	},

	generate_battlefield: function(width = 5) {
		let battlefield = document.createElement("div");
		battlefield.id = "battlefield";
		if (settings.board_colors_enabled == false)
			battlefield.className = "battlefield_no_color";

		let board_pc = document.createElement("div");
		board_pc.id = "board_pc";
		board_pc.className = "board";
		board_pc.appendChild(Generate_Element.generate_rank(width, "flank"));
		board_pc.appendChild(Generate_Element.generate_rank(width, "center"));
		board_pc.appendChild(Generate_Element.generate_rank(width, "reserve"));
		board_pc.appendChild(Generate_Element.generate_rank(width, "vanguard"));
		battlefield.appendChild(board_pc);

		let board_dm = document.createElement("div");
		board_dm.id = "board_dm";
		board_dm.className = "board";
		board_dm.appendChild(Generate_Element.generate_rank(width, "vanguard"));
		board_dm.appendChild(Generate_Element.generate_rank(width, "reserve"));
		board_dm.appendChild(Generate_Element.generate_rank(width, "center"));
		board_dm.appendChild(Generate_Element.generate_rank(width, "flank"));
		battlefield.appendChild(board_dm);
		return battlefield;
	},

	set_unit_events: function(unit) {
		unit.ondblclick = Board.Events.toggle_unit_expand;
		unit.ondragend = Board.Events.on_drag_end;
		unit.ondragstart = Board.Events.on_drag_start;
		unit.onclick = Board.Events.select_unit;
		unit.oncontextmenu = function(event) {
			let unit = Board.find_parent_unit(event.target);
			if (!unit.hasAttribute("commander"))
				return false;
			GUI.show_bubble_menu({x: event.clientX, y: event.clientY},
				{
					label: "+", title: "Remove casualty", click: function() {
						Board.increment_unit_health(unit)
					}
				},
				{
					label: "-", title: "Add casualty", click: function() {
						Board.decrement_unit_health(unit)
					}
				},
				{
					label: "A", title: "Toggle unit activated", click: function() {
						Board.toggle_unit_activated(unit)
					}
				},
				{
					icon: "bub_icon_trashcan", click: function() {
						unit.parentElement.removeChild(unit);
						Board.update_board_tier_total_counter();
						GUI.hide_bubble_menu();
					}
				}
			);
			event.preventDefault();
			event.stopPropagation();
		}
	},

	generate_unit: function(u, index, draggable = true) {
		let unit = document.createElement("div");
		unit.setAttribute("data-index", index);
		unit.className = "unit";
		unit.draggable = draggable;
		let type = document.createElement("div");
		type.className = "unit_type " + Unit_Manager.get_unit_property(u, "type").toLowerCase();
		unit.appendChild(type);
		let attack_box = document.createElement("div");
		attack_box.className = "unit_attack_box";
		unit.appendChild(attack_box);
		let damage = document.createElement("div");
		damage.className = "unit_damage";
		damage.innerText = Unit_Manager.get_unit_property(u, "damage");
		attack_box.appendChild(damage);
		let attacks = document.createElement("div");
		attacks.className = "unit_attacks";
		if (u.attacks > 1)
			attacks.innerText = "×" + Unit_Manager.get_unit_property(u, "attacks");
		attack_box.appendChild(attacks);
		let health_box = document.createElement("div");
		health_box.className = "unit_health";
		let casualties = document.createElement("div");
		casualties.className = "casualties";
		casualties.innerText = Unit_Manager.get_unit_property(u, "size");
		health_box.appendChild(casualties);
		let size = document.createElement("div");
		size.className = "unit_size";
		size.innerText = "/" + Unit_Manager.get_unit_property(u, "size");
		health_box.appendChild(size);
		unit.appendChild(health_box);
		let name = document.createElement("div");
		name.className = "unit_name";
		name.innerText = Unit_Manager.get_unit_property(u, "name");
		name.title = name.innerText;
		unit.appendChild(name);
		let stats = document.createElement("div");
		stats.className = "stats";
		let attack = document.createElement("div");
		attack.className = "stat";
		attack.innerHTML = '<div class="label" title="Attack">ATK</div><span>+' + u.stats.attack + '</span>';
		stats.appendChild(attack);
		let defense = document.createElement("div");
		defense.className = "stat";
		defense.innerHTML = '<div class="label" title="Defense">DEF</div><span>+' + u.stats.defense + '</span>';
		stats.appendChild(defense);
		let power = document.createElement("div");
		power.className = "stat";
		power.innerHTML = '<div class="label" title="Power">POW</div><span>+' + u.stats.power + '</span>';
		stats.appendChild(power);
		let toughness = document.createElement("div");
		toughness.className = "stat";
		toughness.innerHTML = '<div class="label" title="Toughness">TOU</div><span>+' + u.stats.toughness + '</span>';
		stats.appendChild(toughness);
		let morale = document.createElement("div");
		morale.className = "stat";
		morale.innerHTML = '<div class="label" title="Morale">MOR</div><span>+' + u.stats.morale + '</span>';
		stats.appendChild(morale);
		let command = document.createElement("div");
		command.className = "stat";
		command.innerHTML = '<div class="label" title="Command">COM</div><span>+' + u.stats.command + '</span>';
		stats.appendChild(command);
		unit.appendChild(stats);
		let traits = document.createElement("div");
		traits.className = "unit_trait_list";
		traits.style.position = "absolute";
		traits.style.top = "130px";
		traits.style.left = "5px";
		traits.innerText = "Traits:";
		if (u.hasOwnProperty("traits")) {
			for (let i = 0; i < u.traits.length; i++) {
				try {
					let trait = trait_store[u.traits[i]];
					let trait_entry = Generate_Element.generate_trait_entry(trait.name, null, trait.type);
					trait_entry.classList.add("no_border");
					trait_entry.title = trait.description;
					traits.appendChild(trait_entry);
				} catch (e) {
					console.error(e);
				}
			}
			unit.appendChild(traits);
		}
		let effects = document.createElement("div");
		effects.className = "unit_effect_container";
		effects.innerHTML = "<div class='unit_effect_money' />";
		Generate_Element.set_unit_events(unit);
		return unit;
	},

	generate_commander_icon: function(commander) {
		let icon = document.createElement("div");
		let icon_color = "";
		if (commander.icon_color != "")
			icon_color = " turn_icon_" + commander.icon_color;
		icon.className = "turn_icon turn_icon_" + commander.icon + icon_color;
		icon.style.backgroundColor = commander.color;
		return icon;
	},

	generate_commander_list_entry: function(commander) {
		let cmdr = document.createElement("div");
		cmdr.className = "commander_list_entry";
		cmdr.onclick = function() {
			Commander_Manager.commander_manager_update_commander(commander)
		};
		cmdr.innerHTML = Generate_Element.generate_commander_icon(commander).outerHTML + commander.name + "<span title='Unit limit'>x" + commander.unit_limit + "</span>";
		return cmdr;
	},

	append_turn_tracker_initiative_update_event: function(entry) {
		let turn_tracker_initiative = entry.querySelector(".turn_tracker_initiative");
		turn_tracker_initiative.onclick = function(event) {
			event.target.innerHTML = "<input class='initiative_input' value='" + event.target.innerText + "' onkeydown='Events.num_increment_decrement(event)' onclick='Events.field_auto_select(event)' onblur='Turn_Tracker.update_initiative(event);' />";
			event.target.children[0].select();
		};
	},

	generate_turn_tracker_entry: function(commander, initiative = 0) {
		let turn_tracker_entry = document.createElement("div");
		turn_tracker_entry.className = "turn_tracker_entry";
		turn_tracker_entry.setAttribute("commander", commander.id);
		turn_tracker_entry.title = commander.name;

		let icon = Generate_Element.generate_commander_icon(commander);
		turn_tracker_entry.appendChild(icon);

		let turn_tracker_initiative = document.createElement("div");
		turn_tracker_initiative.className = "turn_tracker_initiative";
		turn_tracker_initiative.innerText = initiative.toString();
		turn_tracker_entry.appendChild(turn_tracker_initiative);
		Generate_Element.append_turn_tracker_initiative_update_event(turn_tracker_entry);
		return turn_tracker_entry;
	},

	generate_trait_entry: function(title, description = null, type = "passive") {
		let trait_entry = document.createElement("div");
		trait_entry.className = "trait_entry " + type;

		let trait_title = document.createElement("div");
		trait_title.className = "trait_title";
		trait_title.innerText = title;
		trait_entry.appendChild(trait_title);

		if (description != null) {
			let trait_description = document.createElement("div");
			trait_description.className = "trait_description";
			trait_description.innerText = description;
			trait_entry.appendChild(trait_description);
		}

		return trait_entry;
	},
//</editor-fold>
}