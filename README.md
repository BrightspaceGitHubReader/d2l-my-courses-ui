[![Build Status](https://travis-ci.com/Brightspace/d2l-my-courses-ui.svg?branch=master)](https://travis-ci.com/Brightspace/d2l-my-courses-ui)

# d2l-my-courses-ui

The UI for the My Courses homepage widget in the LE.

![widget view](/images/widget.png?raw=true)

## Building

Install dependencies via NPM:
```shell
npm install
```

Install the Polymer client globally if you haven't already:
```shell
npm i -g polymer-cli
```

## Local Development

### Using the demo pages

For simple changes like layout adjustments, you may be able to use the demo pages.  They have fake data setup, but do not have functionality like pinning, filtering, sorting, etc.

To host the demo pages, run:
```shell
polymer serve
```
Then navigate to `http://localhost:<port>/components/d2l-my-courses/demo/`.

### Testing from within the LMS

To test your changes in the LMS, you'll need to host a local BSI (`brightspace-integration`):
1. [Running a Local BSI](https://github.com/Brightspace/brightspace-integration#development-build)
2. [Configuring the LMS](https://github.com/Brightspace/brightspace-integration#using-the-configuration-file)

After completing the steps above, you can modify the files in BSI's `node_modules/d2l-my-courses` folder directly, or setup npm linking.  Changes to the files are picked up immediately, so no need to restart BSI each time - just refresh the browser.

### Testing with LMS data in the demo pages

Another option is to use the demo page, but pull in real data from the LMS to allow for pinning, filtering, etc.

You can do this by visiting a quad site with the user whose course setup you'd like to test with, and inspecting the My Courses widget.  You can copy over the attributes to the component in `demo/d2l-my-courses/d2l-my-courses.html`, and grab a token from a HM network call.  You'll need to remove the code that cancels the PUT call, and replace the token when it expires.

## Unit Tests

The unit tests are built and run using [web-component-tester](https://github.com/Polymer/web-component-tester).

To lint and run unit tests, run:

```shell
npm test
```

You can also see the tests run in a browser by running:
```shell
polymer serve
```
Then navigate to `http://localhost:<port>/components/d2l-my-courses/test/index.all.html`.

## Performance Timings

For details on the performance profile of my-courses and the various timings which are collected, see [Performance Timings](performance-timing.md).

## Publishing & Releasing

To publish a numbered "release" version, include [increment major], [increment minor] or [increment patch] in your merge commit message.  It must be in the top, bolded part of the commit message in Github to work properly:
![releasing on Github merge](/images/releasing.png?raw=true)

This will automatically bump the version in `package.json` and create a Github release.  Minor and patch versions will be automatically picked up by the current release's BSI.

For cert or hotfixes, you will want to create a branch for that release based on the last version that made it into BSI.  After merging the fixes into that branch, you can manually create a release in Github to point to in BSI's `package.json`.

