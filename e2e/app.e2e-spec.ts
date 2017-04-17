import { Bitirmeprojesi2dataminingPage } from './app.po';

describe('bitirmeprojesi2datamining App', () => {
  let page: Bitirmeprojesi2dataminingPage;

  beforeEach(() => {
    page = new Bitirmeprojesi2dataminingPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
