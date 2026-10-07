const tw = require('tailwindcss');
const fs = require('fs');

const config = require('./tailwind.config.cjs');
const input = fs.readFileSync('tailwind.input.css', 'utf8');

tw(config)
  .then(twPlugin => {
    return twPlugin.process(input, { from: 'tailwind.input.css' });
  })
  .then(result => {
    fs.writeFileSync('app.css', result.css);
    console.log('CSS built successfully');
  })
  .catch(err => {
    console.error('Error building CSS:', err);
    process.exit(1);
  });