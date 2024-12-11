const fs = require('fs');
const { Buffer } = require('buffer'); 

function base64ToImage(base64String, outputFilePath) {
    const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');

    const imageBuffer = Buffer.from(base64Data, 'base64');

    fs.writeFile(outputFilePath, imageBuffer, (err) => {
        if (err) {
            console.error('Error writing image file:', err);
        } else {
            console.log(`Image saved to ${outputFilePath}`);
        }
    });
}

const base64String = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==';
const outputFilePath = 'output-image.png';

base64ToImage(base64String, outputFilePath);
