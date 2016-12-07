import test from 'ava';

import resource from '../index';

test('Returns a valid simple URL', t => {
  const input = '/path/to/resource';
  const output = '/path/to/resource';

  t.is(resource(input), output);
});

test('Returns a URL with all params', t => {
  const input = '/path/:param1/resource/:param2';
  const inputParams = {
    param1: 'one',
    param2: '123',
  };
  const output = '/path/one/resource/123';

  t.is(resource(input, inputParams), output);
});

test('Returns a URL with some params', t => {
  const input = '/path/:param1/resource/:param2';
  const inputParams = {
    param1: 'one',
  };
  const output = '/path/one/resource';

  t.is(resource(input, inputParams), output);
});

test('Returns a URL with no params', t => {
  const input = '/path';
  const inputParams = { };
  const output = '/path';

  t.is(resource(input, inputParams), output);
});

test('Not allow "hasOwnProperty" as param', t => {
  const input = '/path/:hasOwnProperty';

  try {
    resource(input);
    t.fail('Should have thrown an exception');
  } catch (e) {
    t.is(e.message, 'badname');
    t.pass();
  }
});

test('Returns full URL', t => {
  const input = 'https://example.com/path/:id/end';
  const inputParams = {
    id: 123,
  };
  const output = 'https://example.com/path/123/end';

  t.is(resource(input, inputParams), output);
});

test('Returns full IPv6 URL', t => {
  const input = 'http://[2001:db8:1f70::999:de8:7648:6e8]:100/path/:id/end';
  const inputParams = {
    id: 123,
  };
  const output = 'http://[2001:db8:1f70::999:de8:7648:6e8]:100/path/123/end';

  t.is(resource(input, inputParams), output);
});

test('Returns query parameters', t => {
  const input = '/path?id=:id&another=:two&third=hello';
  const inputParams = {
    id: 123,
    two: 'something',
  };
  const output = '/path?id=123&another=something&third=hello';

  t.is(resource(input, inputParams), output);
});

test('Remove trailing slash', t => {
  const input = '/path/to/:resource/something';
  const output = '/path/to/something';

  t.is(resource(input), output);
});
