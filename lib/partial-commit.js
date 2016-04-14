'use babel'

import { CompositeDisposable } from 'atom'

module.exports = {
  partialCommitView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    const PartialCommitView = require('./partial-commit-view')
    this.partialCommitView = new PartialCommitView(state.partialCommitViewState)
    this.modalPanel = atom.workspace.addModalPanel({ item: this.partialCommitView.getElement(), visible: false })

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable()

    // Register command that toggles this view
    return this.subscriptions.add(atom.commands.add('atom-workspace', { 'partial-commit:toggle': () => this.toggle() }))
  },

  deactivate() {
    this.modalPanel.destroy()
    this.subscriptions.dispose()
    return this.partialCommitView.destroy()
  },

  serialize() {
    return { partialCommitViewState: this.partialCommitView.serialize() }
  },

  toggle() {
    if (this.modalPanel.isVisible()) {
      return this.modalPanel.hide()
    }

    return this.modalPanel.show()
  }
}
