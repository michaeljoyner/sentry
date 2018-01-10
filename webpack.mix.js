let mix = require("laravel-mix");
let tailwindcss = require("tailwindcss");

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for your application, as well as bundling up your JS files.
 |
 */

mix
  .js("resources/js/app.js", "public/js/")
  .postCss("resources/css/main.css", "public/css", [
    tailwindcss("tailwind.js")
  ]);
