<?php

require_once 'php-util/imports.php';

header('Content-Type: application/json');
echo json_encode([
    'GET' => $_GET,
    'SERVER' => $_SERVER,
]);