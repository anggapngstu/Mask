// MaterialAnimationHelper.js
// Version: 0.0.1
// Event: Lens Initialized
// Description: This helper script changes parameter on material when onFound or onLost is called

//@input Asset.Material targetMaterial
//@input float acceleration{"widget":"slider","min":"0.1","max":"3","step":"0.02"}
//@input string channelName
//@input float startValue = 0
//@input float endValue = 1

script.api.onFound = onFound;
script.api.onLost = onLost;

var changeT = 0;
var startFading;

var matPass = script.targetMaterial ? script.targetMaterial.mainPass : script.getSceneObject().getComponent("Component.MaterialMeshVisual").mainPass;

if(!matPass) {
    debugPrint("Warning, No material assigned in script attached to " + script.getSceneObject().name);
    return;
}

function onFound() {
    startFading =true;
}

function onLost(){
    startFading = false;
}

function OnUpdate(){
    if(startFading && (changeT < script.endValue)){
        changeT += getDeltaTime() * script.acceleration;
        matPass[script.channelName] = changeT;
    }else if(!startFading && (changeT> script.startValue)){
        changeT -= getDeltaTime() * script.acceleration;
        matPass[script.channelName] = changeT;
    }
}

script.createEvent("UpdateEvent").bind(OnUpdate);

function debugPrint(text) {
    print("MaterialAnimationHelper: " + text);
}
