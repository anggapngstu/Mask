// -----JS CODE-----
//@input float changeDelay = 0.005 {"widget":"slider", "min":0.0, "max":0.4, "step":0.005}
//@input float hintShowTime = 1 {"widget":"slider", "min":0.0, "max":3, "step":0.1}
//@input string stopHintText
//@input string startHintText
//@input Component.Text hintTextObject

var stop = false
var running = false

if (!script.hintTextObject) {
  print('Add the hint text back to the controller!')
  return
}

var hideHintDelay = script.createEvent('DelayedCallbackEvent')
hideHintDelay.bind(function() {
  hideHint()
})

function showHint(text) {
  script.hintTextObject.enabled = true
  script.hintTextObject.text = text
  hideHintDelay.reset(script.hintShowTime)
}

function hideHint() {
  script.hintTextObject.enabled = false
}

showHint(script.stopHintText)

function start(arr, mat, delay) {
  running = true
  var delayedEvent = script.createEvent('DelayedCallbackEvent')
  delayedEvent.bind(function() {
    mat.mainPass.baseTex = arr[(arr.length * Math.random()) | 0]
    if (!stop) {
      delayedEvent.reset(delay)
    }
  })
  delayedEvent.reset(0)
}