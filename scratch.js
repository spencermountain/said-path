//comment!
const somehow = require('./src')
let el = document.querySelector('#stage')
el.innerHTML = '<h2>one.</h2>'

let w = somehow({
  height: 300,
  aspect: 'widescreen',
  el: el
})
w.build()
