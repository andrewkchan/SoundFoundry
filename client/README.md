# SoundFoundry

## Introduction

SoundFoundry is a barebones remake of the SoundCloud.com frontend using React and Redux. It features an infinitely scrollable track list drawn from SoundCloud and a
fully featured streaming music player.

## Installation and Quick Start

1. `npm install`
2. `npm start` to start a development server at localhost:8080. `npm run build` to build a production module at client/public/js/main.js.

## Credits

The majority of the skeleton code is lifted verbatim from Andrew Ngu's [https://github.com/andrewngu/sound-redux](Sound-Redux project), but several major components have
been changed to make better use of ES6 syntax and increase reusability. Also, I added comments to much of the codebase as Sound-Redux is very lacking in documentation.

SoundFoundry also makes use of the following libraries:

* [https://github.com/paularmstrong/normalizr](Normalizr)
* [https://github.com/soundcloud/soundcloud-javascript](SoundCloud JavaScript API)
* [https://github.com/gaearon/redux-thunk](Redux Thunk Middleware)
