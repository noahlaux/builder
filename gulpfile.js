'use strict';

var gulp    = require('gulp'),
    sass    = require('gulp-sass'),
    connect = require('gulp-connect'),
    compass = require('gulp-compass'),
    path = require('path');

gulp.task('compass', function() {
    gulp.src('./*.scss')
        .pipe(compass({
            config_file: './app/styles/config.rb',
            project: path.join(__dirname, 'assets'),
            css: './app/styles',
            js: './app/scripts',
            sass: './app/styles',
            debug: true,
            'import_path': './app/components'
        }))
        .pipe(gulp.dest('./app/styles'));
});

gulp.task('sass', function () {
    gulp.src('./app/styles/main.scss')
        .pipe(sass())
        .pipe(gulp.dest('./css'));
});

gulp.task('webserver', function() {
    connect.server({
        root: ['app']
    });
});

gulp.task('default', ['compass', 'webserver']);
