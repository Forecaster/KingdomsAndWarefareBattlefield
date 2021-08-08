const Data = {
	//<editor-fold desc="LOCAL DATA STORAGE">
	load_data: function() {
		if (typeof window.localStorage.settings !== "undefined") {
			try {
				settings = JSON.parse(window.localStorage.settings);
			} catch (e) {
				console.warn(e);
			}
		}
		if (typeof window.localStorage.unit_store !== "undefined") {
			try {
				unit_store = JSON.parse(window.localStorage.unit_store);
			} catch (e) {
				console.warn(e);
			}
		}
		if (typeof window.localStorage.trait_store !== "undefined") {
			try {
				trait_store = JSON.parse(window.localStorage.trait_store);
			} catch (e) {
				console.warn(e);
			}
		}
		GUI.update_all_visible_modals();
	},

	save_data: function() {
		window.localStorage.settings = JSON.stringify(settings);
		window.localStorage.unit_store = JSON.stringify(unit_store);
		window.localStorage.trait_store = JSON.stringify(trait_store);
	}

	//</editor-fold>
}