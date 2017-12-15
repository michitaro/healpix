# HEALPix

## Introduction
* This module is an implementation of [HEALPix](http://healpix.sourceforge.net) in JavaScript / TypeScript.
* Most API interfaces are ported from [healpy](https://healpy.readthedocs.io/en/latest/)


## Example
```typescript
import * as healpix from '@hscmap/healpix'

healpix.nest2ring(16, 1130) // => 1504
```


## Progress
|API                |status|
|-------------------|:------------------------------------:|
|nest2ring          |😀|
|ring2nest          |😀|
|vec2pix_nest       |😀|
|vec2pix_ring       |😀|
|ang2pix_nest       |😀|
|ang2pix_ring       |😀|
|pix2vec_nest       |😀|
|pix2vec_ring       |😀|
|query_disc_nest    ||
|query_disc_ring    ||
|corners_nest       |😀|
|corners_ring       |😀|
|nside2resol        |😀|
|nside2pixarea      |😀|

## See Also
* http://healpix.sourceforge.net
* https://healpy.readthedocs.io