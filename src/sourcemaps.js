const convertSourceMap = require('convert-source-map')
const offsetSourcemapLines = require('offset-sourcemap-lines')

module.exports = { wrapIntoBundle }


function wrapIntoBundle (source) {
  // extract sourcemaps
  const sourceBundle = extractSourceMaps(source)
  // create wrapper + update sourcemaps
  const transformedBundle = transformToWrapped(sourceBundle)
  return transformedBundle
}

function extractSourceMaps (sourceCode) {
  const converter = convertSourceMap.fromSource(sourceCode)
  // if (!converter) throw new Error('Unable to find original inlined sourcemap')
  const maps = converter && converter.toObject()
  const code = convertSourceMap.removeComments(sourceCode)
  return { code, maps }
}

function transformToWrapped (bundle) {
  const start = '(function(require,module,exports){\n'
  const end = '\n})'

  const offsetLinesCount = start.match(/\n/g).length
  const maps = bundle.maps && offsetSourcemapLines(bundle.maps, offsetLinesCount)
  const code = start + bundle.code + end
    
  return { code, maps }
}