<?php

require_once 'php-util/imports.php';

header('Content-Type: application/json');

$request = file_get_contents('php://input');
$data = json_decode($request, true);

shuffle($data);

$responses = [];

$makeResponse = function ($data) {
    $id = $data['id'];
    $response = [
        'jsonrpc' => '2.0',
        'id' => $id,
    ];
    try {
        if (mt_rand(1, 100) % 4 === 0) {
            switch (mt_rand(1, 5)) {
                case 1:
                    throw new \JsonRpc\Exception\InternalErrorException();
                    break;
                case 2:
                    throw new \JsonRpc\Exception\InvalidParamsException();
                    break;
                case 3:
                    throw new \JsonRpc\Exception\InvalidRequestException();
                    break;
                case 4:
                    throw new \JsonRpc\Exception\MethodNotFoundException();
                    break;
                default:
                    throw new \JsonRpc\Exception\ParseErrorException();
            }
        }
        $method = $data['method'];
        $response['result'] = [
            $method,
            $data,
        ];
    } catch (Exception $ex) {
        $response['error'] = [
            'code' => $ex->getCode(),
            'message' => $ex->getMessage(),
        ];
    }
    return $response;
};

foreach ($data as $d) {
    if (!array_key_exists('id', $d)) continue;
    if (!array_key_exists('method', $d)) continue;
    $responses[] = $makeResponse($d);
}

echo json_encode($responses);