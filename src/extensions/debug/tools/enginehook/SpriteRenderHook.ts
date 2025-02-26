import { Laya } from "./../../../../../../../core/src/Laya";
import { DebugTool } from "../../DebugTool"
	import { CacheAnalyser } from "../CacheAnalyser"
	import { DebugConsts } from "../DebugConsts"
	import { RenderAnalyser } from "../RenderAnalyser"
	import { DebugInfoLayer } from "../../view/nodeInfo/DebugInfoLayer"
	import { Sprite } from "../../../../../../../core/src/laya/display/Sprite"
	import { Stage } from "../../../../../../../core/src/laya/display/Stage"
	import { RenderSprite } from "../../../../../../../core/src/laya/renders/RenderSprite"
	import { Context } from "../../../../../../../core/src/laya/resource/Context"
	import { Browser } from "../../../../../../../core/src/laya/utils/Browser"
	import { Stat } from "../../../../../../../core/src/laya/utils/Stat"

	/**
	 * ...
	 * @author ww
	 */
	export class SpriteRenderHook 
	{
		
		constructor(){
			
		}
		 static I:SpriteRenderHook;
		 static init():void
		{
			if (SpriteRenderHook.I) return;
			SpriteRenderHook.I = new SpriteRenderHook();
			SpriteRenderHook.setRenderHook();
		}
		 static setRenderHook():void
		{
			Sprite["prototype"]["render"]=SpriteRenderHook.I.render;
		}
		/** @private */
		protected _repaint:number = 1;
		 _renderType:number = 1;
		 _x:number;
		 _y:number;
		 static ShowBorderSign:string = "ShowBorderSign";
		 static showDisplayBorder(sprite:any,ifShowBorder:boolean=true):void
		{
			sprite[SpriteRenderHook.ShowBorderSign] = ifShowBorder;
		}
		 static isDisplayShowBorder(sprite:any):boolean
		{
			return sprite[SpriteRenderHook.ShowBorderSign];
		}
		/**
		 * 更新、呈现显示对象。
		 * @param	context 渲染的上下文引用。
		 * @param	x X轴坐标。
		 * @param	y Y轴坐标。
		 */
		 render(context:Context, x:number, y:number):void {
			if (((<Stage>this )) == Laya.stage)
			{
				CacheAnalyser.renderLoopBegin();
			}
			var preTime:number;
			preTime = Browser.now();
			//Stat.spriteCount++;
			if (this[SpriteRenderHook.ShowBorderSign])
			{
				DebugTool.showDisBoundToSprite((<Sprite>this ), DebugInfoLayer.I.cacheViewLayer, DebugConsts.SPRITE_REC_COLOR, DebugConsts.SPRITE_REC_LINEWIDTH);
			}
			RenderSprite.renders[this._renderType]._fun(this, context, x + this._x, y + this._y);
			this._repaint = 0;
			RenderAnalyser.I.render((<Sprite>this ), Browser.now() - preTime);
		}
		
		
	}


