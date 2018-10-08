"use strict";
import renderPolys from './polys_rendering';
import mapboxgl from 'mapbox-gl';
// import ky from 'ky';

mapboxgl.accessToken = 'pk.eyJ1IjoiZHJib3llci1tYiIsImEiOiJjajI5NmZscjcwMHFjMzNtbWZleDY0bWdnIn0.z-o8EoH7yO-sZw4k_KegBA';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v9',
    // center: [-99.9, 41.5],
    zoom: 3,
    hash: true
});

var radPopup = new mapboxgl.Popup({
  closeButton: false,
  closeOnClick: false
});

var annotationsPopup = new mapboxgl.Popup({
    // closeButton: false,
    // closeOnClick: false
  });

map.on('load', () => {
    map.addSource("points", {
        type: "vector",
        // url: "mapbox://drboyer-mb.5dyzuvud"
        url: "mapbox://drboyer-mb.21pnzh40"
    });

    map.addLayer({
        id: 'safecast-points',
        type: 'circle',
        source: 'points',
        'source-layer': 'bgeigie-measurements',
        paint: {
            'circle-radius': {
                base: 2,
                stops: [[1, 2], [13, 5]]
            },
            // 'circle-color': 'white'
            // color on an interpolated curve
            'circle-color': [
                    "interpolate",
                    ["linear"],
                    // ["exponential", 10],
                    ["log10", ["get", "value"]],
                    0, 'black',
                    0.08, 'blue',
                    0.20, 'aqua',
                    0.45, 'pink',
                    0.60, 'red',
                    2.15, 'orange',
                    4.00, 'yellow',
                    65, 'white'
                ]
        }
    }, 'waterway-label');

    // immediately filter out features with cpm non-conversion
    // map.setFilter('safecast-points', ["all", ["==", ["get", "unit"], "cpm"], ["!=", ["get", "value"], ["get", "orig_value"]]]);
    map.setFilter('safecast-points', ["!=", ["get", "orig_unit"], "cpm"]);
    console.log('filter applied');

    // load annoations layer and add it to the map
    console.log(`fetching polys from ${location.protocol}//${location.host}/dist/polys.json`);
    // fetch('http://safecast.org/tilemap/polys.json')
    fetch(`${location.protocol}//${location.host}/dist/polys.json`)
        .then(resp => resp.json())
        .then((polysJson) => {
            return renderPolys(polysJson)
        })
        .then((annotationsFC) => {
            map.addSource("annotations", {
                type: "geojson",
                data: annotationsFC
            });

            map.addLayer({
                id: 'annotations-points',
                type: 'circle',
                source: 'annotations',
                paint: {
                    'circle-radius': 5,
                    'circle-color': 'red',
                    'circle-stroke-width': 1,
                    'circle-stroke-color': 'white'
                }
            });

            map.addLayer({
                id: 'annotations-line',
                type: 'line',
                source: 'annotations'
            });
        })
        .catch((err) => {
            console.error(`Error encounted loading annotations: ${err}`);
        });

    map.on('mousemove', (e) => {
        // TODO: bbox or point? let's start with point
        // TODO: we may also need to use this function to render popups for static points, in which case we'll need to change
        //       which points are utilized
        const features = map.queryRenderedFeatures(e.point, { layers: ['safecast-points']}) || [];
        if (!features.length) {
            radPopup.remove();
        } else {
            radPopup.setLngLat(e.lngLat)
                .setHTML(renderPopup(features))
                .addTo(map);
        }
    });
});

function filteryear(yearValue) {
    var filter = null;
    if (yearValue !== 'all') {
        const startDate = new Date(parseInt(yearValue), 1, 1);
        const endDate = new Date(parseInt(yearValue)+1, 1, 1);
        filter = ["all", [">=", ["get", "observation_timestamp"], startDate.getTime()/1000], ["<", ["get", "observation_timestamp"], endDate.getTime()/1000]];
    }
    map.setFilter('safecast-points', filter);
}

function renderPopup(features) {
    var popupHTML = '<table>';
    features.forEach((feature, i) => {
        popupHTML += '<tr><th colspan="2">Feature ' + (i+1) + '</th></tr>';
        Object.keys(feature.properties).forEach((prop) => {
            if (prop == 'observation_timestamp') return; 
            popupHTML += '<tr><td>' + prop + '</td><td>' + feature.properties[prop] + '</td></tr>';
        });
    });
    popupHTML += '</table>';
    return popupHTML;
}
