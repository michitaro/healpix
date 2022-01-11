# HEALPix

## Introduction

This module is an implementation of [HEALPix](http://healpix.sourceforge.net) in [TypeScript](https://www.typescriptlang.org/). A Javascript version is available as well. (Typescript is a typed superset of Javascript, that compiles to Javascript.)

This package was implemented based on the description in the [HEALPix paper](http://iopscience.iop.org/article/10.1086/427976/pdf). Pixelisation-related functions (including corners) and disk query are available for the ring and nested HEALPix pixelisation schemes. Most API interfaces are ported from wonderful [healpy](https://healpy.readthedocs.io/) Python package, and tests against `healpy` are used to show correctness.

The following sections explain installation and usage, and give examples. Detailed [API documentation](https://michitaro.github.io/healpix/typedoc/) is also available.

### Limitations
* This package can handle only ```norder``` <= 15.

## Installation and Usage

### With NPM

If you are using [Node.js](https://nodejs.org/), you can download and install [@hscmap/healpix](https://www.npmjs.com/package/@hscmap/healpix) with [npm](https://www.npmjs.com/):

```sh
npm install --save @hscmap/healpix
```

Then from your Javascript (JS) you can require and use `healpix` like this:
```js
const healpix = require('@hscmap/healpix');
console.log(healpix.order2nside(0));
```

From Typescript import and use it like this:
```typescript
import * as healpix from '@hscmap/healpix';
console.log(healpix.order2nside(0));
```

### Standalone JS

Another option is to use ``healpix.js`` as a standalone library.

Thanks to the [unpkg](https://unpkg.com/) CDN, you can simply add this line to your HTML file:
```html
<script src="https://unpkg.com/@hscmap/healpix@latest/standalone/dist/healpix.js"></script>
```
and after that line you can call `healpix` functions like this:
```html
<script>
console.log(healpix.order2nside(0));
</script>
```
If you don't want to use the latest version, select one from [here](https://unpkg.com/@hscmap/healpix/).

## Examples

Examples using `healpix` are available here: http://michitaro.github.io/healpix/

The code is available here:

* [docs/example/src/pixcoord2vec](docs/example/src/pixcoord2vec)
* [docs/example/src/query_disc](docs/example/src/query_disc)

Instructions how to build the examples locally are in the next section.

## Developer documentation

To hack on this package, clone https://github.com/michitaro/healpix from Github:
```
git clone https://github.com/michitaro/healpix.git
cd healpix
```

Then run `npm install` to install the tools and dependencies used (especially [Typescript](https://www.typescriptlang.org/) and [Webpack](https://webpack.js.org/)):
```sh
npm install
```

The package is implemented in a single Typescript file: [src/index.ts](src/index.ts).

To generate the standalone Javascript package ``standalone/dist/healpix.js``, run this command:
```sh
npm run standalone
```

To compile and run the examples locally:
```
npm run build-example
```

To test the package install Python and [healpy](http://healpy.readthedocs.io/) first, and then run:
```
npm run my-test
```

Feedback, issues and contributions welcome: https://github.com/michitaro/healpix

## See Also
* http://healpix.sourceforge.net
* https://healpy.readthedocs.io

## License

This software is released under the MIT License, see LICENSE.
