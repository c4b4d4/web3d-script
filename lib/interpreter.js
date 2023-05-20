import Base from '../utils/base.js';

class InterpreterService extends Base
{
	status = 0;
	_postconstructor(data){
		
	}
	
	loaded(){
		
		await waitFor(()=>iframe.contentWindow && iframe.contentWindow.postMessage);
		iframe.contentWindow.postMessage({html:config.html}, "https://dev.3.land");
		
		ifr.postMessage({dispatch:{event:"load", data:{hello:"world"}}))
	}
	
	async init(){
		const ifr = document.createElement("iframe");
		ifr.onload = this.loaded()
		ifr.setAttribute("class","interpreter_script");
		ifr.id = this.id;
		ifr.setAttribute("allowfullscreen", "allowfullscreen");
		ifr.setAttribute("allow", "accelerometer;  autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture");
		ifr.setAttribute("sandbox","allow-forms allow-modals allow-scripts allow-pointer-lock allow-popups");
		ifr.setAttribute("scrolling", "yes");
		ifr.setAttribute("frameborder", "0");
		ifr.setAttribute("title", "script");
		document.body.appendChild(ifr);
		
	}
}

export default Interpreter;