const Unit_Manager = {
	/**
	 * Update list of units on the left side of the Unit manager from `unit_store`
	 */
	update_unit_list: function() {
		unit_editor_unit_list.innerHTML = "";
		for (let i = 0; i < unit_store.length; i++) {
			let unit = unit_store[i];
			let unit_element = document.createElement("div");
			unit_element.onclick = function() {
				Unit_Manager.edit_unit(i)
			};
			let tier = unit.tier == 5 ? "V" : unit.tier == 4 ? "IV" : unit.tier == 3 ? "III" : unit.tier == 2 ? "II" : "I";
			unit_element.innerHTML = "<div>" + tier + " | " + (unit.name || (unit.ancestry + " " + unit.type)) + "</div><div>" + unit.experience + " " + unit.equipment + " " + unit.type + "</div>";
			unit_editor_unit_list.appendChild(unit_element);
		}
	},

	/**
	 * Takes the current content of the inputs in the Unit manager and saves unit to `unit_store`
	 * Forces an update of the unit list in Unit manager and menu panel
	 * Saves data to localStorage
	 * @param force_save_as_new If true saves as a new entry even if `unit_editor_current_unit_index` is set
	 */
	save_unit: function(force_save_as_new = false) {
		let unit = {
			name: unit_editor_name.value,
			type: unit_editor_type.value,
			ancestry: unit_editor_ancestry.value,
			stats: {
				attack: unit_editor_atk.value,
				defense: unit_editor_def.value,
				power: unit_editor_pow.value,
				toughness: unit_editor_tou.value,
				morale: unit_editor_mor.value,
				command: unit_editor_com.value
			},
			experience: unit_editor_experience.value,
			equipment: unit_editor_equipment.value,
			tier: unit_editor_tier.value,
			damage: unit_editor_damage.value,
			size: unit_editor_size.value,
			attacks: unit_editor_attacks.value,
			traits: Unit_Manager.get_checked_traits(),
		};
		if (force_save_as_new || unit_editor_current_unit_index.value == "") {
			console.debug("Save as new unit");
			unit_store.push(unit);
		} else {
			console.debug("Update existing unit at index " + unit_editor_current_unit_index.value);
			unit_store[unit_editor_current_unit_index.value] = unit;
		}
		Unit_Manager.update_unit_list();
		Menu_Panel.update_unit_list();
		Unit_Manager.clear_fields();
		Data.save_data();
	},

	/**
	 * Attempts to fetch the unit with the given index from `unit_store` and load values into input fields in the Unit manager
	 * Sets the field `unit_editor_current_unit_index` to the index so edits can be saved by `save_unit`
	 * @param index
	 */
	edit_unit: function(index) {
		let unit = unit_store[index];
		if (typeof unit == "undefined" || unit == null) {
			console.warn("Unable to retrieve unit at index " + index);
			Chat.send_chat_error("Unable to retrieve unit from unit store");
		} else {
			unit_editor_current_unit_index.value = index;
			unit_editor_name.value = unit.name;
			unit_editor_type.value = unit.type;
			unit_editor_ancestry.value = unit.ancestry;
			unit_editor_atk.value = unit.stats.attack;
			unit_editor_def.value = unit.stats.defense;
			unit_editor_pow.value = unit.stats.power;
			unit_editor_tou.value = unit.stats.toughness;
			unit_editor_mor.value = unit.stats.morale;
			unit_editor_com.value = unit.stats.command;
			unit_editor_experience.value = unit.experience;
			unit_editor_equipment.value = unit.equipment;
			unit_editor_tier.value = unit.tier;
			unit_editor_damage.value = unit.damage;
			unit_editor_size.value = unit.size;
			unit_editor_attacks.value = unit.attacks;
			unit_editor_button_save.classList.remove("hidden");
			Unit_Manager.update_trait_list(unit.traits);
		}
	},

	/**
	 * Resets all input fields in the Unit manager to their default values
	 */
	clear_fields: function() {
		unit_editor_current_unit_index.value = "";
		unit_editor_name.value = "";
		unit_editor_type.selectedIndex = 0;
		unit_editor_ancestry.selectedIndex = 0;
		unit_editor_atk.value = 0;
		unit_editor_def.value = 0;
		unit_editor_pow.value = 0;
		unit_editor_tou.value = 0;
		unit_editor_mor.value = 0;
		unit_editor_com.value = 0;
		unit_editor_experience.selectedIndex = 1;
		unit_editor_equipment.selectedIndex = 0;
		unit_editor_tier.value = 1;
		unit_editor_damage.value = 1;
		unit_editor_size.value = 1;
		unit_editor_attacks.value = 1;
		unit_editor_button_save.classList.add("hidden");
		Unit_Manager.update_trait_list();
	},

	/**
	 * Refreshes the trait list in the Unit manager
	 * @param traits If a list of trait ids' are provided matching traits will be checked
	 */
	update_trait_list: function(traits = []) {
		unit_manager_trait_list.innerHTML = "";
		for (let i in trait_store) {
			let trait = trait_store[i];
			let entry = document.createElement("div");

			let checkbox = document.createElement("input");
			checkbox.type = "checkbox";
			checkbox.className = "unit_manger_trait_checkbox";
			checkbox.setAttribute("trait-id", i);
			if (traits.indexOf(i) !== -1)
				checkbox.checked = true;

			let label = document.createElement("label");
			label.appendChild(checkbox);
			label.style.marginLeft = "6px";
			label.title = trait.description;

			// let title = document.createElement("span");
			// title.style.display = "inline-block";
			// title.innerText = trait.name;
			let title = Generate_Element.generate_trait_entry(trait.name, null, trait.type);
			title.classList.add("no_border");
			label.appendChild(title);

			entry.appendChild(label);
			unit_manager_trait_list.appendChild(entry);
		}
	},

	trait_search_timeout: null,
	/**
	 * Filters the Unit manager trait list by searching for entire contents in any position in trait title
	 */
	trait_search: function(event) {
		clearTimeout(Unit_Manager.trait_search_timeout);
		setTimeout(function() {
			for (let i = 0; i < unit_manager_trait_list.children.length; i++) {
				let child = unit_manager_trait_list.children[i];
				let title = child.querySelector(".trait_title").innerText;
				if (title.toLowerCase().indexOf(unit_manager_trait_search.value.toLowerCase()) !== -1)
					child.classList.remove("hidden");
				else
					child.classList.add("hidden");
			}
		}, 300);
	},

	/**
	 * @returns {string[]} A list of trait ids' that were selected in the Unit manager trait list
	 */
	get_checked_traits: function() {
		let traits = [];
		for (let i = 0; i < unit_manager_trait_list.children.length; i++) {
			let trait = unit_manager_trait_list.children[i];

			let checkbox = trait.querySelector("input[type=checkbox]");
			if (typeof checkbox !== "undefined" && checkbox != null && checkbox.checked) {
				traits.push(checkbox.getAttribute("trait-id"));
			}
		}
		return traits;
	},

	/**
	 * Exports `unit_store` to import/export text area as a JSON string
	 */
	units_export: function() {
		unit_import_export_data.value = JSON.stringify(unit_store);
	},

	/**
	 * Parse contents of import/export text area as a JSON string. If successful load into `unit_store`
	 */
	units_import: function() {
		if (!window.confirm("Importing will completely overwrite the current unit store! Are you sure?")) {
			GUI.hide_modal('unit_import_export');
			GUI.show_modal('unit_manager');
			return;
		}
		try {
			unit_store = JSON.parse(unit_import_export_data.value);
			Data.save_data();
			Unit_Manager.update_unit_list();
			Menu_Panel.update_unit_list();
			GUI.hide_modal('unit_import_export');
			GUI.show_modal('unit_manager');
		} catch (e) {
			unit_import_export_error.innerText = "An error occurred while importing. Check that the Json is valid. Check the console for more details.";
			unit_import_export_error.classList.remove("hidden");
			console.error(e);
		}
	},
}