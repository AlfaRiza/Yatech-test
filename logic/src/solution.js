const solution = {
  pair: (a, m, k) => { // a = array of integers, m = integer, k = integer
    if (a.length < m) {
      return 0
    }
    let result = 0;
    for (let i = 0; i < a.length - (m - 1); i++) {
      const batas = m - 1 + i;
      const selectedArray = a.filter((_, index) => index <= batas && index >= i);
      for (let j = 0; j < selectedArray.length - 1; j++) {
        for (let l = j; l < selectedArray.length - 1; l++) {
          if (selectedArray[j] + selectedArray[l + 1] === k) {
            result += 1;
          }
        }
      }
    }
    return result;
  }
}

module.exports = solution
