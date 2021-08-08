const GUI = {
	//<editor-fold desc="GUI functions">
	hide_modal: function(id) {
		let mod = document.getElementById(id);
		if (typeof mod != "undefined" && mod != null && (mod.classList.contains("mod") || mod.classList.contains("dynamic_modal"))) {
			mod.classList.add("hidden");
			if (mod.hasAttribute("onmodalhide")) {
				try {
					eval(mod.getAttribute("onmodalhide"));
				} catch (e) {
					console.warn("Error parsing modal onmodalhide");
					console.warn(mod);
					console.warn(e);
				}
			}
		}
	},

	show_modal: function(id, pos = null) {
		let mod = document.getElementById(id);
		if (typeof mod != "undefined" && mod != null && (mod.classList.contains("mod") || mod.classList.contains("dynamic_modal"))) {
			if (typeof pos != "undefined" && pos != null) {
				mod.style.top = pos.y + "px";
				mod.style.left = pos.x + "px";
			}
			if (mod.hasAttribute("onmodalshow")) {
				try {
					eval(mod.getAttribute("onmodalshow"));
				} catch (e) {
					console.warn("Error parsing modal onmodalshow");
					console.warn(mod);
					console.warn(e);
				}
			}
			GUI.update_modal(mod.id);
			mod.classList.remove("hidden");
		}
		if (typeof window[id + "_error"] != "undefined") {
			window[id + "_error"].innerText = "";
			window[id + "_error"].classList.add("hidden");
		}
	},

	update_modal: function(id) {
		let mod = document.getElementById(id);
		if (typeof mod != "undefined" && mod != null && mod.classList.contains("mod")) {
			if (mod.hasAttribute("onupdate")) {
				try {
					eval(mod.getAttribute("onupdate"));
				} catch (e) {
					console.warn("Error parsing modal onupdate");
					console.warn(mod);
					console.warn(e);
				}
			}
		}
		if (typeof window[id + "_error"] != "undefined") {
			window[id + "_error"].innerText = "";
			window[id + "_error"].classList.add("hidden");
		}
	},

	update_all_visible_modals: function() {
		let modals = document.querySelectorAll(".mod");
		for (let i = 0; i < modals.length; i++) {
			let modal = modals[i];
			if (!modal.classList.contains("hidden"))
				GUI.update_modal(modal.id);
		}
	},

	show_bubble_menu: function(pos, b1, b2, b3, b4) {
		if (typeof b1 != "undefined" && b1 != null) {
			bub1.className = "sub_bubble bub1";
			bub1.style.display = null;
			bub1.onclick = b1.click;
			if (typeof b1.icon !== "undefined" && b1.icon != null) {
				bub1.innerText = "";
				bub1.classList.add(b1.icon);
			} else
				bub1.innerText = b1.label;
			if (typeof b1.title !== "undefined" && b1.title !== null)
				bub1.title = b1.title;
		} else {
			bub1.style.display = "none";
		}
		if (typeof b2 != "undefined" && b2 != null) {
			bub2.className = "sub_bubble bub2";
			bub2.style.display = null;
			bub2.onclick = b2.click;
			if (typeof b2.icon !== "undefined" && b2.icon != null) {
				bub2.innerText = "";
				bub2.classList.add(b2.icon);
			} else
				bub2.innerText = b2.label;
			if (typeof b2.title !== "undefined" && b2.title !== null)
				bub2.title = b2.title;
		} else {
			bub2.style.display = "none";
		}
		if (typeof b3 != "undefined" && b3 != null) {
			bub3.className = "sub_bubble bub3";
			bub3.style.display = null;
			bub3.onclick = b3.click;
			if (typeof b3.icon !== "undefined" && b3.icon != null) {
				bub3.innerText = "";
				bub3.classList.add(b3.icon);
			} else
				bub3.innerText = b3.label;
			if (typeof b3.title !== "undefined" && b3.title !== null)
				bub3.title = b3.title;
		} else {
			bub3.style.display = "none";
		}
		if (typeof b4 != "undefined" && b4 != null) {
			bub4.className = "sub_bubble bub4";
			bub4.style.display = null;
			bub4.onclick = b4.click;
			if (typeof b4.icon !== "undefined" && b4.icon != null) {
				bub4.innerText = "";
				bub4.classList.add(b4.icon);
			} else
				bub4.innerText = b4.label;
			if (typeof b4.title !== "undefined" && b4.title !== null)
				bub4.title = b4.title;
		} else {
			bub4.style.display = "none";
		}
		bub1.style.top = "0";
		bub1.style.left = "0";
		bub2.style.top = "0";
		bub2.style.left = "0";
		bub3.style.top = "0";
		bub3.style.left = "0";
		bub4.style.top = "0";
		bub4.style.left = "0";
		bubble_menu.style.top = (pos.y - 15) + "px";
		bubble_menu.style.left = (pos.x + 15) + "px";
		bubble_menu.classList.remove("hidden");
		setTimeout(function() {
			bub1.style.top = null;
			bub1.style.left = null;
			bub2.style.top = null;
			bub2.style.left = null;
			bub3.style.top = null;
			bub3.style.left = null;
			bub4.style.top = null;
			bub4.style.left = null;
		}, 200);
	},

	hide_bubble_menu: function() {
		bubble_menu.classList.add("hidden");
	},

	update_icon_selector: function() {
		let container = icon_selector.querySelector("#icon_container");
		container.innerHTML = "";
		for (let i = 0; i < turn_icons.length; i++) {
			let name = turn_icons[i];
			let icon = document.createElement("div");
			icon.className = "turn_icon turn_icon_" + name;
			icon.setAttribute("data-icon", name);
			icon.onclick = function() {
				commander_manager_icon.className = icon.className;
				commander_manager_icon.setAttribute("data-icon", icon.getAttribute("data-icon"));
				GUI.hide_modal("icon_selector");
			}
			container.appendChild(icon);
		}
	}
	//</editor-fold>
}
