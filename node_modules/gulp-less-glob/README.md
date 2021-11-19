[![Package Quality](http://npm.packagequality.com/badge/gulp-less-glob.png)](http://packagequality.com/#?package=gulp-less-glob)

[![Package Quality](http://npm.packagequality.com/shield/gulp-less-glob.svg)](http://packagequality.com/#?package=gulp-less-glob)  [![Build Status](https://travis-ci.org/yarkovaleksei/gulp-less-glob.svg?branch=master)](https://travis-ci.org/yarkovaleksei/gulp-less-glob)

# gulp-less-glob

[Gulp](http://gulpjs.com/) plugin for [gulp-less](https://github.com/plus3network/gulp-less) to use glob imports.

# Install

```
npm install gulp-less-glob --save-dev
```

# Basic Usage

main.less

```less
@import "vars/**/*.less";
@import "mixins/**/*.less";
@import "generic/**/*.less";
@import "../components/**/*.less";
@import "../views/**/*.less";
@import "../views/**/*something.less";
@import "../views/**/all.less";
```

*NOTE*: Also support using `'` (single quotes) for example: `@import 'vars/**/*.less';`

gulpfile.js

```javascript
var gulp = require('gulp');
var less = require('gulp-less');
var lessGlob = require('gulp-less-glob');

gulp.task('styles', function () {
    return gulp
        .src('src/styles/main.less')
        .pipe(lessGlob())
        .pipe(less())
        .pipe(gulp.dest('dist/styles'));
});
```

# Ignoring files and directories by pattern

You can optionally provide an array of paths to be ignored. Any files and directories that match any of these glob patterns are skipped.

```
gulp.task('styles', function () {
    return gulp
        .src('src/styles/main.less')
          .pipe(lessGlob({
              ignorePaths: [
                  '**/_f1.less',
                  'recursive/*.less',
                  'import/**'
              ]
          }))
        .pipe(less())
        .pipe(gulp.dest('dist/styles'));
});
```

# Troubleshooting

## Nested glob imports

`gulp-less-glob` currently does NOT support nested glob imports i.e.

main.less
```less
@import 'blocks/**/*.less';
```

blocks/index.less
```less
@import 'other/blocks/**/*.less';
```

This will throw an error, because `gulp-less-glob` does NOT read nested import structures.

### Solving nested glob imports

You have to think diffrent about your `less` folder structure, what I suggest to do is:

* Point your gulp styles task ONLY to `main.less`
* In `main.less` -> ONLY in this file I use glob imports

# Contribute

## Run tests
```
npm test
```
## Build dist
```
npm run compile
```

