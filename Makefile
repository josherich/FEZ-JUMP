.PHONY: all jsdeps

all: bundle.js style postcss

jsdeps:
	npm install

bundle.js: jsdeps
	./node_modules/.bin/browserify -t --igv=window ./src/js/*.js ./src/js/index.js -o dist/app.js

watch: jsdeps
	./node_modules/.bin/watchify -d -t --igv=window ./src/js/*.js ./src/js/index.js -o dist/app.js

watch-style: jsdeps
	./node_modules/.bin/chokidar './src/css/*.scss' -c 'make style'

watch-all:
	./node_modules/.bin/parallelshell "make watch" "make watch-style"

copy:
	cp -r ./src/images dist/

sass:
	./node_modules/.bin/node-sass ./src/css/index.scss ./src/css/index.css

postcss:
	postcss --use autoprefixer ./src/css/index.css -d dist/

style: sass postcss