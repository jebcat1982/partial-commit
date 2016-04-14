'use babel'

module.exports =
class PartialCommitView {
  constructor() {
    // Create message element
    const message = document.createElement('div')

    // Create root element
    this.element = document.createElement('div')
    this.element.classList.add('partial-commit')

    message.textContent = "The PartialCommit package is Alive! It's ALIVE!"
    message.classList.add('message')
    this.element.appendChild(message)
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    return this.element.remove()
  }

  getElement() {
    return this.element
  }
}
