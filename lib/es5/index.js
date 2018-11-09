"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var _require = require('stream'),
    Transform = _require.Transform;

var ResizeableBuffer = require('./ResizeableBuffer');

var default_options = {
  // cast: false,
  // cast_date: false,
  columns: null,
  delimiter: Buffer.from(','),
  escape: Buffer.from('"'),
  from: 1,
  from_line: 1,
  objname: undefined,
  // ltrim: false,
  // quote: Buffer.from('"'),
  // TODO create a max_comment_size
  max_record_size: 0,
  relax: false,
  relax_column_count: false,
  // rtrim: false,
  skip_empty_lines: false,
  skip_lines_with_empty_values: false,
  skip_lines_with_error: false,
  to_line: -1,
  to: -1,
  trim: false
};
var cr = 13;
var nl = 10;
var space = 32;

var Parser =
/*#__PURE__*/
function (_Transform) {
  _inherits(Parser, _Transform);

  function Parser() {
    var _this;

    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Parser);

    var options = {};

    for (var i in opts) {
      options[i] = opts[i];
    }

    options.readableObjectMode = true;
    _this = _possibleConstructorReturn(this, _getPrototypeOf(Parser).call(this, options)); // Import default options

    for (var k in default_options) {
      if (options[k] === undefined) {
        options[k] = default_options[k];
      }
    } // Normalize option `cast`


    var fnCastField = null;

    if (options.cast === undefined || options.cast === null || options.cast === false || options.cast === '') {
      options.cast = undefined;
    } else if (typeof options.cast === 'function') {
      fnCastField = options.cast;
      options.cast = true;
    } else if (options.cast !== true) {
      throw new Error('Invalid Option: cast must be true or a function');
    } // Normize option `cast_date`


    if (options.cast_date === undefined || options.cast_date === null || options.cast_date === false || options.cast_date === '') {
      options.cast_date = false;
    } else if (options.cast_date === true) {
      options.cast_date = function (value) {
        var date = Date.parse(value);
        return !isNaN(date) ? new Date(date) : value;
      };
    } else if (typeof options.cast_date !== 'function') {
      throw new Error('Invalid Option: cast_date must be true or a function');
    } // Normalize option `comment`


    if (options.comment === undefined || options.comment === null || options.comment === false || options.comment === '') {
      options.comment = null;
    } else {
      if (typeof options.comment === 'string') {
        options.comment = Buffer.from(options.comment);
      }

      if (!Buffer.isBuffer(options.comment)) {
        throw new Error("Invalid Option: comment must be a buffer or a string, got ".concat(JSON.stringify(options.comment)));
      }
    } // Normalize option `delimiter`


    if (typeof options.delimiter === 'string') {
      options.delimiter = Buffer.from(options.delimiter);
    } // Normalize option `rowDelimiter`


    if (!options.rowDelimiter) {
      options.rowDelimiter = [];
    } else if (!Array.isArray(options.rowDelimiter)) {
      options.rowDelimiter = [options.rowDelimiter];
    }

    options.rowDelimiter = options.rowDelimiter.map(function (rd) {
      if (typeof rd === 'string') {
        rd = Buffer.from(rd);
      }

      return rd;
    }); // Normalize option `quote`

    if (options.quote === null || options.quote === false || options.quote === '') {
      options.quote = null;
    } else {
      if (options.quote === undefined || options.quote === true) {
        options.quote = Buffer.from('"');
      } else if (typeof options.quote === 'string') {
        options.quote = Buffer.from(options.quote);
      }

      if (!Buffer.isBuffer(options.quote)) {
        throw new Error("Invalid Option: quote must be a buffer or a string, got ".concat(JSON.stringify(options.quote)));
      } else if (options.quote.length !== 1) {
        throw new Error("Invalid Option Length: quote must be one character, got ".concat(options.quote.length));
      } else {
        options.quote = options.quote[0];
      }
    } // Normalize option `buffer`


    if (typeof options.escape === 'string') {
      options.escape = Buffer.from(options.escape);
    }

    if (!Buffer.isBuffer(options.escape)) {
      throw new Error("Invalid Option: escape must be a buffer or a string, got ".concat(JSON.stringify(options.escape)));
    } else if (options.escape.length !== 1) {
      throw new Error("Invalid Option Length: escape must be one character, got ".concat(options.escape.length));
    } else {
      options.escape = options.escape[0];
    } // Normalize option `columns`


    var fnFirstLineToHeaders = null;

    if (options.columns === true) {
      fnFirstLineToHeaders = firstLineToHeadersDefault;
    } else if (typeof options.columns === 'function') {
      fnFirstLineToHeaders = options.columns;
      options.columns = true;
    } else if (Array.isArray(options.columns)) {
      normalizeColumnsArray(options.columns);
    } else if (options.columns === undefined || options.columns === null || options.columns === false) {
      options.columns = false;
    } else {
      throw new Error("Invalid Option columns: expect an object or true, got ".concat(JSON.stringify(options.columns)));
    } // Normalize options `raw`


    if (options.raw === undefined || options.raw === null || options.raw === false) {
      options.raw = false;
    } else if (options.raw !== true) {
      throw new Error("Invalid Option: raw must be true, got ".concat(JSON.stringify(options.raw)));
    } // Normalize options `trim`, `ltrim` and `rtrim`


    if (options.trim === true && options.ltrim !== false) {
      options.ltrim = true;
    } else if (options.ltrim !== true) {
      options.ltrim = false;
    }

    if (options.trim === true && options.rtrim !== false) {
      options.rtrim = true;
    } else if (options.rtrim !== true) {
      options.rtrim = false;
    }

    _this.options = options;
    _this.state = {
      castField: fnCastField,
      commenting: false,
      escaping: false,
      escapeIsQuote: options.escape === options.quote,
      expectedRecordLength: options.columns === null ? 0 : options.columns.length,
      field: new ResizeableBuffer(20),
      firstLineToHeaders: fnFirstLineToHeaders,
      previousBuf: undefined,
      quoting: false,
      stop: false,
      rawBuffer: new ResizeableBuffer(100),
      record: [],
      recordHasError: false,
      record_length: 0,
      rowDelimiterMaxLength: options.rowDelimiter.length === 0 ? 2 : Math.max.apply(Math, _toConsumableArray(options.rowDelimiter.map(function (v) {
        return v.length;
      }))),
      trimChars: [Buffer.from(' ')[0], Buffer.from('\t')[0]],
      wasQuoting: false
    };
    _this.info = {
      records: 0,
      lines: 1,
      empty_line_count: 0,
      skipped_line_count: 0
    };
    return _this;
  }

  _createClass(Parser, [{
    key: "_transform",
    value: function _transform(buf, encoding, callback) {
      if (this.state.stop === true) {
        return;
      }

      var err = this.__parse(buf, false);

      if (err !== undefined) {
        this.state.stop = true;
      }

      callback(err);
    }
  }, {
    key: "_flush",
    value: function _flush(callback) {
      if (this.state.stop === true) {
        return;
      }

      var err = this.__parse(undefined, true);

      callback(err);
    }
  }, {
    key: "__parse",
    value: function __parse(nextBuf, end) {
      var _this$options = this.options,
          comment = _this$options.comment,
          escape = _this$options.escape,
          from = _this$options.from,
          ltrim = _this$options.ltrim,
          max_record_size = _this$options.max_record_size,
          quote = _this$options.quote,
          raw = _this$options.raw,
          relax = _this$options.relax,
          rtrim = _this$options.rtrim,
          skip_empty_lines = _this$options.skip_empty_lines,
          to = _this$options.to;
      var rowDelimiter = this.options.rowDelimiter;
      var _this$state = this.state,
          previousBuf = _this$state.previousBuf,
          rawBuffer = _this$state.rawBuffer,
          escapeIsQuote = _this$state.escapeIsQuote,
          trimChars = _this$state.trimChars;
      var commenting = this.state.commenting;
      var buf;

      if (previousBuf === undefined && nextBuf !== undefined) {
        buf = nextBuf;
      } else if (previousBuf !== undefined && nextBuf === undefined) {
        buf = previousBuf;
      } else {
        buf = Buffer.concat([previousBuf, nextBuf]);
      }

      var bufLen = buf.length;
      var pos; // let escaping = this.

      var wasRowDelimiter = false;

      for (pos = 0; pos < bufLen; pos++) {
        // Ensure we get enough space to look ahead
        // There should be a way to move this out of the loop
        if (this.__needMoreData(pos, bufLen, end)) {
          break;
        }

        if (wasRowDelimiter === true) {
          this.info.lines++;
          wasRowDelimiter = false;
        } // if(to_line !== -1 && this.info.lines > to_line){
        //   this.push(null)
        //   break
        // }
        // Auto discovery of rowDelimiter, unix, mac and windows supported


        if (this.state.quoting === false && rowDelimiter.length === 0) {
          var rowDelimiterCount = this.__autoDiscoverRowDelimiter(buf, pos);

          if (rowDelimiterCount) {
            rowDelimiter = this.options.rowDelimiter;
          }
        }

        var chr = buf[pos];

        if (raw === true) {
          rawBuffer.append(chr);
        }

        var rowDelimiterLength = this.__isRowDelimiter(chr, buf, pos);

        if (rowDelimiterLength !== 0) {
          wasRowDelimiter = true;
        } // if(from_line !== 1 && this.info.lines < this.options.from_line){
        //   pos += rowDelimiterLength === 0 ? 0 : rowDelimiterLength - 1
        //   continue
        // }
        // Previous char was a valid escape char
        // treat the current char as a regular char


        if (this.state.escaping === true) {
          this.state.escaping = false;
        } else {
          // Escape is only active inside quoted fields
          if (this.state.quoting === true && chr === escape && pos + 1 < bufLen) {
            // We are quoting, the char is an escape chr and there is a chr to escape
            if (escapeIsQuote) {
              if (buf[pos + 1] === quote) {
                this.state.escaping = true;
                continue;
              }
            } else {
              this.state.escaping = true;
              continue;
            }
          } // Not currently escaping and chr is a quote
          // TODO: need to compare bytes instead of single char


          if (commenting === false && chr === quote) {
            if (this.state.quoting === true) {
              var nextChr = buf[pos + 1];

              var isNextChrTrimable = rtrim && this.__isCharTrimable(nextChr); // const isNextChrComment = nextChr === comment


              var isNextChrComment = comment !== null && this.__compareBytes(comment, buf, pos + 1, nextChr);

              var isNextChrDelimiter = this.__isDelimiter(nextChr, buf, pos + 1);

              var isNextChrRowDelimiter = rowDelimiter.length === 0 ? this.__autoDiscoverRowDelimiter(buf, pos + 1) : this.__isRowDelimiter(nextChr, buf, pos + 1); // Escape a quote
              // Treat next char as a regular character
              // TODO: need to compare bytes instead of single char

              if (chr === escape && nextChr === quote) {
                pos++;
              } else if (!nextChr || isNextChrDelimiter || isNextChrRowDelimiter || isNextChrComment || isNextChrTrimable) {
                this.state.quoting = false;
                this.state.wasQuoting = true;
                continue;
              } else if (relax === false) {
                var err = this.error("Invalid Closing Quote: got \"".concat(String.fromCharCode(nextChr), "\" at line ").concat(this.info.lines, " instead of delimiter, row delimiter, trimable character (if activated) or comment"));
                if (err !== undefined) return err;
              } else {
                this.state.quoting = false;
                this.state.wasQuoting = true; // continue

                this.state.field.prepend(quote);
              }
            } else {
              if (this.state.field.length !== 0) {
                // In relax mode, treat opening quote preceded by chrs as regular
                if (relax === false) {
                  var _err = this.error("Invalid opening quote at line ".concat(this.info.lines));

                  if (_err !== undefined) return _err;
                }
              } else {
                this.state.quoting = true;
                continue;
              }
            }
          }

          if (this.state.quoting === false) {
            if (rowDelimiterLength !== 0) {
              // Do not emit comments which take a full line
              var skipCommentLine = commenting && this.state.record.length === 0 && this.state.field.length === 0;

              if (skipCommentLine) {
                // TODO: update the doc, a line with comment is considered an
                // empty line in the sense that no record is found inside
                this.info.empty_line_count++;
              } else {
                if (skip_empty_lines === true && this.state.wasQuoting === false && this.state.record.length === 0 && this.state.field.length === 0) {
                  this.info.empty_line_count++;
                  continue;
                }

                this.__onField();

                var _err2 = this.__onRow();

                if (_err2 !== undefined) return _err2;

                if (to !== -1 && this.info.records >= to) {
                  this.state.stop = true;
                  this.push(null);
                  return;
                }
              }

              this.state.commenting = commenting = false;
              pos += rowDelimiterLength - 1;
              continue;
            }

            if (commenting) {
              continue;
            }

            var commentCount = comment === null ? 0 : this.__compareBytes(comment, buf, pos, chr);

            if (commentCount !== 0) {
              this.state.commenting = commenting = true;
              continue;
            }

            var delimiterLength = this.__isDelimiter(chr, buf, pos);

            if (delimiterLength !== 0) {
              this.__onField();

              pos += delimiterLength - 1;
              continue;
            }
          }
        }

        if (commenting === false && max_record_size !== 0) {
          if (this.state.record_length + this.state.field.length > max_record_size) {
            var _err3 = this.error("Max Record Size: record exceed the maximum number of tolerated bytes of ".concat(max_record_size, " on line ").concat(this.info.lines));

            if (_err3 !== undefined) return _err3;
          }
        }

        var lappend = ltrim === false || this.state.quoting === true || this.state.field.length !== 0 || !this.__isCharTrimable(chr); // rtrim in non quoting is handle in __onField

        var rappend = rtrim === false || this.state.wasQuoting === false;

        if (lappend === true && rappend === true) {
          this.state.field.append(chr);
        } else if (rtrim === true && !this.__isCharTrimable(chr)) {
          var _err4 = this.error("Invalid Closing Quote: found non trimable byte after quote at line ".concat(this.info.lines));

          if (_err4 !== undefined) return _err4;
        }
      }

      if (wasRowDelimiter === true) {
        this.info.lines++;
        wasRowDelimiter = false;
      }

      if (end) {
        if (this.state.quoting === true) {
          var _err5 = this.error("Invalid Closing Quote: quote is not closed at line ".concat(this.info.lines));

          if (_err5 !== undefined) return _err5;
        } else {
          // Skip last line if it has no characters
          if (this.state.record.length !== 0 || this.state.field.length !== 0) {
            this.__onField();

            var _err6 = this.__onRow();

            if (_err6 !== undefined) return _err6;
          }
        }
      } else {
        this.state.previousBuf = buf.slice(pos);
      }
    }
  }, {
    key: "__isCharTrimable",
    value: function __isCharTrimable(chr) {
      return chr === space || chr === cr || chr === nl;
    }
  }, {
    key: "__onRow",
    value: function __onRow() {
      var _this$options2 = this.options,
          columns = _this$options2.columns,
          from = _this$options2.from,
          relax_column_count = _this$options2.relax_column_count,
          raw = _this$options2.raw,
          skip_lines_with_empty_values = _this$options2.skip_lines_with_empty_values;
      var record = this.state.record;
      var recordLength = record.length; // Validate column length

      if (columns === true && this.state.firstLineToHeaders) {
        return this.__firstLineToColumns(record);
      }

      if (columns === false && this.info.records === 0) {
        this.state.expectedRecordLength = recordLength;
      } else {
        if (relax_column_count === true) {
          if (recordLength !== this.state.expectedRecordLength) {
            this.info.skipped_line_count++;
          }
        } else if (recordLength !== this.state.expectedRecordLength) {
          if (columns === false) {
            var err = this.error("Invalid Record Length: expect ".concat(this.state.expectedRecordLength, ", got ").concat(recordLength, " on line ").concat(this.info.lines));
            if (err !== undefined) return err;
          } else {
            var _err7 = this.error("Invalid Record Length: header length is ".concat(columns.length, ", got ").concat(recordLength, " on line ").concat(this.info.lines));

            if (_err7 !== undefined) return _err7;
          }
        }
      }

      if (skip_lines_with_empty_values === true) {
        if (record.map(function (field) {
          return field.trim();
        }).join('') === '') {
          this.__resetRow();

          return;
        }
      }

      if (this.state.recordHasError === true) {
        this.__resetRow();

        this.state.recordHasError = false;
        return;
      }

      this.info.records++;

      if (from === 1 || this.info.records >= from) {
        if (columns !== false) {
          var obj = {};

          for (var i in record) {
            if (columns[i].disabled) continue;
            obj[columns[i].name] = record[i];
          }

          var objname = this.options.objname;

          if (objname === undefined) {
            if (raw === true) {
              this.push({
                raw: this.state.rawBuffer.toString(),
                record: obj
              });
            } else {
              this.push(obj);
            }
          } else {
            if (raw === true) {
              this.push({
                raw: this.state.rawBuffer.toString(),
                record: [obj[objname], obj]
              });
            } else {
              this.push([obj[objname], obj]);
            }
          }
        } else {
          if (raw === true) {
            this.push({
              raw: this.state.rawBuffer.toString(),
              record: record
            });
          } else {
            this.push(record);
          }
        }
      }

      this.__resetRow();
    }
  }, {
    key: "__firstLineToColumns",
    value: function __firstLineToColumns(record) {
      try {
        var headers = this.state.firstLineToHeaders.call(null, record);

        if (!Array.isArray(headers)) {
          return this.error("Invalid Header Mapping: expect an array, got ".concat(JSON.stringify(headers)));
        }

        normalizeColumnsArray(headers);
        this.state.expectedRecordLength = headers.length;
        this.options.columns = headers;

        this.__resetRow();

        return;
      } catch (err) {
        return err;
      }
    }
  }, {
    key: "__resetRow",
    value: function __resetRow() {
      if (this.options.raw === true) {
        this.state.rawBuffer.reset();
      }

      this.state.record = [];
      this.state.record_length = 0;
    }
  }, {
    key: "__onField",
    value: function __onField() {
      var _this$options3 = this.options,
          cast = _this$options3.cast,
          rtrim = _this$options3.rtrim;
      var wasQuoting = this.state.wasQuoting;
      var field = this.state.field.toString();

      if (rtrim === true && wasQuoting === false) {
        field = field.trimRight();
      }

      if (cast === true) {
        field = this.__cast(field);
      }

      this.state.record.push(field);
      this.state.field.reset();
      this.state.record_length += field.length;
      this.state.wasQuoting = false;
    }
  }, {
    key: "__cast",
    value: function __cast(field) {
      var context = {
        column: Array.isArray(this.options.columns) === true ? this.options.columns[this.state.record.length] : this.state.record.length,
        header: this.options.columns === true,
        index: this.state.record.length,
        quoting: this.state.wasQuoting,
        lines: this.info.lines,
        records: this.info.records,
        empty_line_count: this.info.empty_line_count,
        skipped_line_count: this.info.skipped_line_count
      };

      if (this.state.castField !== null) {
        return this.state.castField.call(null, field, context);
      }

      if (this.__isInt(field) === true) {
        return parseInt(field);
      } else if (this.__isFloat(field)) {
        return parseFloat(field);
      } else if (this.options.cast_date !== false) {
        return this.options.cast_date.call(null, field, context);
      }

      return field;
    }
  }, {
    key: "__isInt",
    value: function __isInt(value) {
      return /^(\-|\+)?([1-9]+[0-9]*)$/.test(value);
    }
  }, {
    key: "__isFloat",
    value: function __isFloat(value) {
      return value - parseFloat(value) + 1 >= 0; // Borrowed from jquery
    }
  }, {
    key: "__compareBytes",
    value: function __compareBytes(sourceBuf, targetBuf, pos, firtByte) {
      if (sourceBuf[0] !== firtByte) return 0;
      var sourceLength = sourceBuf.length;

      for (var i = 1; i < sourceLength; i++) {
        if (sourceBuf[i] !== targetBuf[pos + i]) return 0;
      }

      return sourceLength;
    }
  }, {
    key: "__needMoreData",
    value: function __needMoreData(i, bufLen, end) {
      if (end) {
        return false;
      }

      var _this$options4 = this.options,
          comment = _this$options4.comment,
          delimiter = _this$options4.delimiter,
          escape = _this$options4.escape;
      var _this$state2 = this.state,
          quoting = _this$state2.quoting,
          rowDelimiterMaxLength = _this$state2.rowDelimiterMaxLength;
      var numOfCharLeft = bufLen - i - 1;
      var requiredLength = Math.max( // Skip if the remaining buffer smaller than comment
      comment ? comment.length : 0, // Skip if the remaining buffer smaller than row delimiter
      rowDelimiterMaxLength, // Skip if the remaining buffer can be row delimiter following the closing quote
      // 1 is for quote.length
      quoting ? 1 + rowDelimiterMaxLength : 0, // Skip if the remaining buffer can be delimiter
      delimiter.length, // Skip if the remaining buffer can be escape sequence
      // 1 is for escape.length
      1);
      return numOfCharLeft < requiredLength;
    }
  }, {
    key: "__isDelimiter",
    value: function __isDelimiter(chr, buf, pos) {
      var delimiter = this.options.delimiter;
      var delLength = delimiter.length;
      if (delimiter[0] !== chr) return 0;

      for (var i = 1; i < delLength; i++) {
        if (delimiter[i] !== buf[pos + i]) return 0;
      }

      return delimiter.length;
    }
  }, {
    key: "__isRowDelimiter",
    value: function __isRowDelimiter(chr, buf, pos) {
      var rowDelimiter = this.options.rowDelimiter;
      var rowDelimiterLength = rowDelimiter.length;

      loop1: for (var i = 0; i < rowDelimiterLength; i++) {
        var rd = rowDelimiter[i];
        var rdLength = rd.length;

        if (rd[0] !== chr) {
          continue;
        }

        for (var j = 1; j < rdLength; j++) {
          if (rd[j] !== buf[pos + j]) {
            continue loop1;
          }
        }

        return rd.length;
      }

      return 0;
    }
  }, {
    key: "__autoDiscoverRowDelimiter",
    value: function __autoDiscoverRowDelimiter(buf, pos) {
      var chr = buf[pos];

      if (chr === cr) {
        if (buf[pos + 1] === nl) {
          this.options.rowDelimiter.push(Buffer.from('\r\n'));
          this.state.rowDelimiterMaxLength = 2;
          return 2;
        } else {
          this.options.rowDelimiter.push(Buffer.from('\r'));
          this.state.rowDelimiterMaxLength = 1;
          return 1;
        }
      } else if (chr === nl) {
        this.options.rowDelimiter.push(Buffer.from('\n'));
        this.state.rowDelimiterMaxLength = 1;
        return 1;
      }

      return 0;
    }
  }, {
    key: "error",
    value: function error(msg) {
      var skip_lines_with_error = this.options.skip_lines_with_error;
      var err = new Error(msg);

      if (skip_lines_with_error) {
        this.state.recordHasError = true;
        this.emit('skip', err);
        return undefined;
      } else {
        return err;
      }
    }
  }]);

  return Parser;
}(Transform);

var parse = function parse() {
  var data, options, callback;

  for (var i in arguments) {
    var argument = arguments[i];

    var type = _typeof(argument);

    if (data === undefined && (typeof argument === 'string' || Buffer.isBuffer(argument))) {
      data = argument;
    } else if (options === undefined && isObject(argument)) {
      options = argument;
    } else if (callback === undefined && type === 'function') {
      callback = argument;
    } else {
      throw new Error("Invalid argument: got ".concat(JSON.stringify(argument), " at index ").concat(i));
    }
  }

  var parser = new Parser(options);

  if (callback) {
    var records = options === undefined || options.objname === undefined ? [] : {};
    parser.on('readable', function () {
      var record;

      while (record = this.read()) {
        if (options === undefined || options.objname === undefined) {
          records.push(record);
        } else {
          records[record[0]] = record[1];
        }
      }
    });
    parser.on('error', function (err) {
      callback(err);
    });
    parser.on('end', function () {
      callback(null, records);
    });
  }

  if (data !== undefined) {
    parser.write(data);
    parser.end();
  }

  return parser;
};

parse.Parser = Parser;
module.exports = parse;

var isObject = function isObject(obj) {
  return _typeof(obj) === 'object' && obj !== null && !Array.isArray(obj);
};

var firstLineToHeadersDefault = function firstLineToHeadersDefault(record) {
  return record.map(function (field) {
    return {
      header: field,
      name: field
    };
  });
};

var normalizeColumnsArray = function normalizeColumnsArray(columns) {
  for (var i = 0; i < columns.length; i++) {
    var column = columns[i];

    if (column === undefined || column === null || column === false) {
      columns[i] = {
        disabled: true
      };
    } else if (typeof column === 'string') {
      columns[i] = {
        name: column
      };
    } else if (isObject(column)) {
      if (typeof column.name !== 'string') {
        throw new Error("Invalid Option columns: property \"name\" is required at position ".concat(i));
      }

      columns[i] = column;
    } else {
      throw new Error("Invalid Option columns: expect a string or an object, got ".concat(JSON.stringify(column), " at position ").concat(i));
    }
  }
};