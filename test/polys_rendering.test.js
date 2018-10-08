const test = require('tape');
const renderFeatures = require('../src/polys_rendering');

test('render-features', (t) => {
    const inputFeatures = require('./fixtures/polys.json');
    const fukishamaGeom = require('./fixtures/fukishama_zone_geometry.json');
    // TODO: other fixture(s)?
    const outputGeoJSON = renderFeatures(inputFeatures);

    t.equal(outputGeoJSON.features.length, 2, 'expected number of output features');
    t.deepEqual(Object.keys(outputGeoJSON.features[0].properties),
               ['poly_id', 'group_id', 'author', 'date', 'title', 'info', 'imgs', 'attribution'],
               'expected property names in first output feature');
               t.deepEqual(Object.keys(outputGeoJSON.features[1].properties),
               ['poly_id', 'group_id', 'author', 'date', 'title', 'info', 'imgs', 'more'],
               'expected property names in second output feature');
    t.equal(outputGeoJSON.features[0].properties.poly_id, 0, 'matching poly_id property');
    t.equal(outputGeoJSON.features[0].properties.group_id, 0, 'matching group_id property');
    t.equal(outputGeoJSON.features[0].properties.author, 'Azby Brown', 'matching author property');
    t.equal(outputGeoJSON.features[0].properties.date, '2016-11-08T22:02:00Z', 'matching date property');
    t.deepEqual(outputGeoJSON.features[0].properties.title, inputFeatures.polys[0].desc, 'matching title property');
    t.deepEqual(outputGeoJSON.features[0].properties.info, inputFeatures.polys[0].info, 'matching info property');
    t.deepEqual(outputGeoJSON.features[0].properties.attribution, inputFeatures.polys[0].atts, 'matching attribution property');
    // geometry tests
    t.deepEqual(outputGeoJSON.features[0].geometry, fukishamaGeom, 'path feature geometry matches expected')
    t.deepEqual(outputGeoJSON.features[1].geometry, { type: 'Point', coordinates: [47.84, 8.0408]}, 'point feature geometry matches expected');
    t.end();
});