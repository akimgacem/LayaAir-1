import { PixelLineFilter } from "./PixelLineFilter";
import { PixelLineRenderer } from "./PixelLineRenderer";
import { PixelLineMaterial } from "./PixelLineMaterial";
import { PixelLineData } from "./PixelLineData";
import { RenderableSprite3D } from "../RenderableSprite3D"
import { BaseMaterial } from "../material/BaseMaterial"
import { RenderElement } from "../render/RenderElement"
import { Color } from "../../math/Color"
import { Vector3 } from "../../math/Vector3"
import { Node } from "../../../display/Node"

/**
 * <code>PixelLineSprite3D</code> 类用于像素线渲染精灵。
 */
export class PixelLineSprite3D extends RenderableSprite3D {
	/** @internal */
	public _geometryFilter: PixelLineFilter;

	/**
	 * 获取最大线数量
	 * @return  最大线数量。
	 */
	get maxLineCount(): number {
		return this._geometryFilter._maxLineCount;
	}

	/**
	 * 设置最大线数量
	 * @param	value 最大线数量。
	 */
	set maxLineCount(value: number) {
		this._geometryFilter._resizeLineData(value);
		this._geometryFilter._lineCount = Math.min(this._geometryFilter._lineCount, value);
	}

	/**
	 * 获取线数量。
	 * @return 线段数量。
	 */
	get lineCount(): number {
		return this._geometryFilter._lineCount;
	}

	/**
	 * 设置获取线数量。
	 * @param	value 线段数量。
	 */
	set lineCount(value: number) {
		if (value > this.maxLineCount)
			throw "PixelLineSprite3D: lineCount can't large than maxLineCount";
		else
			this._geometryFilter._lineCount = value;
	}

	/**
	 * 获取line渲染器。
	 * @return  line渲染器。
	 */
	get pixelLineRenderer(): PixelLineRenderer {
		return (<PixelLineRenderer>this._render);
	}

	/**
	 * 创建一个 <code>PixelLineSprite3D</code> 实例。
	 * @param maxCount 最大线段数量。
	 * @param name 名字。
	 */
	constructor(maxCount: number = 2, name: string = null) {
		super(name);
		this._geometryFilter = new PixelLineFilter(this, maxCount);
		this._render = new PixelLineRenderer(this);
		this._changeRenderObjects((<PixelLineRenderer>this._render), 0, PixelLineMaterial.defaultMaterial);
	}

	/**
	 * @inheritDoc
	 */
	_changeRenderObjects(sender: PixelLineRenderer, index: number, material: BaseMaterial): void {
		var renderObjects: RenderElement[] = this._render._renderElements;
		(material) || (material = PixelLineMaterial.defaultMaterial);
		var renderElement: RenderElement = renderObjects[index];
		(renderElement) || (renderElement = renderObjects[index] = new RenderElement());
		renderElement.setTransform(this._transform);
		renderElement.setGeometry(this._geometryFilter);
		renderElement.render = this._render;
		renderElement.material = material;
	}

	/**
	 * 增加一条线。
	 * @param	startPosition  初始点位置
	 * @param	endPosition	   结束点位置
	 * @param	startColor	   初始点颜色
	 * @param	endColor	   结束点颜色
	 */
	addLine(startPosition: Vector3, endPosition: Vector3, startColor: Color, endColor: Color): void {
		if (this._geometryFilter._lineCount !== this._geometryFilter._maxLineCount)
			this._geometryFilter._updateLineData(this._geometryFilter._lineCount++, startPosition, endPosition, startColor, endColor);
		else
			throw "PixelLineSprite3D: lineCount has equal with maxLineCount.";
	}

	/**
	 * 添加多条线段。
	 * @param	lines  线段数据
	 */
	addLines(lines: PixelLineData[]): void {
		var lineCount: number = this._geometryFilter._lineCount;
		var addCount: number = lines.length;
		if (lineCount + addCount > this._geometryFilter._maxLineCount) {
			throw "PixelLineSprite3D: lineCount plus lines count must less than maxLineCount.";
		} else {
			this._geometryFilter._updateLineDatas(lineCount, lines);
			this._geometryFilter._lineCount += addCount;
		}
	}

	/**
	 * 移除一条线段。
	 * @param index 索引。
	 */
	removeLine(index: number): void {
		if (index < this._geometryFilter._lineCount)
			this._geometryFilter._removeLineData(index);
		else
			throw "PixelLineSprite3D: index must less than lineCount.";
	}

	/**
	 * 更新线
	 * @param	index  		   索引
	 * @param	startPosition  初始点位置
	 * @param	endPosition	   结束点位置
	 * @param	startColor	   初始点颜色
	 * @param	endColor	   结束点颜色
	 */
	setLine(index: number, startPosition: Vector3, endPosition: Vector3, startColor: Color, endColor: Color): void {
		if (index < this._geometryFilter._lineCount)
			this._geometryFilter._updateLineData(index, startPosition, endPosition, startColor, endColor);
		else
			throw "PixelLineSprite3D: index must less than lineCount.";
	}

	/**
	 * 获取线段数据
	 * @param out 线段数据。
	 */
	getLine(index: number, out: PixelLineData): void {
		if (index < this.lineCount)
			this._geometryFilter._getLineData(index, out);
		else
			throw "PixelLineSprite3D: index must less than lineCount.";
	}

	/**
	 * 清除所有线段。
	 */
	clear(): void {
		this._geometryFilter._lineCount = 0;
	}

	/**
	 * @internal
	 */
	protected _create(): Node {
		return new PixelLineSprite3D();
	}

}

