process.stdin.setEncoding('utf8');
process.stdin.on('readable', function(){
    let chunk = process.stdin.read();
    if (chunk !== null) {
        chunk = chunk.trim();
        const hex = textToHex(chunk);
        console.log(`${chunk} | ${hex}`);
    }
});
const textToHex = str => {
    let hex = "";
    for(let i = 0; i < str.length; ++i) {
        hex += ` ${str.charCodeAt(i).toString(16)}`;
    }
    return hex.trim();
};