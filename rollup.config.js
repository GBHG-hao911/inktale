export default {
  external: ['./story.js', 'ink'],
  input: 'web/js/main.js',
  output: {
    file: 'dist/main.js',
    globals: 'inkjs',
    format: 'esm',
    sourcemap: true
  }
};
