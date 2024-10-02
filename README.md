# alternative-formats-files-prototype

A selection of views and routes for alternative formats a prototype

## Using with the prototype kit

1. Install this repo

```
npm install github:dwp/alternative-formats-files-prototype
```

2. Include the routes

```
// Add your routes normally this would be routes.js

const alternativeFormatsPrototype = require("alternative-formats-files-prototype");

alternativeFormatsPrototype(router);
```

3. Access the page, you can do this via a redirect or a link. You will need to set the alternative_formats_exit_url to where you want the exit page to go

```
{# example of a start button #}
{{ 
    govukButton({
        text: "Start now",
        href: "/dwp-alternative-formats-plugin/start&alternative_formats_exit_url=/end",
        isStartButton: true
    })
}}
```
