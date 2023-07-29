# ol-wfs-capabilities
Module to work alongside Open Layers for reading WFS Capabilities data (version 2.0.0) and convert it to JSON, complementing the native classes `ol/format/WMSCapabilities` and `ol/format/WMTSCapabilities`.

Open Layers (at least up to 7.4.0 version) does not have a native way to do this (see related [issue](https://github.com/openlayers/openlayers/issues/8909)), hence the creation of this module that does not depend on any other external dependency other than what comes with Ol.

## How to use
```js
import WFSCapabilities from 'ol-wfs-capabilities';

const parser = new WFSCapabilities();

const parsedCapabilities = parser.read(myWfsCapabilitiesSource);
```