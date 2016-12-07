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
