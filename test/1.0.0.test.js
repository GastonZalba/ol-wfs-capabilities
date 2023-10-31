import { toBeNumber, toBeString, toBeArray } from 'jest-extended';
expect.extend({ toBeNumber, toBeString, toBeArray });

import fs from 'fs';
import WFSCapabilities from '../lib/WFSCapabilities';
import { resolve } from 'path';

const parser = new WFSCapabilities();

describe("Capabilities Parser - version 1.0.0", () => {

    const capabilities = fs.readFileSync(resolve(__dirname, 'arba-1.0.0-getCapabilities.xml'), { encoding: 'utf-8' });

    let parsed;

    test("Open and parse", () => {
        parsed = parser.read(capabilities);
        expect(Object.keys(parsed).length).toBeGreaterThan(1);
        fs.writeFileSync('test/wfs-1.0.0-parsed.json', JSON.stringify(parsed), { encoding: 'utf-8' });
    });

    test("Service", () => {
        // key different from 2.0.0
        expect(parsed.Service.Name).toBeDefined();
        expect(parsed.Service.Title).toBeDefined();
        expect(parsed.Service.Abstract).toBeDefined();
        expect(parsed.Service.Keywords).toBeDefined();
        expect(parsed.Service.Fees).toBeDefined();
        expect(parsed.Service.AccessConstraints).toBeDefined();
    });

    test("Capability", () => {
        expect(parsed.Capability).toBeDefined();

        expect(parsed.Capability.Request.length).toBeGreaterThan(1);

        expect(parsed.Capability.Request[0].name).toBe('GetCapabilities');
    
        expect(parsed.Capability.Request[0].DCPType.HTTP.Get).toBeString();
        expect(parsed.Capability.Request[0].DCPType.HTTP.Post).toBeString();

        expect(parsed.Capability.Request[1].SchemaDescriptionLanguage).toBeArray();

        expect(parsed.Capability.Request[2].ResultFormat).toBeArray();

    });

    test("FeatureTypeList", () => {
        expect(parsed.FeatureTypeList).toBeDefined();
        
        // key different from 2.0.0
        expect(parsed.FeatureTypeList.Operations.length).toBeArray();

        expect(parsed.FeatureTypeList.FeatureType.length).toBeArray();
        expect(parsed.FeatureTypeList.FeatureType[1].Name).toBeString();
        expect(parsed.FeatureTypeList.FeatureType[1].Title).toBeString();
        expect(parsed.FeatureTypeList.FeatureType[1].Abstract).toBeString();
        expect(parsed.FeatureTypeList.FeatureType[1].Keywords).toBeArray();
    
        // key different from 2.0.0
        expect(parsed.FeatureTypeList.FeatureType[1].SRS).toBeString();
        // key different from 2.0.0
        expect(parsed.FeatureTypeList.FeatureType[1].LatLongBoundingBox).toBeArray();
        expect(parsed.FeatureTypeList.FeatureType[1].LatLongBoundingBox[0]).toBeNumber();
        expect(parsed.FeatureTypeList.FeatureType[1].LatLongBoundingBox[1]).toBeNumber();
    });

    test("Filter_Capabilities", () => {
        expect(parsed.Filter_Capabilities.Spatial_Capabilities.SpatialOperators.length).toBeGreaterThan(1);
        
        expect(parsed.Filter_Capabilities.Scalar_Capabilities.ComparisonOperators.length).toBeGreaterThan(1);
        //expect(parsed.Filter_Capabilities.Scalar_Capabilities.LogicalOperators.length).toBeGreaterThan(1);
        
        expect(parsed.Filter_Capabilities.Scalar_Capabilities.ArithmeticOperators.length).toBeGreaterThan(1);
        expect(parsed.Filter_Capabilities.Scalar_Capabilities.ArithmeticOperators.Functions).toBeGreaterThan(1);
        expect(parsed.Filter_Capabilities.Scalar_Capabilities.ArithmeticOperators.Functions[0].name).toBeDefined();
        expect(parsed.Filter_Capabilities.Scalar_Capabilities.ArithmeticOperators.Functions[0].nArgs).toBeNumber();    
    
    });

});
