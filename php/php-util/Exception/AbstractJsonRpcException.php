<?php

namespace JsonRpc\Exception;

use Throwable;

abstract class AbstractJsonRpcException extends \Exception
{
    protected $code = 0;
    protected $message = '';

    public function __construct(Throwable $previous = null)
    {
        parent::__construct($this->message, $this->code, $previous);
    }
}