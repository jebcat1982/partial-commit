'use babel'

import { View, $ } from 'atom-space-pen-views'
const git = require('../git')

class FileItem extends View {
  static content(file) {
    let fileClickClass = ''
    if (file.type === 'modified') {
      fileClickClass = 'clickable'
    }

    this.div({ class: `file ${file.type}`, 'data-name': file.name }, () => {
      this.span({ class: 'clickable text',
                  outlet: 'contentView',
                  click: 'select',
                  title: file.name }, file.name)
      this.i({ class: 'icon check clickable', click: 'select' })
      this.i({ class: `icon ${fileClickClass} file-${file.type}`, click: 'showFileDiff' })
    })
  }

  initialize(file) {
    this.file = file
  }

  showFileDiff() {
    if (this.file.type === 'modified') {
      this.file.showFileDiff(this.file.name)
    }
  }

  select() {
    this.file.select(this.file.name)
  }
}

module.exports =
class FileView extends View {
  static content() {
    this.div({ class: 'files' }, () => {
      this.div({ class: 'heading clickable' }, () => {
        this.i({ click: 'toggleBranch' })
        this.span('', { outlet: 'workspaceTitle' })
        this.div({ class: 'action', click: 'selectAll' }, () => {
          this.span('Select')
          this.i({ class: 'icon check' })
          this.input({ class: 'invisible', type: 'checkbox', outlet: 'allCheckbox', checked: true })
        })
      })
      this.div({ class: 'placeholder' }, 'No local working copy changes detected')
    })
  }

  initialize() {
    this.files = {}
    this.arrayOfFiles = []
    this.hidden = false
  }

  hasSelected() {
    const ref = this.files
    let filename
    for (filename in ref) {
      if (ref[filename].hasOwnProperty('selected')) {
        return true
      }
    }
    return false
  }

  getSelected() {
    const ref = this.files
    const files = { all: [], add: [], rem: [] }
    let filename
    for (filename in ref) {
      if (!ref[filename].hasOwnProperty('selected')) {
        continue
      }

      files.all.push(name)
      switch (ref[filename].type) {
        case 'deleted':
          files.rem.push(name)
          break
        default:
          files.add.push(name)
      }
    }

    return files
  }

  showSelected() {
    const fnames = []
    this.arrayOfFiles = Object.keys(this.files).map((file) => this.files[file])
    this.find('.file').toArray().forEach(div => {
      const f = $(div)
      const name = f.attr('data-name')
      if (name) {
        if (this.files[name].selected) {
          fnames.push(name)
          f.addClass('active')
        } else {
          f.removeClass('active')
        }
        return
      }
    })

    let filename
    const ref = this.files

    for (filename in ref) {
      if (fnames.indexOf(filename) < 0) {
        ref[filename].selected = false
      }
    }

    this.parentView.showSelectedFiles()
    return
  }

  clearAll() {
    this.find('>.file').remove()
    return
  }

  addAll(files) {
    const fnames = []

    this.clearAll()

    if (files.length) {
      this.removeClass('none')

      const select = (name) => this.selectFile(name)
      const showFileDiff = (name) => this.showFileDiff(name)

      files.forEach(file => {
        fnames.push(file.name)

        file.select = select
        file.showFileDiff = showFileDiff

        if (this.files[file.name] === undefined) {
          this.files[file.name] = { name: file.name }
        }
        this.files[file.name].type = file.type
        this.files[file.name].selected = file.selected
        this.append(new FileItem(file))
        return
      })
    } else {
      this.addClass('none')
    }

    let filename
    const ref = this.files

    for (filename in ref) {
      if (fnames.indexOf(filename) < 0) {
        ref[filename].selected = false
      }
    }

    this.showSelected()
    return
  }

  showFileDiff(name) {
    git.diff(name).then(diffs => {
      this.parentView.diffView.clearAll()
      this.parentView.diffView.addAll(diffs)
    })
  }

  selectFile(name) {
    if (name)
      this.files[name].selected = !!!this.files[name].selected

    this.allCheckbox.prop('checked', false)
    this.showSelected()
    return
  }

  selectAll() {
    if (this.hidden)
      return
    val = !!!this.allCheckbox.prop('checked')
    this.allCheckbox.prop('checked', val)

    let filename
    const ref = this.files

    for (filename in ref) {
      ref[filename].selected = val
    }

    this.showSelected()
    return
  }

  unselectAll() {
    let filename
    const ref = this.files

    for (filename in ref) {
      if (ref[filename].selected) {
        ref[filename].selected = false
      }
    }

    return
  }

  setWorkspaceTitle(title) {
    this.workspaceTitle.text(title)
  }
}
