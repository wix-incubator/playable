import htmlToElement from './htmlToElement';

describe('htmlToElement', () => {
  it('should create dom element from given string with HTML', () => {
    const html = '<div>TEST</div>';
    const element = htmlToElement(html);

    expect(element.constructor).toBe(HTMLDivElement);
  });

  it('should throw error if provided HTML is empty', () => {
    const html = '';

    expect(() => htmlToElement(html)).toThrow();
  });

  it("should throw error if provided HTML doesn't have root element", () => {
    const html = '<span>asd</span><span>asd</span>';

    expect(() => htmlToElement(html)).toThrow();
  });
});
