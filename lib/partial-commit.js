'use babel'

const PartialCommitView = require('./partial-commit-view')

const views = []

let view = undefined
let pane = undefined
let item = undefined

module.exports = {
  partialCommitView: null,
  modalPanel: null,
  subscriptions: null,

  activate() {
    atom.commands.add('atom-workspace', { 'partial-commit:toggle': () => this.toggleView() })
    atom.workspace.onDidChangeActivePaneItem(() => this.updateViews())
    return
  },

  deactivate() {
    return
  },

  toggleView() {
    if (!(view && view.active)) {
      view = new PartialCommitView()
      views.push(view)
      pane = atom.workspace.getActivePane()
      item = pane.addItem(view, 0)
      pane.activateItem(item)
    } else {
      pane.destroyItem(item)
    }
  },

  updateViews() {
    let i
    let len
    let v

    const activeView = atom.workspace.getActivePane().getActiveItem()

    for (i = 0, len = views.length; i < len; i++) {
      v = views[i]
      if (v === activeView) {
        v.update()
      }
    }
  },

  serialize() {}
}
