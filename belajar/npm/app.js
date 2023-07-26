//docs
//https://nodejs.org/docs/latest-v16.x/api/readline.html
//https://www.npmjs.com

const validator = require('validator');

// validator
console.log(validator.isEmail('daffa@gmail.com'));
console.log(validator.isMobilePhone('081234567', 'id-ID'));
console.log(validator.isNumeric('12345678'));

// chalk
const chalk = require('chalk');
const log = console.log;
log(chalk.blue('Hello') + ' World' + chalk.red('!'));
log(`
${chalk.bgWhite.red('CPU: 90%')}
RAM: ${chalk.green('40%')}
DISK: ${chalk.yellow('70%')}
`);
log(chalk`test {bgRed.black.bold siramet}`);