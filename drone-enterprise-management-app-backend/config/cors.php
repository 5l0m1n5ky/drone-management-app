<?php

return [

    'paths' => ['api/*', 'sanctum/csrf-cookie', '/login', '/register', '/logout', '/posts', '/services', '/posts/*', '/user/check', '/orders/*', '/orders', '/states', '/notifications', '/background-music', '/subservices', '/dates', '/notifications/*', '/verify-account', '/regenerate-token', '/contact'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [env(key: 'FRONTEND_URL')],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];
