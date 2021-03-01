import {getCurrentWordAt} from '../getCurrentWordAt'

test('returns current word obj with start and end cursor position', () => {

    const twit = 'hello there @google'
    const cursorPosition = 4;
    const expectedWordObj = {
        currentWord: 'hello',
        startPos: 0,
        endPos: 5
    }
    expect(getCurrentWordAt(cursorPosition, twit)).toStrictEqual(expectedWordObj);
  });