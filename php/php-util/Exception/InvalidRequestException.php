<?php

namespace JsonRpc\Exception;

class InvalidRequestException extends \Exception
{
    protected $code = -32600;
    protected $message = 'Invalid Request';
}