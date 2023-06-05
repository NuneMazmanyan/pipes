import fs from 'fs';
import {Transform} from 'stream';

function pipe() {
    const fileStream = fs.createReadStream( process.argv[2].toString());
    const transformedData = fs.createWriteStream(process.argv[3].toString());
    let hasError = false;

    if(process.argv.length!== 5){
        console.log('The function requires 3 arguments');
        console.log('It should look like this: inputFilePath, outputFilePath, pipeName')
        transformedData.end();
        return;
    }

    fileStream.on('error',(err)=>{
        console.log(err.message);
        hasError = true;
        transformedData.end();
        return;
    });

    const transformStream = new Transform({
        transform(chunk) {
            if (hasError) {
                return;
            }
            switch (process.argv[4].toString()) {
                case 'uppercase':
                    chunk = chunk.toString().toUpperCase();
                    break;
                case 'lowercase':
                    chunk = chunk.toString().toLowerCase();
                    break;
                case 'reverse':
                    chunk = chunk.toString().split('').reverse().join('');
                    break;
                case 'title-case': {
                    chunk = chunk.toString().toLowerCase().split(' ').map(word => {
                        return (word.charAt(0).toUpperCase() + word.slice(1));
                    }).join(' ');
                }
                    break;
                case 'camelcase':
                    chunk = chunk.toString().split(' ').map(word => {
                        return (word.charAt(0).toUpperCase() + word.slice(1))
                    }).join('');
                    break;
                default:{
                    console.log('There is no such pipe');
                    return;
                }
            }
            transformedData.write(chunk);
        }
    });

    fileStream.pipe(transformStream).pipe(transformedData);
}

pipe()