<?php

namespace JsonRpc\Exception;

class MethodNotFoundException extends \Exception
{
    protected $code = -32601;
    protected $message = 'Method not found';
}