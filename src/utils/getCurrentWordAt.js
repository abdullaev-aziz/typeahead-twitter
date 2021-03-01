export const getCurrentWordAt = (cursorPosition, text) => {
  const nullObj = {
    currentWord: '',
    startPos: 0,
    endPos: 0
  }
    //get right part of the word
    try{
      const rightPart = getRightPartWord(cursorPosition, text);
      const leftPart = getLeftPartWord(cursorPosition, text);
      const startPos = (cursorPosition-leftPart.length)
      const endPos = (cursorPosition+rightPart.length);
      const selectedWord = leftPart + rightPart;
      if (text[cursorPosition] === " ") {
        return {currentWord:leftPart, startPos, endPos:cursorPosition}
      }
      return {currentWord:selectedWord, startPos, endPos};

    }
    catch(err) {
      return nullObj
    }
  }

  function getLeftPartWord(pos, str) {
    let savedPos = pos - 1;
    let leftPart = "";
    while (savedPos >= 0 && str[savedPos] !== " ") {
      leftPart = str[savedPos] + leftPart;
      savedPos--;
    }
    return leftPart;
  }
  
  function getRightPartWord(pos, str) {
    try{
      const rightSpacePos = str.indexOf(" ", pos);
      let rightPart;
      if (rightSpacePos === -1) {
        rightPart = str.slice(pos);
      } else {
        rightPart = str.slice(pos, rightSpacePos);
      }
      return rightPart;

    }
    catch(err) {
      return ''
    }
  }
  