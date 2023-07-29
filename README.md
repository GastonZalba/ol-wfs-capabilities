# ol-wfs-capabilities

<p align="center">
    <a href="https://www.npmjs.com/package/ol-wfs-capabilities">
        <img src="https://img.shields.io/npm/v/ol-wfs-capabilities.svg" alt="npm version">
    </a>
    <a href="https://img.shields.io/npm/dm/ol-wfs-capabilities">
        <img alt="npm" src="https://img.shields.io/npm/dm/ol-wfs-capabilities">
    </a>
    <a href="https://github.com/gastonzalba/ol-wfs-capabilities/blob/master/LICENSE">
        <img src="https://img.shields.io/npm/l/ol-wfs-capabilities.svg" alt="license">
    </a>
</p>

Module to work alongside Open Layers for reading WFS Capabilities data (version 2.0.0) and convert it to JSON, complementing the native classes `ol/format/WMSCapabilities` and `ol/format/WMTSCapabilities`.

Open Layers (at least up to 7.4.0 version) does not have a native way to do this (see related [issue](https://github.com/openlayers/openlayers/issues/8909)), hence the creation of this module that does not depend on any other external dependency other than what comes with Ol.

## How to use
```js
import WFSCapabilities from 'ol-wfs-capabilities';

const parser = new WFSCapabilities();

const parsedCapabilities = parser.read(myWfsCapabilitiesSource);
```

## License
MIT (c) Gastón Zalba.