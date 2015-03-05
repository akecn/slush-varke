# Generator varke 

a simple nodejs module generator for myself.

[Slush](http://slushjs.github.io/) is the streaming scaffolding system - Gulp as a replacement for Yeoman.

## Install

```
npm install -g slush slush-varke
```

## Usage

### project initialize

```
mkdir project
cd project
slush varke
```

### update version for npm

```
cd project
slush varke:version
```

fetch the latest `package.json` from npmjs.org. and update project version with `patch`. and also, you can set a special version

```
cd project
slush varke:version --to 0.1.0
# or
slush varke:version --tag patch
```

enjoy!