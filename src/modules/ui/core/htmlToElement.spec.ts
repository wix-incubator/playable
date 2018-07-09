import { expect } from 'chai';

import htmlToElement from './htmlToElement';

describe('htmlToElement', () => {
  it('should create dom element from given string with HTML', () => {
    const html = '<div>TEST</div>';
    const element = htmlToElement(html);

    expect(element.constructor).to.be.equal(HTMLDivElement);
  });

  it('should throw error if provided HTML is empty', () => {
    const html = '';

    expect(() => htmlToElement(html)).to.throw();
  });

  it("should throw error if provided HTML doesn't have root element", () => {
    const html = '<span>asd</span><span>asd</span>';

    expect(() => htmlToElement(html)).to.throw();
  });
});
