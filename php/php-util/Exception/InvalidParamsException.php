<?php

namespace JsonRpc\Exception;

use Throwable;

class InvalidParamsException extends \Exception
{
    protected $code = -32602;
    protected $message = 'Invalid params';
}