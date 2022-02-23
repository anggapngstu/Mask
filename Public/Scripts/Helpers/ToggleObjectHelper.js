// ToggleObjectHelper.js
// Version: 0.0.1
// Event: Lens Initialized
// Description: This helper script toggles object visibilities when onFound or onLost is called

// @input SceneObject[] objectOnFound
// @input SceneObject[] objectOnLost

script.api.onFound = function() {
    enableObjects(true);
}

script.api.onLost = function() {
    enableObjects(false);
}


function enableObjects(isOnFound){
    
    for(var i=0;i<script.objectOnFound.length ;i++){
        script.objectOnFound[i].enabled = isOnFound;
    }
    for(var i=0;i<script.objectOnLost.length;i++){
        script.objectOnLost[i].enabled = !isOnFound;
    }
}