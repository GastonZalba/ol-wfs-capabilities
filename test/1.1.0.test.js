import { toBeNumber, toBeString, toBeArray } from "jest-extended";
expect.extend({ toBeNumber, toBeString, toBeArray });

import fs from "fs";
import WFSCapabilities from "../lib/WFSCapabilities";
import { resolve } from "path";

const parser = new WFSCapabilities();

describe("Capabilities Parser - version 1.1.0", () => {
  const capabilities = fs.readFileSync(
    resolve(__dirname, "arba-1.1.0-getCapabilities.xml"),
    { encoding: "utf-8" }
  );

  let parsed;

  test("Open and parse", () => {
    parsed = parser.read(capabilities);
    expect(Object.keys(parsed).length).toBeGreaterThan(1);
    fs.writeFileSync("test/wfs-1.1.0-parsed.json", JSON.stringify(parsed), {
      encoding: "utf-8",
    });
  });

  test("ServiceIdentification", () => {
    expect(parsed.ServiceIdentification.Title).toBeDefined();
    expect(parsed.ServiceIdentification.Abstract).toBeDefined();
    expect(parsed.ServiceIdentification.Keywords).toBeDefined();
    expect(parsed.ServiceIdentification.ServiceType).toBeDefined();
    expect(parsed.ServiceIdentification.ServiceTypeVersion).toBeDefined();
    expect(parsed.ServiceIdentification.Fees).toBeDefined();
    expect(parsed.ServiceIdentification.AccessConstraints).toBeDefined();
  });

  test("ServiceProvider", () => {
    expect(parsed.ServiceProvider.ProviderName).toBeDefined();

    expect(parsed.ServiceProvider.ServiceContact.IndividualName).toBeDefined();
    expect(parsed.ServiceProvider.ServiceContact.PositionName).toBeDefined();

    expect(parsed.ServiceProvider.ServiceContact.ContactInfo.Phone.Voice).toBeDefined();
    expect(parsed.ServiceProvider.ServiceContact.ContactInfo.Phone.Facsimile).toBeDefined();

    expect(parsed.ServiceProvider.ServiceContact.ContactInfo.Address.DeliveryPoint).toBeDefined();
    expect(parsed.ServiceProvider.ServiceContact.ContactInfo.Address.City).toBeDefined();
    expect(parsed.ServiceProvider.ServiceContact.ContactInfo.Address.AdministrativeArea).toBeDefined();
    expect(parsed.ServiceProvider.ServiceContact.ContactInfo.Address.PostalCode).toBeDefined();
    expect(parsed.ServiceProvider.ServiceContact.ContactInfo.Address.Country).toBeDefined();
    expect(parsed.ServiceProvider.ServiceContact.ContactInfo.Address.ElectronicMailAddress).toBeDefined();
  });

  test("OperationsMetadata", () => {
    expect(parsed.OperationsMetadata.Operation.length).toBeGreaterThan(1);

    expect(parsed.OperationsMetadata.Operation[0].name).toBe('GetCapabilities');

    expect(parsed.OperationsMetadata.Operation[0].DCP.HTTP.Get).toBeString();
    expect(parsed.OperationsMetadata.Operation[0].DCP.HTTP.Post).toBeString();

    expect(parsed.OperationsMetadata.Operation[0].Parameter[0].name).toBe('AcceptVersions');
    expect(parsed.OperationsMetadata.Operation[0].Parameter[0].Value).toBeDefined();

    expect(parsed.OperationsMetadata.Operation[3].name).toBe('GetGmlObject');

    // key different from 2.0.0
    expect(parsed.OperationsMetadata.Operation[0].Parameter[0].Value).toHaveLength(2);
  });

  test("FeatureTypeList", () => {

    expect(parsed.FeatureTypeList).toBeDefined();

    // key different from 2.0.0
    expect(parsed.FeatureTypeList.Operations.length).toBe(1);
    expect(parsed.FeatureTypeList.Operations[0]).toBe('Query');

    expect(parsed.FeatureTypeList.FeatureType.length).toBeGreaterThan(1);
    expect(parsed.FeatureTypeList.FeatureType[1].Name).toBeString();
    expect(parsed.FeatureTypeList.FeatureType[1].Title).toBeString();
    expect(parsed.FeatureTypeList.FeatureType[1].Abstract).toBeString();
    expect(parsed.FeatureTypeList.FeatureType[1].Keywords).toBeArray();

    // key different from 2.0.0
    expect(parsed.FeatureTypeList.FeatureType[1].DefaultSRS).toBeString();
    // key different from 2.0.0
    expect(parsed.FeatureTypeList.FeatureType[1].OtherSRS).toBeArray();

    expect(parsed.FeatureTypeList.FeatureType[1].WGS84BoundingBox.LowerCorner[0]).toBeNumber();
    expect(parsed.FeatureTypeList.FeatureType[1].WGS84BoundingBox.UpperCorner[0]).toBeNumber();

    expect(parsed.FeatureTypeList.FeatureType[1].MetadataURL).toBeString();
  });

  test("Filter_Capabilities", () => {

    expect(parsed.Filter_Capabilities.Spatial_Capabilities.GeometryOperands.length).toBeGreaterThan(1);
    expect(parsed.Filter_Capabilities.Spatial_Capabilities.SpatialOperators.length).toBeGreaterThan(1);

    expect(parsed.Filter_Capabilities.Scalar_Capabilities.ComparisonOperators.length).toBeGreaterThan(1);
    expect(parsed.Filter_Capabilities.Scalar_Capabilities.LogicalOperators).toBeDefined();
    
    // key different from 2.0.0
    expect(parsed.Filter_Capabilities.Scalar_Capabilities.ArithmeticOperators.SimpleArithmetic).toBeDefined();

    expect(parsed.Filter_Capabilities.Scalar_Capabilities.ArithmeticOperators.Functions.FunctionNames.length).toBeGreaterThan(1);
    expect(parsed.Filter_Capabilities.Scalar_Capabilities.ArithmeticOperators.Functions.FunctionNames[0].name).toBeDefined();
    expect(parsed.Filter_Capabilities.Scalar_Capabilities.ArithmeticOperators.Functions.FunctionNames[0].nArgs).toBeNumber();    
    
    // @TODO check valid values
    expect(parsed.Filter_Capabilities.Id_Capabilities.length).toBeDefined();

  });
});
