const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const uglify = require('gulp-uglify')
const rename = require('gulp-rename');
const cleanCSS = require('gulp-clean-css');
const purgeCss = require('gulp-purgecss');
const clean = require('gulp-clean');
const concat = require('gulp-concat');
const babel = require('gulp-babel');

const paths = {
    views: {
        www: 'views',
    },
    src:{
        root: 'views',
        css: 'views/css/',
        js: 'views/js/*',
        sass: 'views/sass/*'

    },
    dest:{
        root: 'views/dest',
        css: 'views/dest/css',
        js: 'views/dest/js',
    }

};

gulp.task('sass', () => {
    return gulp
            .src(paths.src.sass)
            .pipe(
                sass({
                    outputStyle: 'expanded',
                }).on('error', sass.logError),
            )
            .pipe(gulp.dest(paths.src.css))
});

gulp.task('css', () => {
    return gulp
            .src(paths.src.css + '*.css')
            .pipe(concat('main.css'))
            /*.pipe(
                cleanCSS({
                    compatibility: 'ie8',
                }),
            )*/
            .pipe(concat('main.css'))
            // .pipe(purgeCss({
            //     content: ['views/**/*.html']
            // }))
            .pipe(
                rename({
                    suffix: '.min',
                }),
            )
            .pipe(gulp.dest(paths.dest.css))
});

gulp.task('js', () => {
    return gulp
            .src(paths.src.js)
            .pipe(
                babel({
		    plugins:['@babel/transform-runtime'],
                    //presets: ['@babel/preset-env'],
                }),
            )
            .pipe(uglify())
            .pipe(concat('script.js'))
            .pipe(
                rename({
                    suffix: '.min',
                }),
            )
            .pipe(gulp.dest(paths.dest.js))
});

gulp.task('clean', function () {
    return gulp.src(paths.dest.root).pipe(clean());
});

gulp.task('build', gulp.series('clean', 'sass', 'css', 'js'));

gulp.task('watch', () => {
    gulp.watch(paths.src.sass, gulp.series('sass'));
    gulp.watch(paths.src.js, gulp.series('js'));
    
    
})

// exports.default = defaultTask;

