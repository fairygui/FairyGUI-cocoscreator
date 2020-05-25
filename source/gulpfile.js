'use strict';
const gulp = require("gulp");
const minify = require('gulp-minify');
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json');
const inject = require('gulp-inject-string');

gulp.task('buildJs', function () {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(inject.replace('var fgui;', ''))
        .pipe(inject.prepend('window.fgui = {};\nwindow.fairygui = window.fgui;\n'))
        .pipe(inject.replace('var __extends', 'window.__extends'))
        //.pipe(minify({ ext: { min: ".min.js" } }))
        .pipe(gulp.dest('./bin'));
})

gulp.task("buildDts", gulp.series("buildJs"), function () {
    return tsProject.src()
        .pipe(tsProject())
        .dts.pipe(inject.append('import fairygui = fgui;'))
        .pipe(gulp.dest('./bin'));
});
gulp.task("copy", function () {
    return gulp.src('bin/**/*')
        .pipe(gulp.dest('../demo/assets/Script/Lib/'))
});

gulp.task("build", gulp.series("buildDts","copy"), function () {
    return new Promise((ok,err)=>{
        ok();
    })
});
