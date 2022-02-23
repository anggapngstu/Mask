// -----JS CODE-----
// @input Component.Image background
// @input Asset.Texture[] images

var index = 0;
script.background.mainPass.baseTex = script.images[index];

script.createEvent("TapEvent").bind(function() {
index += 1;
    if(index >= script.images.length){
        index = 0;
    }
    script.background.mainPass.baseTex = script.images[index];
    print("Tap!");
    print(index); 
});
