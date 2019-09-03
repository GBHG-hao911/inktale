# Ink Tale

A web viewer and tooling around [ink](https://www.inklestudios.com/ink/) interactive fiction stories. Ink Tale uses modern es6 designs without shims or transpilers - which means it's output will only on es6 compatible browsers (so, sorry IE users :shrug:). It's powered by rollup and npx, to allow modules to be assembled.

## Requirements

+ `make`
+ `inklecate`
+ `node` and `npm`

### make

You probably already have this, but if not:

+ MacOS - Run `xcode-select --install` in your terminal
+ [Windows](http://gnuwin32.sourceforge.net/packages/make.htm)
+ Linux - Install your build-essentials package. Ubuntu - `sudo apt-get install build-essential`

### inklecate

You need to have [inklecate](https://github.com/inkle/ink/releases) installed and accessible in your $PATH. On MacOS or Linux, you'll need to download it and copy it somewhere, before linking it as appropriate.

Example of how to do this for MacOS:

```
curl -L https://github.com/inkle/ink/releases/download/0.9.0/inklecate_mac.zip --output inklecate_mac.zip
unzip inklecate_mac.zip -d inklecate_mac
mkdir -p /usr/local/var/inklecate
cp inklecate_mac/* /usr/local/var/inklecate
ln -s /usr/local/var/inklecate/inklecate /usr/local/bin
```
### node and npm

You will also need [node and npm](https://nodejs.org/en/download/) installed. Please have at least version **10.16.3** installed.

## Usage

1. Edit `story.ink` to your pleasing. You can use [Inky](https://github.com/inkle/inky) or your favorite editor as you see fit.
2. Build `make build`
3. Run `make run` and your browser should pop up and show your story!

You can leave the server running, and it will automatically reload the page whenever you re-build your story.

If you want to make code changes and would like code changes to be automatically built, you can use `watch-code`.

Running too slow or want to work offline? You can run `make install` to help you globally install libraries and save you some fetching.

## Distribution

Zip up and hand out the contents of the `dist/` directory. Done. Easy. _Phew_.

## License

The story we provide is [Inkle's "The Intercept"](https://github.com/inkle/the-intercept). All rights to it are reserved by Ink, and covered under it's license.

This includes an unmodified redistribution of `ink.js`, and some elements of the original ink.js html viewer example.
