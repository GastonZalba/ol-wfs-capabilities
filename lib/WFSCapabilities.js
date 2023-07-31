/**
 * @module ol/format/WFSCapabilities
 */
import XML from 'ol/format/XML.js';
import {
  getAllTextContent,
  makeArrayPusher,
  makeObjectPropertyPusher,
  makeObjectPropertySetter,
  makeStructureNS,
  pushParseAndPop,
} from 'ol/xml.js';
import {readHref} from 'ol/format/xlink.js';
import {readString} from 'ol/format/xsd.js';

/**
 * @const
 * @type {Array<null|string>}
 */
const NAMESPACE_URIS = [
  null,
  'http://www.opengis.net/fes/2.0',
  'http://www.opengis.net/ows/1.1',
  'http://www.opengis.net/wfs/2.0',
];

/**
 * @const
 * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
 */
// @ts-ignore
const PARSERS = makeStructureNS(NAMESPACE_URIS, {
  'ServiceIdentification': makeObjectPropertySetter(readServiceIdentification),
  'ServiceProvider': makeObjectPropertySetter(readServiceProvider),
  'OperationsMetadata': makeObjectPropertySetter(readOperationsMetadata),
  'FeatureTypeList': makeObjectPropertySetter(readFeatureTypeList),
  'Filter_Capabilities': makeObjectPropertySetter(readFilter_Capabilities),
});

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
    const wfsCapabilityObject = pushParseAndPop(
      {
        'version': this.version,
      },
      PARSERS,
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
const SERVICE_IDENTIFICATION_PARSERS = makeStructureNS(NAMESPACE_URIS, {
  'Title': makeObjectPropertySetter(readString),
  'Abstract': makeObjectPropertySetter(readString),
  'Keywords': makeObjectPropertySetter(readKeywordList),
  'ServiceType': makeObjectPropertySetter(readString),
  'ServiceTypeVersion': makeObjectPropertySetter(readString),
  'Fees': makeObjectPropertySetter(readString),
  'AccessConstraints': makeObjectPropertySetter(readString),
});

/**
 * @const
 * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
 */
// @ts-ignore
const SERVICE_PROVIDER_PARSERS = makeStructureNS(NAMESPACE_URIS, {
  'ProviderName': makeObjectPropertySetter(readString),
  'ServiceContact': makeObjectPropertySetter(readServiceContact),
});

/**
 * @const
 * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
 */
// @ts-ignore
const OPERATIONS_METADATA_PARSERS = makeStructureNS(NAMESPACE_URIS, {
  'Operation': makeObjectPropertyPusher(readNamedOperation),
  'Constraint': makeObjectPropertyPusher(readNamedConstraint),
});

/**
 * @const
 * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
 */
// @ts-ignore
const SERVICE_CONTACT_PARSERS = makeStructureNS(NAMESPACE_URIS, {
  'IndividualName': makeObjectPropertySetter(readString),
  'PositionName': makeObjectPropertySetter(readString),
  'ContactInfo': makeObjectPropertySetter(readContactInfo),
});

/**
 * @const
 * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
 */
// @ts-ignore
const CONTACT_INFO_PARSERS = makeStructureNS(NAMESPACE_URIS, {
  'Phone': makeObjectPropertySetter(readPhone),
  'Address': makeObjectPropertySetter(readAddress),
});

/**
 * @const
 * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
 */
// @ts-ignore
const PHONE_PARSERS = makeStructureNS(NAMESPACE_URIS, {
  'Voice': makeObjectPropertySetter(readString),
  'Facsimile': makeObjectPropertySetter(readString),
});

/**
 * @const
 * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
 */
// @ts-ignore
const ADDRESS_PARSERS = makeStructureNS(NAMESPACE_URIS, {
  'DeliveryPoint': makeObjectPropertySetter(readString),
  'City': makeObjectPropertySetter(readString),
  'AdministrativeArea': makeObjectPropertySetter(readString),
  'PostalCode': makeObjectPropertySetter(readString),
  'Country': makeObjectPropertySetter(readString),
  'ElectronicMailAddress': makeObjectPropertySetter(readString),
});

/**
 * @const
 * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
 */
// @ts-ignore
const FEATURE_TYPE_LIST_PARSERS = makeStructureNS(NAMESPACE_URIS, {
  'FeatureType': makeArrayPusher(readFeatureType),
});

/**
 * @const
 * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
 */
// @ts-ignore
const FEATURE_TYPE_PARSERS = makeStructureNS(NAMESPACE_URIS, {
  'Name': makeObjectPropertySetter(readString),
  'Title': makeObjectPropertySetter(readString),
  'Abstract': makeObjectPropertySetter(readString),
  'Keywords': makeObjectPropertySetter(readKeywordList),
  'DefaultCRS': makeObjectPropertySetter(readString),
  'WGS84BoundingBox': makeObjectPropertySetter(readWGS84BoundingBox),
  'MetadataURL': makeObjectPropertySetter(readHref),
});

/**
 * @const
 * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
 */
// @ts-ignore
const OPERATION_PARSERS = makeStructureNS(NAMESPACE_URIS, {
  'DCP': makeObjectPropertySetter(readDCP),
  'Parameter': makeObjectPropertyPusher(readNamedParameter),
});

/**
 * @const
 * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
 */
// @ts-ignore
const PARAMETER_PARSERS = makeStructureNS(NAMESPACE_URIS, {
  'AllowedValues': makeObjectPropertySetter(readValueList),
});

/**
 * @const
 * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
 */
// @ts-ignore
const CONSTRAINT_PARSERS = makeStructureNS(NAMESPACE_URIS, {
  'NoValues': makeObjectPropertySetter(readString),
  'DefaultValue': makeObjectPropertySetter(readString),
  'AllowedValues': makeObjectPropertySetter(readValueList),
});

/**
 * @const
 * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
 */
// @ts-ignore
const HTTP_PARSERS = makeStructureNS(NAMESPACE_URIS, {
  'Get': makeObjectPropertySetter(readHref),
  'Post': makeObjectPropertySetter(readHref),
});

/**
 * @const
 * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
 */
// @ts-ignore
const WGS84_BOUNDINGBOX_PARSERS = makeStructureNS(NAMESPACE_URIS, {
  'LowerCorner': makeObjectPropertySetter(readStringCoords),
  'UpperCorner': makeObjectPropertySetter(readStringCoords),
});

/**
 * @const
 * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
 */
// @ts-ignore
const DCP_PARSERS = makeStructureNS(NAMESPACE_URIS, {
  'HTTP': makeObjectPropertySetter(readHTTP),
});

/**
 * @const
 * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
 */
// @ts-ignore
const KEYWORDLIST_PARSERS = makeStructureNS(NAMESPACE_URIS, {
  'Keyword': makeArrayPusher(readString),
});

/**
 * @const
 * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
 */
// @ts-ignore
const VALUELIST_PARSERS = makeStructureNS(NAMESPACE_URIS, {
  'Value': makeArrayPusher(readString),
});

/**
 * @const
 * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
 */
// @ts-ignore
const FILTER_CAPABILITIES_PARSERS = makeStructureNS(NAMESPACE_URIS, {
  'Conformance': makeObjectPropertySetter(readConformance),
  'Id_Capabilities': makeObjectPropertySetter(readId_Capabilities),
  'Scalar_Capabilities': makeObjectPropertySetter(readScalarCapabilities),
  'Spatial_Capabilities': makeObjectPropertySetter(readSpatialCapabilities),
  'Temporal_Capabilities': makeObjectPropertySetter(readTemporalCapabilities),
  'Functions': makeObjectPropertySetter(readFunctions),
});

/**
 * @const
 * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
 */
// @ts-ignore
const CONFORMANCE_PARSERS = makeStructureNS(NAMESPACE_URIS, {
  'Constraint': makeObjectPropertyPusher(readNamedConstraint),
});

/**
 * @const
 * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
 */
// @ts-ignore
const ID_CAPABILITIES_PARSERS = makeStructureNS(NAMESPACE_URIS, {
  'ResourceIdentifier': makeObjectPropertySetter(readNamedResourceIdentifier),
});

/**
 * @const
 * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
 */
// @ts-ignore
const SCALAR_CAPABILITIES_PARSERS = makeStructureNS(NAMESPACE_URIS, {
  'LogicalOperators': makeObjectPropertySetter(readLogicalOperators),
  'ComparisonOperators': makeObjectPropertySetter(readComparisonOperators),
});

/**
 * @const
 * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
 */
// @ts-ignore
const SPATIAL_CAPABILITIES_PARSERS = makeStructureNS(NAMESPACE_URIS, {
  'GeometryOperands': makeObjectPropertySetter(readGeometryOperands),
  'SpatialOperators': makeObjectPropertySetter(readSpatialOperators),
});

/**
 * @const
 * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
 */
// @ts-ignore
const TEMPORAL_CAPABILITIES_PARSERS = makeStructureNS(NAMESPACE_URIS, {
  'TemporalOperands': makeObjectPropertySetter(readTemporalOperands),
  'TemporalOperators': makeObjectPropertySetter(readTemporalOperators),
});

/**
 * @const
 * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
 */
// @ts-ignore
const FUNCTIONS_PARSERS = makeStructureNS(NAMESPACE_URIS, {
  'Function': makeArrayPusher(readNamedFunction),
});

/**
 * @const
 * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
 */
// @ts-ignore
const FUNCTION_PARSERS = makeStructureNS(NAMESPACE_URIS, {
  'Returns': makeObjectPropertySetter(readString),
  'Arguments': makeObjectPropertySetter(readArguments),
});

/**
 * @const
 * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
 */
// @ts-ignore
const ARGUMENTS_PARSERS = makeStructureNS(NAMESPACE_URIS, {
  'Argument': makeArrayPusher(readNamedArgument),
});

/**
 * @const
 * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
 */
// @ts-ignore
const ARGUMENT_PARSERS = makeStructureNS(NAMESPACE_URIS, {
  'Type': makeObjectPropertySetter(readString),
});

/**
 * @const
 * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
 */
// @ts-ignore
const LOGICAL_OPERATORS_PARSERS = makeStructureNS(NAMESPACE_URIS, {
  'LogicalOperator': makeArrayPusher(readNamedOnly),
});

/**
 * @const
 * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
 */
// @ts-ignore
const COMPARISON_OPERATORS_PARSERS = makeStructureNS(NAMESPACE_URIS, {
  'ComparisonOperator': makeArrayPusher(readNamedOnly),
});

/**
 * @const
 * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
 */
// @ts-ignore
const GEOMETRY_OPERANDS_PARSERS = makeStructureNS(NAMESPACE_URIS, {
  'GeometryOperand': makeArrayPusher(readNamedOnly),
});

/**
 * @const
 * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
 */
// @ts-ignore
const SPATIAL_OPERATORS_PARSERS = makeStructureNS(NAMESPACE_URIS, {
  'SpatialOperator': makeArrayPusher(readNamedOnly),
});

/**
 * @const
 * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
 */
// @ts-ignore
const TEMPORAL_OPERANDS_PARSERS = makeStructureNS(NAMESPACE_URIS, {
  'TemporalOperand': makeArrayPusher(readNamedOnly),
});

/**
 * @const
 * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
 */
// @ts-ignore
const TEMPORAL_OPERATORS_PARSERS = makeStructureNS(NAMESPACE_URIS, {
  'TemporalOperator': makeArrayPusher(readNamedOnly),
});

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} Service Identification object.
 */
function readServiceIdentification(node, objectStack) {
  return pushParseAndPop({}, SERVICE_IDENTIFICATION_PARSERS, node, objectStack);
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} Service Provider object.
 */
function readServiceProvider(node, objectStack) {
  return pushParseAndPop({}, SERVICE_PROVIDER_PARSERS, node, objectStack);
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} Operations Metadata object.
 */
function readOperationsMetadata(node, objectStack) {
  return pushParseAndPop({}, OPERATIONS_METADATA_PARSERS, node, objectStack);
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} FeatureType list.
 */
function readFeatureTypeList(node, objectStack) {
  return pushParseAndPop([], FEATURE_TYPE_LIST_PARSERS, node, objectStack);
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} Serrvice contact object.
 */
function readServiceContact(node, objectStack) {
  return pushParseAndPop({}, SERVICE_CONTACT_PARSERS, node, objectStack);
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} Contact info object.
 */
function readContactInfo(node, objectStack) {
  return pushParseAndPop({}, CONTACT_INFO_PARSERS, node, objectStack);
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} Contact Phone object.
 */
function readPhone(node, objectStack) {
  return pushParseAndPop({}, PHONE_PARSERS, node, objectStack);
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} Contact address object.
 */
function readAddress(node, objectStack) {
  return pushParseAndPop({}, ADDRESS_PARSERS, node, objectStack);
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} DCP object.
 */
function readDCP(node, objectStack) {
  return pushParseAndPop({}, DCP_PARSERS, node, objectStack);
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} Operation object.
 */
function readOperation(node, objectStack) {
  return pushParseAndPop({}, OPERATION_PARSERS, node, objectStack);
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} Parameter object.
 */
function readParameter(node, objectStack) {
  return pushParseAndPop({}, PARAMETER_PARSERS, node, objectStack);
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} Constraint object.
 */
function readConstraint(node, objectStack) {
  return pushParseAndPop({}, CONSTRAINT_PARSERS, node, objectStack);
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} HTTP object.
 */
function readHTTP(node, objectStack) {
  return pushParseAndPop({}, HTTP_PARSERS, node, objectStack);
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
  return node.getAttribute('name') || undefined;
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
  return pushParseAndPop({}, WGS84_BOUNDINGBOX_PARSERS, node, objectStack);
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Array<string>|undefined} Keyword list.
 */
function readKeywordList(node, objectStack) {
  return pushParseAndPop([], KEYWORDLIST_PARSERS, node, objectStack);
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Array<string>|undefined} Value list.
 */
function readValueList(node, objectStack) {
  return pushParseAndPop([], VALUELIST_PARSERS, node, objectStack);
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} FeatureTyoe object.
 */
function readFeatureType(node, objectStack) {
  return pushParseAndPop({}, FEATURE_TYPE_PARSERS, node, objectStack);
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} FilterCapabilities object.
 */
function readFilter_Capabilities(node, objectStack) {
  return pushParseAndPop({}, FILTER_CAPABILITIES_PARSERS, node, objectStack);
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} Conformance object.
 */
function readConformance(node, objectStack) {
  return pushParseAndPop({}, CONFORMANCE_PARSERS, node, objectStack);
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} Id Capabilities object.
 */
function readId_Capabilities(node, objectStack) {
  return pushParseAndPop({}, ID_CAPABILITIES_PARSERS, node, objectStack);
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} Scalar Capabilities object.
 */
function readScalarCapabilities(node, objectStack) {
  return pushParseAndPop({}, SCALAR_CAPABILITIES_PARSERS, node, objectStack);
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} Spatial Capabilities object.
 */
function readSpatialCapabilities(node, objectStack) {
  return pushParseAndPop({}, SPATIAL_CAPABILITIES_PARSERS, node, objectStack);
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} Temporal Capabilities object.
 */
function readTemporalCapabilities(node, objectStack) {
  return pushParseAndPop({}, TEMPORAL_CAPABILITIES_PARSERS, node, objectStack);
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Array<string>|undefined} Functions array.
 */
function readFunctions(node, objectStack) {
  return pushParseAndPop([], FUNCTIONS_PARSERS, node, objectStack);
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} Function object.
 */
function readFunction(node, objectStack) {
  return pushParseAndPop({}, FUNCTION_PARSERS, node, objectStack);
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Array<string>|undefined} Logical Operators array.
 */
function readLogicalOperators(node, objectStack) {
  return pushParseAndPop([], LOGICAL_OPERATORS_PARSERS, node, objectStack);
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Array<string>|undefined} Comparison Operators array.
 */
function readComparisonOperators(node, objectStack) {
  return pushParseAndPop([], COMPARISON_OPERATORS_PARSERS, node, objectStack);
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Array<string>|undefined} Geometry Operands array.
 */
function readGeometryOperands(node, objectStack) {
  return pushParseAndPop([], GEOMETRY_OPERANDS_PARSERS, node, objectStack);
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Array<string>|undefined} Spatials Operators array.
 */
function readSpatialOperators(node, objectStack) {
  return pushParseAndPop([], SPATIAL_OPERATORS_PARSERS, node, objectStack);
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Array<string>|undefined} Temporal Operands array.
 */
function readTemporalOperands(node, objectStack) {
  return pushParseAndPop([], TEMPORAL_OPERANDS_PARSERS, node, objectStack);
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Array<string>|undefined} Temporal Operators array.
 */
function readTemporalOperators(node, objectStack) {
  return pushParseAndPop([], TEMPORAL_OPERATORS_PARSERS, node, objectStack);
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Array<string>|undefined} Arguments array.
 */
function readArguments(node, objectStack) {
  return pushParseAndPop([], ARGUMENTS_PARSERS, node, objectStack);
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} Argument object.
 */
function readArgument(node, objectStack) {
  return pushParseAndPop({}, ARGUMENT_PARSERS, node, objectStack);
}

/**
 * @param {Element} node Node.
 * @return {Array<number>|undefined} Coordinates array.
 */
function readStringCoords(node) {
  const coords = getAllTextContent(node, false).split(' ');
  if (coords.length) {
    return coords.map((c) => Number(c));
  }
  return undefined;
}

export default WFSCapabilities;
