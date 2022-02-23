// ToggleTextHelper.js
// Version: 0.0.1
// Event: Lens Initialized
// Description: This helper script toggles text when onFound or onLost is called

//@ui {"widget":"separator"}
// @input Component.Text text

if(!script.text) {
    debugPrint("Warning, Text component is not set");
    return;
}

script.api.onFound = function() {
    script.text.text = "DIRGAHAYU REPUBLIK INDONESIA";
}

script.api.onLost = function() {
    script.text.text = "SUDAH VAKSIN TETAP PAKAI MASKERMU !";
}

function debugPrint(text) {
    print("ToggleTextHelper: " + text);
}