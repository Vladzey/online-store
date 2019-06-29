'use strict';

var gulp = require('gulp'),
    rename = require('gulp-rename'),
    plumber = require('gulp-plumber'),
    notify = require('gulp-notify'),
    watch = require('gulp-watch'),
    newer = require('gulp-newer'),
    imagemin = require('gulp-imagemin'),
    minifyJs = require('gulp-uglify'),
    babel = require('gulp-babel'),
    postCss = require('gulp-postcss'),
    sass = require('gulp-sass'),
    autoprefixer = require('autoprefixer'),
    minifyCss = require('cssnano'),
    mediaGroup = require('css-mqpacker'),
    cssNew = require('postcss-preset-env');

var browserSync = require('browser-sync'),
reload = browserSync.reload;

var paths = {
    src: {
        srcHtml: './*.html',
        srcHtmlNav: './index.html',
        srcStyle: './styles/**/*.scss',
        srcJs: './js/**/*.js',
        srcFonts: './fonts/**/*',
        srcImages: './images/*.*'
    },
    dev: {
        devHtml: '../dev/',
        devHtmlNav: '../dev/',
        devStyle: '../dev/styles/',
        devJs: '../dev/js/',
        devFonts: '../dev/fonts/',
        devImages: '../dev/'
    }
};

gulp.task('html:dev', function() {
    return gulp.src(paths.src.srcHtml)
        .pipe(plumber({
            errorHandler : notify.onError(function (err) {
                return {
                    title: 'HTML',
                    message: err.message
                }
            })
        }))
        .pipe(gulp.dest(paths.dev.devHtml))
        .pipe(reload({stream: true}));
});

gulp.task('htmlNav:dev', function() {
    return gulp.src(paths.src.srcHtmlNav)
        .pipe(plumber({
            errorHandler : notify.onError(function (err) {
                return {
                    title: 'HTML',
                    message: err.message
                }
            })
        }))
        .pipe(gulp.dest(paths.dev.devHtmlNav))
        .pipe(reload({stream: true}));
});

gulp.task('style:dev', function() {
    var plugins = [
        autoprefixer,
        mediaGroup,
        cssNew,
        minifyCss
    ];

    return gulp.src(paths.src.srcStyle)
        .pipe(plumber({
            errorHandler : notify.onError(function (err) {
                return {
                    title: 'STYLE',
                    message: err.message
                }
            })
        }))
        .pipe(sass())
        .pipe(postCss(plugins))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(paths.dev.devStyle))
        .pipe(reload({stream: true}));
});

gulp.task('js:dev', function() {
    return gulp.src(paths.src.srcJs)
    .pipe(plumber({
        errorHandler : notify.onError(function (err) {
            return {
                title: 'JS',
                message: err.message
            }
        })
    }))
    .pipe(babel({presets: ['env']}))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifyJs())
    .pipe(gulp.dest(paths.dev.devJs))
    .pipe(reload({stream: true}));
});

gulp.task('fonts:dev', function() {
    return gulp.src(paths.src.srcFonts)
        .pipe(plumber({
            errorHandler : notify.onError(function (err) {
                return {
                    title: 'FONTS',
                    message: err.message
                }
            })
        }))
        .pipe(gulp.dest(paths.dev.devFonts));
});

gulp.task('images:dev', function() {
    return gulp.src(paths.src.srcImages, {base: './'})
        .pipe(plumber({
            errorHandler : notify.onError(function (err) {
                return {
                    title: 'IMAGES',
                    message: err.message
                }
            })
        }))
        .pipe(newer(paths.dev.devImages))
        .pipe(imagemin())
        .pipe(gulp.dest(paths.dev.devImages))
        .pipe(reload({stream: true}));
});

gulp.task('webserver', function() {
    browserSync.init({
        server: {baseDir: "../dev"}
    });
});

gulp.task('dev', [
    'html:dev',
    'htmlNav:dev',
    'style:dev',
    'js:dev',
    'fonts:dev',
    'images:dev'
]);

gulp.task('watchDev', function() { // watch
    watch([paths.src.srcHtml], function() {
        gulp.start('html:dev');
    });
    watch([paths.src.srcHtmlNav], function() {
        gulp.start('htmlNav:dev');
    });
    watch([paths.src.srcStyle], function() {
        gulp.start('style:dev');
    });
    watch([paths.src.srcJs], function() {
        gulp.start('js:dev');
    });
    watch([paths.src.srcFonts], function() {
        gulp.start('fonts:dev');
    });
    watch([paths.src.srcImages], function() {
        gulp.start('images:dev');
    });
});

gulp.task('serve', ['dev', 'webserver', 'watchDev']);