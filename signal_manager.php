<?php
if (!is_dir("signals"))
	mkdir("signals");

// REGISTER HOST
if ($_POST['mode'] == "register_host") {
	file_put_contents("signals/" . $_POST['id'] . ".host", $_POST['offer']);
	die(json_encode(array("result" => 0, "data" => "Host " . $_POST['id'] . " registered")));
}

// REGISTER CLIENT
if ($_POST['mode'] == "register_client") {
	file_put_contents("signals/" . $_POST['host_id'] . ".client_" . $_POST['id'], json_encode(array("id" => $_POST['id'], "nickname" => $_POST['nickname'])));
	die(json_encode(array("result" => 0, "data" => "Client " . $_POST['id'] . " registered")));
}

// CONNECT HOST
if ($_POST['mode'] == "get_clients") {
	$files = array();
	foreach (glob("signals/" . $_POST['id'] . ".client*") as $file) {
		array_push($files, json_decode(file_Get_contents($file)));
		unlink($file);
	}
//	$signal = file_get_contents("signals/" . $_POST['id'] . ".answer");
//	unlink("signals/" . $_POST['id'] . ".answer");
	if (count($files) > 0)
		die(json_encode(array("result" => 0, "data" => $files)));
	else
		die(json_encode(array("result" => 1, "msg" => "No client files retrieved")));
}

die(json_encode(array("result" => 1, "msg" => "Unknown mode '" . $_POST['mode'] . "'")));

