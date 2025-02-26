import { Laya } from "../../../Laya";
import { Node } from "../../display/Node";
import { Event } from "../../events/Event";
import { Loader } from "../../net/Loader";
import { Matrix4x4 } from "../math/Matrix4x4";
import { Vector3 } from "../math/Vector3";
import { Vector4 } from "../math/Vector4";
import { SkyRenderer } from "../resource/models/SkyRenderer";
import { Shader3D } from "../shader/Shader3D";
import { ShaderData } from "../shader/ShaderData";
import { Sprite3D } from "./Sprite3D";
import { Scene3D } from "./scene/Scene3D";

/**
 * <code>BaseCamera</code> 类用于创建摄像机的父类。
 */
export class BaseCamera extends Sprite3D {
	static _tempMatrix4x40: Matrix4x4 = new Matrix4x4();

	static CAMERAPOS: number = Shader3D.propertyNameToID("u_CameraPos");
	static VIEWMATRIX: number = Shader3D.propertyNameToID("u_View");
	static PROJECTMATRIX: number = Shader3D.propertyNameToID("u_Projection");
	static VIEWPROJECTMATRIX: number = Shader3D.propertyNameToID("u_ViewProjection");
	static CAMERADIRECTION: number = Shader3D.propertyNameToID("u_CameraDirection");
	static CAMERAUP: number = Shader3D.propertyNameToID("u_CameraUp");
	static VIEWPORT: number = Shader3D.propertyNameToID("u_Viewport");
	static PROJECTION_PARAMS: number = Shader3D.propertyNameToID("u_ProjectionParams");

	/**渲染模式,延迟光照渲染，暂未开放。*/
	static RENDERINGTYPE_DEFERREDLIGHTING: string = "DEFERREDLIGHTING";
	/**渲染模式,前向渲染。*/
	static RENDERINGTYPE_FORWARDRENDERING: string = "FORWARDRENDERING";

	/**清除标记，固定颜色。*/
	static CLEARFLAG_SOLIDCOLOR: number = 0;
	/**清除标记，天空。*/
	static CLEARFLAG_SKY: number = 1;
	/**清除标记，仅深度。*/
	static CLEARFLAG_DEPTHONLY: number = 2;
	/**清除标记，不清除。*/
	static CLEARFLAG_NONE: number = 3;

	protected static _invertYScaleMatrix: Matrix4x4 = new Matrix4x4(1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);//Matrix4x4.createScaling(new Vector3(1, -1, 1), _invertYScaleMatrix);
	protected static _invertYProjectionMatrix: Matrix4x4 = new Matrix4x4();
	protected static _invertYProjectionViewMatrix: Matrix4x4 = new Matrix4x4();

	//private static const Vector3[] cornersWorldSpace:Vector.<Vector3> = new Vector.<Vector3>(8);
	//private static const  boundingFrustum:BoundingFrustum = new BoundingFrustum(Matrix4x4.Identity);


	/** @internal 渲染顺序。*/
	_renderingOrder: number

	/** 近裁剪面。*/
	protected _nearPlane: number;
	/** 远裁剪面。*/
	protected _farPlane: number;
	/** 视野。*/
	private _fieldOfView: number;
	/** 正交投影的垂直尺寸。*/
	private _orthographicVerticalSize: number;
	private _skyRenderer: SkyRenderer = new SkyRenderer();
	private _forward: Vector3 = new Vector3();
	private _up: Vector3 = new Vector3();

	/**@internal */
	protected _orthographic: boolean;

	/**@internal 是否使用用户自定义投影矩阵，如果使用了用户投影矩阵，摄像机投影矩阵相关的参数改变则不改变投影矩阵的值，需调用ResetProjectionMatrix方法。*/
	protected _useUserProjectionMatrix: boolean;

	/** @internal */
	_shaderValues: ShaderData;

	/**清楚标记。*/
	clearFlag: number;
	/**摄像机的清除颜色,默认颜色为CornflowerBlue。*/
	clearColor: Vector4 = new Vector4(100 / 255, 149 / 255, 237 / 255, 255 / 255);
	/** 可视层位标记遮罩值,支持混合 例:cullingMask=Math.pow(2,0)|Math.pow(2,1)为第0层和第1层可见。*/
	cullingMask: number;
	/** 渲染时是否用遮挡剔除。 */
	useOcclusionCulling: boolean;

	/**
	 * 获取天空渲染器。
	 * @return 天空渲染器。
	 */
	get skyRenderer(): SkyRenderer {
		return this._skyRenderer;
	}

	/**
	 * 获取视野。
	 * @return 视野。
	 */
	get fieldOfView(): number {
		return this._fieldOfView;
	}

	/**
	 * 设置视野。
	 * @param value 视野。
	 */
	set fieldOfView(value: number) {
		this._fieldOfView = value;
		this._calculateProjectionMatrix();
	}

	/**
	 * 获取近裁面。
	 * @return 近裁面。
	 */
	get nearPlane(): number {
		return this._nearPlane;
	}

	/**
	 * 设置近裁面。
	 * @param value 近裁面。
	 */
	set nearPlane(value: number) {
		this._nearPlane = value;
		this._calculateProjectionMatrix();
	}

	/**
	 * 获取远裁面。
	 * @return 远裁面。
	 */
	get farPlane(): number {
		return this._farPlane;
	}

	/**
	 * 设置远裁面。
	 * @param value 远裁面。
	 */
	set farPlane(vaule: number) {
		this._farPlane = vaule;
		this._calculateProjectionMatrix();
	}

	/**
	 * 获取是否正交投影矩阵。
	 * @return 是否正交投影矩阵。
	 */
	get orthographic(): boolean {
		return this._orthographic;
	}

	/**
	 * 设置是否正交投影矩阵。
	 * @param 是否正交投影矩阵。
	 */
	set orthographic(vaule: boolean) {
		this._orthographic = vaule;
		this._calculateProjectionMatrix();
	}

	/**
	 * 获取正交投影垂直矩阵尺寸。
	 * @return 正交投影垂直矩阵尺寸。
	 */
	get orthographicVerticalSize(): number {
		return this._orthographicVerticalSize;
	}

	/**
	 * 设置正交投影垂直矩阵尺寸。
	 * @param 正交投影垂直矩阵尺寸。
	 */
	set orthographicVerticalSize(vaule: number) {
		this._orthographicVerticalSize = vaule;
		this._calculateProjectionMatrix();
	}

	get renderingOrder(): number {
		return this._renderingOrder;
	}

	set renderingOrder(value: number) {
		this._renderingOrder = value;
		this._sortCamerasByRenderingOrder();
	}

	/**
	 * 创建一个 <code>BaseCamera</code> 实例。
	 * @param	fieldOfView 视野。
	 * @param	nearPlane 近裁面。
	 * @param	farPlane 远裁面。
	 */
	constructor(nearPlane: number = 0.3, farPlane: number = 1000) {
		super();
		this._shaderValues = new ShaderData(null);

		this._fieldOfView = 60;
		this._useUserProjectionMatrix = false;
		this._orthographic = false;

		this._orthographicVerticalSize = 10;
		this.renderingOrder = 0;

		this._nearPlane = nearPlane;
		this._farPlane = farPlane;

		this.cullingMask = 2147483647/*int.MAX_VALUE*/;
		this.clearFlag = BaseCamera.CLEARFLAG_SOLIDCOLOR;
		this.useOcclusionCulling = true;
	}

	/**
	 * 通过RenderingOrder属性对摄像机机型排序。
	 */
	_sortCamerasByRenderingOrder(): void {
		if (this.displayedInStage) {
			var cameraPool: BaseCamera[] = this.scene._cameraPool;//TODO:可优化，从队列中移除再加入
			var n: number = cameraPool.length - 1;
			for (var i: number = 0; i < n; i++) {
				if (cameraPool[i].renderingOrder > cameraPool[n].renderingOrder) {
					var tempCamera: BaseCamera = cameraPool[i];
					cameraPool[i] = cameraPool[n];
					cameraPool[n] = tempCamera;
				}
			}
		}
	}

	/**
	 * @internal
	 */
	protected _calculateProjectionMatrix(): void {

	}

	/**
	 * @internal
	 */
	protected _onScreenSizeChanged(): void {
		this._calculateProjectionMatrix();
	}

	/**
	 * @internal
	 */
	_prepareCameraToRender(): void {
		var cameraSV: ShaderData = this._shaderValues;
		this.transform.getForward(this._forward);
		this.transform.getUp(this._up);
		cameraSV.setVector3(BaseCamera.CAMERAPOS, this.transform.position);
		cameraSV.setVector3(BaseCamera.CAMERADIRECTION, this._forward);
		cameraSV.setVector3(BaseCamera.CAMERAUP, this._up);
	}


	/**
	 * 相机渲染。
	 * @param	shader 着色器。
	 * @param   replacementTag 着色器替换标记。
	 */
	render(shader: Shader3D = null, replacementTag: string = null): void {
	}

	/**
	 * 增加可视图层,layer值为0到31层。
	 * @param layer 图层。
	 */
	addLayer(layer: number): void {
		this.cullingMask |= Math.pow(2, layer);
	}

	/**
	 * 移除可视图层,layer值为0到31层。
	 * @param layer 图层。
	 */
	removeLayer(layer: number): void {
		this.cullingMask &= ~Math.pow(2, layer);
	}

	/**
	 * 增加所有图层。
	 */
	addAllLayers(): void {
		this.cullingMask = 2147483647/*int.MAX_VALUE*/;
	}

	/**
	 * 移除所有图层。
	 */
	removeAllLayers(): void {
		this.cullingMask = 0;
	}

	resetProjectionMatrix(): void {
		this._useUserProjectionMatrix = false;
		this._calculateProjectionMatrix();
	}

	//public void BoundingFrustumViewSpace(Vector3[] cornersViewSpace)
	//{
	//if (cornersViewSpace.Length != 4)
	//throw new ArgumentOutOfRangeException("cornersViewSpace");
	//boundingFrustum.Matrix = ViewMatrix * ProjectionMatrix;
	//boundingFrustum.GetCorners(cornersWorldSpace);
	//// Transform form world space to view space
	//for (int i = 0; i < 4; i++)
	//{
	//cornersViewSpace[i] = Vector3.Transform(cornersWorldSpace[i + 4], ViewMatrix);
	//}
	//
	//// Swap the last 2 values.
	//Vector3 temp = cornersViewSpace[3];
	//cornersViewSpace[3] = cornersViewSpace[2];
	//cornersViewSpace[2] = temp;
	//} // BoundingFrustumViewSpace

	//public void BoundingFrustumWorldSpace(Vector3[] cornersWorldSpaceResult)
	//{
	//if (cornersWorldSpaceResult.Length != 4)
	//throw new ArgumentOutOfRangeException("cornersViewSpace");
	//boundingFrustum.Matrix = ViewMatrix * ProjectionMatrix;
	//boundingFrustum.GetCorners(cornersWorldSpace);
	//// Transform form world space to view space
	//for (int i = 0; i < 4; i++)
	//{
	//cornersWorldSpaceResult[i] = cornersWorldSpace[i + 4];
	//}
	//
	//// Swap the last 2 values.
	//Vector3 temp = cornersWorldSpaceResult[3];
	//cornersWorldSpaceResult[3] = cornersWorldSpaceResult[2];
	//cornersWorldSpaceResult[2] = temp;
	//} // BoundingFrustumWorldSpace

	/**
	 * @inheritDoc
	 * @override
	 */
	protected _onActive(): void {
		((<Scene3D>this._scene))._addCamera(this);
		super._onActive();
	}

	/**
	 * @inheritDoc
	 * @override
	 */
	protected _onInActive(): void {
		((<Scene3D>this._scene))._removeCamera(this);
		super._onInActive();
	}

	/**
	 * @inheritDoc
	 * @override
	 * @internal
	 */
	_parse(data: any, spriteMap: any): void {
		super._parse(data, spriteMap);
		var clearFlagData: any = data.clearFlag;
		(clearFlagData !== undefined) && (this.clearFlag = clearFlagData);

		this.orthographic = data.orthographic;
		(data.orthographicVerticalSize !== undefined) && (this.orthographicVerticalSize = data.orthographicVerticalSize);
		(data.fieldOfView !== undefined) && (this.fieldOfView = data.fieldOfView);
		this.nearPlane = data.nearPlane;
		this.farPlane = data.farPlane;

		var color: any[] = data.clearColor;
		this.clearColor = new Vector4(color[0], color[1], color[2], color[3]);
		var skyboxMaterial: any = data.skyboxMaterial;
		if (skyboxMaterial) {
			this._skyRenderer.material = Loader.getRes(skyboxMaterial.path);
		}
	}

	/**
	 * @inheritDoc
	 * @override
	 */
	destroy(destroyChild: boolean = true): void {
		//postProcess = null;
		//AmbientLight = null;
		this._skyRenderer.destroy();
		this._skyRenderer = null;

		Laya.stage.off(Event.RESIZE, this, this._onScreenSizeChanged);
		super.destroy(destroyChild);
	}

	/**
	 * @internal
	 */
	protected _create(): Node {
		return new BaseCamera();
	}


}

