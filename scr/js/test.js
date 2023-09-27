var touch = []
window.addEventListener("touchstart", function (e) {

  touch.push(`${e.touches[0].screenX.toFixed(2)}_${e.touches[0].screenY.toFixed(2)}`)
  alert(touch)
})