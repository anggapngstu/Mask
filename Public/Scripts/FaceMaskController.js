// FaceMaskController.js
// Version: 0.0.1
// Event: Lens Initialized
// Description: This script gets output mask probability from ML model and distribute it across project

// @input Component.MLComponent mlComponent 
// @input string outputName {"hint": "Output placeholder name of your Ml model asset"}
// @input int classIndex = 0 {"hint" : "This is an index of desired class in your neural network output"}
//@ui {"widget":"separator"}

// @input float threshold = 0.5  {"widget" : "slider" , "min" : "0", "max" : "1" ,"step" : "0.01", "hint": "If probability is bigger than this value - class is considered as found, if less - as lost"}
//@ui {"widget":"separator"}

//@ui {"label":"Callback Objects"}
//@input Component.ScriptComponent[] scriptsWithCallbacks {"hint": "If these scripts have function script.api.onFound or script.api.onLost they will be called correspondingly"}
//@input SceneObject hintObject
//@input Component.Head head

//@ui {"widget":"separator"}
// @input bool showDebug
// @input Component.ScriptComponent debugScoreBar {"showIf" : "showDebug"}

//@ui {"widget":"separator"}
//@input bool optional
//@input SceneObject loader {"showIf" : "optional"}

var smoothCoef = 0.5;
var delta = 0.15;

var minProb = script.threshold - delta;
var maxProb = script.threshold + delta;

var currentProb = 1.0;
var prevProb = 1.0;

var State = { NONE: 0, FOUND: 1, LOST: 2 }
var state = State.NONE;

var outputData;

if (checkInputs()) {
    script.mlComponent.onLoadingFinished = wrapFunction(script.mlComponent.onLoadingFinished, onLoadingFinished);
}

function onLoadingFinished() {
    //initializing output data reference
    var output;
    try {
        output = script.mlComponent.getOutput(script.outputName);
    } catch (e) {
        debugPrint(e + ". Please specify correct output name of your model");
        return;
    }
    outputData = output.data;
    if (script.classIndex < 0 || script.classIndex >= outputData.length) {
        debugPrint("Error, class index is outside of range");
        return;
    }

    if (script.loader) {
        script.loader.enabled = false;
    }

}

function onUpdate() {

    if (outputData) {
        currentProb = outputData[script.classIndex];
    }
    //check if we get valid values for probability
    if (currentProb > 1.0 || currentProb < 0.0) {
        debugPrint("Warning, your model is producing values outside of [0, 1] range. Please make sure you have sigmoid applied");
    }
    currentProb = prevProb + smoothCoef * (currentProb - prevProb);

    //change state based on probability
    if (currentProb < minProb && state != State.LOST) {
        state = State.LOST;
        invokeOnLostCallbacks();

    }
    else if (currentProb > maxProb && state != State.FOUND) {
        state = State.FOUND;
        invokeOnFoundCallbacks();
    }

    if (script.hintObject) {
        script.hintObject.enabled = (state != State.FOUND);
    }

    prevProb = currentProb;

    if (script.showDebug && script.debugScoreBar && script.debugScoreBar.api.updateValue) {
        script.debugScoreBar.api.updateValue(currentProb);
    }
}

script.createEvent("UpdateEvent").bind(onUpdate);


function invokeOnFoundCallbacks() {
    for (var i = 0; i < script.scriptsWithCallbacks.length; i++) {
        if (script.scriptsWithCallbacks[i] && script.scriptsWithCallbacks[i].api.onFound) {
            script.scriptsWithCallbacks[i].api.onFound();
        }
    }
}

function invokeOnLostCallbacks() {
    for (var i = 0; i < script.scriptsWithCallbacks.length; i++) {
        if (script.scriptsWithCallbacks[i] && script.scriptsWithCallbacks[i].api.onLost) {
            script.scriptsWithCallbacks[i].api.onLost();
        }
    }
}

function checkInputs() {

    if (!script.mlComponent) {
        debugPrint("Error, ML Component is not set");
        return false;
    }

    if (script.showDebug) {
        if (!script.debugScoreBar) {
            debugPrint("Warning, debugScoreBar is not set")
            return false;
        }
    } else if (script.debugScoreBar) {
        if (script.debugScoreBar) {
            script.debugScoreBar.getSceneObject().enabled = false;
        }
    }

    if (!script.hintObject) {
        debugPrint("Warning, Please assign hint object");
    }
    return true;

}

function debugPrint(text) {
    print("FaceMaskController: " + text);
}

function wrapFunction(origFunc, newFunc) {
    if (!origFunc) {
        return newFunc;
    }
    return function () {
        origFunc();
        newFunc();
    };
}