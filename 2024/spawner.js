const { spawn } = require('child_process');

// Define the total number of chunks
const totalChunks = 114;

// Define the range for each chunk
const chunkSize = Math.ceil(114 / totalChunks);


// Define ANSI color codes
const colors = {
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    underscore: '\x1b[4m',
    blink: '\x1b[5m',
    magenta: '\x1b[35m',
    reverse: '\x1b[7m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    magenta: '\x1b[35m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    bgBlack: '\x1b[40m',
    bgRed: '\x1b[41m',
    bgGreen: '\x1b[42m',
    bgYellow: '\x1b[43m',
    bgBlue: '\x1b[44m',
    bgMagenta: '\x1b[45m',
    bgCyan: '\x1b[46m',
    bgWhite: '\x1b[47m',
    hidden: '\x1b[8m',
    black: '\x1b[30m',
    reset: '\x1b[0m',
};

// Example usage
console.log(`${colors.red}This is red text.${colors.reset}`);
console.info(`${colors.green}This is green text.${colors.reset}`);


// console.log(chunkSize);
// Function to spawn child processes
function spawnChildProcesses() {
    let start = 1;
    let end = chunkSize;

    for (let i = 1; i <= totalChunks; i++) {
        // Spawn a child process
        const child = spawn('node', ['./2024/populate_audio_wbw.js', `Worker#${i}  : `, start, end]);

        const colorValues = Object.values(colors)

        // Log stdout and stderr of child process
        child.stdout.on('data', (data) => {
            console.log(`${colorValues[1]}${data}.${colors.reset}`);
            // if(i === 4) {
            //     console.log(`${colors.green}${data}.${colors.reset}`);
            // }
        });

        child.stderr.on('data', (data) => {
            console.error(`E-${data}`);
        });

        // Calculate start and end for the next chunk
        start = end + 1;
        end = Math.min(end + chunkSize, 114);
    }
}

// Call the function to spawn child processes
spawnChildProcesses();