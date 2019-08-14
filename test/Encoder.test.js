const { Encoder } = require('../src/Encoder');

test('sets url shortener link', () => {
  const encoder = new Encoder('https://cgreinhold.com/');
  expect(encoder.URL_SHORTENER).toBe('https://cgreinhold.com/');
  encoder.setUrlShortener('https://test.com/');
  expect(encoder.URL_SHORTENER).toBe('https://test.com/');
  encoder.setUrlShortener(undefined);
  expect(encoder.URL_SHORTENER).toBe(undefined);
})

test('gets code type correctly', () => {
  const encoder = new Encoder('https://cgreinhold.com/');
  expect(encoder._getCodeType('teste123')).toEqual({ type: '0', parsedData: 'teste123' });
  expect(encoder._getCodeType('teste+::>')).toEqual({ type: '0', parsedData: 'teste+::>' });
  expect(encoder._getCodeType('http://localhost:3000/')).toEqual({ type: '1', parsedData: 'localhost:3000/' });
  expect(encoder._getCodeType('https://mail.google.com/mail/')).toEqual({ type: '2', parsedData: 'mail.google.com/mail/' });
  expect(encoder._getCodeType('https://app.slack.com/client/T0SBCV4LT/C0SCM9SB0')).toEqual({ type: '2', parsedData: 'app.slack.com/client/T0SBCV4LT/C0SCM9SB0' });
  expect(encoder._getCodeType('https://cgreinhold.com/dsdKSJDsh')).toEqual({ type: '3', parsedData: 'dsdKSJDsh' });
  expect(encoder._getCodeType('http://cgreinhold.com/341d4cg4rgb1sh')).toEqual({ type: '1', parsedData: 'cgreinhold.com/341d4cg4rgb1sh' });
  encoder.setUrlShortener(undefined);
  expect(encoder._getCodeType('https://cgreinhold.com/dsdKSJDsh')).toEqual({ type: '2', parsedData: 'cgreinhold.com/dsdKSJDsh' });
});

test('gets text kind correctly', () => {
  const encoder = new Encoder();
  expect(encoder._getTextKind('432914078')).toBe('0');
  expect(encoder._getTextKind('11111111111')).toBe('0');
  expect(encoder._getTextKind('0')).toBe('0');
  expect(encoder._getTextKind('teste123SD')).toBe('1');
  expect(encoder._getTextKind('test')).toBe('1');
  expect(encoder._getTextKind('teste+::>')).toBe('2');
  expect(encoder._getTextKind('localhost/test')).toBe('1');
  expect(encoder._getTextKind('localhost:3000/#top')).toBe('2');
  expect(encoder._getTextKind('localhost:3000/first-page')).toBe('2');
  expect(encoder._getTextKind('mail.google.com/mail/')).toBe('1');
  expect(encoder._getTextKind('app.slack.com/client/T0SBCV4LT/C0SCM9SB0')).toBe('1');
  expect(encoder._getTextKind('cgreinhold.com/dsdKSJDsh')).toBe('1');
  expect(encoder._getTextKind('cgreinhold.com/341d4cg4rgb1sh')).toBe('1');
  expect(encoder._getTextKind('cgreinhold.com/dsdKSJDsh')).toBe('1');
  expect(encoder._getTextKind('testΔ')).toBe('3');
  expect(encoder._getTextKind('цПіϲое')).toBe('3');
});

test('adds pad correctly', () => {
  const encoder = new Encoder();
  expect(encoder._pad('123', '0')).toBe('000000000000123');
  expect(encoder._pad('654624231', '0')).toBe('000000654624231');
  expect(encoder._pad('12342134123432143432', '0')).toBe('12342134123432143432');
  expect(encoder._pad('test', '1')).toBe('......test');
  expect(encoder._pad('teste123SD', '1')).toBe('teste123SD');
  expect(encoder._pad('localhost/test', '2')).toBe('localhost/test');
  expect(encoder._pad(':)', '2')).toBe('..:)');
  expect(encoder._pad('teste+::>', '2')).toBe('teste+::>');
  expect(encoder._pad('localhost:3000/#top', '2')).toBe('localhost:3000/#top');
  expect(encoder._pad('localhost:3000/first-page', '2')).toBe('localhost:3000/first-page');
  expect(encoder._pad('testΔ', '3')).toBe('testΔ');
  expect(encoder._pad('цПіϲое', '3')).toBe('цПіϲое');
});

test('converts text to numbers', () => {
  const encoder = new Encoder();
  expect(encoder._textToNumber('123', '0')).toBe('010101010101010101010101020310');
  expect(encoder._textToNumber('654624231', '0')).toBe('010101010101131211130311031002');
  expect(encoder._textToNumber('12342134123432143432', '0')).toBe('0203101103021011020310111003021110111003');
  expect(encoder._textToNumber('test', '1')).toBe('020020020020020020132033131132');
  expect(encoder._textToNumber('teste123SD', '1')).toBe('132033131132033001002003313220');
  expect(encoder._textToNumber('localhost/test', '1')).toBe('112121031023112102121131132333132033131132');
  expect(encoder._textToNumber(':)', '2')).toBe('00232002320032200221');
  expect(encoder._textToNumber('teste+::>', '2')).toBe('00131000121100130300131000121100223003220032200332');
  expect(encoder._textToNumber('localhost:3000/#top', '2')).toBe('00123000123300120300120100123000122000123300130300131000322003030030000300003000023300203001310001233001300');
  expect(encoder._textToNumber('localhost:3000/first-page', '2')).toBe('00123000123300120300120100123000122000123300130300131000322003030030000300003000023300121200122100130200130300131000231001300001201001213001211');
  expect(encoder._textToNumber('testΔ', '3')).toBe('001310001211001303001310032110');
  expect(encoder._textToNumber('цПіϲое', '3')).toBe('101012100133101112033302100332100311');
});

test('encodes text', () => {
  const encoder = new Encoder('https://cgreinhold.com');
  expect(encoder.encode('CGRCode')).toBe('401020020020213223312213121032033');
  expect(encoder.encode('123')).toBe('400010101010101010101010101020310');
  expect(encoder.encode('654624231')).toBe('400010101010101131211130311031002');
  expect(encoder.encode('12342134123432143432')).toBe('4000203101103021011020310111003021110111003');
  expect(encoder.encode('test')).toBe('401020020020020020020132033131132');
  expect(encoder.encode('teste123SD')).toBe('401132033131132033001002003313220');
  expect(encoder.encode('http://localhost/test')).toBe('411112121031023112102121131132333132033131132');
  expect(encoder.encode(':)')).toBe('40200232002320032200221');
  expect(encoder.encode('teste+::>')).toBe('40200131000121100130300131000121100223003220032200332');
  expect(encoder.encode('http://localhost:3000/#top')).toBe('41200123000123300120300120100123000122000123300130300131000322003030030000300003000023300203001310001233001300');
  expect(encoder.encode('http://localhost:3000/first-page')).toBe('41200123000123300120300120100123000122000123300130300131000322003030030000300003000023300121200122100130200130300131000231001300001201001213001211');
  expect(encoder.encode('testΔ')).toBe('403001310001211001303001310032110');
  expect(encoder.encode('цПіϲое')).toBe('403101012100133101112033302100332100311');
  expect(encoder.encode('https://mail.google.com/mail/')).toBe('421113023103112020101121121101112033020031121113333113023103112333');
  expect(encoder.encode('https://app.slack.com/client/T0SBCV4LT/C0SCM9SB0')).toBe('421023122122020131112023031111020031121113333031112103033120132333320000313212213322010300320333213000313213301022313212000');
  expect(encoder.encode('https://cgreinhold.com/dsdKSJDsh')).toBe('431333032131032233313232220131102');
  expect(encoder.encode('https://cgreinhold.com/dsdKSJDsh+test')).toBe('4320023300121000130300121000102300110300102200101000130300122000223001310001211001303001310');
  
});
