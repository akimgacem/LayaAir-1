import { Laya3D } from "Laya3D"
import { Laya } from "Laya";
import { AnimationTransform3D } from "laya/d3/animation/AnimationTransform3D"
	import { Sprite3D } from "laya/d3/core/Sprite3D"
	import { Transform3D } from "laya/d3/core/Transform3D"
	import { Stage } from "laya/display/Stage"
	import { Event } from "laya/events/Event"
	import { Browser } from "laya/utils/Browser"
	import { Stat } from "laya/utils/Stat"
	
	/**
	 * ...
	 * @author ...
	 */
	export class MemoryTest {
		 count:number = 200000;
		 static array:any[] = new Array();
		
		constructor(){
			Laya3D.init(0, 0);
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Laya.stage.screenMode = Stage.SCREEN_NONE;
			Stat.show();
			
			Laya.stage.on(Event.MOUSE_DOWN, null, function():void {
				for (var i:number = 0; i < this.count; i++ )
					//array.push(new Vector3Test());
					//array.push(new Vector3TestFloatArray());
					//array.push(new Float32Array(16));
					//array.push(new  Transform3D());
					//array.push(new  AnimationTransform3D());
					MemoryTest.array.push(new Sprite3D());
			});
		
		}

	}


