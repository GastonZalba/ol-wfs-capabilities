import resolve from '@rollup/plugin-node-resolve';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import del from 'rollup-plugin-delete';

const globals = (id) => {
  const globals = {};

  if (/ol(\\|\/)/.test(id)) {
    return id.replace(/\//g, '.').replace('.js', '');
  } else if (id in globals) {
    return globals[id];
  }

  return id;
};

export default function (commandOptions) {

  const outputs = [
    {
      input: 'lib/WFSCapabilities.js',
      output: [
        {
          file: 'dist/WFSCapabilities.js',
          format: 'umd',
          name: 'WFSCapabilities',
          globals: globals,
          sourcemap: commandOptions.dev
        }
      ],
      plugins: [
        del({ targets: 'dist/*' }),

        resolve({
          browser: true, // <-- suppress node-specific features
          module: false
        }),

        commandOptions.dev &&
        serve({
          open: false,
          verbose: true,
          contentBase: ['', 'examples'],
          historyApiFallback: `/${commandOptions.example || 'converter'}.html`,
          host: 'localhost',
          port: 3009,
          // execute function after server has begun listening
          onListening: function (server) {
            const address = server.address();
            // by using a bound function, we can access options as `this`
            const protocol = this.https ? 'https' : 'http';
            console.log(
              `Server listening at ${protocol}://localhost:${address.port}/`
            );
          }
        }),
        commandOptions.dev &&
        livereload({
          watch: ['dist'],
          delay: 2000
        })
      ],

      external: (id) => {
        return /(ol(\\|\/))/.test(
          id
        );
      }
    }
  ];
  return outputs;
}

