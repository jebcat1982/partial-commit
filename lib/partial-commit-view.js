'use babel'

const git = require('./git')
const FileView = require('./views/file-view')
const DiffView = require('./views/diff-view')

import { View } from 'atom-space-pen-views'

let gitWorkspaceTitle = ''

export default class PartialCommitView extends View {

  static content() {
    if (!git.isInitialised()) {
      return this.div({ class: 'partial-commit' })
    }

    return this.div({ class: 'partial-commit' }, () => {
      this.div({ class: 'content', outlet: 'contentView' }, () => {
        this.div({ class: 'sidebar' }, () =>
          this.subview('filesView', new FileView())
        )
        this.div({ class: 'domain' }, () =>
          this.subview('diffView', new DiffView())
        )
        return
      })
    })
  }

  serialize() {}

  initialize() {
    this.active = true
    this.branchSelected = null
    if (!git.isInitialised()) {
      git.alert('> This project is not a git repository. Either open another project or create a repository.')
    } else {
      this.setWorkspaceTitle(git.getRepository().path.split('/').reverse()[1])
    }
    this.update(true)
  }

  destroy() {
    this.active = false
  }

  setWorkspaceTitle(title) {
    gitWorkspaceTitle = title
    return
  }

  getTitle() {
    return 'partial-commit'
  }

  update(nofetch) {
    if (git.isInitialised()) {
      this.showStatus()
      this.filesView.setWorkspaceTitle(gitWorkspaceTitle)
      if (!nofetch) {
        if (this.diffView) {
          this.diffView.clearAll()
        }
      }
    }
  }

  showStatus() {
    git.status().then(files =>
      this.filesView.addAll(files)
    )
  }

  commit() {
    if (!this.filesView.hasSelected()) {
      return
    }

    const msg = this.commitDialog.getMessage()
    const files = this.filesView.getSelected()
    this.filesView.unselectAll()
    git.add(files.add).then(function() {
      return git.remove(files.rem)
    }).then(function() {
      return git.commit(msg)
    }).then((function(_this) {
      return function() {
        return _this.update()
      }
    })(this))
  }
}
