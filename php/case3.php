<?php

require_once 'php-util/imports.php';

header('Content-Type: application/json');

$request = file_get_contents('php://input');
$data = json_decode($request, true);

shuffle($data);

$responses = [];

foreach ($data as $d) {
    if (!array_key_exists('id', $d)) continue;
    if (!array_key_exists('method', $d)) continue;
    $id = $d['id'];
    $method = $d['method'];
    $responses[] = [
        'jsonrpc' => '2.0',
        'result' => [
            $method,
            $d,
        ],
        'id' => $id,
    ];
}

echo json_encode($responses);