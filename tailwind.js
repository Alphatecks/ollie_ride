import { create } from 'twrnc';

// create the customized version...
const tw = create(require('./tailwind.config.js')); // <- using relative path

// ... and then this becomes the main function your app uses
export default tw;
