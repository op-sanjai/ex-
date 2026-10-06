import munnarImage from "../assets/hero-gallery/munnar-tea-valley-sm.webp";
import vagamonImage from "../assets/hero-gallery/vagamon-meadows-sm.webp";
import wayanadImage from "../assets/hero-gallery/wayanad-green-hills-sm.webp";
import coorgImage from "../assets/hero-gallery/coorg-hills-sm.webp";
import ootyImage from "../assets/hero-gallery/ooty-tea-picker-sm.webp";
import goaImage from "../assets/hero-gallery/goa-sunset-palms-sm.webp";

export const destinations = [
  {
    id: "munnar",
    number: "01",
    name: "Munnar",
    state: "Kerala",
    tagline: "Emerald hills, endless tea",
    description:
      "Roll through mist-wrapped tea plantations that fold into the horizon, chase waterfalls down volcanic slopes, and wake up to clouds resting inside the valley below your window.",
    scene: "tea-hills",
    palette: ["#0b2b22", "#1c4d3b", "#6f8f5a", "#e0b567"],
    image: munnarImage,
  },

  {
    id: "vagamon",
    number: "02",
    name: "Vagamon",
    state: "Kerala",
    tagline: "Meadows above the clouds",
    description:
      "Open grasslands, pine forests and rolling meadows sit at 1,100m — a quiet, uncrowded hill escape built for slow mornings and long, unhurried skies.",
    scene: "meadow-pines",
    palette: ["#0e2f2f", "#1c4d3b", "#8fae6a", "#f1d9a4"],
    image: vagamonImage,
  },

  {
    id: "wayanad",
    number: "03",
    name: "Wayanad",
    state: "Kerala",
    tagline: "Deep forest, wild edges",
    description:
      "Dense evergreen forest, ancient caves and cascading falls — Wayanad trades postcard hills for something wilder, with wildlife sanctuaries at every turn.",
    scene: "forest-falls",
    palette: ["#0b2b22", "#123a2d", "#3f6b4a", "#9fb98a"],
    image: wayanadImage,
  },

  {
    id: "coorg",
    number: "04",
    name: "Coorg",
    state: "Karnataka",
    tagline: "The Scotland of India",
    description:
      "Coffee estates scent the air, mist rolls through the Western Ghats every morning, and waterfalls appear around every second bend in the road.",
    scene: "coffee-mist",
    palette: ["#123a2d", "#1c4d3b", "#7c9a5a", "#e0b567"],
    image: coorgImage,
  },

  {
    id: "ooty",
    number: "05",
    name: "Ooty",
    state: "Tamil Nadu",
    tagline: "Queen of the Nilgiris",
    description:
      "Blue hills, botanical gardens and a toy train that still climbs the same track it did a century ago — Ooty is colonial charm wrapped in eucalyptus air.",
    scene: "blue-hills-lake",
    palette: ["#0e2f2f", "#1e4a52", "#5b8a8a", "#cfe0d8"],
    image: ootyImage,
  },

  {
    id: "goa",
    number: "06",
    name: "Goa",
    state: "Goa",
    tagline: "Coastline and gold light",
    description:
      "Palm-lined beaches, warm sunsets and a laid-back coastal pace — the perfect counterpoint after days spent chasing mountain air.",
    scene: "beach-palms",
    palette: ["#0b2b22", "#e8703a", "#e0b567", "#f8f5ee"],
    image: goaImage,
  },
];
