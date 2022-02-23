// ParticleControllerHelper.js
// Version: 0.0.1
// Event: Lens Initialized
// Description: This helper script allows user to burst particles when onFound or onLost is called

// @input int particleAmount = 100
//@input Asset.Material particleMaterial

var mat = script.particleMaterial ? script.particleMaterial.mainPass : script.getSceneObject().getComponent("Component.MaterialMeshVisual").mainPass;

if(!mat) {
    debugPrint("Error, No particle material assigned in script attached to " + script.getSceneObject().name);
    return;
}

script.api.onFound = onFound;
script.api.onLost = onLost;

var event = script.createEvent("UpdateEvent");
event.enabled = false;
event.bind(function (eventData)
{
	mat.externalTimeInput += getDeltaTime();
});

function onFound() {
	mat.externalTimeInput = 0;
    mat.externalSeed = Math.random();
	mat.spawnMaxParticles = script.particleAmount;
	event.enabled = true;
}

function onLost() {
	mat.externalTimeInput = 0;
	mat.spawnMaxParticles = 0;
	event.enabled = false;	
}

function debugPrint(text) {
    print("ParticleControllerHelper: " + text);
}
