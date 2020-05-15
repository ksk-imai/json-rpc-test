<?php

require_once 'php-util/imports.php';

header('Content-Type: application/json');

$request = file_get_contents('php://input');
var_dump($request, json_decode($request, true));


echo json_encode([
]);