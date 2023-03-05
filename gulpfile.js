const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
// const imagemin =
//     import ('gulp-imagemin');
// const mozjpeg =
//     import ('imagemin-mozjpeg');
const browserSync = require('browser-sync').create();

const paths = {
    styles: {
        src: 'src/scss/**/*.scss',
        dest: 'dist/css'
    },
    scripts: {
        src: 'src/js/**/*.js',
        dest: 'dist/js'
    },
    images: {
        src: 'src/img/**/*.{jpg,png,svg,gif}',
        dest: 'dist/img'
    }
};

function styles() {
    return gulp.src(paths.styles.src)
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(browserSync.stream());
}

function scripts() {
    return gulp.src(paths.scripts.src)
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(gulp.dest(paths.scripts.dest))
        .pipe(browserSync.stream());
}

function images() {
    return gulp.src(paths.images.src)
        .pipe(imagemin([
            imagemin.mozjpeg({ progressive: true }),
            imagemin.optipng({ optimizationLevel: 5 }),
            imagemin.svgo({
                plugins: [
                    { removeViewBox: true },
                    { cleanupIDs: false }
                ]
            })
        ]))
        .pipe(gulp.dest(paths.images.dest))
        .pipe(browserSync.stream());
}

function watch() {
    browserSync.init({
        server: {
            baseDir: './'
        }
    });
    gulp.watch(paths.styles.src, styles);
    gulp.watch(paths.scripts.src, scripts);
    gulp.watch(paths.images.src, images);
    gulp.watch('.*.html').on('change', browserSync.reload);
}

exports.styles = styles;
exports.scripts = scripts;
exports.images = images;
exports.watch = watch;
exports.default = gulp.series(gulp.parallel(styles, scripts, images), watch);