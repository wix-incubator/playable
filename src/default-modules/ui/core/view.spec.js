import { expect } from 'chai';
import classnames from 'classnames';

import View from './view';


describe('View', () => {
  let view;

  beforeEach(() => {
    view = new View();
  });

  afterEach(() => {
    View.resetStyles();
  });

  it('instance should have method for getting styles', () => {
    expect(view.styleNames).to.be.deep.equal({});
  });

  it('should have method for extending styles', () => {
    const styleNames = {
      name: 'value'
    };
    View.extendStyleNames(styleNames);
    expect(view.styleNames).to.be.deep.equal(styleNames);
  });

  it('method for extending styles should merge styleNames for same style', () => {
    const styleNames1 = {
      name: 'value1'
    };

    const styleNames2 = {
      name: 'value2'
    };

    View.extendStyleNames(styleNames1);
    View.extendStyleNames(styleNames2);
    expect(view.styleNames).to.be.deep.equal({
      name: classnames(styleNames1.name, styleNames2.name)
    });
  })
});
