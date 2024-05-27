const path = require( 'path' )
const { defineConfig } = require( 'vite' )
const { default: dtsPlugin } = require( "vite-plugin-dts" )

module.exports = defineConfig( {
	build: {
		lib: {
			entry: path.resolve( __dirname, 'lib/main.ts' ),
			name: 'typeValidator',
			fileName: ( format ) => `typeValidator.${format}.js`,
			formats: [ "es", "umd" ]
		},
		// sourcemap: true
		minify: false
	},
	plugins: [ dtsPlugin( {
		rollupTypes: true,
	} ) ]
} )