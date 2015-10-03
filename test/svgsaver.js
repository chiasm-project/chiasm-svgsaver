// This file contains tests for the layout plugin.
// Created by Curran Kelleher Feb 2015

// Use the "expect" assert style.
// See http://chaijs.com/guide/styles/
var expect = require("chai").expect,
  Model = require("model-js"),
  Chiasm = require("chiasm");

// Use JSDOM for DOM manipulation in Node.
// https://github.com/tmpvar/jsdom#creating-a-browser-like-window-object
// "var" omitted intentionally to induce global variables.
document = require("jsdom").jsdom();
window = document.parentWindow;

// must be after JSDOM
var downloadButton = require("../index");

// A utility function for asserting a group of component property values.
function expectValues(chiasm, values, callback){
  var promises = Object.keys(values).map(function(key){
    return new Promise(function(resolve, reject){
      var path = key.split("."),
      alias = path[0],
      property = path[1],
      propertyPath = path.slice(2),
      expectedValue = values[key];

      chiasm.getComponent(alias).then(function(component){
        component.when(property, function(value){
          propertyPath.forEach(function(key){
            value = value[key];
          });
          expect(value).to.equal(expectedValue);
          resolve();
        });
      }, reject);
    });
  });

  Promise.all(promises).then(function(results){
    callback();
  }, function(err){
    console.log(err);
  });
}

function initChiasm(){
  var chiasm = Chiasm();

  chiasm.plugins.layout = require("chiasm-layout");
  chiasm.plugins.downloadButton = downloadButton;
  chiasm.plugins.dummyVis = Model;

  // Mock the DOM container using jsdom.
  chiasm.getComponent("layout").then(function (layout){
    var div = document.createElement("div");
    div.clientHeight = div.clientWidth = 100;
    layout.container = div;
  });

  return chiasm;
}

describe("plugins/svgsaver", function () {
  it("should create a component using downloadButton plugin", function(done) {

    var chiasm = initChiasm();

    chiasm.setConfig({
      layout: {
        plugin: "layout",
        state: {
          layout: "downloadButton"
        }
      },
      downloadButton: {
        plugin: "downloadButton",
        state: {
          downloadAs: "PNG"
        }
      }
    }).then(function(){
      chiasm.getComponent("downloadButton").then(function(a){
        expect(a).instanceof(Model);
        expect(a.downloadAs).to.equal("PNG");
        done();
      });
    });

  });
});
