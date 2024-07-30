import "./style.css";
import { Map, View } from "ol";
import { OSM, TileDebug, DataTile, TileWMS, StadiaMaps, Vector as VectorSource } from "ol/source";
import { fromLonLat } from "ol/proj";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { Icon, Style } from "ol/style";
import { Vector as VectorLayer } from "ol/layer";
import { createStringXY } from "ol/coordinate";
import { defaults as defaultControls, MousePosition } from "ol/control";
import { Tile as TileLayer } from "ol/layer.js";
import { Circle } from "ol/geom";

const SCALE_UNIT = 1;
const DEBUG_MODE = false;
const MAP_TILER_KEY = "17YhaUehJVmGcqQaZ2up"; // "https://api.maptiler.com/maps/basic-v2/?key=17YhaUehJVmGcqQaZ2up#1.0/0.00000/0.00000";

const MARRIOT_LOC = fromLonLat([105.783089061, 21.007448175]);
const METRI_PART_LOC = fromLonLat([105.77148046, 21.007552187]);
const BOX_LOC = fromLonLat([105.778904815, 21.007035379]);

// #region Mouse Position
const mousePositionControl = new MousePosition({
  coordinateFormat: createStringXY(9),
  projection: "EPSG:4326", // EPSG:4326 vs EPSG:3857

  // comment the following two lines to have the mouse position
  // be placed within the map.
  className: "custom-mouse-position",
  target: document.getElementById("mouse-position"),
});
// #endregion

// #region Custom Circle Render
const circleFeature1 = new Feature({
  geometry: new Circle([MARRIOT_LOC[0], MARRIOT_LOC[1]], 200),
});
circleFeature1.setStyle(
  new Style({
    renderer(coordinates, state) {
      const [[x, y], [x1, y1]] = coordinates;
      const ctx = state.context;
      const dx = x1 - x;
      const dy = y1 - y;
      const radius = Math.sqrt(dx * dx + dy * dy);

      const innerRadius = 0;
      const outerRadius = radius * 1.5;

      const gradient = ctx.createRadialGradient(x, y, innerRadius, x, y, outerRadius);
      gradient.addColorStop(0, "rgba(20,45,220,0)");
      gradient.addColorStop(0.5, "rgba(20,45,220,0.2)");
      gradient.addColorStop(1, "rgba(20,45,220,0.8)");

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI, true);
      ctx.fillStyle = gradient;
      ctx.fill();

      ctx.arc(x, y, radius, 0, 2 * Math.PI, true);
      ctx.strokeStyle = "rgba(20,45,220,1)";
      ctx.stroke();
    },
  })
);

const circleFeature2 = new Feature({
  geometry: new Circle([METRI_PART_LOC[0], METRI_PART_LOC[1]], 500),
});
circleFeature2.setStyle(
  new Style({
    renderer(coordinates, state) {
      const [[x, y], [x1, y1]] = coordinates;
      const ctx = state.context;
      const dx = x1 - x;
      const dy = y1 - y;
      const radius = Math.sqrt(dx * dx + dy * dy);

      const innerRadius = 0;
      const outerRadius = radius * 1.5;

      const gradient = ctx.createRadialGradient(x, y, innerRadius, x, y, outerRadius);
      gradient.addColorStop(0, "rgba(225,0,0,0)");
      gradient.addColorStop(0.5, "rgba(225,0,0,0.2)");
      gradient.addColorStop(1, "rgba(225,0,0,0.8)");

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI, true);
      ctx.fillStyle = gradient;
      ctx.fill();

      ctx.arc(x, y, radius, 0, 2 * Math.PI, true);
      ctx.strokeStyle = "rgba(225,0,0,1)";
      ctx.stroke();
    },
  })
);

const circleFeature3 = new Feature({
  geometry: new Circle([BOX_LOC[0], BOX_LOC[1]], 800),
});
circleFeature3.setStyle(
  new Style({
    renderer(coordinates, state) {
      const [[x, y], [x1, y1]] = coordinates;
      const ctx = state.context;
      const dx = x1 - x;
      const dy = y1 - y;
      const radius = Math.sqrt(dx * dx + dy * dy);

      const innerRadius = 0;
      const outerRadius = radius * 1.5;

      const gradient = ctx.createRadialGradient(x, y, innerRadius, x, y, outerRadius);
      gradient.addColorStop(0, "rgba(0,0,0,0)");
      gradient.addColorStop(0.5, "rgba(0,0,0,0.2)");
      gradient.addColorStop(1, "rgba(0,0,0,0.5)");

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI, true);
      ctx.fillStyle = gradient;
      ctx.fill();

      ctx.arc(x, y, radius, 0, 2 * Math.PI, true);
      ctx.strokeStyle = "rgba(0,0,0,.7)";
      ctx.stroke();
    },
  })
);
// #endregion

// Main
const map = new Map({
  target: "map",
  controls: defaultControls().extend([mousePositionControl]),
  layers: [
    // type layer: image -> use default from OpenStreetMap
    new TileLayer({
      source: new OSM(),
      visible: true,
      // preload: Infinity, //  preload: 0, // default value
    }),

    new VectorLayer({
      source: new VectorSource({
        features: [circleFeature1],
      }),
    }),
    new VectorLayer({
      source: new VectorSource({
        features: [circleFeature2],
      }),
    }),
    new VectorLayer({
      source: new VectorSource({
        features: [circleFeature3],
      }),
    }),

    // Layer Debug
    ...(DEBUG_MODE
      ? [
          new TileLayer({
            source: new TileDebug(),
          }),
        ]
      : []),
  ],
  view: new View({
    // center: [0, 0], // --> default
    // center: MARRIOT_LOC, // custom localtion default
    // zoom: 15,

    // center: [0, 0], // --> default
    // zoom: 2,

    center: [MARRIOT_LOC[0], MARRIOT_LOC[1]],
    zoom: 16,
  }),
});

// #region Zoom In, Zoom Out
document.getElementById("zoom-out").onclick = function () {
  const view = map.getView();
  const zoom = view.getZoom();
  view.setZoom(zoom - SCALE_UNIT);
};

document.getElementById("zoom-in").onclick = function () {
  const view = map.getView();
  const zoom = view.getZoom();
  view.setZoom(zoom + SCALE_UNIT);
};
// #endregion

// #region Get Location
// const projectionSelect = document.getElementById("projection");
// projectionSelect.addEventListener("change", function (event) {
//   mousePositionControl.setProjection(event.target.value);
// });

// const precisionInput = document.getElementById("precision");
// precisionInput.addEventListener("change", function (event) {
//   const format = createStringXY(event.target.valueAsNumber);
//   mousePositionControl.setCoordinateFormat(format);
// });
// #endregion
