const somehow = require('./src')

let w = somehow({
  el: '#stage',
  height: 300,
  aspect: 'widescreen'
})

w.line()
  .set([['Jan 21st 2019', '0%'], ['Jan 22nd 2019', '80']])
  .color('blue')

w.line()
  .set([['Jan 10th 2019', '10%'], ['Jan 10th 2019', '80%']])
  .color('lightgrey')

w.fit()
w.y.fit(-9, 80)
w.x.fit('Jan 1 2019', 'Jan 28 2019')
w.clip()
w.x.reverse()

document.querySelector('#stage').innerHTML = w.build()
