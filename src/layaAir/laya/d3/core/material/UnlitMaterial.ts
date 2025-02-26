import { BaseTexture } from "../../../resource/BaseTexture";
import { Vector4 } from "../../math/Vector4";
import { Shader3D } from "../../shader/Shader3D";
import { BaseMaterial } from "./BaseMaterial";
import { RenderState } from "./RenderState";
import { ShaderDefine } from "../../shader/ShaderDefine";

/**
 * <code>UnlitMaterial</code> 类用于实现不受光照影响的材质。
 */
export class UnlitMaterial extends BaseMaterial {

	/**渲染状态_不透明。*/
	static RENDERMODE_OPAQUE: number = 0;
	/**渲染状态_阿尔法测试。*/
	static RENDERMODE_CUTOUT: number = 1;
	/**渲染状态__透明混合。*/
	static RENDERMODE_TRANSPARENT: number = 2;
	/**渲染状态__加色法混合。*/
	static RENDERMODE_ADDTIVE: number = 3;

	static SHADERDEFINE_ALBEDOTEXTURE: ShaderDefine;
	static SHADERDEFINE_TILINGOFFSET: ShaderDefine;
	static SHADERDEFINE_ENABLEVERTEXCOLOR: ShaderDefine;

	static ALBEDOTEXTURE: number = Shader3D.propertyNameToID("u_AlbedoTexture");
	static ALBEDOCOLOR: number = Shader3D.propertyNameToID("u_AlbedoColor");
	static TILINGOFFSET: number = Shader3D.propertyNameToID("u_TilingOffset");
	static CULL: number = Shader3D.propertyNameToID("s_Cull");
	static BLEND: number = Shader3D.propertyNameToID("s_Blend");
	static BLEND_SRC: number = Shader3D.propertyNameToID("s_BlendSrc");
	static BLEND_DST: number = Shader3D.propertyNameToID("s_BlendDst");
	static DEPTH_TEST: number = Shader3D.propertyNameToID("s_DepthTest");
	static DEPTH_WRITE: number = Shader3D.propertyNameToID("s_DepthWrite");

	/** 默认材质，禁止修改*/
	static defaultMaterial: UnlitMaterial;

	/**
	 * @internal
	 */
	static __initDefine__(): void {
		UnlitMaterial.SHADERDEFINE_ALBEDOTEXTURE = Shader3D.getDefineByName("ALBEDOTEXTURE");
		UnlitMaterial.SHADERDEFINE_TILINGOFFSET = Shader3D.getDefineByName("TILINGOFFSET");
		UnlitMaterial.SHADERDEFINE_ENABLEVERTEXCOLOR = Shader3D.getDefineByName("ENABLEVERTEXCOLOR");
	}

	private _albedoColor: Vector4 = new Vector4(1.0, 1.0, 1.0, 1.0);
	private _albedoIntensity: number = 1.0;
	private _enableVertexColor: boolean = false;

	/**
	 * @internal
	 */
	get _ColorR(): number {
		return this._albedoColor.x;
	}

	/**
	 * @internal
	 */
	set _ColorR(value: number) {
		this._albedoColor.x = value;
		this.albedoColor = this._albedoColor;
	}

	/**
	 * @internal
	 */
	get _ColorG(): number {
		return this._albedoColor.y;
	}

	/**
	 * @internal
	 */
	set _ColorG(value: number) {
		this._albedoColor.y = value;
		this.albedoColor = this._albedoColor;
	}

	/**
	 * @internal
	 */
	get _ColorB(): number {
		return this._albedoColor.z;
	}

	/**
	 * @internal
	 */
	set _ColorB(value: number) {
		this._albedoColor.z = value;
		this.albedoColor = this._albedoColor;
	}

	/**@internal */
	get _ColorA(): number {
		return this._albedoColor.w;
	}

	/**
	 * @internal
	 */
	set _ColorA(value: number) {
		this._albedoColor.w = value;
		this.albedoColor = this._albedoColor;
	}

	/**
	 * @internal
	 */
	get _AlbedoIntensity(): number {
		return this._albedoIntensity;
	}

	/**
	 * @internal
	 */
	set _AlbedoIntensity(value: number) {
		if (this._albedoIntensity !== value) {
			var finalAlbedo: Vector4 = (<Vector4>this._shaderValues.getVector(UnlitMaterial.ALBEDOCOLOR));
			Vector4.scale(this._albedoColor, value, finalAlbedo);
			this._albedoIntensity = value;
			this._shaderValues.setVector(UnlitMaterial.ALBEDOCOLOR, finalAlbedo);
		}
	}

	/**
	 * @internal
	 */
	get _MainTex_STX(): number {
		return this._shaderValues.getVector(UnlitMaterial.TILINGOFFSET).x;
	}

	/**
	 * @internal
	 */
	set _MainTex_STX(x: number) {
		var tilOff: Vector4 = (<Vector4>this._shaderValues.getVector(UnlitMaterial.TILINGOFFSET));
		tilOff.x = x;
		this.tilingOffset = tilOff;
	}

	/**
	 * @internal
	 */
	get _MainTex_STY(): number {
		return this._shaderValues.getVector(UnlitMaterial.TILINGOFFSET).y;
	}

	/**
	 * @internal
	 */
	set _MainTex_STY(y: number) {
		var tilOff: Vector4 = (<Vector4>this._shaderValues.getVector(UnlitMaterial.TILINGOFFSET));
		tilOff.y = y;
		this.tilingOffset = tilOff;
	}

	/**
	 * @internal
	 */
	get _MainTex_STZ(): number {
		return this._shaderValues.getVector(UnlitMaterial.TILINGOFFSET).z;
	}

	/**
	 * @internal
	 */
	set _MainTex_STZ(z: number) {
		var tilOff: Vector4 = (<Vector4>this._shaderValues.getVector(UnlitMaterial.TILINGOFFSET));
		tilOff.z = z;
		this.tilingOffset = tilOff;
	}

	/**
	 * @internal
	 */
	get _MainTex_STW(): number {
		return this._shaderValues.getVector(UnlitMaterial.TILINGOFFSET).w;
	}

	/**
	 * @internal
	 */
	set _MainTex_STW(w: number) {
		var tilOff: Vector4 = (<Vector4>this._shaderValues.getVector(UnlitMaterial.TILINGOFFSET));
		tilOff.w = w;
		this.tilingOffset = tilOff;
	}

	/**
	 * @internal
	 */
	get _Cutoff(): number {
		return this.alphaTestValue;
	}

	/**
	 * @internal
	 */
	set _Cutoff(value: number) {
		this.alphaTestValue = value;
	}

	/**
	 * 获取反照率颜色R分量。
	 * @return 反照率颜色R分量。
	 */
	get albedoColorR(): number {
		return this._ColorR;
	}

	/**
	 * 设置反照率颜色R分量。
	 * @param value 反照率颜色R分量。
	 */
	set albedoColorR(value: number) {
		this._ColorR = value;
	}

	/**
	 * 获取反照率颜色G分量。
	 * @return 反照率颜色G分量。
	 */
	get albedoColorG(): number {
		return this._ColorG;
	}

	/**
	 * 设置反照率颜色G分量。
	 * @param value 反照率颜色G分量。
	 */
	set albedoColorG(value: number) {
		this._ColorG = value;
	}

	/**
	 * 获取反照率颜色B分量。
	 * @return 反照率颜色B分量。
	 */
	get albedoColorB(): number {
		return this._ColorB;
	}

	/**
	 * 设置反照率颜色B分量。
	 * @param value 反照率颜色B分量。
	 */
	set albedoColorB(value: number) {
		this._ColorB = value;
	}

	/**
	 * 获取反照率颜色Z分量。
	 * @return 反照率颜色Z分量。
	 */
	get albedoColorA(): number {
		return this._ColorA;
	}

	/**
	 * 设置反照率颜色alpha分量。
	 * @param value 反照率颜色alpha分量。
	 */
	set albedoColorA(value: number) {
		this._ColorA = value;
	}

	/**
	 * 获取反照率颜色。
	 * @return 反照率颜色。
	 */
	get albedoColor(): Vector4 {
		return this._albedoColor;
	}

	/**
	 * 设置反照率颜色。
	 * @param value 反照率颜色。
	 */
	set albedoColor(value: Vector4) {
		var finalAlbedo: Vector4 = (<Vector4>this._shaderValues.getVector(UnlitMaterial.ALBEDOCOLOR));
		Vector4.scale(value, this._albedoIntensity, finalAlbedo);
		this._albedoColor = value;
		this._shaderValues.setVector(UnlitMaterial.ALBEDOCOLOR, finalAlbedo);
	}

	/**
	 * 获取反照率强度。
	 * @return 反照率强度。
	 */
	get albedoIntensity(): number {
		return this._albedoIntensity;
	}

	/**
	 * 设置反照率强度。
	 * @param value 反照率强度。
	 */
	set albedoIntensity(value: number) {
		this._AlbedoIntensity = value;
	}

	/**
	 * 获取反照率贴图。
	 * @return 反照率贴图。
	 */
	get albedoTexture(): BaseTexture {
		return this._shaderValues.getTexture(UnlitMaterial.ALBEDOTEXTURE);
	}

	/**
	 * 设置反照率贴图。
	 * @param value 反照率贴图。
	 */
	set albedoTexture(value: BaseTexture) {
		if (value)
			this._shaderValues.addDefine(UnlitMaterial.SHADERDEFINE_ALBEDOTEXTURE);
		else
			this._shaderValues.removeDefine(UnlitMaterial.SHADERDEFINE_ALBEDOTEXTURE);
		this._shaderValues.setTexture(UnlitMaterial.ALBEDOTEXTURE, value);
	}

	/**
	 * 获取纹理平铺和偏移X分量。
	 * @return 纹理平铺和偏移X分量。
	 */
	get tilingOffsetX(): number {
		return this._MainTex_STX;
	}

	/**
	 * 获取纹理平铺和偏移X分量。
	 * @param x 纹理平铺和偏移X分量。
	 */
	set tilingOffsetX(x: number) {
		this._MainTex_STX = x;
	}

	/**
	 * 获取纹理平铺和偏移Y分量。
	 * @return 纹理平铺和偏移Y分量。
	 */
	get tilingOffsetY(): number {
		return this._MainTex_STY;
	}

	/**
	 * 获取纹理平铺和偏移Y分量。
	 * @param y 纹理平铺和偏移Y分量。
	 */
	set tilingOffsetY(y: number) {
		this._MainTex_STY = y;
	}

	/**
	 * 获取纹理平铺和偏移Z分量。
	 * @return 纹理平铺和偏移Z分量。
	 */
	get tilingOffsetZ(): number {
		return this._MainTex_STZ;
	}

	/**
	 * 获取纹理平铺和偏移Z分量。
	 * @param z 纹理平铺和偏移Z分量。
	 */
	set tilingOffsetZ(z: number) {
		this._MainTex_STZ = z;
	}

	/**
	 * 获取纹理平铺和偏移W分量。
	 * @return 纹理平铺和偏移W分量。
	 */
	get tilingOffsetW(): number {
		return this._MainTex_STW;
	}

	/**
	 * 获取纹理平铺和偏移W分量。
	 * @param w 纹理平铺和偏移W分量。
	 */
	set tilingOffsetW(w: number) {
		this._MainTex_STW = w;
	}

	/**
	 * 获取纹理平铺和偏移。
	 * @return 纹理平铺和偏移。
	 */
	get tilingOffset(): Vector4 {
		return (<Vector4>this._shaderValues.getVector(UnlitMaterial.TILINGOFFSET));
	}

	/**
	 * 获取纹理平铺和偏移。
	 * @param value 纹理平铺和偏移。
	 */
	set tilingOffset(value: Vector4) {
		if (value) {
			if (value.x != 1 || value.y != 1 || value.z != 0 || value.w != 0)
				this._shaderValues.addDefine(UnlitMaterial.SHADERDEFINE_TILINGOFFSET);
			else
				this._shaderValues.removeDefine(UnlitMaterial.SHADERDEFINE_TILINGOFFSET);
		} else {
			this._shaderValues.removeDefine(UnlitMaterial.SHADERDEFINE_TILINGOFFSET);
		}
		this._shaderValues.setVector(UnlitMaterial.TILINGOFFSET, value);
	}

	/**
	 * 获取是否支持顶点色。
	 * @return  是否支持顶点色。
	 */
	get enableVertexColor(): boolean {
		return this._enableVertexColor;
	}

	/**
	 * 设置是否支持顶点色。
	 * @param value  是否支持顶点色。
	 */
	set enableVertexColor(value: boolean) {
		this._enableVertexColor = value;
		if (value)
			this._shaderValues.addDefine(UnlitMaterial.SHADERDEFINE_ENABLEVERTEXCOLOR);
		else
			this._shaderValues.removeDefine(UnlitMaterial.SHADERDEFINE_ENABLEVERTEXCOLOR);
	}

	/**
	 * 设置渲染模式。
	 * @return 渲染模式。
	 */
	set renderMode(value: number) {
		switch (value) {
			case UnlitMaterial.RENDERMODE_OPAQUE:
				this.alphaTest = false;
				this.renderQueue = BaseMaterial.RENDERQUEUE_OPAQUE;
				this.depthWrite = true;
				this.cull = RenderState.CULL_BACK;
				this.blend = RenderState.BLEND_DISABLE;
				this.depthTest = RenderState.DEPTHTEST_LESS;
				break;
			case UnlitMaterial.RENDERMODE_CUTOUT:
				this.renderQueue = BaseMaterial.RENDERQUEUE_ALPHATEST;
				this.alphaTest = true;
				this.depthWrite = true;
				this.cull = RenderState.CULL_BACK;
				this.blend = RenderState.BLEND_DISABLE;
				this.depthTest = RenderState.DEPTHTEST_LESS;
				break;
			case UnlitMaterial.RENDERMODE_TRANSPARENT:
				this.renderQueue = BaseMaterial.RENDERQUEUE_TRANSPARENT;
				this.alphaTest = false;
				this.depthWrite = false;
				this.cull = RenderState.CULL_BACK;
				this.blend = RenderState.BLEND_ENABLE_ALL;
				this.blendSrc = RenderState.BLENDPARAM_SRC_ALPHA;
				this.blendDst = RenderState.BLENDPARAM_ONE_MINUS_SRC_ALPHA;
				this.depthTest = RenderState.DEPTHTEST_LESS;
				break;
			default:
				throw new Error("UnlitMaterial : renderMode value error.");
		}
	}

	/**
	 * 设置是否写入深度。
	 * @param value 是否写入深度。
	 */
	set depthWrite(value: boolean) {
		this._shaderValues.setBool(UnlitMaterial.DEPTH_WRITE, value);
	}

	/**
	 * 获取是否写入深度。
	 * @return 是否写入深度。
	 */
	get depthWrite(): boolean {
		return this._shaderValues.getBool(UnlitMaterial.DEPTH_WRITE);
	}

	/**
	 * 设置剔除方式。
	 * @param value 剔除方式。
	 */
	set cull(value: number) {
		this._shaderValues.setInt(UnlitMaterial.CULL, value);
	}

	/**
	 * 获取剔除方式。
	 * @return 剔除方式。
	 */
	get cull(): number {
		return this._shaderValues.getInt(UnlitMaterial.CULL);
	}

	/**
	 * 设置混合方式。
	 * @param value 混合方式。
	 */
	set blend(value: number) {
		this._shaderValues.setInt(UnlitMaterial.BLEND, value);
	}

	/**
	 * 获取混合方式。
	 * @return 混合方式。
	 */
	get blend(): number {
		return this._shaderValues.getInt(UnlitMaterial.BLEND);
	}

	/**
	 * 设置混合源。
	 * @param value 混合源
	 */
	set blendSrc(value: number) {
		this._shaderValues.setInt(UnlitMaterial.BLEND_SRC, value);
	}

	/**
	 * 获取混合源。
	 * @return 混合源。
	 */
	get blendSrc(): number {
		return this._shaderValues.getInt(UnlitMaterial.BLEND_SRC);
	}

	/**
	 * 设置混合目标。
	 * @param value 混合目标
	 */
	set blendDst(value: number) {
		this._shaderValues.setInt(UnlitMaterial.BLEND_DST, value);
	}

	/**
	 * 获取混合目标。
	 * @return 混合目标。
	 */
	get blendDst(): number {
		return this._shaderValues.getInt(UnlitMaterial.BLEND_DST);
	}

	/**
	 * 设置深度测试方式。
	 * @param value 深度测试方式
	 */
	set depthTest(value: number) {
		this._shaderValues.setInt(UnlitMaterial.DEPTH_TEST, value);
	}

	/**
	 * 获取深度测试方式。
	 * @return 深度测试方式。
	 */
	get depthTest(): number {
		return this._shaderValues.getInt(UnlitMaterial.DEPTH_TEST);
	}

	constructor() {
		super();
		this.setShaderName("Unlit");
		this._shaderValues.setVector(UnlitMaterial.ALBEDOCOLOR, new Vector4(1.0, 1.0, 1.0, 1.0));
		this.renderMode = UnlitMaterial.RENDERMODE_OPAQUE;
	}

	/**
	 * 克隆。
	 * @return	 克隆副本。
	 * @override
	 */
	clone(): any {
		var dest: UnlitMaterial = new UnlitMaterial();
		this.cloneTo(dest);
		return dest;
	}
}

