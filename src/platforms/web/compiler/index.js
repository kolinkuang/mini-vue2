import {baseOptions} from './options.js'
import {createCompiler} from '../../../compiler/'

const {compileToFunctions} = createCompiler(baseOptions)
export {compileToFunctions}
