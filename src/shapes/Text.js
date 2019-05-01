const Shape = require('./Shape')
const colors = require('spencer-color').colors

const defaults = {
  fill: 'grey',
  stroke: 'none',
  'stroke-width': 1,
  'stroke-linecap': 'round'
}

class Text extends Shape {
  constructor(obj = {}, world) {
    let text = null
    let textFn = null
    if (typeof obj === 'string') {
      text = [obj]
      obj = {}
    } else if (typeof obj === 'function') {
      textFn = obj
      obj = {}
    } else if (Array.isArray(obj)) {
      text = obj
      obj = []
    }
    obj = Object.assign({}, defaults, obj)
    super(obj, world)
    this.textLines = text || obj.text || []
    this.textFn = textFn
    if (typeof this.textLines === 'string') {
      this.textLines = [this.textLines]
    }
    this._order = 0
    this.data = [
      {
        x: {
          value: 50,
          type: 'percent'
        },
        y: {
          value: 50,
          type: 'percent'
        }
      }
    ]
    this._dodge = {
      x: 0,
      y: 4
    }
    this._underline = ''
  }
  before(x, y) {
    this.attrs['text-anchor'] = 'end'
    this.set([[x, y]])
    return this
  }
  after(x, y) {
    this.attrs['text-anchor'] = 'start'
    this.set([[x, y]])
    return this
  }
  center(x, y) {
    this.attrs['text-anchor'] = 'middle'
    this.set([[x, y]])
    return this
  }
  color(color) {
    this.attrs.fill = colors[color] || color
    return this
  }
  dy(n = 0) {
    this._dodge.y = n * -1
    return this
  }
  dx(n = 0) {
    this._dodge.x = n
    return this
  }
  dodge(x, y) {
    x = x || this._dodge.x
    y = y || this._dodge.y
    this._dodge.x = x * -1
    this._dodge.y = y * -1
    return this
  }
  font(num) {
    if (typeof num === 'number') {
      num += 'px'
    }
    this.style['font-size'] = num
    return this
  }
  size(num) {
    return this.font(num)
  }
  extent() {
    // let longest = this.textLines.sort((a, b) => a.length < b.length ? 1 : -1)[0] || ''
    // let width = longest.length * 8
    // let height = this.textLines.length * 20
    let d = this.data[0] || {}
    return {
      x: {
        min: d.x,
        max: d.x
      },
      y: {
        min: d.y, // - height,
        max: d.y
      }
    }
  }
  text(text) {
    if (typeof text === 'string') {
      this.textLines = [text]
    } else if (typeof text === 'function') {
      this.textLines = []
      this.textFn = text
    } else {
      this.textLines = text
    }
    return this
  }
  path() {
    return ''
  }
  estimate() {
    let textArr = this.textLines
    if (this.textFn !== null) {
      textArr = this.textFn(this.world)
      textArr = typeof textArr === 'string' ? [textArr] : textArr
    }
    //calculate height
    let height = 24
    if (this.style['font-size']) {
      let num = this.style['font-size'].replace('px', '')
      num = Number(num)
      height = num * 1.5
    }
    height *= textArr.length
    //calculate width
    let width = 0
    textArr.forEach(str => {
      let w = str.length * 8
      if (w > width) {
        width = w
      }
    })
    return {
      height: height,
      width: width
    }
  }
  position() {
    let point = this.points()[0]
    let res = {
      x: 0,
      y: 0
    }
    if (!point) {
      return res
    }
    let { height, width } = this.estimate()
    res.height = height
    res.width = width
    res.y = point[1] + this._dodge.y - height
    res.x = point[0] + 2 + this._dodge.x
    return res
  }
  build() {
    let h = this.world.html
    this.onMount()
    let textArr = this.textLines
    if (this.textFn !== null) {
      textArr = this.textFn(this.world)
      textArr = typeof textArr === 'string' ? [textArr] : textArr
    }
    let inside = textArr.map(str => h`<tspan x="0" dy="1.2em">${String(str)}</tspan>`)
    let { x, y } = this.position()
    let transform = `translate(${x} ${y})`
    return h`<g transform="${transform}" style="${this.drawSyle()}">
      <text ...${this.attrs}>
        ${inside}
      </text>
    </g>`
  }
}

module.exports = Text
