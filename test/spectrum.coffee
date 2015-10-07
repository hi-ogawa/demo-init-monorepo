
spectrum = require 'csv-spectrum'
each = require 'each'
should = require 'should'
parse = if process.env.CSV_COV then require '../lib-cov' else require '../src'

describe 'spectrum', ->

  it 'pass all tests', (next) ->
    spectrum (err, tests) ->
      each tests
      .on 'item', (test, next) ->
        return next() if test.name is 'simple' # See https://github.com/maxogden/csv-spectrum/commit/ec45e96a79661d7bd87f6becbb845b30f11accde
        parse test.csv.toString(), columns: true, (err, data) ->
          return next err if err
          data.should.eql JSON.parse test.json.toString()
          next()
      .on 'both', (err) ->
        next err
