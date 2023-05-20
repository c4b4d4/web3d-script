export default class Base
{	
	
	constructor(data){
		this.killed = false;
		this.listeners = {};
		this.timers = {};
		this.timerGroups = {};
		this.id = (data && data.id) ? data.id : guid()+"-"+guid()+"-"+guid();
		this._postconstructor.bind(this)(data,this);
	}
	
	emit(type,...data){
		
		if(!data){
			data = false;
		}
		let regresos = [];
		if(this.listeners[type]){
			for(const machine in this.listeners[type]){
				for(const id in this.listeners[type][machine]){
					
					const bb = this.listeners[type][machine][id].cb(...data);
					regresos.push(bb);
					if(bb && bb.stopPropagation){
						return regresos;
					}
				}
			}
		}
		return regresos;
	}

	interval(id,cb,tm){ //Attach an interval to the entity (id:string, cb:function, interval_time:number)

		if(this.timers[id.id]){
			this.timers[id.id].destroy();
		}
		
		if(!tm || typeof id == "string" || (id.id || id.group)){
			if(!tm){
				tm = cb;
				cb = id;
				id = {};
			}
			if(typeof id =="string") id = {id};
			if(!id.id) id.id = guid();
			if(!id.group) id.group = "general";
		}
		
		let timero = setInterval(cb,tm)
		if(!this.timerGroups[id.group]) this.timerGroups[id.group] = {};
		this.timerGroups[id.group][id.id] = true;
		this.timers[id.id] = {group: id.group, timer:timero, destroy:()=>{
			clearInterval(timero);
			if(this.timerGroups[id.group]){
				delete this.timerGroups[id.group][id.id];
				if(Object.keys(this.timerGroups[id.group]).length==0){
					delete this.timerGroups[id.group];
				}
			}
		}}

		return this.timers[id.id];
	}
	
	async attach(ref,type,id,cb,ignoreAtt){
		
		if(!ignoreAtt){
			ignoreAtt = 0;
		}
		
		
		if(ref.holder && ref.holder.attach) ref = ref.holder;

		if(typeof id == 'function'){
			cb = id;
			id = guid();	
		}
		
		
		let parentId = ref.id;
		
		
		if(!this.listeners[type]) this.listeners[type] = {};
		if(!this.listeners[type][parentId]) this.listeners[type][parentId] = {};
		this.listeners[type][parentId][id] = {instance:ref,cb};
		
		if(ignoreAtt<2){
			await ref.attach(this,"kill","defaultkill_"+this.id+"_"+type+"_"+id,()=>{
				this.deattach(ref,type,id,true);
			},(ignoreAtt+1))
		}
		
		await this._attached(type,ref);
		
		return {deattach:()=>{
			this.deattach(ref,type,id);
		}}
	}

	

	
	async deattach(ref,type,id,ignore){
		if(!id){
			
			return;
		}
		
		if(ref.holder && ref.holder.attach) ref = ref.holder;
		let parentId = ref.id;
		
		
		if(this.listeners[type] && this.listeners[type][parentId] && this.listeners[type][parentId][id]){
			
			this.listeners[type][parentId][id] = false;
			delete this.listeners[type][parentId][id];
			if(Object.keys(this.listeners[type][parentId]).length==0){
				this.listeners[type][parentId] = false;
				delete this.listeners[type][parentId];	
			}
			if(Object.keys(this.listeners[type]).length==0){
				this.listeners[type] = false;
				delete this.listeners[type];
			}
		}
		
		if(!ignore){
			await ref.deattach(this,"kill","defaultkill_"+this.id+"_"+type+"_"+id,true);
		}
		
		await this._deattached(type,ref);
	}
	
	kill(){
		if(this.killed) return;
		if(this._kill) this._kill();
		this.killed = true;

		for(const tm in this.timers){
			this.timers[tm].destroy();
		}

		for(const type in this.listeners){
			for(const machine in this.listeners[type]){
				for(const id in this.listeners[type][machine]){
					if(type=="kill"){
						this.listeners[type][machine][id].cb();
					}
					
					const ref = this.listeners[type][machine][id];
					if(ref && ref.instance){
						ref.instance.deattach(this,"kill",this.id+"_"+type+"_"+id);
					}
					
				}
			}
		}
		
		this.listeners = {};
	}
	
	async _attached(type,ref){
		
	}
	
	async _deattached(type,ref){
		
	}
	
	_kill(){
		
	}
	
	_postconstructor(data){
		
	}
}