import * as esbuild from 'esbuild';
import {sassPlugin} from 'esbuild-sass-plugin'
let ctx = await esbuild.context({
  entryPoints: [
    'app/javascript/application.js',
    'app/javascript/vendors/**',
    'app/javascript/application_react.js',
    'app/javascript/components/**',
    'app/javascript/controllers/**',
    'app/javascript/views/**',
    'app/javascript/App.js',
    'app/javascript/routes.js',
    'app/javascript/nav.js',
  ],
  bundle: true,
  outdir: 'app/assets/builds',
  publicPath: 'app/assets',
  loader:{
    '.js':'jsx',
    '.jpg':'dataurl',
    '.png':'dataurl',
    '.webp':'dataurl',
  },
  // outfile: 'app/assets/builds/application.js',
  format: 'esm',
  plugins: [
    sassPlugin({
      filter: /\.scss$/
    }),
  ],
  // minify: true,
  sourcemap: true,
});

await ctx.watch();