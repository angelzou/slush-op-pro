'use strict';
/*!
 * gulp
 * $ npm install gulp-sass gulp-minify-css gulp-jshint gulp-concat gulp-uglify gulp-imagemin gulp-notify gulp-livereload
 *   gulp-rename gulp-cache gulp-filter gulp-connect del main-bower-files gulp-order lodash --save-dev
 */
// 引入gulp
var gulp = require('gulp');

// 引入组件
var mainBowerFiles = require('main-bower-files'),
    jshint = require('gulp-jshint'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    minifycss = require('gulp-minify-css'),
    notify = require('gulp-notify'),
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    filter = require('gulp-filter'),
    del = require('del'),
    connect = require('gulp-connect'),
    order = require('gulp-order'),
    lodash = require('lodash');

var projectConfig = require('./app.js');
var appName = projectConfig.appName;console.log(appName);
var appConfig = require(appName + '/bo.json');

lodash.extend(projectConfig, appConfig);

// 过滤文件
var filterByExtension = function(extension) {
    return filter(function(file) {
        return file.path.match(new RegExp('.' + extension + '$'));
    });
};

// 将bower安装的第三方包，存储到dist/lib目录下
gulp.task('bower', function() {
    var mainFiles = mainBowerFiles();
    var jsFilter = filterByExtension('js'),
        cssFilter = filterByExtension('css');
    return gulp.src(mainFiles, {base: projectConfig.src.bower})
        .pipe(gulp.dest(projectConfig.dest.bower))
        .pipe(rename({suffix: '.min'}))
        .pipe(cssFilter)
        .pipe(minifycss())
        .pipe(gulp.dest(projectConfig.dest.bower))
        .pipe(cssFilter.restore())
        .pipe(jsFilter)
        .pipe(uglify())
        .pipe(gulp.dest(projectConfig.dest.bower));
});

// 编译sass, 压缩css
gulp.task('styles', function(){
    return gulp.src(projectConfig.src.scss)
        .pipe(sass())
        .pipe(gulp.dest(projectConfig.src.css))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest(projectConfig.dest.css))
        .pipe(notify({ message: 'Styles task complete' }));
});

// 检查，合并，压缩js文件
gulp.task('scripts', function(){
    return gulp.src(projectConfig.src.js)
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(concat())
        .pipe(gulp.dest(projectConfig.dest.js))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest(projectConfig.dest.js))
        .pipe(notify({ message: 'Scripts task complete' }));
});

// 图片压缩
gulp.task('images', function(){
    return gulp.src(projectConfig.src.img)
        .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
        .pipe(gulp.dest(projectConfig.dest.img))
        .pipe(notify({message: 'Images task complete'}));
});

// 清除文件
gulp.task('clean', function(cb){
    del([projectConfig.dest.css, projectConfig.dest.js, projectConfig.dest.img], cb)
});
gulp.task('clean-bower', function(cb){
    del([projectConfig.dest.bower], cb)
});
// 设置默认任务
gulp.task('default',['clean'], function(){
    gulp.run('styles', 'scripts', 'images');
;})

// watch任务
gulp.task('watch', function(){
    // 启动web服务
    connect.server({
        root: [__dirname],
        port: 8099,
        livereload: true
    })
    // 监听文件变化
    gulp.watch(projectConfig.src.js, ['scripts']);
    gulp.watch(projectConfig.src.scss, ['styles']);
    gulp.watch(projectConfig.src.img, ['images']);
    gulp.watch('./bower_components/**/*', ['bower']);
    // 创建LiveReload服务
    // livereload.listen();
    // 监听projectConfig文件夹下面的所有文件，有变化的浏览器就会重新加载
    // gulp.watch(['./projectConfig/**']).on('change', livereload.changed);
});
