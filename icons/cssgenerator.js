const fs = require('fs');
const sass = require('sass');
const { parse, stringify } = require('scss-parser')
const createQueryWrapper = require('query-ast')

const css = (name, color, isDark) => {
  let eachClass = `
    $icon-${name}-color: ${color}"
  `
}

let ast = parse(fs.readFileSync('./style.scss').toString())
let $ = createQueryWrapper(ast);

console.dir($('rule').eq(1222).nodes[0])
// console.log($)
$('icon-gatsby').eq(1).remove()
let scss = stringify($().get(0))
// console.log(scss)
