'use strict';
var gulp=require("gulp");
var browserSync=require("browser-sync").create();
var fileinClude=require("gulp-file-include");
var imagemin=require("gulp-imagemin");
var minifyCss=require("gulp-minify-css");
var sass=require("gulp-sass-china");
var sourcemaps=require("gulp-sourcemaps");
var uglify=require("gulp-uglify");
var gutil=require("gulp-util");
var watchPath=require("gulp-watch-path");
var streamCombiner=require("stream-combiner2");
var autoprefixer=require("gulp-autoprefixer");


//控制台颜色
var handleError=function(err){
    var colors=gutil.colors;
    console.log('/n');
    gutil.log(colors.red('Error'));
    gutil.log('fileName:'+colors.red(err.fileName));
    gutil.log('lineNumber:'+colors.red(err.lineNumber));
    gutil.log('message:'+err.message);
    gutil.log('plugin:'+colors.yellow(err.plugin));
}

//静态服务器
gulp.task('server',function(){
    var files=[
        './dist/html/**/*',
        './dist/css/**/*',
        './dist/fonts/**/*',
        './dist/js/**/*',
        './dist/img/**/*'
    ];
    browserSync.init(files,{
        server:'./dist/'
    });
    var html=['dist/html/**/*'];
    gulp.watch(html).on('change',browserSync.reload);
})
//编写普通的转化任务
//文件包含
gulp.task('fileinclude',function(){
    gulp.src(['src/html/**/*.html','!src/html/include/*.html'])
        .pipe(fileinClude({
            prefix:'@@',
            basepath:'@file'
            }))
        .pipe(gulp.dest('dist/html/'));
});
/*首页*/
gulp.task('indexFile',function(){
    gulp.src(['src/index.html'])
        .pipe(fileinClude({
            prefix:'@@',
            basepath:'@file'
            }))
        .pipe(gulp.dest('dist/'));
});
//监听html
gulp.task("watchHtml",function(){
     gulp.watch('src/html/**/*.html',function(event){
        var paths=watchPath(event,'src','dist/');
        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath)
        gutil.log('Dist ' + paths.distPath);
        gulp.src(paths.srcPath)
             .pipe(gulp.dest(paths.distDir))
    })
})

//编译css
gulp.task("minifyCss",function(){
    gulp.src(['src/css/**/*','!src/css/include/*.css'])
        //.pipe(sourcemaps.init())
        .pipe(autoprefixer({
            browsers:'last 2 versions',
            cascade:true,
            remove:true
        }))
        //.pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist/css/'));
});
gulp.task('watchcss', function () {
    gulp.watch('src/css/*.css', function (event) {
        var paths = watchPath(event, 'src/', 'dist/')
        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath)
        gutil.log('Dist ' + paths.distPath)

        gulp.src(paths.srcPath)
            //.pipe(sourcemaps.init())
            .pipe(autoprefixer({
              browsers: 'last 2 versions',
              cascade:true,
              remove:true
            }))
            //.pipe(minifycss())
            //.pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(paths.distDir))
    })
});
/*监听sass*/
gulp.task('watchsass',function(){
    gulp.watch('src/sass/*.scss',function(event){
        var paths=watchPath(event,'src','dist/');
        gutil.log(gutil.colors.green(event.type)+''+paths.srcPath);
        gutil.log('Dist '+paths.distPath);
        sass(paths.srcPath)
            .on('error',function(err){
                console.error('Error!',err.message);
                })
            .pipe(sourcemaps.init())
            .pipe(autoprefixer({
                browsers:'last 2 versions',
                cascade:true,
                remove:true
                }))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(paths.distDir))
        })
});

//编译并压缩js
gulp.task("uglifyJs",function(){
    var combined=streamCombiner.obj([
        gulp.src('src/js/**/*'),
        //sourcemaps.init(),
        //uglify(),
        //sourcemaps.write('./'),
        gulp.dest('dist/js/')
    ])
    combined.on('error',handleError);
});
//复制ueditor文件夹
gulp.task("copyUeditor",function(){
    gulp.src("src/js/ueditor/**/*")
        .pipe(gulp.dest("dist/js/ueditor/"))
    });
//编译并压缩image
 gulp.task("image",function(){
    gulp.src('src/images/**/*')
        .pipe(imagemin({
            progressive:true
            }))
        .pipe(gulp.dest('dist/images/'))
})

//复制fonts等文件夹
gulp.task("copyFonts",function(){
    gulp.src("src/fonts/**/*")
        .pipe(gulp.dest("dist/fonts/"))
})

//实时监听
gulp.task("watch",function(){
    gulp.watch('src/js/**/*',['uglifyJs']);
    gulp.watch('src/images/**/*',['image']);
    gulp.watch('src/fonts/**/*',['copyFonts']);
    gulp.watch('dist/**/*.*').on('change', browserSync.reload);
})

gulp.task('default',['watchHtml','minifyCss','uglifyJs','image','copyFonts','watchsass','watchcss','server','fileinclude','indexFile','watch','copyUeditor']);
