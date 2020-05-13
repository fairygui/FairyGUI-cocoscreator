'use strict';
const gulp = require("gulp");
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json');
const inject = require('gulp-inject-string');


exports.buildJs = (done)=>{
    
    tsProject.src()
    .pipe(tsProject())
    .js.pipe(inject.replace('var fgui;', ''))
    .pipe(inject.prepend('window.fgui = {};\nwindow.fairygui = window.fgui;\n'))
    .pipe(inject.replace('var __extends', 'window.__extends'))
    .pipe(gulp.dest('./bin'));

    done();
};

exports.buildDts = (done)=>{

    tsProject.src()
    .pipe(tsProject())
    .dts.pipe(inject.append('import fairygui = fgui;'))
    .pipe(gulp.dest('./bin'));

    done();
};