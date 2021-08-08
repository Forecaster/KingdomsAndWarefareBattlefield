const Trait_Manager = {
	Events: {
		on_description_paste: function(event) {
			if (!settings.trait_description_correction)
				return;
			setTimeout(function() {
			event.target.value = event.target.value.replaceAll("\n", "").replaceAll("", "").trim();
			if (event.target.value.toLowerCase().indexOf("if this unit") !== -1)
				trait_manager_trait_type.value = "conditional";
			else if (event.target.value.toLowerCase().indexOf("as an action") === 0)
				trait_manager_trait_type.value = "action";
			else if (event.target.value.toLowerCase().indexOf("as a reaction") === 0)
				trait_manager_trait_type.value = "reaction";
			if (event.target.value[event.target.value.length-1] !== "." && event.target.value[event.target.value.length-1] !== "!")
				event.target.value += ".";
			}, 100);
		},
	},
	trait_add: function(trait = null) {
		if (trait == null) {
			trait = {
				id: trait_manager_trait_name.value.toLowerCase().replaceAll(" ", "_"),
				name: trait_manager_trait_name.value,
				description: trait_manager_trait_description.value,
				type: trait_manager_trait_type.value,
			};
		}

		if (typeof trait.name !== "undefined" && trait.name !== null && trait.name !== "") {
			if (!trait_store.hasOwnProperty(trait.id)) {
				trait_store[trait.id] = trait;
				Trait_Manager.update_trait_manager_list();
				Trait_Manager.clear_fields();
				Data.save_data();
			} else {
				Chat.send_chat_error("Trait with this ID already exists.");
			}
		}
	},

	update_trait: function() {
		let trait_id = trait_manager_trait_id.value;
		if (typeof trait_id != "undefined" && trait_id != null && trait_id != "") {
			trait_store[trait_id] = {
				id: trait_id,
				name: trait_manager_trait_name.value,
				description: trait_manager_trait_description.value,
				type: trait_manager_trait_type.value,
			};
			Trait_Manager.update_trait_manager_list();
			Trait_Manager.clear_fields();
			Data.save_data();
		}
	},

	/**
	 * @param trait_id:string If trait_id is null deletes current trait id in `trait_manager_trait_id` if any
	 */
	delete_trait: function(trait_id = null) {
		if (typeof trait_id == "undefined" || trait_id == null || trait_id === "" )
			trait_id = trait_manager_trait_id.value;
		if (trait_store.hasOwnProperty(trait_id)) {
			delete trait_store[trait_id];
			Data.save_data();
			Trait_Manager.update_trait_manager_list();
			Trait_Manager.clear_fields();
		}
	},

	update_trait_manager_list: function() {
		trait_manager_trait_list.innerHTML = "";

		for (let i in trait_store) {
			let trait = trait_store[i];
			let element = Generate_Element.generate_trait_entry(trait.name, trait.description, trait.type);
			element.onclick = function() {
				trait_manager_trait_id.value = trait.id;
				trait_manager_trait_name.value = trait.name;
				trait_manager_trait_description.value = trait.description;
				trait_manager_trait_type.value = trait.type;
				trait_manager_buttons_save.classList.add("hidden");
				trait_manager_buttons_edit.classList.remove("hidden");
			};
			trait_manager_trait_list.appendChild(element);
		}
		if (trait_manager_trait_list.children.length == 0)
			trait_manager_trait_list.innerHTML = "There are no traits to list";
	},

	clear_fields: function() {
		trait_manager_trait_id.value = "";
		trait_manager_trait_name.value = "";
		trait_manager_trait_description.value = "";
		trait_manager_trait_type.value = "passive";
		trait_manager_buttons_save.classList.remove("hidden");
		trait_manager_buttons_edit.classList.add("hidden");
	},
}