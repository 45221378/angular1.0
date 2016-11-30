var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var px2rem = require('postcss-px2rem');
var cssgrace = require('cssgrace');

//启动服务
var webserver = require('gulp-webserver');

gulp.task('webserver',function(){
    gulp.src('./')
    .pipe(webserver({
        livereload:true,
        directoryListing:{
            enable:true,
            path:'./'
        },
        port:8000,
        host:'192.168.191.1',
    }))
})

//文件拷贝
gulp.task('copyAll',function(){
    return gulp.src('./src/**')
        .pipe(gulp.dest('dist'))
});

//文件index.html
gulp.task('copyIndex',function(){
    return gulp.src('./src/index.html')
        .pipe(gulp.dest('dist'))
});
//删除dist下多余的html
gulp.task('cleanSpareHtml',function(){
    return gulp.src(['./dist/*.html','!./dist/index.html'])
        .pipe($.clean())
});

//删除dist文件
gulp.task('cleanAll',function(){
    return gulp.src('dist')
        .pipe($.clean())
        .pipe($.notify())
});
//字体拷贝
gulp.task('copyFont', function () {
    return gulp.src('src/font/**/*')
        .pipe(gulp.dest('dist/font'))
});
//css 处理压缩 屏蔽有问题的css
gulp.task('cssmin', function () {
    var processors = [cssgrace,px2rem({remUnit: 75})];
    return gulp.src(['./dist/**/*.css','!./dist/**/swiper/*'])
        .pipe($.postcss(processors))
        .pipe($.autoprefixer({ browsers: ['> 1%', 'last 10 versions'], cascade: false }))
        //.pipe($.minifyCss())
        .pipe(gulp.dest('dist'))
});
//css 拷贝补全css
// gulp.task('copyCss',function(){
//     return gulp.src('src/vendor/swiper/*.css')
//         .pipe(gulp.dest('dist/vendor/swiper'))
// });

//js 压缩
gulp.task('uglify',function(){
    return gulp.src('src/**/*.js')
        .pipe($.uglify())
        .pipe(gulp.dest('dist'))
});

//删除引用后多余的js文件
gulp.task('cleanSpareJs',function(){
    return gulp.src(['dist/js/*',
        '!dist/js/app-*.js',
        'dist/vendor/*',
        '!dist/vendor/swiper',
        '!dist/vendor/Validform_*.js'
    ])
        .pipe($.clean())
});
//html 压缩
gulp.task('htmlmin', function () {
    var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        //collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        //removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        //removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        //removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
    return gulp.src('src/view/*.html')
        .pipe($.htmlmin(options))
        .pipe(gulp.dest('dist/view'))
});

//组合任务 4.0gulp task 只接受2个参数了 组合多个任务得用gulp.series去执行
//拷贝文件 并删掉多余的html
//gulp.task('copyForDist',gulp.series('copyAll','cleanSpareHtml'));
////多一步cleanAll
//gulp.task('repeatCopy',gulp.series('cleanAll','copyForDist'));
////处理引用依赖 并删掉合并后多余的文件
//gulp.task('useminAndCleanSpare',gulp.series('usemin','cleanSpareJs'));
////压缩
//gulp.task('minAll',gulp.series('minify-css','uglify','htmlmin','imagemin'));
//
//gulp.task('noDistDefault',gulp.series('copyForDist','useminAndCleanSpare','minAll'));
//gulp.task('default',gulp.series('repeatCopy','useminAndCleanSpare','minAll'));

//gulp.task('cssBuild',gulp.series('cssmin','copyCss'));
//gulp.task('copy',gulp.series('copyIndex','copyFont','imageCopy'));
//gulp.task('buildHaveImg',gulp.series('cleanAll', 'htmlmin','imagemin','copy','cssBuild','uglify','usemin','cleanSpareJs'));
//gulp.task('default',gulp.series('cleanAll', 'htmlmin','copy','cssBuild','uglify','usemin','cleanSpareJs'));
gulp.task('default',gulp.series('copyAll','cssmin','webserver'));

// gulp.task('default',['webserver','watch']); default 加个 webserver 任务