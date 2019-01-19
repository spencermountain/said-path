// const colors = require('spencer-color')
const defaults = {}

class Input {
  constructor(obj = {}, world) {
    if (typeof obj === 'string') {
      this.id = obj
      obj = {}
    }
    this.world = world
    this.attrs = Object.assign({}, defaults, obj)
    this.id = obj.id || 'input'
    this._value = obj.value || ''
    this.world.state[this.id] = this._value
    this.callback = (e) => {
      this.world.state[this.id] = e.target.value
      this.world.redraw()
    }
    this.mounted = false
    this.el = null
  }
  setCallback() {
    setTimeout(() => {
      let el = document.getElementById(this.id)
      if (el) {
        el.addEventListener('input', (e) => {
          this.world.state[this.id] = e.target.value
          this.callback(e)
        })
      }
    }, 50)
  }
  build() {
    let h = this.world.html
    this.setCallback()
    return h`<input id="${this._id}" class="input" type="text" value="${this._value}"/>`
  }
}
module.exports = Input
