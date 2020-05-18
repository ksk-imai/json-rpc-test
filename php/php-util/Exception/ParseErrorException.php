<?php

namespace JsonRpc\Exception;

class ParseErrorException extends \Exception
{
    protected $code = -32700;
    protected $message = 'Parse error';
}