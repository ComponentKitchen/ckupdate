ckupdate
========

Extends npm for web components and other projects that require a flat dependency namespace by writing
dependencies under a single directory. Dependencies installed by npm under the node_modules directory
are copied to a specified directory, or to a directory named "bower_components" if no directory is
specified.

##Installation

npm install -g ComponentKitchen/ckupdate

##Usage

Dependencies identify themselves to the ckupdate extension by adding "flatten" to its package.json
keywords array:

    keywords: [ "web-components", "flatten" ]

A project wishing to invoke ckupdate should add the following script to its package.json:

    "scripts": {
      "postinstall": "ckupdate -o components"
    }

###Example

    {
      "name": "printable-wall-calendar",
      "repository": "git@github.com:CKUpdate/printable-wall-calendar.git",
      "version": "2.0.0",
      "dependencies": {
        "basic-culture-selector": "CKUpdate/basic-culture-selector#master",
        "polymer": "CKUpdate/polymer#0.5.2000",
        "basic-button": "CKUpdate/basic-button#master",
        "basic-calendar-month": "CKUpdate/basic-calendar-month#master",
        "basic-days-of-week": "CKUpdate/basic-days-of-week#master"
      },
      "keywords": [
        "web-components",
        "flatten"
      ],
      "scripts": {
        "postinstall": "ckupdate -o components"
      }
    }

### Demo

See [ckupdate-demo](https://github.com/ComponentKitchen/ckupdate-demo) for a sample application that uses ckupdate to install
web components.
