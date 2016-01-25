#!/usr/bin/env node
'use strict'

const opn = require('opn')
const meow = require('meow')
const readPkg = require('read-pkg')
const pkg = require('../package.json')

require('update-notifier')({pkg: pkg}).notify()

const cli = meow({
  pkg: pkg,
  help: require('fs').readFileSync(__dirname + '/help.txt', 'utf8')
}, {
  default: {
    wait: false
  }
})

function openURL (pkg) {
  return opn(pkg, cli.flags)
}

function pkgURL (pkg) {
  const NPM_BASE_URL = 'https://www.npmjs.com/package'
  return `${NPM_BASE_URL}/${pkg}`
}

function getURL (pkg) {
  if (pkg) return Promise.resolve(pkgURL(pkg))

  return readPkg().then(function (pkg) {
    return Promise.resolve(pkgURL(pkg.name))
  })
}

cli.flags.app = cli.input.slice(1)
const pkgName = cli.input[0]
getURL(pkgName).then(openURL)
