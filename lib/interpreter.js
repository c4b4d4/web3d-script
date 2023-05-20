import Base from '../utils/base.js';
import Messenger from './messenger.js';

class Interpreter extends Base
{
	attach(){
		Messenger.ready();
	}
	_postconstructor(data){
			
	}
}

export default Interpreter;