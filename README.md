# Resource Path

[![Travis](https://img.shields.io/travis/aurbano/resource-path.svg?style=flat-square)](https://travis-ci.org/aurbano/resource-path)
[![npm](https://img.shields.io/npm/v/resource-path.svg?style=flat-square)](https://www.npmjs.com/package/resource-path)
[![Coveralls](https://img.shields.io/coveralls/aurbano/resource-path.svg)](https://coveralls.io/github/aurbano/resource-path)
[![npm](https://img.shields.io/npm/dm/resource-path.svg)](https://www.npmjs.com/package/resource-path)
[![npm](https://img.shields.io/npm/l/resource-path.svg)](https://www.npmjs.com/package/resource-path)

> Tiny module to generate resource paths for APIs, with zero dependencies

This module implements Angular's resource URL definition, so that you can easily interact with an API.

Example:

```js
import resource from 'resource-path';

const input = '/path/to/resource/:id';
const params = {
  id: 123
};

resource(input, params);
// Returns: /path/to/resource/123
```

```js
const input = '/path/to/resource/:id/something/:param2';
const params = {
  id: 123
};

resource(input, params);
// Returns: /path/to/resource/123
```

## Getting started

Install:

```bash
npm install --save resource-path
# or if you prefer yarn
yarn add resource-path
```

Usage

```js
import resource from 'resource-path';

resource(path, [params]);
```

* `path` `{string}` Is the path to the resource. Either a full URL or a relative path. It can contain identifiers in the form of `:identifier` in any part of the path.
* `params` `{Object}` An object with key/value pairs, where the keys are identifiers in the path, and the value is what will be replaced in it.
 
The `resource` method will return the path, substituting the params whenever if finds an indentifier. As soon as it finds an identifier without a specified parameter it stops.This way you can define full API paths that are reusable.
 
## Testing
 
Tests are located in the `tests` folder, and are written with `ava`.
 
## Contributing
 
Feel free to send any PR with new features, more test cases...
 
## License
 
This project is licensed under the MIT License.
