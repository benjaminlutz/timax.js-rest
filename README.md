[![Build Status](https://travis-ci.org/benjaminlutz/timax.js-rest.svg)](https://travis-ci.org/benjaminlutz/timax.js-rest)
[![Coverage Status](https://coveralls.io/repos/benjaminlutz/timax.js-rest/badge.svg?branch=master)](https://coveralls.io/r/benjaminlutz/timax.js-rest?branch=master)
[![Dependency Status](https://david-dm.org/benjaminlutz/timax.js-rest/status.png)](https://david-dm.org/benjaminlutz/timax.js-rest)
[![Dev Dependency Status](https://david-dm.org/benjaminlutz/timax.js-rest/dev-status.png)](https://david-dm.org/benjaminlutz/timax.js-rest)

# timax.js-rest
timax.js - the REST services

## Prerequisites
Make sure you have installed all these prerequisites on your machine.

* Node.js - [Download & Install Node.js](http://www.nodejs.org/download/) and the npm package manager.
* MongoDB - [Download & Install MongoDB](http://www.mongodb.org/downloads) Version > 2.6, and make sure it's running on the default port (27017).

* Grunt - You're going to use the [Grunt Task Runner](http://gruntjs.com/) to automate your development process, in order to install it make sure you've installed Node.js and npm, then install grunt globally using npm:

```
$ sudo npm install -g grunt-cli
```

* bunyan - If you want a nice formatted log output, install and use the [bunyan](https://github.com/trentm/node-bunyan) CLI tool:

```
$ sudo npm install -g bunyan
```

## Install
To install Node.js dependencies you're going to npm, in the application folder run this in the command-line:

```
$ npm install
```

## Configure
You can find all the configuration including its documentation in the 

```
config.js
```

file.

## Initialize the database with test data
If you want to initialize the database with some test users, just type

```
$ node init.js
```

Then you can login as:

User: user@test.com / 
Manager: manager@test.com / 
Admin: admin@test.com

The password is for all three users: geheim

## Start the application
If everything is installed and configured, just type the following command to start the application:

```
$ node app.js
```

Or if you want a nice formatted log output, then use the bunyan CLI tool:

```
$ node app.js | bunyan
```

## Development
If you need live reload then start:

```
$ grunt | bunyan
```

To run the tests:

```
$ grunt test | bunyan
```

## License
The MIT License (MIT)

Copyright (c) 2015 Benjamin Lutz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
