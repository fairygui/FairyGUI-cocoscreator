'use strict';
const gulp = require("gulp");
const minify = require('gulp-minify');
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json');
const inject = require('gulp-inject-string');

gulp.task('buildJs', () => {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(inject.replace('var fgui;', ''))
        .pipe(inject.prepend('window.fgui = {};\n'))
        .pipe(inject.replace('var __extends', 'window.__extends'))
        //.pipe(minify({ ext: { min: ".min.js" } }))
        .pipe(gulp.dest('./test/assets/Script/Lib/'));
})

gulp.task("build", ["buildJs"], () => {
    return tsProject.src()
        .pipe(tsProject())
        .dts.pipe(gulp.dest('./test/assets/Script/Lib/'));
});
