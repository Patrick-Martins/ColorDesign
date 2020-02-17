"use strict";

window.addEventListener("DOMContentLoaded", init);

let hex;
let r, g, b;
let h, s, l;

function init() {
  document.querySelector("input").addEventListener("change", showColorAndConvert);
}

function showColorAndConvert() {
  hex = document.querySelector(".color_input").value;
  //convert to rgb
  console.log("Value INPUT is " + hex);
  console.log(Array.from(hex));
  let hexArray = Array.from(hex);
  r = Number.parseInt(hexArray[1] + hexArray[2], 16);
  console.log(hexArray[1] + hexArray[2]);
  g = Number.parseInt(hexArray[3] + hexArray[4], 16);
  b = Number.parseInt(hexArray[5] + hexArray[6], 16);
  console.log("r= " + r);
  console.log("g= " + g);
  console.log("b= " + b);

  convertToHSL(r, g, b);

  document.querySelector(".hex").textContent += hex;
  document.querySelector(".rgb").textContent += `${r}, ${g}, ${b}`;
  document.querySelector(".hsl").textContent += `${h}, ${s}%, ${l}%`;
}

function convertToHSL(r, g, b) {
  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);

  if (max === min) {
    h = 0;
  } else if (max === r) {
    h = 60 * (0 + (g - b) / (max - min));
  } else if (max === g) {
    h = 60 * (2 + (b - r) / (max - min));
  } else if (max === b) {
    h = 60 * (4 + (r - g) / (max - min));
  }

  if (h < 0) {
    h = h + 360;
  }

  l = (min + max) / 2;

  if (max === 0 || min === 1) {
    s = 0;
  } else {
    s = (max - l) / Math.min(l, 1 - l);
  }
  // multiply s and l by 100 to get the value in percent, rather than [0,1]
  s *= 100;
  l *= 100;

  h = Math.round(h);
  s = Math.round(s);
  l = Math.round(l);

  console.log(l); // just for testing
}
