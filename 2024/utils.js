const fs = require('fs');

function getFileSize(filePath) {
    try {
        // Get the file stats
        const stats = fs.statSync(filePath);
        // Return the size of the file in bytes
        return stats.size;
    } catch (err) {
        // Handle file not found or other errors
        console.error('Error getting file size:', err);
        return 0; // Return 0 if file not found or error occurred
    }
}

// Function to get file size in kilobytes (kB)
function getFileSizeInKB(filePath) {
    try {
        // Get the file stats
        const stats = fs.statSync(filePath);
        // Return the size of the file in kilobytes (rounded to two decimal places)
        return (stats.size / 1024).toFixed(2);
    } catch (err) {
        // Handle file not found or other errors
        console.error('Error getting file size:', err);
        return 0; // Return 0 if file not found or error occurred
    }
}


// Calculate the difference in file size and percentage saved
function calculateFileSizeDifference(file1Path, file2Path) {
    const fileSize1KB = getFileSizeInKB(file1Path);
    const fileSize2KB = getFileSizeInKB(file2Path);
    const sizeDifference = fileSize1KB - fileSize2KB;
    const percentageSaved = (sizeDifference / fileSize1KB) * 100;
    return { sizeDifference, percentageSaved };
}


function calculate(length, input, output) {
let totalPercentageSaved = 0;
let totalBytesSaved = 0;
let totalMBSaved = 0;
let totalKBSaved = 0;
for (let i = 1; i <= length; i++) {
    const diff = calculateFileSizeDifference(input(i), output(i))
    console.log(`File ${i} has a difference of ${diff.sizeDifference.toFixed(2)} KB, saved ${ diff.percentageSaved.toFixed(2) }%`)
    totalPercentageSaved += diff.percentageSaved;
    totalKBSaved += diff.sizeDifference;
}

const averagePercentageSaved = totalPercentageSaved / 30;

console.log(`Total KB saved: ${totalKBSaved.toFixed(2)} KB`)
console.log(`Total MB saved: ${(totalKBSaved / 1024).toFixed(2)} MB`)
console.log(`Total percentage saved: ${totalPercentageSaved.toFixed(2)}%`)
console.log(`Total avg percentage saved: ${averagePercentageSaved.toFixed(2)}%`)

}


module.exports = {
    getFileSize,
    getFileSizeInKB,
    calculateFileSizeDifference,
    calculate
};