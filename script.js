"use strict";

window.addEventListener("DOMContentLoaded", init);

let hexInput;
const baseDiv = document.getElementById("color_base");

//create an array to store all the different objects(which are colors) with hex, rgb, and hsl objects inside
let colorsArray = [];

//create an object to store all the color codes fora color
const rgb = { red: "", green: "", blue: "" };
const hsl = { h: "", s: "", l: "" };
const colorPrototype = {
  rgb,
  hsl
};

const selectElement = document.querySelector("select");

function init() {
  document.querySelector("input").addEventListener("input", showColorAndConvert);
  selectElement.addEventListener("change", showColorAndConvert);
}

function showColorAndConvert() {
  colorsArray = [];

  hexInput = document.querySelector(".color_input").value;

  //for the base object which is colorPrototype get rgb and hsl values--------------------
  convertHEXToRGB(hexInput);
  convertRGBToHSL(rgb);
  showBackgroundColor(baseDiv, hexInput);
  //add the base color object to the first element of the colors array
  colorsArray.push(colorPrototype);

  const baseColorHSL = colorsArray[0].hsl;

  //show color values for the base color
  document.querySelector("#color_base > .text_container > .hex").textContent = `HEX: ${hexInput}`;
  document.querySelector("#color_base > .text_container > .rgb").textContent = `RGB: ${rgb.red}, ${rgb.green}, ${rgb.blue}`;
  document.querySelector("#color_base > .text_container > .hsl").textContent = `HSL: ${hsl.h}, ${hsl.s}%, ${hsl.l}%`;

  // the last 4 elements of the array change, which are the 4 divs that change -------------------------------------------
  // for (let index = 1; index < 5; index++) {

  document.querySelectorAll(".color_div").forEach((element, index) => {
    //color=object inside array
    let newColor = Object.create(colorPrototype);
    // console.log("INITIAL H" + newColor.hsl.h);

    //if conditions depending on choice
    if (selectElement.options[selectElement.selectedIndex].value == "analogous") {
      //give h, s and l values to new object
      analogousChoice(baseColorHSL, newColor, index);
    } else if (selectElement.options[selectElement.selectedIndex].value == "monochromatic") {
      monochromaticChoice(baseColorHSL, newColor, index);
    } else if (selectElement.options[selectElement.selectedIndex].value == "triad") {
      triadChoice(baseColorHSL, newColor, index);
    } else if (selectElement.options[selectElement.selectedIndex].value == "complementary") {
      complementaryChoice(baseColorHSL, newColor, index);
    } else if (selectElement.options[selectElement.selectedIndex].value == "compound") {
      compoundChoice(baseColorHSL, newColor, index);
    } else if (selectElement.options[selectElement.selectedIndex].value == "shades") {
      shadesChoice(baseColorHSL, newColor, index);
    }
    convertHSLToRGB(newColor);

    const rgbObject = newColor.rgb;
    showBackgroundColor(element, `rgb(${rgbObject.red}, ${rgbObject.green}, ${rgbObject.blue})`);
    showValues(element, newColor);

    // console.log("FINAL H" + newColor.hsl.h);
    // console.log("BASE COLOR IS NOW" + baseColorHSL.h);
  });

  //show what is inside the colorsArray
  // document.querySelectorAll(".color_div").forEach((element, index) => {
  //   const rgbObject = colorsArray[index + 1].rgb;
  //   showBackgroundColor(element, `rgb(${rgbObject.red}, ${rgbObject.green}, ${rgbObject.blue})`);
  //   showValues(element, colorsArray[index + 1]);
  // });
}

function showBackgroundColor(element, color) {
  element.style.backgroundColor = color;
}

function showValues(element, anObject) {
  element.querySelector(".text_container > .hex").textContent = `HEX: a hex number`;
  element.querySelector(".text_container > .rgb").textContent = `RGB: ${anObject.rgb.red}, ${anObject.rgb.green}, ${anObject.rgb.blue}`;
  element.querySelector(".text_container > .hsl").textContent = `HSL: ${anObject.hsl.h}, ${anObject.hsl.s}%, ${anObject.hsl.l}%`;
}

function convertHEXToRGB(hexColorCode) {
  const hexArray = Array.from(hexColorCode);
  rgb.red = Number.parseInt(hexArray[1] + hexArray[2], 16);
  rgb.green = Number.parseInt(hexArray[3] + hexArray[4], 16);
  rgb.blue = Number.parseInt(hexArray[5] + hexArray[6], 16);

  //return the rgb object
  return rgb;
}

function convertRGBToHSL(rbgObject) {
  const r = rbgObject.red / 255;
  const g = rbgObject.green / 255;
  const b = rbgObject.blue / 255;
  let h, s, l;

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

  hsl.h = Math.round(h);
  hsl.s = Math.round(s);
  hsl.l = Math.round(l);

  return hsl;
}

//https://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion
function convertHSLToRGB(anObject) {
  let r, g, b;
  //assign hsl valuesto the correct value from the object between interval [0, 1]
  const h = anObject.hsl.h / 360;
  const s = anObject.hsl.s / 100;
  const l = anObject.hsl.l / 100;

  if (s == 0) {
    r = g = b = l; // achromatic
  } else {
    function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  anObject.rgb.red = Math.round(r * 255);
  anObject.rgb.green = Math.round(g * 255);
  anObject.rgb.blue = Math.round(b * 255);

  console.log("Funtion!!!!");

  // return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

////////////////////////////color functions

function analogousChoice(baseColorInHSL, colorObject, indexOfCurrentElement) {
  let h, s, l;

  h = baseColorInHSL.h + 4 + 1 * indexOfCurrentElement;
  s = baseColorInHSL.s;
  l = baseColorInHSL.l;

  colorObject.hsl.h = h;
  colorObject.hsl.s = s;
  colorObject.hsl.l = l;
}

function monochromaticChoice(baseColorInHSL, colorObject, indexOfCurrentElement) {
  let h, s, l;
  h = baseColorInHSL.h;
  s = baseColorInHSL.s;
  l = baseColorInHSL.l;
  //lower than the s from base color
  if (indexOfCurrentElement == 0) {
    s = Math.floor(Math.random() * s);
  } //higer than the s from base color
  else if (indexOfCurrentElement == 1) {
    s = Math.floor(Math.random() * (101 - s) + s);
  } else if (indexOfCurrentElement == 2) {
    l = Math.floor(Math.random() * l);
  } else {
    l = Math.floor(Math.random() * (101 - l) + l);
  }

  colorObject.hsl.h = h;
  colorObject.hsl.s = s;
  colorObject.hsl.l = l;
}

function triadChoice(baseColorInHSL, colorObject, indexOfCurrentElement) {
  let h, s, l;
  h = baseColorInHSL.h;
  s = baseColorInHSL.s;
  l = baseColorInHSL.l;
  //lower than the s from base color
  if (indexOfCurrentElement == 0) {
    h = h - 120;
    l = 30;
  } //higer than the s from base color
  else if (indexOfCurrentElement == 1) {
    h = h - 60;
    l = 90;
  } else if (indexOfCurrentElement == 2) {
    h = h + 60;
    l = 20;
  } else {
    h = h + 120;
    l = 60;
  }

  colorObject.hsl.h = h;
  colorObject.hsl.s = s;
  colorObject.hsl.l = l;
}

function complementaryChoice(baseColorInHSL, colorObject, indexOfCurrentElement) {
  let h, s, l;
  h = baseColorInHSL.h;
  s = baseColorInHSL.s;
  l = baseColorInHSL.l;
  //lower than the s from base color
  if (indexOfCurrentElement == 0) {
    h = h + 180;
    s = 50;
    l = 30;
  } //higer than the s from base color
  else if (indexOfCurrentElement == 1) {
    h = h - 90;
    s = 50;
    l = 50;
  } else if (indexOfCurrentElement == 2) {
    h = h + 90;
    s = 75;
    l = 70;
  } else {
    h = h + 30;
    s = 100;
    l = 90;
  }

  colorObject.hsl.h = h;
  colorObject.hsl.s = s;
  colorObject.hsl.l = l;
}

function compoundChoice(baseColorInHSL, colorObject, indexOfCurrentElement) {
  let h, s, l;
  h = baseColorInHSL.h;
  s = baseColorInHSL.s;
  l = baseColorInHSL.l;
  //lower than the s from base color
  if (indexOfCurrentElement == 0) {
    h = h + 10;
  } //higer than the s from base color
  else if (indexOfCurrentElement == 1) {
    h = h + 180;
  } else if (indexOfCurrentElement == 2) {
    h = h + 90;
  } else {
    h = h - 10;
  }

  colorObject.hsl.h = h;
  colorObject.hsl.s = s;
  colorObject.hsl.l = l;
}

function shadesChoice(baseColorInHSL, colorObject, indexOfCurrentElement) {
  let h, s, l;
  h = baseColorInHSL.h;
  s = baseColorInHSL.s;
  l = baseColorInHSL.l;
  //lower than the s from base color
  if (indexOfCurrentElement == 0) {
    l = 10;
  } //higer than the s from base color
  else if (indexOfCurrentElement == 1) {
    l = 30;
  } else if (indexOfCurrentElement == 2) {
    l = 50;
  } else {
    l = 70;
  }

  colorObject.hsl.h = h;
  colorObject.hsl.s = s;
  colorObject.hsl.l = l;
}
