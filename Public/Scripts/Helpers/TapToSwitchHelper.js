// TapToSwitchHelper.js
// Version: 0.0.1
// Event: Lens Initialized
// Description: This helper script allows user to toggle objects on tap

//@input SceneObject[] ObjectList

var index = 0;
var maxIndex = script.ObjectList.length;

function OnTap(){
        if(index < maxIndex-1){
        index ++;
    }else{
        index = 0;
    }
    for(var i=0;i<maxIndex;i++){
        script.ObjectList[i].enabled = (i == index);
    }
}

script.createEvent("TapEvent").bind(OnTap);