'use strict';

describe('mdc-ripple', () => {
  let MockRipple;

  beforeEach(angular.mock.module('mdc'));
  beforeEach(angular.mock.module('ngMockComponent'));

  beforeEach(inject(($componentGenerator) => {
    MockRipple = $componentGenerator('mdcRipple');
  }));

  it('should have the `mdc-ripple-surface` class', () => {
    const component = new MockRipple();
    const elem = component.$element;

    expect(elem.hasClass('mdc-ripple-surface'), 'missing class mdc-ripple-surface').to.be.true;
  });
});
