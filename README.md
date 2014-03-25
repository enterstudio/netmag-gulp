Gulp.js
===========
I think by now we can all agree that frameworks are there to make our lives easier, whether we're rapidly prototyping or writing lightweight and scaleable css with Sassaparilla. The next peice of the puzzle is a framework around which we can write our build scripts and task automation. In steps Gulp.

Everyone who's aware of Grunt will know what this is all about, but Gulp differs from Grunt in two important ways: the use of streams and a code-over-configuration approach. A stream is essentially a method of plugging the output of one tool into the input of another, allowing you to compose large systems out of small tools that do one thing well. Gulp is then a small framework with which you can plug in your favourite tools and form a build script of your liking.

##Getting Started

In order to begin we'll need node and npm. If you don't have these you can download installers from the website (http://nodejs.org/) or if you're on OS X I recommend using homebrew.

You can get all the files from this part of the project on GitHub: https://github.com/fffunction/netmag-gulp

First you'll want to install the gulp CLI helper, this will allow you to run the build simply with the `gulp` command:

	npm install -g gulp
	
Next you'll need the dependencies for this build script. We're going simple and only compiling the sass from the Sassaparilla project with some LiveReload magic. Here's the command to get everything you need:

	npm install --save-dev gulp gulp-compass gulp-minify-css express gulp-livereload
	
You'll notice that one of those is not the same as the others. While there are many purpose-written Gulp plugins (e.g gulp-livereload) most things can be done easily with existing node modules, so the Express module used here is the same as you might be used to using in Node.

The `--save-dev` option saves these packages to your `devDependencies` list in `package.json`. If you don’t already have this file, I recommend creating one according to the docs(https://www.npmjs.org/doc/json.html) or using `npm init` to create one for you. The benefit of this is that anyone using this project will know exactly what packages they need and npm can automatically install them all.

###Writing the script

We're now ready to get into the meat of it and write the script. The fantastic thing about Gulp is it only has 4 methods, so it's easy to learn and it then gets out of your way and lets you write a build script how you want it to be.

Create yourself a `gulpfile.js` and stick these few lines in:

	var gulp = require('gulp');

    gulp.task('default', function() {
        gulp.src('./index.html')
        .pipe(gulp.dest('./'));
    });

This is the minimum viable script, and of course it doesn't do a great deal but it does introduce you to three of the four gulp methods: `gulp.task`, `gulp.src`, and `gulp.dest`. As the names suggest, they respectivley define a task, get a stream from a source file, and output the stream to a destination folder.

Run `gulp` in the terminal to test it's all working.

[gulp1.png]

####Compiling

Now everything is running we can start compiling our Sassaparilla.

Lets import the relevant modules and write an actual task:

	var compass = require('gulp-compass');
	var minifyCSS = require('gulp-minify-css');

	gulp.task('compass', function() {
	    gulp.src('./assets/css/*.scss')
	        .pipe(compass({
	            config_file: './compass/config.rb'
	        }))
	        .pipe(minifyCSS())
	        .pipe(gulp.dest('./assets/css/'));
	});
	
	gulp.task('default', ['compass']);

You'll notice the default task now takes an array of tasks to call when you run `gulp` from the terminal.

After running `gulp` this time you should have a brand new, compiled and minified, css file in your css directory.

####Watching

The addition of a watch task will both introduce us to the fourth and final gulp method (`gulp.watch`) and allow us to run gulp once and compile any changes to our styles.

Here how we do it:

	gulp.task('watch', function () {
	    gulp.watch(['./assets/css/*.scss'], ['compass']);
	});
	
	gulp.task('default', ['compass', 'watch']);

####LiveReloading

One more addition and we will have a fully functional gulpfile for working on our Sassaparilla project.

Import the modules:

	var express = require('express');
	var livereload = require('gulp-livereload');
	
Add livereload to the end of the compass pipeline:
	
	.pipe(livereload());
	
Write a new task for serving the files:

	gulp.task('serve', function () {
	    var app = express();
	    app.use(express.static(__dirname));
	    app.listen(1337);
	});

	gulp.task('default', ['compass', 'serve', 'watch']);
	
And run it:

[gulp2.png]

____
Resources:

 - https://github.com/substack/stream-handbook