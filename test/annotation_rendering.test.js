const test = require('tape');
const renderFeatureLayers = require('../src/annotation_rendering');

test('render-features', (t) => {
    const inputFeatures = require('./fixtures/polys.json');
    const fukishamaGeom = require('./fixtures/fukishama_zone_geometry.json');
    // TODO: other fixture(s)?
    const featureLayersOutput = renderFeatureLayers(inputFeatures);

    t.equal(featureLayersOutput.pointFeatures.features.length, 1, '1 test feature in pointFeatures layer');
    t.equal(featureLayersOutput.pathFeatures.features.length, 1, '1 test feature in pathFeatures layer');
    t.deepEqual(Object.keys(featureLayersOutput.pathFeatures.features[0].properties),
               ['poly_id', 'group_id', 'author', 'date', 'title', 'info', 'imgs', 'more', 'attribution'],
               'expected property names in path output feature');
               t.deepEqual(Object.keys(featureLayersOutput.pointFeatures.features[0].properties),
               ['poly_id', 'group_id', 'author', 'date', 'title', 'info', 'imgs', 'more', 'attribution'],
               'expected property names in point output feature');
    t.equal(featureLayersOutput.pathFeatures.features[0].properties.poly_id, 0, 'matching poly_id property');
    t.equal(featureLayersOutput.pathFeatures.features[0].properties.group_id, 0, 'matching group_id property');
    t.equal(featureLayersOutput.pathFeatures.features[0].properties.author, 'Azby Brown', 'matching author property');
    t.equal(featureLayersOutput.pathFeatures.features[0].properties.date, '2016-11-08T22:02:00Z', 'matching date property');
    t.deepEqual(featureLayersOutput.pathFeatures.features[0].properties.title, inputFeatures.polys[0].desc, 'matching title property');
    t.deepEqual(featureLayersOutput.pathFeatures.features[0].properties.info, inputFeatures.polys[0].info, 'matching info property');
    t.deepEqual(featureLayersOutput.pathFeatures.features[0].properties.attribution, inputFeatures.polys[0].atts, 'matching attribution property');
    // geometry tests
    t.deepEqual(featureLayersOutput.pathFeatures.features[0].geometry, fukishamaGeom, 'path feature geometry matches expected')
    t.deepEqual(featureLayersOutput.pointFeatures.features[0].geometry, { type: 'Point', coordinates: [8.0408, 47.84]}, 'point feature geometry matches expected');
    t.end();
});