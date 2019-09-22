install:
	npm install -g live-server rollup

clean:
	@rm -rf ./build
	@rm -rf ./dist
	mkdir build
	mkdir dist

build-code:
	cp -r web/assets/* dist/
	npx rollup -c

build-story:
	inklecate -o build/script.json story/main.ink
	node util/json2js.js build/script.json build/story.js
	cp build/story.js dist/

build: clean build-code build-story

watch-code: build
	npx rollup -c --watch

watch-story: build
	fswatch -0 -o story/ | xargs -0 -n 1 -I {} make build-story

run:
	npx live-server --port=8080 --cors dist/

.PHONY: run watch-code watch-story install
