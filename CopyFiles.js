let fs = require('fs');
let path = require('path');

class CopyFiles {
  constructor() {

  }

  copy(from, to) {
    

    for (let c = 0; c < from.length; c++) {
      let src = from[c];
      let dest = to[c];

      console.log("Copying '%s' to '%s'.", src, dest);
      fs.copyFileSync(src, dest);
    }

    return true;
  }
}

module.exports = CopyFiles;