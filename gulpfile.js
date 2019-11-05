const { src, dest, series, parallel, watch } = require("gulp");
const del = require("del");
const concat = require("gulp-concat");
const autoprefixer = require("gulp-autoprefixer");
const cleanCSS = require("gulp-clean-css");
const gulpif = require("gulp-if");
const sourcemaps = require("gulp-sourcemaps");
const browserSync = require("browser-sync").create();
const gcmq = require("gulp-group-css-media-queries");
const less = require('gulp-less');
const htmlmin = require('gulp-htmlmin');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const svgSprite = require('gulp-svg-sprite');
const merge = require('merge-stream');
const buffer = require('vinyl-buffer'); 
const spritesmith = require('gulp.spritesmith');
const babel = require("gulp-babel");
const uglify = require('gulp-uglify');


const isDev = process.argv.includes("--dev");
const isProd = !isDev;
const isSync = process.argv.includes("--sync");

function clear() {
  return isDev? del(["./build/*.css","./build/index.html","./build/**/*.js"]): del("./build/**");
}

function styles() {
  return src("./src/styles/style.less")
    .pipe(gulpif(isDev, sourcemaps.init()))
    .pipe(less())
    .pipe(gcmq())
    .pipe(
      autoprefixer({
        cascade: false
      })
    )
    .pipe(gulpif(isProd,cleanCSS({
          level: 2
        })))
    .pipe(gulpif(isDev, sourcemaps.write()))
    .pipe(dest("./build/"))
    .pipe(gulpif(isSync, browserSync.stream()));
}

function fonts(){
  return src("./src/fonts/*.{woff,woff2}")
    .pipe(dest("./build/fonts"))
}

function html() {
  return src("./src/**/*.html")
    .pipe(gulpif(isProd, htmlmin({ collapseWhitespace: true }))) // минификация html без удаления пробелов внутри тегов
    .pipe(dest("./build/"))
    .pipe(gulpif(isSync, browserSync.stream()));
}

function compilingJs(){
  return src("./src/scripts/compilingJs/*.js")
    .pipe(babel({
      presets: [
        '@babel/preset-env'
      ]
    }))
    .pipe(gulpif(isProd, uglify()))
    .pipe(dest("./build/scripts"));
}

function js() {
  return src(["./src/scripts/**/*.js",
              "./node_modules/babel-polyfill/dist/polyfill.min.js", // руками напрямую добавил полифил, ибо не использовал сборщика понимающего модули
              "!src/scripts/compilingJs/**"])
    .pipe(gulpif(isProd, uglify()))
    .pipe(dest("./build/scripts"));
}


function picture(){
  return src(["./src/image/**/*.{png,jpg}","./src/image/content-SVG/*.svg", "!src/image/spriteIMG/**"], { base:"./src/image/" })
    .pipe(imagemin([
      imagemin.jpegtran({progressive: true}), // Прогрессивное отображение jpg
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.svgo({plugins: [{
          removeViewBox: false
        }]})
  ]))
    .pipe(dest("./build/image"))
}

function webpPicture(){
  return src("./src/image/content-picture/**/*", { base:"./src/image/content-picture/" })
    .pipe( webp({quality:90}))
    .pipe(dest("./build/image/content-picture/"))
}

function svgInlineSprite(){ // создает спрайты для вставиавния в html через use 

  const svgConfig = {
    mode: {
      symbol: {
        dest:"./",
        sprite:"./sprite.svg"
      }
    }
  }

  // эти натойки настройки вставляются как атрибуты ф-ции svgo()
  //   {plugins: [{ 
  //     removeAttrs: {
  //       attrs: 'path:fill' // удаляет всe fill атрибуты внутри path
  //     }
  // }]}

  return src("./src/image/spriteSVG/*.svg")
    .pipe(imagemin([
      imagemin.svgo() // оптимизация svg
    ]))
    .pipe(svgSprite(svgConfig))
    .pipe(dest("./build/image/spriteSVG"))
}

function svgCSS(){ // создает спрайты для встравивания в css background

  const svgConfig = {
    mode: {
      css: {
        dest:"./", // удаление лишних вложенностей папок
        sprite:"./sprite.svg",
        render: {
          css: {
            render: {
                css: true, // создание css файла с описание расположения каждого спрайта
                less: {dest: '_sprite.less'}
              }
          }
        }
      }
    },
    svg:{
      namespaceIDs:false
    }

  }

//   {plugins: [{
//     removeAttrs: {
//       attrs: ["width","height"] // удаляет width и height атрибуты (баг при конвертировании из ai в svg)
//     }
//    }]}

  return src("./src/image/svgCssSprite/*.svg")
    .pipe(imagemin([
      imagemin.svgo()
    ]))
    .pipe(svgSprite(svgConfig))
    .pipe(dest("./build/image/css"))
}

function imgSprite(){ // создает спрайты из jpg и png картинок
  const spriteData = src("./src/image/spriteIMG/**/*.{png,jpg}")
                      .pipe(spritesmith({
                        imgName: 'sprite.png',
                        imgPath : "./image/spriteIMG/sprite.png", // устанавливает относительный путь к спрайту в less файле с миксинами
                        cssName: 'sprite.less',
                        algorithm: 'binary-tree',
                        retinaSrcFilter: './src/image/spriteIMG/retina/**/*@2x.{png,jpg}',
                        retinaImgName: 'sprite@2x.png',
                        retinaImgPath: './image/spriteIMG/sprite@2x.png',
                      }));

  const spriteDataImg = spriteData.img
                              .pipe(buffer()) // Без буфера не работает минификация
                              .pipe(imagemin([
                                imagemin.jpegtran({progressive: true}),
                                imagemin.optipng({optimizationLevel: 3})
                              ]))
                              .pipe(dest("./build/image/spriteIMG/"));

  const spriteDataCss = spriteData.css.pipe(dest("./src/styles/blocks"));

  return merge(spriteDataImg, spriteDataCss)
}

function watcher() {
  isSync && browserSync.init({
      server: {
        baseDir: "./build/"
      }
    });

  watch("./src/**/*.{less,css}", styles);
  watch("./src/**/*.html", html);
  watch(["./src/scripts/**/*.js","!src/scripts/compilingJs/**"], js);
  watch("./src/scripts/compilingJs/*.js", compilingJs);
  watch(["./src/image/**/*.{png,jpg}","./src/image/content-SVG/*.svg", "!src/spriteIMG/**"], picture)
  watch("./src/image/spriteSVG/*.svg", svgInlineSprite)
  watch("./src/image/spriteIMG/*.{png,jpg}", imgSprite)
  watch("./src/image/CSS/*.svg", svgCSS)
}

exports.build = series(clear, parallel(styles, html, picture, js, compilingJs, webpPicture, svgInlineSprite, svgCSS, fonts));
exports.watch = series(clear, parallel(styles, html, js, compilingJs), watcher);
exports.preflight = series(clear, parallel(styles, html, js, compilingJs, picture, webpPicture, svgInlineSprite, svgCSS, fonts,imgSprite));
exports.test = js;