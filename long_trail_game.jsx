import { useState, useEffect, useCallback, useRef } from "react";

// ─── TRAIL DATA ───────────────────────────────────────────────────────────────
const WAYPOINTS = [
  { name: "Key West, FL", mile: 0, section: "florida", lat: 24.5, hasTown: true, hasHostel: false, terrain: "flat" },
  { name: "Big Pine Key, FL", mile: 30, section: "florida", lat: 24.7, hasTown: true, hasHostel: false, terrain: "flat" },
  { name: "Homestead, FL", mile: 110, section: "florida", lat: 25.5, hasTown: true, hasHostel: false, terrain: "flat" },
  { name: "Everglades Trailhead", mile: 145, section: "florida", lat: 25.8, hasTown: false, hasHostel: false, terrain: "swamp" },
  { name: "Oasis Visitor Center", mile: 185, section: "florida", lat: 26.1, hasTown: false, hasHostel: false, terrain: "swamp" },
  { name: "Alligator Alley (I-75)", mile: 220, section: "florida", lat: 26.2, hasTown: false, hasHostel: false, terrain: "swamp" },
  { name: "Clewiston, FL", mile: 265, section: "florida", lat: 26.7, hasTown: true, hasHostel: false, terrain: "flat" },
  { name: "Lake Kissimmee SP", mile: 330, section: "florida", lat: 27.9, hasTown: false, hasHostel: false, terrain: "flat" },
  { name: "Ocala, FL", mile: 430, section: "florida", lat: 29.2, hasTown: true, hasHostel: true, terrain: "flat" },
  { name: "Suwannee River SP", mile: 510, section: "florida", lat: 30.0, hasTown: false, hasHostel: false, terrain: "forest" },
  { name: "White Springs, FL", mile: 545, section: "florida", lat: 30.3, hasTown: true, hasHostel: false, terrain: "forest" },
  { name: "Tallahassee, FL", mile: 610, section: "florida", lat: 30.4, hasTown: true, hasHostel: true, terrain: "forest" },
  { name: "Marianna, FL", mile: 680, section: "florida", lat: 30.8, hasTown: true, hasHostel: false, terrain: "forest" },
  { name: "Pensacola, FL", mile: 730, section: "roadwalk", lat: 30.4, hasTown: true, hasHostel: true, terrain: "flat" },
  { name: "Mobile, AL", mile: 810, section: "roadwalk", lat: 30.7, hasTown: true, hasHostel: true, terrain: "flat" },
  { name: "Thomasville, AL", mile: 890, section: "roadwalk", lat: 31.9, hasTown: true, hasHostel: false, terrain: "flat" },
  { name: "Tuscaloosa, AL", mile: 970, section: "roadwalk", lat: 33.2, hasTown: true, hasHostel: true, terrain: "flat" },
  { name: "Gadsden, AL", mile: 1060, section: "roadwalk", lat: 34.0, hasTown: true, hasHostel: false, terrain: "flat" },
  { name: "Rome, GA", mile: 1120, section: "roadwalk", lat: 34.3, hasTown: true, hasHostel: true, terrain: "rolling" },
  { name: "Springer Mountain, GA", mile: 1165, section: "appalachian", lat: 34.6, hasTown: false, hasHostel: false, terrain: "mountain" },
  { name: "Neel Gap, GA (Blood Mtn)", mile: 1200, section: "appalachian", lat: 34.7, hasTown: false, hasHostel: true, terrain: "mountain" },
  { name: "Hiawassee, GA", mile: 1245, section: "appalachian", lat: 34.9, hasTown: true, hasHostel: true, terrain: "mountain" },
  { name: "Franklin, NC", mile: 1310, section: "appalachian", lat: 35.2, hasTown: true, hasHostel: true, terrain: "mountain" },
  { name: "Fontana Dam, NC", mile: 1360, section: "appalachian", lat: 35.4, hasTown: false, hasHostel: true, terrain: "mountain" },
  { name: "Gatlinburg, TN (Smokies)", mile: 1420, section: "appalachian", lat: 35.7, hasTown: true, hasHostel: true, terrain: "mountain" },
  { name: "Hot Springs, NC", mile: 1490, section: "appalachian", lat: 35.9, hasTown: true, hasHostel: true, terrain: "mountain" },
  { name: "Roan Mountain, TN", mile: 1560, section: "appalachian", lat: 36.1, hasTown: false, hasHostel: false, terrain: "alpine" },
  { name: "Damascus, VA", mile: 1650, section: "appalachian", lat: 36.6, hasTown: true, hasHostel: true, terrain: "mountain" },
  { name: "Marion, VA", mile: 1720, section: "appalachian", lat: 36.8, hasTown: true, hasHostel: false, terrain: "mountain" },
  { name: "Pearisburg, VA", mile: 1820, section: "appalachian", lat: 37.3, hasTown: true, hasHostel: true, terrain: "mountain" },
  { name: "Waynesboro, VA", mile: 1950, section: "appalachian", lat: 38.1, hasTown: true, hasHostel: true, terrain: "mountain" },
  { name: "Harpers Ferry, WV", mile: 2050, section: "appalachian", lat: 39.3, hasTown: true, hasHostel: true, terrain: "rolling" },
  { name: "Boiling Springs, PA", mile: 2140, section: "appalachian", lat: 40.1, hasTown: true, hasHostel: false, terrain: "rolling" },
  { name: "Duncannon, PA", mile: 2175, section: "appalachian", lat: 40.4, hasTown: true, hasHostel: true, terrain: "rolling" },
  { name: "Delaware Water Gap, NJ", mile: 2260, section: "appalachian", lat: 41.0, hasTown: true, hasHostel: true, terrain: "rolling" },
  { name: "Bear Mountain, NY", mile: 2305, section: "appalachian", lat: 41.3, hasTown: false, hasHostel: false, terrain: "mountain" },
  { name: "Kent, CT", mile: 2370, section: "appalachian", lat: 41.7, hasTown: true, hasHostel: true, terrain: "mountain" },
  { name: "Salisbury, CT", mile: 2400, section: "appalachian", lat: 42.0, hasTown: true, hasHostel: false, terrain: "mountain" },
  { name: "Dalton, MA", mile: 2450, section: "appalachian", lat: 42.5, hasTown: true, hasHostel: false, terrain: "mountain" },
  { name: "Bennington, VT", mile: 2510, section: "appalachian", lat: 42.9, hasTown: true, hasHostel: true, terrain: "mountain" },
  { name: "Manchester Center, VT", mile: 2545, section: "appalachian", lat: 43.2, hasTown: true, hasHostel: true, terrain: "mountain" },
  { name: "Hanover, NH (Dartmouth)", mile: 2640, section: "appalachian", lat: 43.7, hasTown: true, hasHostel: true, terrain: "mountain" },
  { name: "Lincoln, NH (Franconia)", mile: 2700, section: "appalachian", lat: 44.0, hasTown: true, hasHostel: true, terrain: "alpine" },
  { name: "Mt. Washington, NH", mile: 2750, section: "appalachian", lat: 44.3, hasTown: false, hasHostel: true, terrain: "alpine" },
  { name: "Gorham, NH", mile: 2790, section: "appalachian", lat: 44.4, hasTown: true, hasHostel: true, terrain: "mountain" },
  { name: "Stratton, ME", mile: 2890, section: "appalachian", lat: 45.1, hasTown: true, hasHostel: true, terrain: "mountain" },
  { name: "Monson, ME", mile: 3005, section: "appalachian", lat: 45.3, hasTown: true, hasHostel: true, terrain: "mountain" },
  { name: "100-Mile Wilderness (North)", mile: 3100, section: "appalachian", lat: 45.7, hasTown: false, hasHostel: false, terrain: "wilderness" },
  { name: "Abol Bridge, ME", mile: 3180, section: "appalachian", lat: 45.9, hasTown: false, hasHostel: false, terrain: "wilderness" },
  { name: "Mt. Katahdin Summit", mile: 3295, section: "finish", lat: 45.9, hasTown: false, hasHostel: false, terrain: "alpine" },
];

const TOTAL_MILES = 3295;

// ─── WEATHER ──────────────────────────────────────────────────────────────────
const WEATHER_BY_ZONE = {
  florida:    [[75,3],[77,3],[80,2],[85,1],[89,1],[91,0],[93,0],[93,0],[90,1],[85,1],[80,2],[76,3]],
  southeast:  [[50,4],[54,4],[62,3],[71,2],[79,1],[86,0],[90,0],[88,0],[82,1],[72,2],[62,3],[52,4]],
  midatlantic:[[40,5],[43,5],[52,4],[63,3],[72,2],[80,1],[85,0],[83,1],[75,2],[64,3],[53,4],[43,5]],
  newengland: [[30,6],[33,6],[42,5],[54,4],[64,3],[73,2],[79,1],[77,2],[68,3],[56,4],[45,5],[34,6]],
  maine:      [[25,7],[28,7],[38,6],[50,5],[61,3],[70,2],[76,1],[74,2],[65,3],[52,5],[40,6],[28,7]],
};

function getWeatherZone(lat) {
  if (lat < 30) return "florida";
  if (lat < 36) return "southeast";
  if (lat < 41) return "midatlantic";
  if (lat < 44) return "newengland";
  return "maine";
}

function generateWeather(lat, dayOfYear) {
  const month = Math.min(11, Math.floor(dayOfYear / 30));
  const zone = getWeatherZone(lat);
  const [temp, condIdx] = WEATHER_BY_ZONE[zone][month];
  const variance = Math.floor(Math.random() * 15) - 7;
  const finalTemp = temp + variance;
  const roll = Math.random();
  let cond;
  if (condIdx === 0) cond = roll < 0.7 ? "Sunny" : roll < 0.9 ? "Clear" : "Partly Cloudy";
  else if (condIdx === 1) cond = roll < 0.5 ? "Sunny" : roll < 0.75 ? "Clear" : roll < 0.9 ? "Partly Cloudy" : "Cloudy";
  else if (condIdx === 2) cond = roll < 0.35 ? "Cloudy" : roll < 0.6 ? "Partly Cloudy" : roll < 0.8 ? "Rain" : "Clear";
  else if (condIdx === 3) cond = roll < 0.3 ? "Rain" : roll < 0.5 ? "Cloudy" : roll < 0.65 ? "Storm" : "Partly Cloudy";
  else if (condIdx === 4) cond = roll < 0.35 ? "Rain" : roll < 0.5 ? "Storm" : roll < 0.7 ? "Cold Rain" : "Cloudy";
  else if (condIdx === 5) cond = roll < 0.3 ? "Snow" : roll < 0.5 ? "Cold Rain" : roll < 0.7 ? "Storm" : "Rain";
  else if (condIdx === 6) cond = roll < 0.4 ? "Snow" : roll < 0.65 ? "Cold Rain" : "Storm";
  else cond = roll < 0.55 ? "Snow" : roll < 0.75 ? "Cold Rain" : "Storm";
  return { temp: finalTemp, condition: cond };
}

// ─── EQUIPMENT ────────────────────────────────────────────────────────────────
const EQUIPMENT_OPTIONS = {
  shelter: [
    { id: "tarp", label: "Ultralight Tarp", cost: 0, weight: 1, weatherBonus: 10 },
    { id: "tent", label: "3-Season Tent", cost: 20, weight: 3, weatherBonus: 25 },
    { id: "bivy", label: "Emergency Bivy", cost: 0, weight: 0.5, weatherBonus: 5 },
  ],
  water: [
    { id: "filter", label: "Squeeze Filter", cost: 0, waterBonus: 2 },
    { id: "tablets", label: "Purification Tabs", cost: 0, waterBonus: 1 },
    { id: "uv", label: "UV SteriPen", cost: 15, waterBonus: 3 },
  ],
  firstaid: [
    { id: "basic", label: "Basic First Aid Kit", cost: 0, healthBonus: 1 },
    { id: "advanced", label: "Advanced Med Kit", cost: 20, healthBonus: 3 },
  ],
  pack: [
    { id: "ultralight", label: "Ultralight Pack (35L)", cost: 0, mileBonus: 2, capacity: 5 },
    { id: "standard", label: "Standard Pack (60L)", cost: 0, mileBonus: 0, capacity: 8 },
    { id: "heavy", label: "Large Frame Pack (70L)", cost: 0, mileBonus: -2, capacity: 12 },
  ],
};

// ─── EVENTS ──────────────────────────────────────────────────────────────────
const EVENTS = [
  {
    id: "trail_magic",
    text: "Trail magic! A local has set up a cooler with cold drinks and snacks by the road.",
    section: ["florida","roadwalk","appalachian"],
    effect: (s) => ({ ...s, hunger: Math.min(100, s.hunger + 30), thirst: Math.min(100, s.thirst + 40), morale: Math.min(100, s.morale + 15) }),
    photo: "🧊 Trail Magic Cooler",
  },
  {
    id: "friendly_hiker",
    text: "You meet a NOBO hiker named Stumps. She shares her extra ramen and tips about upcoming terrain.",
    section: ["appalachian"],
    effect: (s) => ({ ...s, hunger: Math.min(100, s.hunger + 20), morale: Math.min(100, s.morale + 10) }),
    photo: "👣 Fellow Hiker Stumps",
  },
  {
    id: "hiker_takes_food",
    text: "A desperate hiker asks to share your food supply. You give them a day's worth of rations.",
    section: ["appalachian","florida"],
    effect: (s) => ({ ...s, food: Math.max(0, s.food - 1), morale: Math.min(100, s.morale + 5) }),
  },
  {
    id: "blister",
    text: "Ouch! A bad blister develops on your heel. Progress slows and it stings with every step.",
    section: ["florida","roadwalk","appalachian"],
    effect: (s) => ({ ...s, health: Math.max(0, s.health - 10) }),
  },
  {
    id: "creek_crossing",
    text: "A swollen creek crossing! You wade through cold water up to your knees. Your boots are soaked.",
    section: ["florida","appalachian"],
    effect: (s) => ({ ...s, health: Math.max(0, s.health - 5), morale: Math.max(0, s.morale - 5) }),
    photo: "🌊 Creek Crossing",
  },
  {
    id: "bear_encounter",
    text: "A black bear crosses the trail 30 feet ahead. You make noise and it ambles off into the woods.",
    section: ["appalachian"],
    effect: (s) => ({ ...s, morale: Math.max(0, s.morale - 8) }),
    photo: "🐻 Bear on Trail",
  },
  {
    id: "shelter_full",
    text: "The shelter is completely packed. You set up your shelter in the rain just outside. Long night.",
    section: ["appalachian"],
    condition: (w) => w.condition === "Rain" || w.condition === "Storm",
    effect: (s) => ({ ...s, health: Math.max(0, s.health - 8), morale: Math.max(0, s.morale - 10) }),
  },
  {
    id: "alligator_warning",
    text: "A ranger warns you of an alligator near the water source. You filter water nervously and move fast.",
    section: ["florida"],
    effect: (s) => ({ ...s, morale: Math.max(0, s.morale - 5) }),
    photo: "🐊 Gator Warning Sign",
  },
  {
    id: "found_cash",
    text: "You find a $20 bill tucked under a log at a trailhead. Trail karma!",
    section: ["florida","roadwalk","appalachian"],
    effect: (s) => ({ ...s, money: s.money + 20, morale: Math.min(100, s.morale + 10) }),
  },
  {
    id: "hiker_gives_gear",
    text: "A finishing hiker is doing a gear shakedown. They give you an extra water bottle. Score!",
    section: ["appalachian"],
    effect: (s) => ({ ...s, water: Math.min(s.maxWater, s.water + 2), morale: Math.min(100, s.morale + 8) }),
    photo: "🎁 Gear Shakedown Gift",
  },
  {
    id: "stomach_bug",
    text: "You pick up a stomach bug. You spend most of the morning doubled over off-trail. Rough miles.",
    section: ["florida","roadwalk","appalachian"],
    effect: (s) => ({ ...s, health: Math.max(0, s.health - 15), hunger: Math.max(0, s.hunger - 20), morale: Math.max(0, s.morale - 15) }),
  },
  {
    id: "dehydration",
    text: "The heat hits hard today. You realize too late you haven't drunk enough. Your head pounds.",
    section: ["florida","roadwalk"],
    condition: (w) => w.temp > 85,
    effect: (s) => ({ ...s, thirst: Math.max(0, s.thirst - 30), health: Math.max(0, s.health - 8) }),
  },
  {
    id: "big_views",
    text: "You summit a ridge and the view is absolutely breathtaking. You sit for 20 minutes taking it in.",
    section: ["appalachian"],
    effect: (s) => ({ ...s, morale: Math.min(100, s.morale + 20) }),
    photo: "🏔️ Summit Views",
  },
  {
    id: "road_walk_heat",
    text: "The pavement reflects brutal heat. You walk the shoulder of a highway for miles. Cars honk.",
    section: ["roadwalk"],
    condition: (w) => w.temp > 80,
    effect: (s) => ({ ...s, thirst: Math.max(0, s.thirst - 20), morale: Math.max(0, s.morale - 10) }),
  },
  {
    id: "town_hitchhike",
    text: "A pickup truck pulls over and offers you a ride to the nearest town. You gratefully accept.",
    section: ["roadwalk","appalachian"],
    effect: (s) => ({ ...s, morale: Math.min(100, s.morale + 15) }),
    triggerTown: true,
  },
  {
    id: "free_hostel",
    text: "A church hostel is open tonight — hiker-only, completely free. Hot shower, dinner, and a real bed!",
    section: ["appalachian"],
    effect: (s) => ({ ...s, health: Math.min(100, s.health + 10), morale: Math.min(100, s.morale + 25), hunger: Math.min(100, s.hunger + 40) }),
    photo: "⛪ Church Hostel Night",
  },
  {
    id: "thunderstorm",
    text: "A violent thunderstorm pins you in your shelter for hours. Lightning strikes nearby trees.",
    section: ["appalachian","florida"],
    condition: (w) => w.condition === "Storm",
    effect: (s) => ({ ...s, morale: Math.max(0, s.morale - 20), health: Math.max(0, s.health - 5) }),
    photo: "⛈️ Waiting Out the Storm",
  },
  {
    id: "rainbow_after_rain",
    text: "After the storm clears, a perfect double rainbow arches over the valley. Grateful to be out here.",
    section: ["florida","appalachian"],
    condition: (w) => w.condition === "Rain" || w.condition === "Partly Cloudy",
    effect: (s) => ({ ...s, morale: Math.min(100, s.morale + 18) }),
    photo: "🌈 Double Rainbow",
  },
  {
    id: "snow_surprise",
    text: "Overnight snowfall! The trail is a winter wonderland. Beautiful, but the extra effort slows you down.",
    section: ["appalachian"],
    condition: (w) => w.condition === "Snow",
    effect: (s) => ({ ...s, morale: Math.min(100, s.morale + 5), health: Math.max(0, s.health - 5) }),
    photo: "❄️ Unexpected Snow",
  },
  {
    id: "sunset_camp",
    text: "You set up camp on an exposed ridge just in time to watch a brilliant orange and pink sunset.",
    section: ["appalachian"],
    effect: (s) => ({ ...s, morale: Math.min(100, s.morale + 15) }),
    photo: "🌅 Ridgeline Sunset",
  },
  {
    id: "gear_failure",
    text: "Your shelter pole snaps in the wind. You spend an hour improvising a repair with sticks and cord.",
    section: ["appalachian","florida"],
    condition: (w, gear) => gear && gear.shelter !== "tent",
    effect: (s) => ({ ...s, morale: Math.max(0, s.morale - 15), health: Math.max(0, s.health - 5) }),
  },
  {
    id: "locals_kindness",
    text: "A local family, seeing your pack, invites you onto their porch for lemonade and pie. The South is kind.",
    section: ["roadwalk"],
    effect: (s) => ({ ...s, hunger: Math.min(100, s.hunger + 35), thirst: Math.min(100, s.thirst + 30), morale: Math.min(100, s.morale + 20) }),
    photo: "🍋 Porch Hospitality",
  },
  {
    id: "katahdin_in_sight",
    text: "Baxter Peak rises above the treeline for the first time. The summit of Katahdin is real. Tears sting your eyes.",
    section: ["appalachian"],
    minMile: 3100,
    effect: (s) => ({ ...s, morale: Math.min(100, s.morale + 30) }),
    photo: "🏔️ First View of Katahdin",
    oneTime: true,
  },
  {
    id: "100mile_warning",
    text: "'100-Mile Wilderness — No services for 100 miles. Be prepared.' You take a deep breath.",
    section: ["appalachian"],
    minMile: 3000,
    maxMile: 3015,
    effect: (s) => ({ ...s, morale: Math.max(0, s.morale - 5) }),
    photo: "⚠️ 100-Mile Wilderness Sign",
    oneTime: true,
  },
  {
    id: "ankle_twist",
    text: "Your ankle rolls on a root hidden under leaves. You hobble the rest of the day.",
    section: ["appalachian","florida"],
    effect: (s) => ({ ...s, health: Math.max(0, s.health - 12) }),
  },
  {
    id: "mosquitoes",
    text: "The Everglades section is a mosquito gauntlet. Clouds of them. Your skin is covered in bites by nightfall.",
    section: ["florida"],
    minMile: 145,
    maxMile: 230,
    effect: (s) => ({ ...s, health: Math.max(0, s.health - 8), morale: Math.max(0, s.morale - 12) }),
    photo: "🦟 Everglades Mosquito Hell",
  },
  {
    id: "summited_roan",
    text: "You reach the balds of Roan Mountain. Miles of open grassy ridgeline stretch before you. Stunning.",
    section: ["appalachian"],
    minMile: 1555,
    maxMile: 1570,
    effect: (s) => ({ ...s, morale: Math.min(100, s.morale + 25) }),
    photo: "🌿 Roan Mountain Balds",
    oneTime: true,
  },
  {
    id: "springer_milestone",
    text: "You've reached Springer Mountain — the official southern terminus of the Appalachian Trail. 2,190 miles to go!",
    section: ["appalachian"],
    minMile: 1160,
    maxMile: 1175,
    effect: (s) => ({ ...s, morale: Math.min(100, s.morale + 20) }),
    photo: "🏔️ Springer Mountain AT Start",
    oneTime: true,
  },
  {
    id: "half_way",
    text: "Harpers Ferry — unofficial halfway point of the AT. You sign the register. Over 1,000 miles behind you.",
    section: ["appalachian"],
    minMile: 2045,
    maxMile: 2060,
    effect: (s) => ({ ...s, morale: Math.min(100, s.morale + 25) }),
    photo: "🎯 Halfway There! Harpers Ferry",
    oneTime: true,
  },
];

// ─── SHOP ITEMS ───────────────────────────────────────────────────────────────
const SHOP_ITEMS = [
  { id: "food_day", label: "1 Day Food Supply", cost: 8, effect: (s) => ({ ...s, food: Math.min(s.maxFood, s.food + 1) }) },
  { id: "food_week", label: "7 Day Food Supply", cost: 50, effect: (s) => ({ ...s, food: Math.min(s.maxFood, s.food + 7) }) },
  { id: "water_bottle", label: "Refill Water Supply", cost: 2, effect: (s) => ({ ...s, water: s.maxWater }) },
  { id: "meal_diner", label: "Hot Diner Meal", cost: 14, effect: (s) => ({ ...s, hunger: Math.min(100, s.hunger + 80), morale: Math.min(100, s.morale + 15) }) },
  { id: "hostel_night", label: "Hostel Bunk Night", cost: 20, effect: (s) => ({ ...s, health: Math.min(100, s.health + 15), morale: Math.min(100, s.morale + 20) }) },
  { id: "motel_night", label: "Motel Room Night", cost: 65, effect: (s) => ({ ...s, health: Math.min(100, s.health + 25), morale: Math.min(100, s.morale + 30) }) },
  { id: "first_aid", label: "First Aid Resupply", cost: 12, effect: (s) => ({ ...s, firstAidCharges: Math.min(5, s.firstAidCharges + 3) }) },
  { id: "blister_pads", label: "Blister Pads + Wrap", cost: 6, effect: (s) => ({ ...s, health: Math.min(100, s.health + 8) }) },
  { id: "town_beer", label: "Cold Beer at the Bar", cost: 7, effect: (s) => ({ ...s, morale: Math.min(100, s.morale + 12) }) },
];

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function getSectionLabel(section) {
  if (section === "florida") return "Florida Trail";
  if (section === "roadwalk") return "Road Walk (AL/GA)";
  if (section === "appalachian") return "Appalachian Trail";
  return "SUMMIT!";
}

function getTerrainArt(terrain, section, condition) {
  if (condition === "Snow") return "❄️🌲❄️🌲❄️";
  if (condition === "Storm") return "⛈️🌲⛈️🌲⛈️";
  if (condition === "Rain" || condition === "Cold Rain") return "🌧️🌲🌧️🌲🌧️";
  if (section === "florida" && terrain === "swamp") return "🌿🐊🌿💧🌿";
  if (section === "florida") return "🌴🌞🌴🌞🌴";
  if (section === "roadwalk") return "🛣️🚶🛣️🏘️🛣️";
  if (terrain === "alpine") return "🏔️❄️🏔️🌬️🏔️";
  if (terrain === "wilderness") return "🌲🦌🌲🦌🌲";
  return "🌲🗻🌲🗻🌲";
}

function getConditionIcon(cond) {
  const icons = { Sunny: "☀️", Clear: "🌙", "Partly Cloudy": "⛅", Cloudy: "☁️", Rain: "🌧️", Storm: "⛈️", "Cold Rain": "🌨️", Snow: "❄️" };
  return icons[cond] || "☀️";
}

function StatBar({ val, max = 100, color = "#4ade80" }) {
  const pct = Math.round((val / max) * 100);
  return (
    <div style={{ background: "#1a1a0e", border: "1px solid #3a3a1e", borderRadius: 2, height: 8, width: "100%", overflow: "hidden" }}>
      <div style={{ width: `${pct}%`, height: "100%", background: color, transition: "width 0.4s" }} />
    </div>
  );
}

// ─── MAIN GAME ────────────────────────────────────────────────────────────────
export default function ThruHikerGame() {
  const [screen, setScreen] = useState("title");
  const [setupStep, setSetupStep] = useState(0);
  const [playerName, setPlayerName] = useState("");
  const [gear, setGear] = useState({ shelter: "tent", water: "filter", firstaid: "basic", pack: "standard" });
  const [startMonth, setStartMonth] = useState(0);
  const [startMoney, setStartMoney] = useState(200);

  const [gameState, setGameState] = useState(null);
  const [log, setLog] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [eventFiredIds, setEventFiredIds] = useState(new Set());
  const [dayResult, setDayResult] = useState(null);
  const [townMessage, setTownMessage] = useState("");

  const currentWaypoint = useCallback((mile) => {
    for (let i = WAYPOINTS.length - 1; i >= 0; i--) {
      if (mile >= WAYPOINTS[i].mile) return WAYPOINTS[i];
    }
    return WAYPOINTS[0];
  }, []);

  function initGame() {
    const packOpt = EQUIPMENT_OPTIONS.pack.find(p => p.id === gear.pack);
    const maxFood = packOpt.capacity;
    const state = {
      name: playerName.trim() || "Hiker",
      mile: 0,
      day: 1,
      dayOfYear: startMonth * 30,
      health: 100,
      hunger: 80,
      thirst: 80,
      morale: 90,
      food: Math.min(maxFood, 5),
      water: 3,
      maxFood,
      maxWater: gear.pack === "heavy" ? 5 : 4,
      money: startMoney,
      firstAidCharges: gear.firstaid === "advanced" ? 5 : 2,
      gear: { ...gear },
      finished: false,
      dead: false,
      quit: false,
    };
    setGameState(state);
    setLog(["📍 Day 1: You stand at the southern terminus in Key West, Florida. The ocean breeze smells of salt and adventure. " + TOTAL_MILES + " miles to Mt. Katahdin. Let's go."]);
    setPhotos([{ label: "🌊 Key West Southern Terminus", day: 1, mile: 0 }]);
    setEventFiredIds(new Set());
    setDayResult(null);
    setScreen("hiking");
  }

  function advanceDay(gs) {
    const wp = currentWaypoint(gs.mile);
    const weather = generateWeather(wp.lat, gs.dayOfYear);
    const packOpt = EQUIPMENT_OPTIONS.pack.find(p => p.id === gs.gear.pack);

    // Miles calculation
    let baseMiles = 12 + packOpt.mileBonus;
    if (gs.health < 30) baseMiles *= 0.5;
    else if (gs.health < 60) baseMiles *= 0.75;
    if (weather.condition === "Storm") baseMiles *= 0.5;
    else if (weather.condition === "Snow") baseMiles *= 0.6;
    else if (weather.condition === "Rain" || weather.condition === "Cold Rain") baseMiles *= 0.75;
    if (weather.temp > 92) baseMiles *= 0.8;
    if (wp.terrain === "alpine") baseMiles *= 0.7;
    else if (wp.terrain === "mountain") baseMiles *= 0.85;
    else if (wp.terrain === "swamp") baseMiles *= 0.8;
    const milesWalked = Math.max(3, Math.round(baseMiles + (Math.random() * 4 - 2)));

    // Drain
    let hungerDrain = 20;
    let thirstDrain = 25;
    if (weather.temp > 88) thirstDrain += 15;
    if (weather.condition === "Snow" || weather.condition === "Cold Rain") hungerDrain += 8;

    let newFood = gs.food;
    let newWater = gs.water;
    let newHunger = gs.hunger - hungerDrain;
    let newThirst = gs.thirst - thirstDrain;

    if (newFood > 0) { newFood -= 1; newHunger = Math.min(100, newHunger + 60); }
    if (newWater > 0) { newWater -= 1; newThirst = Math.min(100, newThirst + 50); }

    let newHealth = gs.health + 1;
    if (newHunger < 20) newHealth -= 8;
    if (newThirst < 20) newHealth -= 12;
    if (weather.condition === "Storm" || weather.condition === "Snow") {
      const shelterOpt = EQUIPMENT_OPTIONS.shelter.find(s => s.id === gs.gear.shelter);
      if (shelterOpt.weatherBonus < 15) newHealth -= 6;
      else if (shelterOpt.weatherBonus < 20) newHealth -= 3;
    }
    if (weather.temp > 95) newHealth -= 5;
    if (weather.temp < 25) newHealth -= 8;

    let newMorale = gs.morale;
    if (newHunger < 20) newMorale -= 10;
    if (newThirst < 20) newMorale -= 10;
    if (weather.condition === "Sunny") newMorale = Math.min(100, newMorale + 5);

    const newMile = Math.min(TOTAL_MILES, gs.mile + milesWalked);
    let newGS = {
      ...gs,
      mile: newMile,
      day: gs.day + 1,
      dayOfYear: gs.dayOfYear + 1,
      health: Math.max(0, Math.min(100, newHealth)),
      hunger: Math.max(0, Math.min(100, newHunger)),
      thirst: Math.max(0, Math.min(100, newThirst)),
      morale: Math.max(0, Math.min(100, newMorale)),
      food: Math.max(0, newFood),
      water: Math.max(0, newWater),
    };

    if (newMile >= TOTAL_MILES) newGS.finished = true;
    if (newGS.health <= 0) newGS.dead = true;

    // Event roll
    let chosenEvent = null;
    if (!newGS.finished && !newGS.dead && Math.random() < 0.5) {
      const fired = eventFiredIds;
      const eligible = EVENTS.filter(e => {
        if (e.oneTime && fired.has(e.id)) return false;
        if (e.section && !e.section.includes(wp.section)) return false;
        if (e.condition && !e.condition(weather, gs.gear)) return false;
        if (e.minMile && newMile < e.minMile) return false;
        if (e.maxMile && newMile > e.maxMile) return false;
        return true;
      });
      if (eligible.length > 0) {
        chosenEvent = eligible[Math.floor(Math.random() * eligible.length)];
        if (chosenEvent.oneTime) setEventFiredIds(prev => new Set([...prev, chosenEvent.id]));
        const afterEvt = chosenEvent.effect(newGS);
        newGS = { ...newGS, ...afterEvt };
        if (newGS.health <= 0) newGS.dead = true;
      }
    }

    const newWp = currentWaypoint(newMile);
    const logLine = `📍 Day ${gs.day + 1}: ${getConditionIcon(weather.condition)} ${weather.condition}, ${weather.temp}°F — Hiked ${milesWalked} mi → Mile ${newMile} (${newWp.name})`;
    setLog(prev => [...prev.slice(-60), logLine]);

    if (chosenEvent?.photo) {
      setPhotos(prev => [...prev, { label: chosenEvent.photo, day: gs.day + 1, mile: newMile }]);
    }
    setDayResult({ weather, milesWalked, event: chosenEvent, newWp, newMile });
    setGameState(newGS);

    if (newGS.finished || newGS.dead) {
      setTimeout(() => setScreen("end"), 600);
    } else if (chosenEvent?.triggerTown && newWp.hasTown) {
      setTimeout(() => { setTownMessage("A kind soul dropped you off in town!"); setScreen("town"); }, 400);
    }
  }

  function doRest(gs) {
    const restHealth = gs.gear.firstaid === "advanced" ? 28 : 20;
    const newGS = {
      ...gs,
      health: Math.min(100, gs.health + restHealth),
      morale: Math.min(100, gs.morale + 15),
      day: gs.day + 1,
      dayOfYear: gs.dayOfYear + 1,
      food: gs.food > 0 ? gs.food - 1 : gs.food,
      hunger: gs.food > 0 ? Math.min(100, gs.hunger + 40) : Math.max(0, gs.hunger - 20),
      water: gs.water > 0 ? gs.water - 1 : gs.water,
      thirst: gs.water > 0 ? Math.min(100, gs.thirst + 40) : Math.max(0, gs.thirst - 20),
    };
    setGameState(newGS);
    setLog(prev => [...prev.slice(-60), `🏕️ Day ${gs.day + 1}: Full rest day. Health +${restHealth}. Body recovering.`]);
    setDayResult({ weather: { condition: "Clear", temp: 68 }, milesWalked: 0, event: null, newWp: currentWaypoint(gs.mile), newMile: gs.mile, isRest: true });
  }

  function takePhoto(gs) {
    const wp = currentWaypoint(gs.mile);
    setPhotos(prev => [...prev, { label: `📸 ${wp.name}`, day: gs.day, mile: gs.mile }]);
    setLog(prev => [...prev.slice(-60), `📸 Photo taken at ${wp.name} (Mile ${gs.mile})`]);
  }

  function useFirstAid(gs) {
    if (gs.firstAidCharges > 0) {
      const opt = EQUIPMENT_OPTIONS.firstaid.find(f => f.id === gs.gear.firstaid);
      const boost = opt.healthBonus * 8;
      setGameState({ ...gs, health: Math.min(100, gs.health + boost), firstAidCharges: gs.firstAidCharges - 1 });
      setLog(prev => [...prev.slice(-60), `🩹 Used first aid. Health +${boost}. (${gs.firstAidCharges - 1} uses left)`]);
    }
  }

  // ── STYLES ─────────────────────────────────────────────────────────────────
  const crt = {
    fontFamily: "'Courier New', Courier, monospace",
    background: "#080805",
    color: "#c8d87a",
    minHeight: "100vh",
  };
  const panel = (extra = {}) => ({
    background: "#0f0f06",
    border: "1px solid #3a4a10",
    borderRadius: 3,
    padding: "12px 14px",
    margin: "6px 0",
    ...extra,
  });
  const btn = (bg = "#c8d87a", disabled = false) => ({
    fontFamily: "inherit",
    fontSize: 12,
    color: disabled ? "#444" : "#050502",
    background: disabled ? "#1a1a0a" : bg,
    border: `1px solid ${disabled ? "#2a2a10" : bg}`,
    padding: "5px 12px",
    cursor: disabled ? "not-allowed" : "pointer",
    borderRadius: 2,
    margin: "3px",
    letterSpacing: 1,
    textTransform: "uppercase",
    fontWeight: "bold",
    fontSize: 11,
  });
  const H1 = ({ children }) => <div style={{ color: "#e8f87a", fontSize: 20, letterSpacing: 4, marginBottom: 4, textShadow: "0 0 12px #8ab020" }}>{children}</div>;
  const H2 = ({ children }) => <div style={{ color: "#9aaa5a", fontSize: 12, letterSpacing: 3, marginBottom: 10, textTransform: "uppercase" }}>{children}</div>;
  const Dim = ({ children, style = {} }) => <span style={{ color: "#6a7a34", fontSize: 11, ...style }}>{children}</span>;

  // ─── TITLE ────────────────────────────────────────────────────────────────
  if (screen === "title") return (
    <div style={{ ...crt, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ maxWidth: 500, width: "100%", textAlign: "center" }}>
        <div style={{ fontSize: 10, color: "#3a4a10", letterSpacing: 4, marginBottom: 20 }}>── TRAIL SYSTEMS v1.0 ──</div>
        <div style={{ fontSize: 40, fontWeight: "bold", color: "#e8f87a", letterSpacing: 8, textShadow: "0 0 24px #8ab020", marginBottom: 6 }}>LONG TRAIL</div>
        <div style={{ fontSize: 12, color: "#7a9030", letterSpacing: 4, marginBottom: 6 }}>KEY WEST, FL → MT. KATAHDIN, ME</div>
        <div style={{ fontSize: 10, color: "#4a5a18", marginBottom: 28, letterSpacing: 2 }}>3,295 MILES</div>
        <div style={{ ...panel(), textAlign: "left", marginBottom: 20 }}>
          <H2>YOUR JOURNEY</H2>
          <div style={{ fontSize: 12, color: "#8a9a4a", lineHeight: 1.9 }}>
            🌴 Florida Trail — Key West north through swamps & palmettos<br/>
            🛣️ Road Walk — Through Alabama and Georgia to Springer<br/>
            🏔️ Appalachian Trail — Georgia to Katahdin, Maine<br/>
            🎒 Manage hunger, thirst, health and money<br/>
            📸 Capture 50 locations along the way<br/>
            👣 Meet hikers, find trail magic, survive the wild
          </div>
        </div>
        <button style={{ ...btn(), fontSize: 13, padding: "8px 24px", letterSpacing: 3 }} onClick={() => setScreen("setup")}>▶ BEGIN HIKE</button>
        <div style={{ marginTop: 20, fontSize: 10, color: "#3a4a10" }}>"Not all those who wander are lost." — J.R.R. Tolkien</div>
      </div>
    </div>
  );

  // ─── SETUP ────────────────────────────────────────────────────────────────
  if (screen === "setup") {
    const setupTitles = ["TRAIL NAME", "SHELTER", "WATER", "FIRST AID", "PACK", "START MONTH", "FUNDS"];
    const steps = [
      <div key="0">
        <H2>What is your trail name?</H2>
        <input style={{ fontFamily: "inherit", background: "#080805", color: "#c8d87a", border: "1px solid #4a5a14", padding: "8px 12px", fontSize: 13, width: "88%", letterSpacing: 2, marginBottom: 10, display: "block" }}
          value={playerName} onChange={e => setPlayerName(e.target.value)} placeholder="e.g. Blaze, Lucky, Stumps..."
          onKeyDown={e => e.key === "Enter" && playerName.trim() && setSetupStep(1)} autoFocus />
        <button style={btn()} onClick={() => (playerName.trim() ? setSetupStep(1) : null)}>NEXT →</button>
      </div>,

      <div key="1">
        <H2>Choose your shelter</H2>
        {EQUIPMENT_OPTIONS.shelter.map(opt => (
          <div key={opt.id} onClick={() => setGear(g => ({ ...g, shelter: opt.id }))}
            style={{ ...panel({ cursor: "pointer", border: `2px solid ${gear.shelter === opt.id ? "#c8d87a" : "#2a3a0a"}`, marginBottom: 6 }) }}>
            <b style={{ color: gear.shelter === opt.id ? "#e8f87a" : "#7a8a40" }}>{opt.label}</b>
            <Dim style={{ display: "block" }}>Protection: {opt.weatherBonus}% · Weight: {opt.weight} lbs{opt.cost > 0 ? ` · −$${opt.cost}` : " · Free"}</Dim>
          </div>
        ))}
        <button style={btn()} onClick={() => setSetupStep(2)}>NEXT →</button>
      </div>,

      <div key="2">
        <H2>Water treatment method</H2>
        {EQUIPMENT_OPTIONS.water.map(opt => (
          <div key={opt.id} onClick={() => setGear(g => ({ ...g, water: opt.id }))}
            style={{ ...panel({ cursor: "pointer", border: `2px solid ${gear.water === opt.id ? "#c8d87a" : "#2a3a0a"}`, marginBottom: 6 }) }}>
            <b style={{ color: gear.water === opt.id ? "#e8f87a" : "#7a8a40" }}>{opt.label}</b>
            <Dim style={{ display: "block" }}>Capacity bonus: +{opt.waterBonus}L{opt.cost > 0 ? ` · −$${opt.cost}` : " · Free"}</Dim>
          </div>
        ))}
        <button style={btn()} onClick={() => setSetupStep(3)}>NEXT →</button>
      </div>,

      <div key="3">
        <H2>First aid kit</H2>
        {EQUIPMENT_OPTIONS.firstaid.map(opt => (
          <div key={opt.id} onClick={() => setGear(g => ({ ...g, firstaid: opt.id }))}
            style={{ ...panel({ cursor: "pointer", border: `2px solid ${gear.firstaid === opt.id ? "#c8d87a" : "#2a3a0a"}`, marginBottom: 6 }) }}>
            <b style={{ color: gear.firstaid === opt.id ? "#e8f87a" : "#7a8a40" }}>{opt.label}</b>
            <Dim style={{ display: "block" }}>Heal: +{opt.healthBonus * 8} per use · {opt.id === "advanced" ? "5 uses · −$20" : "2 uses · Free"}</Dim>
          </div>
        ))}
        <button style={btn()} onClick={() => setSetupStep(4)}>NEXT →</button>
      </div>,

      <div key="4">
        <H2>Choose your pack</H2>
        {EQUIPMENT_OPTIONS.pack.map(opt => (
          <div key={opt.id} onClick={() => setGear(g => ({ ...g, pack: opt.id }))}
            style={{ ...panel({ cursor: "pointer", border: `2px solid ${gear.pack === opt.id ? "#c8d87a" : "#2a3a0a"}`, marginBottom: 6 }) }}>
            <b style={{ color: gear.pack === opt.id ? "#e8f87a" : "#7a8a40" }}>{opt.label}</b>
            <Dim style={{ display: "block" }}>Miles/day: {opt.mileBonus > 0 ? `+${opt.mileBonus}` : opt.mileBonus === 0 ? "base" : opt.mileBonus} · Food capacity: {opt.capacity} days</Dim>
          </div>
        ))}
        <button style={btn()} onClick={() => setSetupStep(5)}>NEXT →</button>
      </div>,

      <div key="5">
        <H2>When do you start?</H2>
        <Dim style={{ display: "block", marginBottom: 10 }}>Jan–Mar: hot FL, cold AT start · May–Jun: busy season · Sep–Nov: ideal fall hiking</Dim>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 12 }}>
          {MONTHS.map((m, i) => (
            <button key={i} style={{ ...btn(startMonth === i ? "#c8d87a" : "#3a4a14"), padding: "4px 8px" }} onClick={() => setStartMonth(i)}>{m.slice(0,3)}</button>
          ))}
        </div>
        <div style={{ ...panel({ marginBottom: 10 }) }}>
          <Dim>Starting: </Dim><b style={{ color: "#c8d87a" }}>{MONTHS[startMonth]}</b>
          <Dim style={{ display: "block", marginTop: 4 }}>Will arrive at Springer ~{Math.round(1165 / 12)} days later in {MONTHS[(startMonth + Math.round(1165/12/30)) % 12]}</Dim>
        </div>
        <button style={btn()} onClick={() => setSetupStep(6)}>NEXT →</button>
      </div>,

      <div key="6">
        <H2>Starting funds</H2>
        {[100, 200, 400, 700].map(amt => (
          <div key={amt} onClick={() => setStartMoney(amt)}
            style={{ ...panel({ cursor: "pointer", border: `2px solid ${startMoney === amt ? "#c8d87a" : "#2a3a0a"}`, marginBottom: 6 }) }}>
            <b style={{ color: startMoney === amt ? "#e8f87a" : "#7a8a40" }}>${amt}</b>
            <Dim style={{ marginLeft: 10 }}>{amt === 100 ? "Broke but free" : amt === 200 ? "Modest budget" : amt === 400 ? "Comfortable" : "Well-funded"}</Dim>
          </div>
        ))}
        <br/>
        <button style={{ ...btn("#e8f87a"), fontSize: 13, padding: "7px 20px" }} onClick={initGame}>▶ START HIKING</button>
      </div>,
    ];

    return (
      <div style={{ ...crt, padding: 24, maxWidth: 520, margin: "0 auto" }}>
        <H1>GEAR UP</H1>
        <div style={{ fontSize: 10, color: "#4a5a14", marginBottom: 12, letterSpacing: 2 }}>STEP {setupStep + 1}/7 — {setupTitles[setupStep]}</div>
        <div style={{ display: "flex", gap: 3, marginBottom: 16 }}>
          {[0,1,2,3,4,5,6].map(i => <div key={i} style={{ flex: 1, height: 3, background: i <= setupStep ? "#c8d87a" : "#1a1a08", borderRadius: 1 }} />)}
        </div>
        {steps[setupStep]}
        {setupStep > 0 && <button style={{ ...btn("#3a4a18"), marginTop: 10 }} onClick={() => setSetupStep(s => s - 1)}>← BACK</button>}
      </div>
    );
  }

  // ─── ALBUM ────────────────────────────────────────────────────────────────
  if (screen === "album") return (
    <div style={{ ...crt, padding: 20, maxWidth: 580, margin: "0 auto" }}>
      <H1>📸 PHOTO ALBUM</H1>
      <Dim style={{ display: "block", marginBottom: 16 }}>{photos.length} photos captured along the trail</Dim>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {photos.map((p, i) => (
          <div key={i} style={{ ...panel({ textAlign: "center", padding: "14px 10px" }) }}>
            <div style={{ fontSize: 26, marginBottom: 6 }}>{p.label.split(" ")[0]}</div>
            <div style={{ fontSize: 11, color: "#b8c87a" }}>{p.label.slice(p.label.indexOf(" ") + 1)}</div>
            <Dim>Day {p.day} · Mile {p.mile}</Dim>
          </div>
        ))}
        {photos.length === 0 && <div style={{ color: "#4a5a20", gridColumn: "span 2", padding: 20 }}>No photos yet.</div>}
      </div>
      <br/>
      <button style={btn()} onClick={() => setScreen(gameState?.finished || gameState?.dead || gameState?.quit ? "end" : "hiking")}>← BACK TO TRAIL</button>
    </div>
  );

  // ─── END ──────────────────────────────────────────────────────────────────
  if (screen === "end" && gameState) {
    const gs = gameState;
    const pct = Math.round((gs.mile / TOTAL_MILES) * 100);
    let endMsg, endIcon, endTitle;
    if (gs.finished) {
      endMsg = `${gs.name} has summited Mt. Katahdin and completed the ${TOTAL_MILES}-mile journey from Key West to Maine. After ${gs.day} days on trail, you stand at the northern terminus. The Appalachian Trail is behind you. You did it.`;
      endIcon = "🏔️🎉"; endTitle = "KATAHDIN!";
    } else if (gs.dead) {
      endMsg = `${gs.name}'s journey ended at Mile ${gs.mile} after ${gs.day} days. The trail claimed another who came underprepared. Health hit zero. Rest well, hiker. The mountains remember.`;
      endIcon = "💀"; endTitle = "TRAIL ENDED";
    } else {
      endMsg = `${gs.name} stepped off trail at Mile ${gs.mile} after ${gs.day} days on trail. You completed ${pct}% of the journey. The trail will always be there. No shame in calling it when you must.`;
      endIcon = "🚶"; endTitle = "HIKE COMPLETE";
    }
    return (
      <div style={{ ...crt, padding: 24, maxWidth: 520, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontSize: 44, marginBottom: 8 }}>{endIcon}</div>
        <H1>{endTitle}</H1>
        <div style={{ ...panel({ textAlign: "left", marginTop: 14 }) }}>
          <p style={{ color: "#a8b86a", lineHeight: 1.8, fontSize: 12 }}>{endMsg}</p>
          <div style={{ borderTop: "1px solid #2a3a0a", paddingTop: 12, marginTop: 12 }}>
            <Dim style={{ display: "block" }}>🗺️ Miles hiked: {gs.mile} / {TOTAL_MILES} ({pct}%)</Dim>
            <Dim style={{ display: "block" }}>📅 Days on trail: {gs.day}</Dim>
            <Dim style={{ display: "block" }}>📸 Photos taken: {photos.length}</Dim>
            <Dim style={{ display: "block" }}>💰 Money remaining: ${gs.money}</Dim>
          </div>
        </div>
        <div style={{ marginTop: 16 }}>
          <button style={btn()} onClick={() => setScreen("album")}>📸 VIEW ALBUM</button>
          <button style={btn("#4a5a18")} onClick={() => { setScreen("title"); setGameState(null); setLog([]); setPhotos([]); setSetupStep(0); setPlayerName(""); setDayResult(null); }}>↺ NEW HIKE</button>
        </div>
      </div>
    );
  }

  // ─── TOWN ─────────────────────────────────────────────────────────────────
  if (screen === "town" && gameState) {
    const gs = gameState;
    const wp = currentWaypoint(gs.mile);
    const isRoadWalk = wp.section === "roadwalk";

    return (
      <div style={{ ...crt, padding: 18, maxWidth: 540, margin: "0 auto" }}>
        <H1>🏘️ {wp.name}</H1>
        {townMessage && <div style={{ color: "#9aaa5a", fontSize: 11, marginBottom: 8 }}>{townMessage}</div>}
        <Dim style={{ display: "block", marginBottom: 10 }}>Mile {gs.mile} · Day {gs.day}</Dim>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 5, marginBottom: 10 }}>
          {[
            { label: "❤️ Health", val: gs.health, color: gs.health < 30 ? "#f87171" : "#4ade80" },
            { label: "🍞 Hunger", val: gs.hunger, color: gs.hunger < 25 ? "#fb923c" : "#facc15" },
            { label: "💧 Thirst", val: gs.thirst, color: gs.thirst < 25 ? "#60a5fa" : "#38bdf8" },
            { label: "🎭 Morale", val: gs.morale, color: "#a78bfa" },
          ].map(s => (
            <div key={s.label} style={{ ...panel({ padding: 8 }) }}>
              <Dim style={{ display: "block", fontSize: 10 }}>{s.label}</Dim>
              <StatBar val={s.val} max={100} color={s.color} />
              <div style={{ fontSize: 10, color: "#c8d87a", marginTop: 2 }}>{s.val}%</div>
            </div>
          ))}
        </div>

        <div style={{ ...panel({ marginBottom: 10, padding: "8px 12px" }) }}>
          <span style={{ color: "#e8f87a", fontSize: 12 }}>💰 ${gs.money}</span>
          <span style={dimtext}> · 🍞 {gs.food}/{gs.maxFood}d · 💧 {gs.water}/{gs.maxWater}L · 🩹 x{gs.firstAidCharges}</span>
        </div>

        <H2>🏪 Town Shop</H2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 14 }}>
          {(isRoadWalk ? SHOP_ITEMS : SHOP_ITEMS).map(item => {
            const canAfford = gs.money >= item.cost;
            return (
              <div key={item.id} style={{ ...panel({ border: `1px solid ${canAfford ? "#3a4a10" : "#1a1a08"}`, padding: "8px 10px" }) }}>
                <div style={{ fontSize: 11, color: canAfford ? "#c8d87a" : "#4a4a20", marginBottom: 3 }}>{item.label}</div>
                <Dim>${item.cost}</Dim>
                <br/>
                <button style={{ ...btn(canAfford ? "#b8c85a" : "#2a2a10", !canAfford), marginTop: 4 }}
                  onClick={() => { if (canAfford) setGameState(prev => ({ ...item.effect(prev), money: prev.money - item.cost })); }}>
                  BUY
                </button>
              </div>
            );
          })}
        </div>

        <button style={{ ...btn("#c8d87a"), fontSize: 12 }} onClick={() => { setTownMessage(""); setScreen("hiking"); }}>← BACK TO TRAIL</button>
        <button style={btn("#6a7a30")} onClick={() => setScreen("album")}>📸 ALBUM</button>
      </div>
    );
  }

  // ─── HIKING ───────────────────────────────────────────────────────────────
  if (screen === "hiking" && gameState) {
    const gs = gameState;
    const wp = currentWaypoint(gs.mile);
    const pct = Math.round((gs.mile / TOTAL_MILES) * 100);
    const weather = dayResult?.weather || { condition: "Sunny", temp: 75 };
    const nextWpIdx = WAYPOINTS.findIndex(w => w.mile > gs.mile);
    const nextWp = nextWpIdx >= 0 ? WAYPOINTS[nextWpIdx] : null;
    const milesTo = nextWp ? nextWp.mile - gs.mile : 0;
    const lowHealth = gs.health < 30;
    const lowFood = gs.food === 0;
    const lowWater = gs.water === 0;
    const artEmoji = getTerrainArt(wp.terrain, wp.section, weather.condition);

    const dimtext = { color: "#6a7a34", fontSize: 10 };

    return (
      <div style={{ ...crt, padding: "14px 16px", maxWidth: 570, margin: "0 auto" }}>

        {/* Header row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <span style={{ color: "#e8f87a", fontWeight: "bold", fontSize: 13 }}>{gs.name}</span>
          <span style={{ ...dimtext, fontSize: 10 }}>{getSectionLabel(wp.section)}</span>
          <span style={{ color: "#9aaa5a", fontSize: 11 }}>Day {gs.day} · Mile {gs.mile}</span>
        </div>

        {/* Progress bar */}
        <div style={{ background: "#111108", border: "1px solid #2a3a08", height: 6, borderRadius: 3, marginBottom: 12, overflow: "hidden" }}>
          <div style={{ width: `${pct}%`, height: "100%", background: "linear-gradient(90deg,#3a5008,#c8d87a)", transition: "width 0.6s" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", ...dimtext, marginTop: -10, marginBottom: 12 }}>
          <span>Key West</span><span>{pct}%</span><span>Katahdin</span>
        </div>

        {/* Scene */}
        <div style={{ ...panel({ textAlign: "center", padding: "12px 8px", marginBottom: 8 }) }}>
          <div style={{ fontSize: 22, letterSpacing: 10 }}>{artEmoji}</div>
          <div style={{ fontSize: 10, color: "#7a8a3a", letterSpacing: 1, marginTop: 6 }}>
            {getConditionIcon(weather.condition)} {weather.condition} · {weather.temp}°F
          </div>
          <div style={{ fontSize: 11, color: "#9aaa5a", marginTop: 3 }}>{wp.name}</div>
        </div>

        {/* Stats 2x2 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5, marginBottom: 6 }}>
          {[
            { l: "❤️ HEALTH", v: gs.health, c: lowHealth ? "#f87171" : "#4ade80" },
            { l: "🎭 MORALE", v: gs.morale, c: "#a78bfa" },
            { l: "🍞 HUNGER", v: gs.hunger, c: gs.hunger < 25 ? "#fb923c" : "#facc15" },
            { l: "💧 THIRST", v: gs.thirst, c: gs.thirst < 25 ? "#60a5fa" : "#38bdf8" },
          ].map(s => (
            <div key={s.l} style={{ ...panel({ padding: "7px 10px" }) }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                <span style={dimtext}>{s.l}</span>
                <span style={{ fontSize: 10, color: s.v < 25 ? s.c : "#c8d87a" }}>{s.v}%</span>
              </div>
              <StatBar val={s.v} max={100} color={s.c} />
            </div>
          ))}
        </div>

        {/* Supplies row */}
        <div style={{ ...panel({ padding: "6px 12px", marginBottom: 6 }) }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
            <span style={{ color: lowFood ? "#f87171" : "#c8d87a" }}>🍞 {gs.food}/{gs.maxFood}d</span>
            <span style={{ color: lowWater ? "#f87171" : "#c8d87a" }}>💧 {gs.water}/{gs.maxWater}L</span>
            <span style={{ color: "#c8d87a" }}>💰 ${gs.money}</span>
            <span style={{ color: "#c8d87a" }}>🩹 ×{gs.firstAidCharges}</span>
          </div>
        </div>

        {/* Warnings */}
        {(lowHealth || lowFood || lowWater) && (
          <div style={{ ...panel({ border: "1px solid #8a3030", background: "#160808", marginBottom: 6, padding: "6px 10px" }) }}>
            <span style={{ color: "#f87171", fontSize: 11 }}>
              ⚠️ {lowHealth ? "LOW HEALTH · " : ""}{lowFood ? "OUT OF FOOD · " : ""}{lowWater ? "OUT OF WATER · " : ""}
              {(lowFood || lowWater) && nextWp ? `Next town: ${nextWp.name} (~${milesTo} mi)` : ""}
            </span>
          </div>
        )}

        {/* Event card */}
        {dayResult?.event && (
          <div style={{ ...panel({ border: "1px solid #5a7a10", background: "#0c0e04", marginBottom: 6, padding: "8px 12px" }) }}>
            <span style={{ fontSize: 11, color: "#b0c060", lineHeight: 1.7 }}>{dayResult.event.text}</span>
          </div>
        )}

        {/* Day summary */}
        {dayResult && (
          <div style={{ ...panel({ background: "#080806", padding: "5px 10px", marginBottom: 8 }) }}>
            <span style={dimtext}>
              {dayResult.isRest ? "🏕️ Rest day — stayed in camp." : `Hiked ${dayResult.milesWalked} mi today.`}
              {nextWp && !dayResult.isRest && ` Next: ${nextWp.name} (~${milesTo} mi away)`}
            </span>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 2, marginBottom: 8 }}>
          <button style={{ ...btn("#c8d87a"), fontSize: 11, padding: "6px 14px" }} onClick={() => advanceDay(gs)}>▶ HIKE A DAY</button>
          <button style={btn("#8a9a40")} onClick={() => doRest(gs)}>🏕️ REST</button>
          {(wp.hasTown || wp.hasHostel) && (
            <button style={btn("#6a8a20")} onClick={() => { setTownMessage(""); setScreen("town"); }}>
              {wp.hasTown ? "🏘️ TOWN" : "🛏️ HOSTEL"}
            </button>
          )}
          <button style={btn("#5a6a28")} onClick={() => takePhoto(gs)}>📸 SNAP</button>
          <button style={btn(gs.firstAidCharges > 0 ? "#8a6a20" : "#2a2a10", gs.firstAidCharges === 0)} onClick={() => useFirstAid(gs)}>🩹 AID</button>
          <button style={btn("#4a5a1a")} onClick={() => setScreen("album")}>📖 ALBUM</button>
          <button style={btn("#2a3a10")} onClick={() => { setGameState({ ...gs, quit: true }); setScreen("end"); }}>🚶 QUIT</button>
        </div>

        {/* Log */}
        <div style={{ ...panel({ maxHeight: 100, overflowY: "auto", padding: "6px 10px" }) }}>
          {log.slice(-6).reverse().map((l, i) => (
            <div key={i} style={{ fontSize: 10, color: i === 0 ? "#7a8a3a" : "#3a4a14", lineHeight: 1.7 }}>{l}</div>
          ))}
        </div>
      </div>
    );
  }

  return <div style={crt}><div style={{ padding: 24 }}>Loading...</div></div>;
}
