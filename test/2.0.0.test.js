import { toBeNumber, toBeString, toBeArray } from 'jest-extended';
expect.extend({ toBeNumber, toBeString, toBeArray });

import fs from 'fs';
import WFSCapabilities from '../lib/WFSCapabilities';
import { resolve } from 'path';

const parser = new WFSCapabilities();

describe("Capabilities Parser - version 2.0.0", () => {

    const capabilities = fs.readFileSync(resolve(__dirname, 'arba-2.0.0-getCapabilities.xml'), { encoding: 'utf-8' });

    let parsed;

    test("Open and parse", () => {
        parsed = parser.read(capabilities);
        expect(Object.keys(parsed).length).toBeGreaterThan(1);
        fs.writeFileSync('test/wfs-2.0.0-parsed.json', JSON.stringify(parsed), { encoding: 'utf-8' });
    });

    test("ServiceIdentification", () => {
        expect(parsed.ServiceIdentification.Title).toBeString();
        expect(parsed.ServiceIdentification.Abstract).toBeString();
        expect(parsed.ServiceIdentification.Keywords).toBeArray();
        expect(parsed.ServiceIdentification.ServiceType).toBeString();
        expect(parsed.ServiceIdentification.ServiceTypeVersion).toBeString();
        expect(parsed.ServiceIdentification.Fees).toBeString();
        expect(parsed.ServiceIdentification.AccessConstraints).toBeString();
    });

    test("ServiceProvider", () => {
        expect(parsed.ServiceProvider.ProviderName).toBeString();

        expect(parsed.ServiceProvider.ServiceContact.IndividualName).toBeString();
        expect(parsed.ServiceProvider.ServiceContact.PositionName).toBeString();

        expect(parsed.ServiceProvider.ServiceContact.ContactInfo.Phone.Voice).toBeString();
        expect(parsed.ServiceProvider.ServiceContact.ContactInfo.Phone.Facsimile).toBeString();

        expect(parsed.ServiceProvider.ServiceContact.ContactInfo.Address.DeliveryPoint).toBeString();
        expect(parsed.ServiceProvider.ServiceContact.ContactInfo.Address.City).toBeString();
        expect(parsed.ServiceProvider.ServiceContact.ContactInfo.Address.AdministrativeArea).toBeString();
        expect(parsed.ServiceProvider.ServiceContact.ContactInfo.Address.PostalCode).toBeString();
        expect(parsed.ServiceProvider.ServiceContact.ContactInfo.Address.Country).toBeString();
        expect(parsed.ServiceProvider.ServiceContact.ContactInfo.Address.ElectronicMailAddress).toBeString();
    });

    test("OperationsMetadata", () => {
        expect(parsed.OperationsMetadata.Operation.length).toBeGreaterThan(1);

        expect(parsed.OperationsMetadata.Operation[0].name).toBe('GetCapabilities');

        expect(parsed.OperationsMetadata.Operation[0].DCP.HTTP.Get).toBeString();
        expect(parsed.OperationsMetadata.Operation[0].DCP.HTTP.Post).toBeString();

        expect(parsed.OperationsMetadata.Operation[0].Parameter[0].name).toBe('AcceptVersions');

        expect(parsed.OperationsMetadata.Operation[0].Parameter[0].AllowedValues).toHaveLength(3);
    });

    test("FeatureTypeList", () => {
        expect(parsed.FeatureTypeList.length).toBeGreaterThan(1);
        expect(parsed.FeatureTypeList[1].Name).toBeString();
        expect(parsed.FeatureTypeList[1].Title).toBeString();
        expect(parsed.FeatureTypeList[1].Abstract).toBeString();
        expect(parsed.FeatureTypeList[1].Keywords).toBeArray();
        expect(parsed.FeatureTypeList[1].DefaultCRS).toBeString();

        expect(parsed.FeatureTypeList[1].WGS84BoundingBox.LowerCorner[0]).toBeNumber();
        expect(parsed.FeatureTypeList[1].WGS84BoundingBox.UpperCorner[0]).toBeNumber();

        expect(parsed.FeatureTypeList[1].MetadataURL).toBeString();
    });

    test("Filter_Capabilities", () => {
        expect(parsed.Filter_Capabilities.Conformance.Constraint.length).toBeGreaterThan(1);
        expect(parsed.Filter_Capabilities.Conformance.Constraint[0].name).toBeString();
        expect(parsed.Filter_Capabilities.Conformance.Constraint[0].NoValues).toBeString();
        expect(parsed.Filter_Capabilities.Conformance.Constraint[0].DefaultValue).toBeString();

        expect(parsed.Filter_Capabilities.Id_Capabilities[0].name).toBeString();

        expect(parsed.Filter_Capabilities.Scalar_Capabilities.LogicalOperators).toBeDefined();
        expect(parsed.Filter_Capabilities.Scalar_Capabilities.ComparisonOperators.length).toBeGreaterThan(1);

        expect(parsed.Filter_Capabilities.Spatial_Capabilities.GeometryOperands.length).toBeGreaterThan(1);
        expect(parsed.Filter_Capabilities.Spatial_Capabilities.SpatialOperators.length).toBeGreaterThan(1);

        expect(parsed.Filter_Capabilities.Temporal_Capabilities.TemporalOperands.length).toBeGreaterThan(1);
        expect(parsed.Filter_Capabilities.Temporal_Capabilities.TemporalOperators.length).toBeGreaterThan(1);

        expect(parsed.Filter_Capabilities.Functions.length).toBeGreaterThan(1);
        expect(parsed.Filter_Capabilities.Functions[0].Returns).toBeString();
        expect(parsed.Filter_Capabilities.Functions[0].name).toBeString();
        expect(parsed.Filter_Capabilities.Functions[0].Arguments[0].Type).toBeString();
        expect(parsed.Filter_Capabilities.Functions[0].Arguments[0].name).toBeString();
    });

});
