var gulp    = require('gulp'),
    sass    = require('gulp-sass')(require('sass')),
    connect = require('gulp-connect'),
    pug     = require('gulp-pug'),
    plumber = require('gulp-plumber'),
    rename  = require('gulp-rename'),
    uglify  = require('gulp-uglify'),
    clean   = require('gulp-clean'),
    autoprefixer = require('gulp-autoprefixer');

function reload(done) {
    connect.server({
        root: 'public',
        livereload: true,
        port: 8080
    });
    done();
}

function cleanPublic() {
    return (
        gulp.src('public/*', {read: false})
        .pipe(plumber())
        .pipe(clean())
    );
}

function styles() {
    return (
        gulp.src('src/sass/main.sass')
        .pipe(plumber())
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('.tmp/sass'))
        .pipe(sass())
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 3 versions'],
            cascade: false
        }))
        .pipe(sass({outputStyle: 'expanded'}))
        .pipe(gulp.dest('public/css'))
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(rename('s.min.css'))
        .pipe(gulp.dest('public/css'))
        .pipe(connect.reload())
    );
}

function scripts() {
    return (
        gulp.src('src/js/magic.js')
        .pipe(plumber())
        .pipe(gulp.dest('public/js'))
        .pipe(uglify())
        .pipe(rename('m.min.js'))
        .pipe(gulp.dest('public/js'))
        .pipe(gulp.dest('public/js'))
        .pipe(connect.reload())
    );
}

function views() {
    return (
        gulp.src('src/views/pages/**/*.pug')
        .pipe(plumber())
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('public/'))
        .pipe(connect.reload())
    )
}

function assets() {
    return (
        gulp.src(['src/assets/**/**/*'])
        .pipe(plumber())
        .pipe(gulp.dest('public/'))
        .pipe(connect.reload())
    )
}

function watchTask(done) {
    gulp.watch('src/sass/**/**/*.sass', styles);
    gulp.watch('src/js/**/*.js', scripts);
    gulp.watch('src/views/**/**/*.pug', views);
    done();
}

const build = gulp.series(gulp.parallel(cleanPublic, assets, styles, scripts, views));
const watch = gulp.parallel(build, watchTask, reload);

exports.reload = reload;
exports.clean = cleanPublic;
exports.assets = assets;
exports.styles = styles;
exports.scripts = scripts;
exports.views = views;
exports.watch = watch;
exports.build = build;
exports.default = watch;