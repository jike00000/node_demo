var gulp = require('gulp'),
    connect = require('gulp-connect'), //创建服务器
    uglify = require("gulp-uglify"), //压缩js
    minifyHtml = require("gulp-minify-html"), //压缩html
    minifyCss = require("gulp-minify-css"), //压缩css
    imagemin = require('gulp-imagemin'), //压缩图片
    pngquant = require('imagemin-pngquant'), //压缩png
    rimraf = require('gulp-rimraf'), //清除文件夹
    rename = require('gulp-rename'), //文件重命名
    rev = require('gulp-rev'), // 对文件名加MD5后缀
    revCollector = require('gulp-rev-collector'); // 路径替换

//清空build文件夹
gulp.task('rimraf', function(cb) {
    return gulp.src('./build/*', {
            read: false
        })
        .pipe(rimraf());
});

//图片压缩加md5
gulp.task('imagemin', ['rimraf'], function() {
    return gulp.src('src/img/*.{png,jpg,gif,ico}')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }], //不要移除svg的viewbox属性
            use: [pngquant()] //使用pngquant深度压缩png图片的imagemin插件
        }))
        .pipe(rev()) // 文件名加MD5后缀
        .pipe(gulp.dest('./build/img'))
        .pipe(rev.manifest('revimg.json')) // 生成一个rev-manifest.json
        .pipe(gulp.dest('./build/rev')); // 将 rev-manifest.json 保存到 rev 目录内
});

gulp.task('resimg', ['imagemin'], function() {
    return gulp.src('./build/imagemin/*')
        .pipe(rev()) // 文件名加MD5后缀
        .pipe(gulp.dest('./build/img'))
        .pipe(rev.manifest('revimg.json')) // 生成一个rev-manifest.json
        .pipe(gulp.dest('./build/rev')); // 将 rev-manifest.json 保存到 rev 目录内
});

gulp.task('revcss', ['imagemin'], function() { // 创建一个名为 concat 的 task
    return gulp.src(['./build/rev/revimg.json', './src/css/main.css']) //- 需要处理的css文件，放到一个字符串数组里
        .pipe(revCollector({
            replaceReved: true,
            dirReplacements: {
                'img': 'img',
            }
        }))
        .pipe(minifyCss()) // 压缩处理成一行
        .pipe(rev()) // 文件名加MD5后缀
        .pipe(gulp.dest('./build/css')) // 输出文件本地
        .pipe(rev.manifest('revcss.json')) // 生成一个rev-manifest.json
        .pipe(gulp.dest('./build/rev')); // 将 rev-manifest.json 保存到 rev 目录内

});

//压缩js加MD5后缀
gulp.task('uglify', ['rimraf'], function() {
    return gulp.src('src/js/bundle.js') // 要压缩的js文件
        .pipe(uglify()) //压缩js
        .pipe(rev()) // 文件名加MD5后缀
        .pipe(gulp.dest('./build/js')) //输出文件本地
        .pipe(rev.manifest('revjs.json')) //生成一个rev-manifest.json
        .pipe(gulp.dest('./build/rev')); // 将 rev-manifest.json 保存到 rev 目录内

});

//压缩html
gulp.task('revhtml', ['revcss', 'uglify'], function() {
    return gulp.src(['./build/rev/*.json', './src/index.html']) //读取 rev-manifest.json 文件以及需要进行替换的文件
        .pipe(revCollector({
            replaceReved: true,
            dirReplacements: {
                'img': 'img',
                'css': 'css',
                'js': 'js'
            }
        })) // 执行文件内的替换
        .pipe(minifyHtml()) // 压缩html
        .pipe(gulp.dest('./build/')); // 替换后的文件输出的目录
});

//创建服务器
gulp.task('connect', ['revhtml'], function() {
    connect.server({
        root: 'build', //访问build目录
    });
});

//默认任务
gulp.task('default', ['connect']);
