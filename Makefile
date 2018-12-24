build:
	tsc

test: build
	mocha -r ts-node/register src/**/*.spec.ts

watch: build
	mocha -w -r ts-node/register src/**/*.spec.ts

clean:
	rm -Rf dist/*
