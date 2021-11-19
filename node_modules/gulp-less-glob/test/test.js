import path from 'path';
import expect from 'expect.js';
import vinyl from 'vinyl-fs';
import lessGlob from '../src';

describe( 'gulp-less-glob', () => {

  it( '(less) should parse a single directory', ( done ) => {
    const expectedResult = [
      '@import "import/_f1.less";',
      '@import "import/_f2.less";'
    ].join( '\n' );

    vinyl
      .src( path.join( __dirname, '/test-less/single-directory.less' ) )
      .pipe( lessGlob() )
      .on( 'data', ( file ) => {
        const contents = file.contents.toString( 'utf-8' )
          .trim();
        expect( contents )
          .to
          .equal( expectedResult.trim() );
      } )
      .on( 'end', done );
  } );

  it( '(less) should understand imports with fixed file name', ( done ) => {
    const expectedResult = [
      '@import "recursive/nested/_f3.less";'
    ].join( '\n' );

    vinyl
      .src( path.join( __dirname, '/test-less/fixed-name.less' ) )
      .pipe( lessGlob() )
      .on( 'data', ( file ) => {
        const contents = file.contents.toString( 'utf-8' )
          .trim();
        expect( contents )
          .to
          .equal( expectedResult.trim() );
      } )
      .on( 'end', done );
  } );

  it( '(less) should parse a directory recursively', ( done ) => {
    const expectedResult = [
      '@import "recursive/_f1.less";',
      '@import "recursive/_f2.less";',
      '@import "recursive/nested/_f3.less";'
    ].join( '\n' );

    vinyl
      .src( path.join( __dirname, '/test-less/recursive.less' ) )
      .pipe( lessGlob() )
      .on( 'data', ( file ) => {
        const contents = file.contents.toString( 'utf-8' )
          .trim();
        expect( contents )
          .to
          .equal( expectedResult.trim() );
      } )
      .on( 'end', done );
  } );

  it( '(less) should find multiple imports', ( done ) => {
    const expectedResult = [
      '@import "recursive/_f1.less";',
      '@import "recursive/_f2.less";',
      '@import "recursive/nested/_f3.less";',
      '@import "import/_f1.less";',
      '@import "import/_f2.less";'
    ].join( '\n' );

    vinyl
      .src( path.join( __dirname, '/test-less/multiple.less' ) )
      .pipe( lessGlob() )
      .on( 'data', ( file ) => {
        const contents = file.contents.toString( 'utf-8' )
          .trim();
        expect( contents )
          .to
          .equal( expectedResult.trim() );
      } )
      .on( 'end', done );
  } );

  it( '(less) should omit ignored directories', ( done ) => {
    const expectedResult = [
      '@import "recursive/_f1.less";',
      '@import "recursive/_f2.less";',
      '@import "import/_f1.less";',
      '@import "import/_f2.less";'
    ].join( '\n' );

    vinyl
      .src( path.join( __dirname, '/test-less/multiple.less' ) )
      .pipe( lessGlob( {
        ignorePaths: [
              'recursive/nested/**'
            ]
      } ) )
      .on( 'data', ( file ) => {
        const contents = file.contents.toString( 'utf-8' )
          .trim();
        expect( contents )
          .to
          .equal( expectedResult.trim() );
      } )
      .on( 'end', done );
  } );

  it( '(less) should allow globbing when ignoring files', ( done ) => {
    const expectedResult = [
      '@import "recursive/_f2.less";',
      '@import "recursive/nested/_f3.less";',
      '@import "import/_f2.less";'
    ].join( '\n' );

    vinyl
      .src( path.join( __dirname, '/test-less/multiple.less' ) )
      .pipe( lessGlob( {
        ignorePaths: [
              '**/_f1.less'
            ]
      } ) )
      .on( 'data', ( file ) => {
        const contents = file.contents.toString( 'utf-8' )
          .trim();
        expect( contents )
          .to
          .equal( expectedResult.trim() );
      } )
      .on( 'end', done );
  } );

  it( '(less) should allow multiple ignore patterns', ( done ) => {
    const expectedResult = [
      '@import "recursive/nested/_f3.less";'
    ].join( '\n' );

    vinyl
      .src( path.join( __dirname, '/test-less/multiple.less' ) )
      .pipe( lessGlob( {
        ignorePaths: [
              '**/_f1.less',
              'recursive/_f2.less',
              'import/**'
            ]
      } ) )
      .on( 'data', ( file ) => {
        const contents = file.contents.toString( 'utf-8' )
          .trim();
        expect( contents )
          .to
          .equal( expectedResult.trim() );
      } )
      .on( 'end', done );
  } );

  it( '(less) should ignore commented globs', ( done ) => {
    vinyl
      .src( path.join( __dirname, '/test-less/ignore-comments.less' ) )
      .pipe( lessGlob() )
      .on( 'data', ( file ) => {
        const contents = file.contents.toString( 'utf-8' )
          .trim();
        expect( contents )
          .to.equal( contents );
      } )
      .on( 'end', done );
  } );

  it( '(less) should ignore empty directories', ( done ) => {
    const expectedResult = [
      '@import "import/_f1.less";',
      '@import "import/_f2.less";'
    ].join( '\n' );

    vinyl
      .src( path.join( __dirname, '/test-less/ignore-empty.less' ) )
      .pipe( lessGlob() )
      .on( 'data', ( file ) => {
        const contents = file.contents.toString( 'utf-8' )
          .trim();
        expect( contents )
          .to
          .equal( expectedResult.trim() );
      } )
      .on( 'end', done );
  } );

  it( '(less) should use includePaths like gulp-less', ( done ) => {
    const expectedResult = [
      '@import "nested/_f3.less";'
    ].join( '\n' );

    vinyl
      .src( path.join( __dirname, '/test-less/option-includePaths.less' ) )
      .pipe( lessGlob( {
        includePaths: [
                path.join( __dirname, '/test-less/recursive/' )
              ]
      } ) )
      .on( 'data', ( file ) => {
        const contents = file.contents.toString( 'utf-8' )
          .trim();
        expect( contents )
          .to
          .equal( expectedResult.trim() );
      } )
      .on( 'end', done );
  } );

  it( '(less) should use includePaths priority, first relative file and position in includePath', ( done ) => {
    const expectedResult = [
      '@import "import/_f1.less";',
      '@import "import/_f2.less";',
      '@import "nested/_f3.less";'
    ].join( '\n' );

    vinyl
      .src( path.join( __dirname, '/test-less/option-includePaths-priority.less' ) )
      .pipe( lessGlob( {
        includePaths: [
                path.join( __dirname, '/test-less/recursive/' ),
                path.join( __dirname, '/test-less/includePaths/' )
              ]
      } ) )
      .on( 'data', ( file ) => {
        const contents = file.contents.toString( 'utf-8' )
          .trim();
        expect( contents )
          .to
          .equal( expectedResult.trim() );
      } )
      .on( 'end', done );
  } );

} );
