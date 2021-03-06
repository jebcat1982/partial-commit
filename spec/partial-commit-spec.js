'use babel'

/* global jasmine, define, it, runs, describe, expect, waitsForPromise, beforeEach */

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.

describe('PartialCommit', function() {
  let [workspaceElement, activationPromise] = []

  beforeEach(function() {
    workspaceElement = atom.views.getView(atom.workspace)
    activationPromise = atom.packages.activatePackage('partial-commit')
    return activationPromise
  })

  return describe('when the partial-commit:toggle event is triggered', function() {
    it('hides and shows the modal panel', function() {
      // Before the activation event the view is not on the DOM, and no panel
      // has been created
      expect(workspaceElement.querySelector('.partial-commit')).not.toExist()

      // This is an activation event, triggering it will cause the package to be
      // activated.
      atom.commands.dispatch(workspaceElement, 'partial-commit:toggle')

      waitsForPromise(function() {
        return activationPromise
      })

      return runs(function() {
        expect(workspaceElement.querySelector('.partial-commit')).toExist()
      })
    })

    return it('hides and shows the view', function() {
      // This test shows you an integration test testing at the view level.

      // Attaching the workspaceElement to the DOM is required to allow the
      // `toBeVisible()` matchers to work. Anything testing visibility or focus
      // requires that the workspaceElement is on the DOM. Tests that attach the
      // workspaceElement to the DOM are generally slower than those off DOM.
      jasmine.attachToDOM(workspaceElement)

      expect(workspaceElement.querySelector('.partial-commit')).not.toExist()

      // This is an activation event, triggering it causes the package to be
      // activated.
      atom.commands.dispatch(workspaceElement, 'partial-commit:toggle')

      waitsForPromise(function() {
        return activationPromise
      })

      return runs(function() {
        // Now we can test for view visibility
        const partialCommitElement = workspaceElement.querySelector('.partial-commit')
        expect(partialCommitElement).toBeVisible()
        atom.commands.dispatch(workspaceElement, 'partial-commit:toggle')
        return expect(partialCommitElement).not.toBeVisible()
      })
    })
  })
})
