var gulp = require('gulp')
var postcss = require('gulp-postcss')
var extender = require('gulp-html-extend')
var clean = require('gulp-clean') //删除文件
var autoprefixer = require('autoprefixer') //浏览器前缀
var notify = require('gulp-notify') //任务提示
var stripDebug = require('gulp-strip-debug') // 删除console语句

// require normalize.css
// var normalize = './node_modules/normalize.css/normalize.css'

gulp.task('styles', function() {
  //任务名
  var processors = [
    autoprefixer({
      browsers: ['last 15 version', 'ie 9'] // 兼容ie最新的15个版本
    })
  ]
  return gulp
    .src(['./src/styles/*.css']) //源文件路径
    .pipe(postcss(processors)) //执行定义好的过程
    .pipe(gulp.dest('./www/styles/'))
    .pipe(
      notify({
        message: 'Generated file: <%= file.relative %> @ <%= options.date %>',
        templateOptions: {
          date: new Date()
        }
      })
    )
})

gulp.task('scripts', function() {
  return (gulp
      .src(['./src/scripts/*.js'])
      // .pipe(stripDebug())
      .pipe(gulp.dest('./www/scripts/')) )
})

gulp.task('images', function() {
  return gulp.src('./src/images/**').pipe(gulp.dest('./www/images'))
})

gulp.task('extend', function() {
  return gulp
    .src(['./src/views/*.html', '!./src/views/layout.html'])
    .pipe(
      extender({
        annotations: true,
        verbose: false
      })
    ) // default options
    .pipe(
      notify({
        message: 'Generated file: <%= file.relative %> @ <%= options.date %>',
        templateOptions: {
          date: new Date()
        }
      })
    )
    .pipe(gulp.dest('./www/views/'))
})

gulp.task('build', ['scripts', 'styles', 'images', 'extend']) //任务数组，执行前面的任务后面整个任务数组都会执行

gulp.task('clean', function() {
  return gulp
    .src('./www/', {
      read: false
    })
    .pipe(clean())
})

gulp.task('watch', function() {
  gulp.watch('./src/scripts/*.js', ['scripts', 'images'])
  gulp.watch('./src/styles/*.css', ['styles', 'images'])
  gulp.watch('./src/views/*.html', ['extend', 'images'])
})

gulp.task('default', ['clean'], function() {
  return gulp.watch(['./src/**'], ['build'])
})
