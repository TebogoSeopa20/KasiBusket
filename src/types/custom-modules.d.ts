// Custom module fallbacks to silence imports that include package versions
declare module '*@*' {
  const whatever: any;
  export default whatever;
}

// Leaflet routing machine (third-party that augments leaflet)
declare module 'leaflet-routing-machine' {
  const routing: any;
  export = routing;
}

// CSS imports (side-effect imports)
declare module 'leaflet/dist/leaflet.css';
declare module 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
declare module '*.css';

// Loose typing for L.Routing to avoid property errors when accessing Routing
declare namespace L {
  const Routing: any;
}




