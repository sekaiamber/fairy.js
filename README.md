# fairy.js

Version v0.4.1 (maker version v0.3.2)

## Introduction

It's a presentation framework based on the power of CSS3 transforms and transitions in modern browsers and inspired by the idea behind prezi.com.

## Version

version is built in this format: vx.y[.z]  
  
x: API version changed, tech stack changed.  
y: New feature/api introduced, Code architecture changed.  
z: bug fixed, small feature/improvment.

maker version is the version of `fairy.maker.js`, usually it is equal or 1 version behind `fairy.js`.

## Who can commit

The following list shows who can commit.

* sekaiamber

But all contributions are welcome.

You can just fork this project. Or raise a [issue](https://github.com/sekaiamber/fairy.js/issues).

Make a pull request, take it easy :)

## Optimization

I use [uglifyjs](https://github.com/mishoo/UglifyJS2) for my javascript compression, using following command to do it , make sure uglifyjs is installed in your computer:

```shell
$ cd path/to/repo/script/
$ uglifyjs fairy.js -m -o fairy.min.js
```

## Change log

### v0.4.1

* update README for optimization information.

### v0.4.0

* add scale change for each step, now user can use `scale` in `transform` css, and mark it with `fairy-scale` attribute in html file.
* when scale changes, some control css will also change to given a better visual effect. (e.g. when move from a small scale element to a bigger one, the camera will zoom first and move to target position with a small delay)

### v0.3.2

* add support for `.fairy-element`, this dom will be inited but not into presentations.

### v0.3.1

* add url change rule, now browser can remember the last transform when page is refresh.

### v0.3.0

* separate `make` mode.
* create fairy.maker.js.

### v0.2.0

* support `.min` file, using uglifyJs to compress fairy.js.

### v0.1.1

* update README, everyone can contribute to this project :)

### v0.1.0

* support muti-indices for a dom element, using `step-index="1,2,5"` for step 1, 2 and 5 to attach the same dom element.

### v0.0.1

* add base code.

## LICENSE

Copyright 2015-2016 Xu Xiaomeng(@sekaiamber)

Released under the MIT and GPL (version 2 or later) Licenses.
