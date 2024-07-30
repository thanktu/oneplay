import "./style.css";
import { Map, View } from "ol";
import { OSM, TileDebug, DataTile, TileWMS, StadiaMaps, OGCMapTile, Vector as VectorSource } from "ol/source";
import { fromLonLat, toLonLat } from "ol/proj";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { Icon, Style } from "ol/style";
import { Vector as VectorLayer, Tile as TileLayer } from "ol/layer";
import { createStringXY, toStringHDMS } from "ol/coordinate";
import { defaults as defaultControls, MousePosition } from "ol/control";
import { Circle } from "ol/geom";
import Overlay from "ol/Overlay";
import { Modify } from "ol/interaction";
import ImageTile from "ol/source/ImageTile";
import { easeIn, easeOut } from "ol/easing";

const SCALE_UNIT = 1;
const DEBUG_MODE = false;
const MAP_TILER_KEY = "17YhaUehJVmGcqQaZ2up"; // "https://api.maptiler.com/maps/basic-v2/?key=17YhaUehJVmGcqQaZ2up#1.0/0.00000/0.00000";

const MARRIOT_LOC = fromLonLat([105.783089061, 21.007448175]);
const METRI_PART_LOC = fromLonLat([105.77148046, 21.007552187]);
const ICON_LOC = fromLonLat([105.794633289, 21.00786928]);
const LOTTE_LOC = fromLonLat([105.813080887, 21.076551416]);

// #region: Mouse Position
const mousePositionControl = new MousePosition({
  coordinateFormat: createStringXY(9),
  projection: "EPSG:4326", // EPSG:4326 vs EPSG:3857

  // comment the following two lines to have the mouse position
  // be placed within the map.
  className: "custom-mouse-position",
  target: document.getElementById("mouse-position"),
});
// #endregion

// #region: Custom Circle Render
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
  geometry: new Circle([LOTTE_LOC[0], LOTTE_LOC[1]], 800),
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

// #region: Elements that make up the popup.
const container = document.getElementById("popup");
const content = document.getElementById("popup-content");
const closer = document.getElementById("popup-closer");

// Create an overlay to anchor the popup to the map.
const overlay = new Overlay({
  element: container,
  autoPan: {
    animation: {
      duration: 250,
    },
  },
});

// Add a click handler to hide the popup.
closer.onclick = function () {
  overlay.setPosition(undefined);
  closer.blur();
  return false;
};
// #endregion

// #region Icons
const iconFeature = new Feature({
  geometry: new Point([ICON_LOC[0], ICON_LOC[1]]),
  name: "Nothing Here :D",
  population: 4000,
  rainfall: 500,
});

const iconStyle = new Style({
  image: new Icon({
    anchor: [0.5, 46],
    anchorXUnits: "fraction",
    anchorYUnits: "pixels",
    src: "icons/icon.png",
  }),
});

iconFeature.setStyle(iconStyle);

const vectorSource = new VectorSource({
  features: [iconFeature],
});

const vectorLayer = new VectorLayer({
  source: vectorSource,
});
// #endregion

const view = new View({
  center: [MARRIOT_LOC[0], MARRIOT_LOC[1]],
  zoom: 16,
});

// MAP
const map = new Map({
  target: "map",
  controls: defaultControls().extend([mousePositionControl]),
  overlays: [overlay],
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

    vectorLayer,

    // Layer Debug
    ...(DEBUG_MODE
      ? [
          new TileLayer({
            source: new TileDebug(),
          }),
        ]
      : []),
  ],

  view,
  // view: new View({
  //   // center: [0, 0], // --> default
  //   // center: MARRIOT_LOC, // custom localtion default
  //   // zoom: 15,

  //   center: [MARRIOT_LOC[0], MARRIOT_LOC[1]],
  //   zoom: 16,
  // }),
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

// #region singleclick Event click handler ->  render the popup.
map.on("singleclick", function (evt) {
  const coordinate = evt.coordinate;
  const hdms = toStringHDMS(toLonLat(coordinate));

  content.innerHTML = `
    <p style="font-weight: 700">
      Click Location: 
    </p>
    <code> ${hdms}</code>

    <code> Latitude: ${JSON.stringify(coordinate[0])}</code>
    <code> Longitude: ${JSON.stringify(coordinate[1])}</code>
  `;

  overlay.setPosition(coordinate);
});
// #endregion

// #region Icon vs popup info
const element = document.getElementById("popupIcon");

const popup = new Overlay({
  element: element,
  positioning: "bottom-center",
  stopEvent: false,
});
map.addOverlay(popup);

let popover;
function disposePopover() {
  if (popover) {
    popover.dispose();
    popover = undefined;
  }
}
// display popup on click
map.on("click", function (evt) {
  const feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
    return feature;
  });
  disposePopover();
  if (!feature) {
    return;
  }
  popup.setPosition(evt.coordinate);
  popover = new bootstrap.Popover(element, {
    placement: "top",
    html: true,
    content: feature.get("name"),
  });
  popover.show();
});

// change mouse cursor when over marker
map.on("pointermove", function (e) {
  const pixel = map.getEventPixel(e.originalEvent);
  const hit = map.hasFeatureAtPixel(pixel);
  map.getTarget().style.cursor = hit ? "pointer" : "";
});
// Close the popup when the map is moved
map.on("movestart", disposePopover);
// #endregion

// #region Animation
function onClick(id, callback) {
  document.getElementById(id).addEventListener("click", callback);
}

function flyTo(location, done) {
  const duration = 2000;
  const zoom = view.getZoom();
  let parts = 2;
  let called = false;
  function callback(complete) {
    --parts;
    if (called) {
      return;
    }
    if (parts === 0 || !complete) {
      called = true;
      done(complete);
    }
  }
  view.animate(
    {
      center: location,
      duration: duration,
    },
    callback
  );
  view.animate(
    {
      zoom: zoom - 1,
      duration: duration / 2,
    },
    {
      zoom: zoom,
      duration: duration / 2,
    },
    callback
  );
}

onClick("goToLotte", function () {
  flyTo(LOTTE_LOC, function () {});
});

onClick("goToMarriot", function () {
  flyTo(MARRIOT_LOC, function () {});
});

onClick("goToIcon", function () {
  flyTo(ICON_LOC, function () {});
});

function tour() {
  const locations = [LOTTE_LOC, MARRIOT_LOC, ICON_LOC, LOTTE_LOC, MARRIOT_LOC, ICON_LOC];
  let index = -1;
  function next(more) {
    if (more) {
      ++index;
      if (index < locations.length) {
        const delay = index === 0 ? 0 : 750;
        setTimeout(function () {
          flyTo(locations[index], next);
        }, delay);
      } else {
        alert("Complete :v");
      }
    } else {
      alert("Cancelled");
    }
  }
  next(true);
}

onClick("goToMulty", tour);
// #endregion
