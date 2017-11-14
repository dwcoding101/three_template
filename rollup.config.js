// Rollup plugins
import babel from 'rollup-plugin-babel';
import eslint from 'rollup-plugin-eslint';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import uglify from 'rollup-plugin-uglify';
import ignore from 'rollup-plugin-ignore';
import glslify from 'glslify';

const glsl = () => {
    return {
      transform( code, id ) {
  
        if ( !/\.glsl$|\.vert$|\.frag$/.test( id ) ) return;
        //
        const res = glslify( code );
        //
        return 'export default ' + JSON.stringify(
          res
          .replace( /[ \t]*\/\/.*\n/g, '' )
          .replace( /[ \t]*\/\*[\s\S]*?\*\//g, '' )
          .replace( /\n{2,}/g, '\n' )
        ) + ';';
      },
    };
  };

//process.env.NODE_ENV = 'production';
export default {
    input: 'src/scripts/main.js',
    output: {
        file: 'build/js/main.min.js',
        format: 'iife',
    },
    sourcemap: 'inline',
    plugins: [
        
        resolve({
             jsnext: true,
             main: true,
             browser: true,
         }),
         commonjs(),
         glsl(),
         eslint({
             exclude: [
                 'src/styles/**',
                 '**/*.glsl'
             ],
         }),
         babel({
             exclude: ['node_modules/**','src/scripts/modules/three/renderers/shaders/ShaderChunk/**'],
          }),
        replace({
            ENV: JSON.stringify(process.env.NODE_ENV ||'development')
        }),
        (process.env.NODE_ENV === 'production' && uglify()),
    ],
};