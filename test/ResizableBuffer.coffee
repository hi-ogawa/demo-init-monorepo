
ResizeableBuffer = require('../lib/ResizeableBuffer')

describe 'ResizeableBuffer', ->
  
  describe 'append', ->

    it 'chars inside boundary', ->
      rb = new ResizeableBuffer(5)
      buf = Buffer.from 'abc'
      for i in [0...buf.length]
        rb.append(buf[i])
      rb.length.should.eql 3
      rb.clone().toString().should.eql('abc')

    it 'chars larger than size', ->
      rb = new ResizeableBuffer(5)
      buf = Buffer.from 'abc,def;hij,klm;'
      for i in [0...buf.length]
        rb.append(buf[i])
      rb.length.should.eql 16
      rb.clone().toString().should.eql 'abc,def;hij,klm;'
        
  describe 'prepend', ->
    
    it 'chars inside boundary', ->
      rb = new ResizeableBuffer(5)
      buf = Buffer.from 'abc'
      for i in [1...buf.length]
        rb.append(buf[i])
      rb.prepend(buf[0])
      rb.length.should.eql 3
      rb.clone().toString().should.eql 'abc'

    it 'chars same size as size', ->
      
      rb = new ResizeableBuffer(3)
      buf = Buffer.from 'abcd'
      for i in [1...buf.length]
        rb.append(buf[i])
      rb.prepend(buf[0])
      rb.length.should.eql 4
      rb.clone().toString().should.eql 'abcd'

    it 'chars larger than size', ->
      rb = new ResizeableBuffer(5)
      buf = Buffer.from 'abc,def;hij,klm;'
      for i in [1...buf.length]
        rb.append(buf[i])
      rb.prepend(buf[0])
      rb.length.should.eql 16
      rb.clone().toString().should.eql 'abc,def;hij,klm;'
    
  describe 'reset', ->

    it 'reset', ->
      rb = new ResizeableBuffer(5)
      buf = Buffer.from 'abc,def;'
      for i in [0...buf.length]
        rb.append(buf[i])
      rb.reset()
      buf = Buffer.from 'hij,klm;'
      for i in [0...buf.length]
        rb.append(buf[i])
      rb.clone().toString().should.eql 'hij,klm;'
