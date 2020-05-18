<?php

namespace JsonRpc\Exception;

class InternalErrorException extends AbstractJsonRpcException
{
    protected $code = -32603;
    protected $message = 'Internal error';
}