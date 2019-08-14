class Encoder {
  constructor(urlShortener = null) {
    this.URL_SHORTENER = urlShortener || 'https://cgrco.de/';

    this.numericTable = {
      none: '00',
      0: '01',
      1: '02',
      2: '03',
      3: '10',
      4: '11',
      5: '12',
      6: '13',
      7: '20',
      8: '21',
      9: '22',
      '+': '23',
      '-': '30',
      '.': '31',
      '/': '32',
      '_': '33'
    }

    this.alphaNumericTable = {
      0: '000',
      1: '001',
      2: '002',
      3: '003',
      4: '010',
      5: '011',
      6: '012',
      7: '013',
      '.': '020',
      8: '021',
      9: '022',
      a: '023',
      b: '030',
      c: '031',
      d: '032',
      e: '033',
      f: '100',
      g: '101',
      h: '102',
      i: '103',
      j: '110',
      k: '111',
      l: '112',
      m: '113',
      n: '120',
      o: '121',
      p: '122',
      q: '123',
      r: '130',
      s: '131',
      t: '132',
      u: '133',
      v: '200',
      w: '201',
      x: '202',
      y: '203',
      z: '210',
      A: '211',
      B: '212',
      C: '213',
      D: '220',
      E: '221',
      F: '222',
      G: '223',
      H: '230',
      I: '231',
      J: '232',
      K: '233',
      L: '300',
      M: '301',
      N: '302',
      O: '303',
      P: '310',
      Q: '311',
      R: '312',
      S: '313',
      T: '320',
      U: '321',
      V: '322',
      W: '323',
      X: '330',
      Y: '331',
      Z: '332',
      '/': '333'
    }
  }

  setUrlShortener(urlShortener) {
    this.URL_SHORTENER = urlShortener;
  } 

  encode(data) {
    let { type, parsedData } = this._getCodeType(data);
    
    const textKind = this._getTextKind(parsedData);

    const codeString = '4' + type + textKind + this._textToNumber(parsedData, textKind);
    return codeString
  }

  _getCodeType(data) {
    if (data.toLowerCase().startsWith(this.URL_SHORTENER)) {
      return { type: '3', parsedData: data.substr(this.URL_SHORTENER.length) };
    }

    if (data.toLowerCase().startsWith('http://')) {
      return { type: '1', parsedData: data.substr(7) };
    }

    if (data.toLowerCase().startsWith('https://')) {
      return { type: '2', parsedData: data.substr(8) };
    }

    return { type: '0', parsedData: data };
  }

  _getTextKind(data) {
    if (data.match(/^[0-9]+$/g)) {
      return '0';
    }
    
    if (data.match(/^[0-9a-zA-Z\./]+$/g)) {
      return '1';
    }

    if (/[^\u0000-\u00ff]/.test(data)) { //Neste caso contém unicode
      return '3';
    }

    return '2';
  }

  _textToNumber(text, encoding) {
    let returnString = '';
    text = this._pad(text, encoding);
    if (encoding === '0') {
      for (let char of text) {
        returnString += this.numericTable[char];
      }
    } else if (encoding === '1') {
      for (let char of text) {
        returnString += this.alphaNumericTable[char];
      }
    } else {
      return text.split('').map((char) => '00'.concat(char.charCodeAt(0).toString(4)).slice(-6)).join('');
    }

    return returnString;
  }

  _pad(text, encoding) {
    let pad = '';
    if (encoding === '0') {
      pad = '000000000000000';
    } else if (encoding === '1') {
      pad = '..........';
    } else {
      pad = '....';
    }

    return pad.substr(0, pad.length - text.length) + text;
  }
}

exports.Encoder = Encoder;
