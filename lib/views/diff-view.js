'use babel'

import { View } from 'atom-space-pen-views'

class DiffLine extends View {
  static content(line) {
    this.div({ class: `line ${line.type}` }, () => {
      const lineClasses = []
      if (!line.lineno) {
        lineClasses.push('invisible')
      }
      if (line.selectable) {
        lineClasses.push('selectable')
      }
      this.pre({ class: `lineno ${lineClasses.join(' ')}`, click: 'stageHunk' }, line.lineno)
      this.pre({ outlet: 'linetext' }, line.text)
    })
  }

  stageHunk() {
    const lineno = this.children().first()
    if (lineno.hasClass('selectable')) {
      if (!lineno.hasClass('selected')) {
        lineno.addClass('selected')
      } else {
        lineno.removeClass('selected')
      }
    }
  }

  initialize(params) {
    if (params.type === 'heading') {
      this.linetext.click(function() { atom.workspace.open(params.text) })
    }
  }
}

function fmtNum(num) {
  return `     ${num || ''} `.slice(-6)
}

module.exports =
class DiffView extends View {
  static content() {
    this.div({ class: 'diff' })
  }

  clearAll() {
    this.find('>.line').remove()
    return
  }

  addAll(diffs) {
    this.clearAll()

    diffs.forEach(diff => {
      let file = diff['+++']
      if (file === '+++ /dev/null') {
        file = diff['---']
      }
      this.append(new DiffLine({ type: 'heading', text: file }))

      let noa = 0
      let nob = 0

      diff.lines.forEach(line => {
        let klass = ''
        let selectable = false
        let lineno = undefined
        let linea
        let lineb
        let ref

        if (/^@@ /.test(line)) {
          // @@ -100,11 +100,13 @@
          ref = line.replace(/-|\+/g, '').split(' ')
          // atstart = ref[0]
          linea = ref[1]
          lineb = ref[2]
          // atend = ref[3]
          noa = parseInt(linea, 10)
          nob = parseInt(lineb, 10)
          klass = 'subtle'
        } else {
          lineno = `${fmtNum(noa)}${fmtNum(nob)}`

          if (/^-/.test(line)) {
            klass = 'red'
            selectable = true
            lineno = `${fmtNum(noa)}${fmtNum(0)}`
            noa++
          } else if (/^\+/.test(line)) {
            klass = 'green'
            selectable = true
            lineno = `${fmtNum(0)}${fmtNum(nob)}`
            nob++
          } else {
            noa++
            nob++
          }
        }

        this.append(new DiffLine({ lineno, selectable, type: klass, text: line }))

        return
      })
      return
    })
    return
  }
}
