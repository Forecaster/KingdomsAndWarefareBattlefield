const Menu_Panel = {
	Events: {
		menu_panel_hide_key: null,
		menu_panel_hide_timeout: null,
		on_panel_leave: function(event) {
			if (!menu_panel.classList.contains("pinned")) {
				if (Menu_Panel.Events.menu_panel_hide_key !== null) {
					clearTimeout(Menu_Panel.Events.menu_panel_hide_key);
					Menu_Panel.Events.menu_panel_hide_key = null;
				}
				this.menu_panel_hide_key = setTimeout(function() {
					Menu_Panel.hide_menu_panel();
					Menu_Panel.Events.menu_panel_hide_key = null;
				}, 1000);
			}
		},

		on_panel_enter: function(event) {
			if (Menu_Panel.Events.menu_panel_hide_key != null) {
				clearTimeout(Menu_Panel.Events.menu_panel_hide_key);
				Menu_Panel.Events.menu_panel_hide_key = null;
			}
		},
	},

	show_menu_panel: function() {
		// This prevents the menu panel from closing immediately after starting moving due to mouse events.
		// Closing is prohibited until just before the animation is complete.
		Menu_Panel.Events.menu_panel_hide_timeout = setTimeout(function() {
			Menu_Panel.Events.menu_panel_hide_timeout = null;
		}, (parseInt(window.getComputedStyle(menu_panel)["transitionDuration"]) * 1000) - 10);
		// Check if panel is not already shown. This is to prevent calling `onmodalshow` unless actually showing the panel
		if (!menu_panel.classList.contains("concealed"))
			return;
		try {
			eval(menu_panel.getAttribute("onmodalshow"));
		} catch (e) {}
		menu_panel.classList.remove("concealed");
	},

	hide_menu_panel: function() {
		// Check if closing is permitted by the timeout started in show_menu_panel
		if (Menu_Panel.Events.menu_panel_hide_timeout !== null)
			return;
		// Check if panel is already hidden. This is to prevent calling `onmodalhide` unless actually hiding the panel
		if (menu_panel.classList.contains("concealed"))
			return;
		try {
			eval(menu_panel.getAttribute("onmodalhide"));
		} catch (e) {}
		menu_panel.classList.add("concealed");
	},

	pin_menu_panel: function() {
		menu_panel.classList.add("pinned");
	},

	unpin_menu_panel: function() {
		menu_panel.classList.remove("pinned");
	},

	toggle_pin_menu_panel: function() {
		if (menu_panel.classList.contains("pinned"))
			Menu_Panel.unpin_menu_panel();
		else
			Menu_Panel.pin_menu_panel();
	},

	/**
	 * Refresh list of unit cards in menu panel from `unit_store`
	 */
	update_unit_list: function() {
		menu_panel_unit_container.innerHTML = "";
		for (let i = 0; i < unit_store.length; i++) {
			menu_panel_unit_container.appendChild(Generate_Element.generate_unit(unit_store[i], i));
		}
	},
}