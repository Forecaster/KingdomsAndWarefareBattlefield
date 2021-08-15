<?php
if (!isset($_GET['path']))
	die("No path");
$path = $_GET['path'];
header("Content-type: image/svg+xml;");

$svg = file_get_contents(__DIR__ . "/" . $path);
if (!$svg)
	die("File not found");
if (isset($_GET['fill'])) {
	$re = '/(fill=\").*?(\")/m';
	$subst = '$1' . $_GET['fill'] . '$2';
	die(preg_replace($re, $subst, $svg));
}
die($svg);
