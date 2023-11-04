
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('ol/format/XML.js'), require('ol/xml.js'), require('ol/format/xlink.js'), require('ol/format/xsd.js')) :
  typeof define === 'function' && define.amd ? define(['ol/format/XML.js', 'ol/xml.js', 'ol/format/xlink.js', 'ol/format/xsd.js'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.WFSCapabilities = factory(global.ol.format.XML, global.ol.xml, global.ol.format.xlink, global.ol.format.xsd));
})(this, (function (XML, xml_js, xlink_js, xsd_js) { 'use strict';

  /**
   * @module ol/format/WFSCapabilities
   */

  /**
   * @typedef {function(Element, Array<*>): void} Parser
   */

  /**
   * @const
   * @type {Object<string,string>}
   */
  const VERSIONS = {
    _200: '2.0.0',
    _110: '1.1.0',
    _100: '1.0.0',
  };

  /**
   *
   * @param {Array<*>} objectStack Object stack.
   * @return {string} WFS version number
   */
  function getVersion(objectStack) {
    return objectStack[0].version;
  }
  /**
   * @const
   * @type {Array<null|string>}
   */
  const NAMESPACE_URIS = [
    null,
    'http://www.opengis.net/fes/2.0',
    'http://www.opengis.net/ows/1.1',
    'http://www.opengis.net/ows',
    'http://www.opengis.net/wfs',
    'http://www.opengis.net/wfs/2.0',
    'http://www.opengis.net/ogc',
    'http://www.opengis.net/gml',
    'http://www.opengis.net/gml/3.2',
  ];

  /**
   * @const
   * @type {Object<string, Object<string,Object<string, import("ol/xml.js").Parser>>>}
   */
  const PARSERS = {
    [VERSIONS._200]: xml_js.makeStructureNS(NAMESPACE_URIS, {
      ServiceIdentification: xml_js.makeObjectPropertySetter(readServiceIdentification),
      ServiceProvider: xml_js.makeObjectPropertySetter(readServiceProvider),
      OperationsMetadata: xml_js.makeObjectPropertySetter(readOperationsMetadata),
      FeatureTypeList: xml_js.makeObjectPropertySetter(readFeatureTypeList),
      Filter_Capabilities: xml_js.makeObjectPropertySetter(readFilter_Capabilities),
    }),
    [VERSIONS._110]: xml_js.makeStructureNS(NAMESPACE_URIS, {
      ServiceIdentification: xml_js.makeObjectPropertySetter(readServiceIdentification),
      ServiceProvider: xml_js.makeObjectPropertySetter(readServiceProvider),
      OperationsMetadata: xml_js.makeObjectPropertySetter(readOperationsMetadata),
      FeatureTypeList: xml_js.makeObjectPropertySetter(readFeatureTypeList),
      Filter_Capabilities: xml_js.makeObjectPropertySetter(readFilter_Capabilities),
    }),
    [VERSIONS._100]: xml_js.makeStructureNS(NAMESPACE_URIS, {
      Service: xml_js.makeObjectPropertySetter(readServiceIdentification),
      Capability: xml_js.makeObjectPropertySetter(readCapability),
      FeatureTypeList: xml_js.makeObjectPropertySetter(readFeatureTypeList),
      Filter_Capabilities: xml_js.makeObjectPropertySetter(readFilter_Capabilities),
    }),
  };

  /**
   * @classdesc
   * Format for reading WFS capabilities data
   *
   * @api
   */
  class WFSCapabilities extends XML {
    constructor() {
      super();

      /**
       * @type {string|undefined}
       */
      this.version = undefined;
    }

    /**
     * @param {Element} node Node.
     * @return {Object} Object
     */
    readFromNode(node) {
      this.version = node.getAttribute('version').trim();
      const wfsCapabilityObject = xml_js.pushParseAndPop(
        {
          version: this.version,
        },
        PARSERS[this.version],
        node,
        []
      );
      return wfsCapabilityObject ? wfsCapabilityObject : null;
    }
  }

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const SERVICE_IDENTIFICATION_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    Name: xml_js.makeObjectPropertySetter(xsd_js.readString),
    Title: xml_js.makeObjectPropertySetter(xsd_js.readString),
    Abstract: xml_js.makeObjectPropertySetter(xsd_js.readString),
    Keywords: xml_js.makeObjectPropertySetter(function (node, objectStack) {
      const version = getVersion(objectStack);
      return version === VERSIONS._100
        ? readJoinedList(node)
        : readKeywordList(node, objectStack);
    }),
    ServiceType: xml_js.makeObjectPropertySetter(xsd_js.readString),
    ServiceTypeVersion: xml_js.makeObjectPropertySetter(xsd_js.readString),
    Fees: xml_js.makeObjectPropertySetter(xsd_js.readString),
    AccessConstraints: xml_js.makeObjectPropertySetter(xsd_js.readString),
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const SERVICE_PROVIDER_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    ProviderName: xml_js.makeObjectPropertySetter(xsd_js.readString),
    ServiceContact: xml_js.makeObjectPropertySetter(readServiceContact),
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const OPERATIONS_METADATA_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    Operation: xml_js.makeObjectPropertyPusher(readNamedOperation),
    Constraint: xml_js.makeObjectPropertyPusher(readNamedConstraint),
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const CAPABILITY_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    Request: xml_js.makeObjectPropertySetter(readRequests),
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const SERVICE_CONTACT_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    IndividualName: xml_js.makeObjectPropertySetter(xsd_js.readString),
    PositionName: xml_js.makeObjectPropertySetter(xsd_js.readString),
    ContactInfo: xml_js.makeObjectPropertySetter(readContactInfo),
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const CONTACT_INFO_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    Phone: xml_js.makeObjectPropertySetter(readPhone),
    Address: xml_js.makeObjectPropertySetter(readAddress),
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const PHONE_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    Voice: xml_js.makeObjectPropertySetter(xsd_js.readString),
    Facsimile: xml_js.makeObjectPropertySetter(xsd_js.readString),
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const ADDRESS_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    DeliveryPoint: xml_js.makeObjectPropertySetter(xsd_js.readString),
    City: xml_js.makeObjectPropertySetter(xsd_js.readString),
    AdministrativeArea: xml_js.makeObjectPropertySetter(xsd_js.readString),
    PostalCode: xml_js.makeObjectPropertySetter(xsd_js.readString),
    Country: xml_js.makeObjectPropertySetter(xsd_js.readString),
    ElectronicMailAddress: xml_js.makeObjectPropertySetter(xsd_js.readString),
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const FEATURE_TYPE_LIST_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    FeatureType: xml_js.makeArrayPusher(readFeatureType),
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const FEATURE_TYPE_LIST_100_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    Operations: xml_js.makeObjectPropertySetter(readTagList),
    FeatureType: xml_js.makeObjectPropertyPusher(readFeatureType),
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const FEATURE_TYPE_LIST_110_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    Operations: xml_js.makeObjectPropertySetter(readOperation_110),
    FeatureType: xml_js.makeObjectPropertyPusher(readFeatureType),
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const FEATURE_TYPE_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    Name: xml_js.makeObjectPropertySetter(xsd_js.readString),
    Title: xml_js.makeObjectPropertySetter(xsd_js.readString),
    Abstract: xml_js.makeObjectPropertySetter(xsd_js.readString),
    Keywords: xml_js.makeObjectPropertySetter(function (node, objectStack) {
      const version = getVersion(objectStack);
      return version === VERSIONS._100
        ? readJoinedList(node)
        : readKeywordList(node, objectStack);
    }),
    DefaultSRS: xml_js.makeObjectPropertySetter(xsd_js.readString),
    DefaultCRS: xml_js.makeObjectPropertySetter(xsd_js.readString), // 1.1.0
    OtherSRS: xml_js.makeObjectPropertyPusher(xsd_js.readString), // 1.1.0
    SRS: xml_js.makeObjectPropertySetter(xsd_js.readString),
    WGS84BoundingBox: xml_js.makeObjectPropertySetter(readWGS84BoundingBox),
    MetadataURL: xml_js.makeObjectPropertySetter(readHrefOrValue),
    LatLongBoundingBox: xml_js.makeObjectPropertySetter(readLatLongBoundingBox), // 1.0.0
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const OPERATION_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    DCP: xml_js.makeObjectPropertySetter(readDCP),
    Parameter: xml_js.makeObjectPropertyPusher(readNamedParameter),
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const OPERATION_110_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    Operation: xml_js.makeArrayPusher(xsd_js.readString),
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const REQUEST_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    DCPType: makeObjectPropertyMerger(readDCPType),
    SchemaDescriptionLanguage: xml_js.makeObjectPropertySetter(readTagList),
    ResultFormat: xml_js.makeObjectPropertySetter(readTagList),
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const PARAMETER_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    Value: xml_js.makeObjectPropertyPusher(xsd_js.readString),
    AllowedValues: xml_js.makeObjectPropertySetter(readValueList),
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const CONSTRAINT_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    NoValues: xml_js.makeObjectPropertySetter(xsd_js.readString),
    DefaultValue: xml_js.makeObjectPropertySetter(xsd_js.readString),
    AllowedValues: xml_js.makeObjectPropertySetter(readValueList),
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const HTTP_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    Get: xml_js.makeObjectPropertySetter(xlink_js.readHref),
    Post: xml_js.makeObjectPropertySetter(xlink_js.readHref),
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const HTTP_100_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    Get: xml_js.makeObjectPropertySetter(readOnline),
    Post: xml_js.makeObjectPropertySetter(readOnline),
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const WGS84_BOUNDINGBOX_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    LowerCorner: xml_js.makeObjectPropertySetter(readStringCoords),
    UpperCorner: xml_js.makeObjectPropertySetter(readStringCoords),
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const DCP_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    HTTP: xml_js.makeObjectPropertySetter(readHTTP),
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const DCPTYPE_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    HTTP: xml_js.makeObjectPropertySetter(readHTTP_100),
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const KEYWORDLIST_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    Keyword: xml_js.makeArrayPusher(xsd_js.readString),
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const VALUELIST_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    Value: xml_js.makeArrayPusher(xsd_js.readString),
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const FILTER_CAPABILITIES_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    Conformance: xml_js.makeObjectPropertySetter(readConformance),
    Id_Capabilities: xml_js.makeObjectPropertySetter(readId_Capabilities),
    Scalar_Capabilities: xml_js.makeObjectPropertySetter(readScalarCapabilities),
    Spatial_Capabilities: xml_js.makeObjectPropertySetter(readSpatialCapabilities),
    Temporal_Capabilities: xml_js.makeObjectPropertySetter(readTemporalCapabilities),
    Functions: xml_js.makeObjectPropertySetter(readFunctions),
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const CONFORMANCE_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    Constraint: xml_js.makeObjectPropertyPusher(readNamedConstraint),
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const ID_CAPABILITIES_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    ResourceIdentifier: xml_js.makeArrayPusher(readNamedResourceIdentifier),
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const SCALAR_CAPABILITIES_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    LogicalOperators: xml_js.makeObjectPropertySetter(readLogicalOperators),
    ComparisonOperators: xml_js.makeObjectPropertySetter(readComparisonOperators),
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const SCALAR_CAPABILITIES_110_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    LogicalOperators: xml_js.makeObjectPropertySetter(xsd_js.readString),
    ComparisonOperators: xml_js.makeObjectPropertySetter(readTagList),
    ArithmeticOperators: xml_js.makeObjectPropertySetter(readArithmetic_Operators),
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const SCALAR_CAPABILITIES_100_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    Logical_Operators: xml_js.makeObjectPropertySetter(xsd_js.readString),
    Comparison_Operators: xml_js.makeObjectPropertySetter(readTagList),
    Arithmetic_Operators: xml_js.makeObjectPropertySetter(readArithmetic_Operators),
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const SPATIAL_CAPABILITIES_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    GeometryOperands: xml_js.makeObjectPropertySetter(readGeometryOperands),
    SpatialOperators: xml_js.makeObjectPropertySetter(readSpatialOperators),
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const SPATIAL_CAPABILITIES_100_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    Spatial_Operators: xml_js.makeObjectPropertySetter(readTagList),
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const TEMPORAL_CAPABILITIES_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    TemporalOperands: xml_js.makeObjectPropertySetter(readTemporalOperands),
    TemporalOperators: xml_js.makeObjectPropertySetter(readTemporalOperators),
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const FUNCTIONS_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    Function: xml_js.makeArrayPusher(readNamedFunction),
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const FUNCTIONS_100_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    Function_Names: xml_js.makeObjectPropertySetter(readFunction_Names), // 1.0.0
    FunctionNames: xml_js.makeObjectPropertySetter(readFunction_Names), // 1.1.0
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const FUNCTION_NAMES_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    FunctionName: xml_js.makeArrayPusher(readFunction_Name), // 1.1.0
    Function_Name: xml_js.makeArrayPusher(readFunction_Name), // 1.0.0
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const FUNCTION_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    Returns: xml_js.makeObjectPropertySetter(xsd_js.readString),
    Arguments: xml_js.makeObjectPropertySetter(readArguments),
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const ARGUMENTS_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    Argument: xml_js.makeArrayPusher(readNamedArgument),
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const ARGUMENT_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    Type: xml_js.makeObjectPropertySetter(xsd_js.readString),
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const LOGICAL_OPERATORS_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    LogicalOperator: xml_js.makeArrayPusher(readNamedOnly),
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const COMPARISON_OPERATORS_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    ComparisonOperator: xml_js.makeArrayPusher(readNamedOnly),
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const ARITHMETIC_OPERATORS_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    Simple_Arithmetic: xml_js.makeObjectPropertySetter(xsd_js.readString),
    SimpleArithmetic: xml_js.makeObjectPropertySetter(xsd_js.readString),
    Functions: xml_js.makeObjectPropertySetter(readFunctions100),
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const GEOMETRY_OPERANDS_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    GeometryOperand: xml_js.makeArrayPusher(readNamedOrValueOnly),
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const SPATIAL_OPERATORS_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    SpatialOperator: xml_js.makeArrayPusher(readNamedOnly),
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const TEMPORAL_OPERANDS_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    TemporalOperand: xml_js.makeArrayPusher(readNamedOnly),
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const TEMPORAL_OPERATORS_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    TemporalOperator: xml_js.makeArrayPusher(readNamedOnly),
  });

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Object|undefined} Service Identification object.
   */
  function readServiceIdentification(node, objectStack) {
    return xml_js.pushParseAndPop({}, SERVICE_IDENTIFICATION_PARSERS, node, objectStack);
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Object|undefined} Service Provider object.
   */
  function readServiceProvider(node, objectStack) {
    return xml_js.pushParseAndPop({}, SERVICE_PROVIDER_PARSERS, node, objectStack);
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Object|undefined} Operations Metadata object.
   */
  function readOperationsMetadata(node, objectStack) {
    return xml_js.pushParseAndPop({}, OPERATIONS_METADATA_PARSERS, node, objectStack);
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Object|undefined} Operations Metadata object.
   */
  function readCapability(node, objectStack) {
    return xml_js.pushParseAndPop({}, CAPABILITY_PARSERS, node, objectStack);
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Object|undefined} FeatureType list.
   */
  function readFeatureTypeList(node, objectStack) {
    const version = getVersion(objectStack);
    let featureTypeParser;
    if (version === VERSIONS._100) {
      featureTypeParser = FEATURE_TYPE_LIST_100_PARSERS;
    } else if (version === VERSIONS._110) {
      featureTypeParser = FEATURE_TYPE_LIST_110_PARSERS;
    } else {
      featureTypeParser = FEATURE_TYPE_LIST_PARSERS;
    }
    return xml_js.pushParseAndPop(
      version === VERSIONS._100 || version === VERSIONS._110 ? {} : [],
      featureTypeParser,
      node,
      objectStack
    );
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Object|undefined} Serrvice contact object.
   */
  function readServiceContact(node, objectStack) {
    return xml_js.pushParseAndPop({}, SERVICE_CONTACT_PARSERS, node, objectStack);
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Object|undefined} Contact info object.
   */
  function readContactInfo(node, objectStack) {
    return xml_js.pushParseAndPop({}, CONTACT_INFO_PARSERS, node, objectStack);
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Object|undefined} Contact Phone object.
   */
  function readPhone(node, objectStack) {
    return xml_js.pushParseAndPop({}, PHONE_PARSERS, node, objectStack);
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Object|undefined} Contact address object.
   */
  function readAddress(node, objectStack) {
    return xml_js.pushParseAndPop({}, ADDRESS_PARSERS, node, objectStack);
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Object|undefined} DCP object.
   */
  function readDCP(node, objectStack) {
    return xml_js.pushParseAndPop({}, DCP_PARSERS, node, objectStack);
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Object|undefined} DCP object.
   */
  function readDCPType(node, objectStack) {
    return xml_js.pushParseAndPop({}, DCPTYPE_PARSERS, node, objectStack);
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Object|undefined} Operation object.
   */
  function readOperation(node, objectStack) {
    return xml_js.pushParseAndPop({}, OPERATION_PARSERS, node, objectStack);
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Object|undefined} Operation object.
   */
  function readOperation_110(node, objectStack) {
    return xml_js.pushParseAndPop([], OPERATION_110_PARSERS, node, objectStack);
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Object|undefined} Operation object.
   */
  function readRequest(node, objectStack) {
    return xml_js.pushParseAndPop({}, REQUEST_PARSERS, node, objectStack);
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Object|undefined} Parameter object.
   */
  function readParameter(node, objectStack) {
    return getVersion(objectStack) === VERSIONS._110
      ? xml_js.pushParseAndPop({}, PARAMETER_PARSERS, node, objectStack)
      : xml_js.pushParseAndPop({}, PARAMETER_PARSERS, node, objectStack);
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Object|undefined} Constraint object.
   */
  function readConstraint(node, objectStack) {
    return xml_js.pushParseAndPop({}, CONSTRAINT_PARSERS, node, objectStack);
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Object|undefined} HTTP object.
   */
  function readHTTP(node, objectStack) {
    return xml_js.pushParseAndPop({}, HTTP_PARSERS, node, objectStack);
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Object|undefined} HTTP object.
   */
  function readHTTP_100(node, objectStack) {
    return xml_js.pushParseAndPop({}, HTTP_100_PARSERS, node, objectStack);
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Object|undefined} DCP object.
   */
  function readFunction_Names(node, objectStack) {
    return xml_js.pushParseAndPop([], FUNCTION_NAMES_PARSERS, node, objectStack);
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Object|undefined} Named operation object.
   */
  function readNamedOperation(node, objectStack) {
    const operation = readOperation(node, objectStack);
    if (operation) {
      operation['name'] = node.getAttribute('name');
      return operation;
    }
    return undefined;
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Array|undefined} Named request object.
   */
  function readRequests(node, objectStack) {
    const arr = [];
    for (const n of node.children) {
      const request = readRequest(n, objectStack);
      if (request) {
        request['name'] = n.tagName;
        arr.push(request);
      }
    }
    if (arr.length) {
      return arr;
    }
    return undefined;
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Object|undefined} Named Function object.
   */
  function readNamedFunction(node, objectStack) {
    const func = readFunction(node, objectStack);
    if (func) {
      func['name'] = node.getAttribute('name');
      return func;
    }
    return undefined;
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Object|undefined} Named Function object.
   */
  function readFunction_Name(node, objectStack) {
    const func = readFunction(node, objectStack);
    if (func) {
      func['name'] = xsd_js.readString(node);
      func['nArgs'] = Number(node.getAttribute('nArgs'));
      return func;
    }
    return undefined;
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Object|undefined} Named argument object.
   */
  function readNamedArgument(node, objectStack) {
    const argument = readArgument(node, objectStack);
    if (argument) {
      argument['name'] = node.getAttribute('name');
      return argument;
    }
    return undefined;
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Object|undefined} Named Parameter object.
   */
  function readNamedParameter(node, objectStack) {
    const parameter = readParameter(node, objectStack);
    if (parameter) {
      parameter['name'] = node.getAttribute('name');
      return parameter;
    }
    return undefined;
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Object|undefined} Named Constraint object.
   */
  function readNamedConstraint(node, objectStack) {
    const constraint = readConstraint(node, objectStack);
    if (constraint) {
      constraint['name'] = node.getAttribute('name');
      return constraint;
    }
    return undefined;
  }

  /**
   * @param {Element} node Node.
   * @return {string|undefined} Node name attribute string.
   */
  function readNamedOnly(node) {
    return node.getAttribute('name') || xsd_js.readString(node) || undefined;
  }

  /**
   * @param {Element} node Node.
   * @return {string|undefined} Node name or value attribute string (useful for compatibility between versions)
   */
  function readNamedOrValueOnly(node) {
    return readNamedOnly(node) || xsd_js.readString(node) || undefined;
  }

  /**
   * @param {Element} node Node.
   * @return {string|undefined} Node href or value attribute string (useful for compatibility between versions)
   */
  function readHrefOrValue(node) {
    return xlink_js.readHref(node) || xsd_js.readString(node) || undefined;
  }

  /**
   * @param {Element} node Node.
   * @return {Object|undefined} Named Resource Identifier object.
   */
  function readNamedResourceIdentifier(node) {
    return {
      name: node.getAttribute('name'),
    };
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Object|undefined} WGS84 BoundingBox resource object.
   */
  function readWGS84BoundingBox(node, objectStack) {
    return xml_js.pushParseAndPop({}, WGS84_BOUNDINGBOX_PARSERS, node, objectStack);
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Array<number>|undefined} LatLong BoundingBox resource object.
   */
  function readLatLongBoundingBox(node, objectStack) {
    return [
      Number(node.getAttribute('minx')),
      Number(node.getAttribute('miny')),
      Number(node.getAttribute('maxx')),
      Number(node.getAttribute('maxy')),
    ];
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Array<string>|undefined} Keyword list.
   */
  function readKeywordList(node, objectStack) {
    return xml_js.pushParseAndPop([], KEYWORDLIST_PARSERS, node, objectStack);
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Array<string>|undefined} Value list.
   */
  function readValueList(node, objectStack) {
    return xml_js.pushParseAndPop([], VALUELIST_PARSERS, node, objectStack);
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Array<string>|undefined} Value list.
   */
  function readTagList(node, objectStack) {
    const arr = [];
    for (const n of node.children) {
      const tagName = n.tagName;
      // Remove namespace
      const splittedTagName = tagName.split(':');
      arr.push(splittedTagName[splittedTagName.length - 1]);
    }
    if (arr.length) {
      return arr;
    }
    return undefined;
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Object|undefined} FeatureTyoe object.
   */
  function readFeatureType(node, objectStack) {
    return xml_js.pushParseAndPop({}, FEATURE_TYPE_PARSERS, node, objectStack);
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Object|undefined} FilterCapabilities object.
   */
  function readFilter_Capabilities(node, objectStack) {
    return xml_js.pushParseAndPop({}, FILTER_CAPABILITIES_PARSERS, node, objectStack);
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Object|undefined} Conformance object.
   */
  function readConformance(node, objectStack) {
    return xml_js.pushParseAndPop({}, CONFORMANCE_PARSERS, node, objectStack);
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Object|undefined} Id Capabilities object.
   */
  function readId_Capabilities(node, objectStack) {
    return getVersion(objectStack) === VERSIONS._110
      ? readTagList(node)
      : xml_js.pushParseAndPop([], ID_CAPABILITIES_PARSERS, node, objectStack);
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Object|undefined} Scalar Capabilities object.
   */
  function readScalarCapabilities(node, objectStack) {
    let scalarParser;
    const version = getVersion(objectStack);
    if (version === VERSIONS._100) {
      scalarParser = SCALAR_CAPABILITIES_100_PARSERS;
    } else if (version === VERSIONS._110) {
      scalarParser = SCALAR_CAPABILITIES_110_PARSERS;
    } else {
      scalarParser = SCALAR_CAPABILITIES_PARSERS;
    }
    return xml_js.pushParseAndPop({}, scalarParser, node, objectStack);
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Object|undefined} Spatial Capabilities object.
   */
  function readSpatialCapabilities(node, objectStack) {
    return xml_js.pushParseAndPop(
      {},
      getVersion(objectStack) === VERSIONS._100
        ? SPATIAL_CAPABILITIES_100_PARSERS
        : SPATIAL_CAPABILITIES_PARSERS,
      node,
      objectStack
    );
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Object|undefined} Temporal Capabilities object.
   */
  function readTemporalCapabilities(node, objectStack) {
    return xml_js.pushParseAndPop({}, TEMPORAL_CAPABILITIES_PARSERS, node, objectStack);
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Array<string>|undefined} Functions array.
   */
  function readFunctions(node, objectStack) {
    return xml_js.pushParseAndPop([], FUNCTIONS_PARSERS, node, objectStack);
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Object|undefined} Functions object.
   */
  function readFunctions100(node, objectStack) {
    return xml_js.pushParseAndPop({}, FUNCTIONS_100_PARSERS, node, objectStack);
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Object|undefined} Function object.
   */
  function readFunction(node, objectStack) {
    return xml_js.pushParseAndPop({}, FUNCTION_PARSERS, node, objectStack);
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Array<string>|undefined} Logical Operators array.
   */
  function readLogicalOperators(node, objectStack) {
    return xml_js.pushParseAndPop([], LOGICAL_OPERATORS_PARSERS, node, objectStack);
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Array<string>|undefined} Comparison Operators array.
   */
  function readComparisonOperators(node, objectStack) {
    return xml_js.pushParseAndPop([], COMPARISON_OPERATORS_PARSERS, node, objectStack);
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Object|undefined} Arithmetic Operators object.
   */
  function readArithmetic_Operators(node, objectStack) {
    return xml_js.pushParseAndPop({}, ARITHMETIC_OPERATORS_PARSERS, node, objectStack);
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Array<string>|undefined} Geometry Operands array.
   */
  function readGeometryOperands(node, objectStack) {
    return xml_js.pushParseAndPop([], GEOMETRY_OPERANDS_PARSERS, node, objectStack);
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Array<string>|undefined} Spatials Operators array.
   */
  function readSpatialOperators(node, objectStack) {
    return xml_js.pushParseAndPop([], SPATIAL_OPERATORS_PARSERS, node, objectStack);
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Array<string>|undefined} Temporal Operands array.
   */
  function readTemporalOperands(node, objectStack) {
    return xml_js.pushParseAndPop([], TEMPORAL_OPERANDS_PARSERS, node, objectStack);
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Array<string>|undefined} Temporal Operators array.
   */
  function readTemporalOperators(node, objectStack) {
    return xml_js.pushParseAndPop([], TEMPORAL_OPERATORS_PARSERS, node, objectStack);
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Array<string>|undefined} Arguments array.
   */
  function readArguments(node, objectStack) {
    return xml_js.pushParseAndPop([], ARGUMENTS_PARSERS, node, objectStack);
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Object|undefined} Argument object.
   */
  function readArgument(node, objectStack) {
    return xml_js.pushParseAndPop({}, ARGUMENT_PARSERS, node, objectStack);
  }

  /**
   * @param {Element} node Node.
   * @return {Array<number>|undefined} Coordinates array.
   */
  function readStringCoords(node) {
    const coords = xml_js.getAllTextContent(node, false).split(' ');
    if (coords.length) {
      return coords.map((c) => Number(c));
    }
    return undefined;
  }

  /**
   * @param {Node} node Node.
   * @param {string} separator separator
   * @return {Array|undefined} String array.
   */
  function readJoinedList(node, separator = ', ') {
    const arr = xsd_js.readString(node).split(separator);
    if (!arr || !arr.length) {
      return undefined;
    }
    return arr;
  }

  /**
   * @param {Element} node Node.
   * @return {string|undefined} online resource attribute.
   */
  function readOnline(node) {
    return node.getAttribute('onlineResource');
  }

  /**
   * Make an object property merger function for adding a property to the
   * object at the top of the stack.
   * @param {function(this: T, Element, Array<*>): *} valueReader Value reader.
   * @param {string} [property] Property.
   * @param {T} [thisArg] The object to use as `this` in `valueReader`.
   * @return {Parser} Parser.
   * @template T
   */
  function makeObjectPropertyMerger(valueReader, property, thisArg) {
    return (
      /**
       * @param {Element} node Node.
       * @param {Array<*>} objectStack Object stack.
       */
      function (node, objectStack) {
        const value = valueReader.call(
          thisArg !== undefined ? thisArg : this,
          node,
          objectStack
        );
        if (value !== undefined) {
          const object = /** @type {!Object} */ (
            objectStack[objectStack.length - 1]
          );
          const name = property !== undefined ? property : node.localName;
          for (const key of Object.keys(value)) {
            if (object[name] && key in object[name]) {
              object[name][key] = {...object[name][key], ...value[key]};
            } else {
              object[name] = value;
            }
          }
        }
      }
    );
  }

  return WFSCapabilities;

}));
//# sourceMappingURL=WFSCapabilities.js.map
