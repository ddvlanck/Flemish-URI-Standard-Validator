# Flemish-URI-Standard-Validator

## Introduction

The Flemish government uses form rules, described in this [document](https://data.vlaanderen.be/cms/VlaamseURI-StandaardVoorData_V1.0.pdf), to comply in order to access data resources in a uniform manner via the Web. This document describes how "Uniform Resource Identifiers" (URIs) must be manufactured to identify those resources persistently. This allows underlying systems to evolve while the URI remains unchanged. The form rules do not necessarily apply to URIs of services, but they do apply to data that are accessed via services.

This validator checks whether these form rules are met. The following rules are checked by the validator:
<ul>
  <li>Does the URI scheme use the HTTP(S) protocol?</li>
  <li>Does the URI scheme follow the following structure: {domein}/{type}/{concept}(/{referentie})*</li>
  <li>Does the {type} of all URIs in the domain and subdomains follow the same strict classification, including at least id, doc and ns?</li>
  <li>Except when {type} is ns, no fragment identifiers are being used</li>
</ul>

## Installation

### Node
```
npm install
const uriValidator = require('flemish-uri-standard-validator')
```

### Browser
```
npm run build
```
The `dist/main.js` file can then be reused in a Web application via the script tag
