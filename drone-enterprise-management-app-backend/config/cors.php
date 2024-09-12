<?php

return [

    'paths' => ['api/*', 'sanctum/csrf-cookie', '/login', '/register', '/logout', '/posts', '/posts/*', '/user/check', '/orders/*', '/orders', '/notifications', '/notifications/*', '/verifyAccount', '/regenerate-token', '/contact'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [env(key: 'FRONTEND_URL')],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];
