'use babel'

import { $, View, TextEditorView } from 'atom-space-pen-views'
import { TextEditor, TextBuffer } from 'atom'

module.exports =
class CommitView extends View {
  static content() {
    const summaryEditor = new TextEditor({ mini: true, placeholderText: 'Summary', buffer: new TextBuffer })
    const descriptionEditor = new TextEditor({ mini: true, placeholderText: 'Description', buffer: new TextBuffer })

    summaryEditor.onDidChange(() => {
      const hasSummary = summaryEditor.getText() !== ''
      const commitButton = $('.commit')
      if (hasSummary) {
        commitButton.removeClass('disabled')
      } else {
        commitButton.addClass('disabled')
      }
    })

    this.div({ class: 'commit-container' }, () => {
      this.div({ class: 'summary-editor' }, () => {
        this.subview('summaryEditor', new TextEditorView({ editor: summaryEditor }))
      })
      this.div({ class: 'description-editor' }, () => {
        this.subview('descriptionEditor', new TextEditorView({ editor: descriptionEditor }))
      })
      this.button({ class: 'commit btn disabled', click: 'commit' }, 'Commit')
    })
  }

  commit() {

  }
}
