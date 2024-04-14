let prepend = 'SA';
let append = 'VIA';
// for (var i =65; i < 91; i++)
// {
//   let left = String.fromCharCode(i)
//   let right = ''
//   sleep(2000)
//   for (let j = 65;j < 91; j++) {
//   sleep(2000)
//   right = String.fromCharCode(j)
//   console.log(`${prepend}${left}${right}${append}`);
//   }
// }

async function iter() {
  for (var i =65; i < 91; i++)
  {
    let left = String.fromCharCode(i)
    let right = ''
    console.log(`${prepend}${left}${append}`);

    // console.log()
    // for (let j = 65;j < 91; j++) {
    //   await sleep(500)
    //   right = String.fromCharCode(j)
    //   console.log(`${prepend}${left}${right}${append}`);
    // }
    await sleep(300)
  }
}
iter()
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function iterate() {
  for (let j = 65;j < 91; j++) {
    let right = String.fromCharCode(i)
  }
}
