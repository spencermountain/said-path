const Shape = require('./Shape')

const defaults = {
  fill: 'grey',
  stroke: 'none',
  'stroke-width': 1,
  'stroke-linecap': 'round'
}

class Text extends Shape {
  constructor(obj = {}, world) {
    obj = Object.assign({}, defaults, obj)
    super(obj, world);
    this.textLines = []
    this._order = 0
    this.data = [{
      x: 0,
      y: 0,
    }]
    this._dodge = {
      x: 0,
      y: 0,
    }
  }
  extent() {
    // let longest = this.textLines.sort((a, b) => a.length < b.length ? 1 : -1)[0] || ''
    // let width = longest.length * 8
    // let height = this.textLines.length * 20
    return {
      x: {
        min: this.data[0].x,
        max: this.data[0].x
      },
      y: {
        min: this.data[0].y, // - height,
        max: this.data[0].y
      },
    }
  }
  dodge(x, y) {
    this._dodge.x = x
    this._dodge.y = y
    return this
  }
  text(text) {
    if (typeof text === 'string') {
      this.textLines = [text]
    } else {
      this.textLines = text
    }
  }
  path() {
    return ''
  }
  build() {
    let inside = this.textLines.map((str) => `<tspan x="0" dy="1.2em">${str}</tspan>`)
    inside = inside.join('\n')

    let point = this.points()[0]
    let attrs = Object.assign({}, this.attrs)
    attrs = Object.keys(attrs).map((k) => {
      return `${k}="${attrs[k]}"`
    }).join(' ')
    let x = point[0] + 2 + (this._dodge.x || 0)
    let y = point[1] - 24 + (this._dodge.y || 0)
    return `<g transform="translate(${x} ${y})">
      <text ${attrs}>
        ${inside}
      </text>
    </g>`
  }
}

module.exports = Text