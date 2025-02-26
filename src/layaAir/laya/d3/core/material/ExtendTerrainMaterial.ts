import { BaseTexture } from "../../../resource/BaseTexture";
import { Vector4 } from "../../math/Vector4";
import { Shader3D } from "../../shader/Shader3D";
import { Scene3DShaderDeclaration } from "../scene/Scene3DShaderDeclaration";
import { BaseMaterial } from "./BaseMaterial";
import { RenderState } from "./RenderState";
import { ShaderDefine } from "../../shader/ShaderDefine";

/**
 * ...
 * @author ...
 */
export class ExtendTerrainMaterial extends BaseMaterial {
	/**渲染状态_不透明。*/
	static RENDERMODE_OPAQUE: number = 1;
	/**渲染状态_透明混合。*/
	static RENDERMODE_TRANSPARENT: number = 2;

	/**渲染状态_透明混合。*/
	static SPLATALPHATEXTURE: number = Shader3D.propertyNameToID("u_SplatAlphaTexture");

	static DIFFUSETEXTURE1: number = Shader3D.propertyNameToID("u_DiffuseTexture1");
	static DIFFUSETEXTURE2: number = Shader3D.propertyNameToID("u_DiffuseTexture2");
	static DIFFUSETEXTURE3: number = Shader3D.propertyNameToID("u_DiffuseTexture3");
	static DIFFUSETEXTURE4: number = Shader3D.propertyNameToID("u_DiffuseTexture4");
	static DIFFUSETEXTURE5: number = Shader3D.propertyNameToID("u_DiffuseTexture5");

	static DIFFUSESCALEOFFSET1: number = Shader3D.propertyNameToID("u_DiffuseScaleOffset1");
	static DIFFUSESCALEOFFSET2: number = Shader3D.propertyNameToID("u_DiffuseScaleOffset2");
	static DIFFUSESCALEOFFSET3: number = Shader3D.propertyNameToID("u_DiffuseScaleOffset3");
	static DIFFUSESCALEOFFSET4: number = Shader3D.propertyNameToID("u_DiffuseScaleOffset4");
	static DIFFUSESCALEOFFSET5: number = Shader3D.propertyNameToID("u_DiffuseScaleOffset5");

	static CULL: number = Shader3D.propertyNameToID("s_Cull");
	static BLEND: number = Shader3D.propertyNameToID("s_Blend");
	static BLEND_SRC: number = Shader3D.propertyNameToID("s_BlendSrc");
	static BLEND_DST: number = Shader3D.propertyNameToID("s_BlendDst");
	static DEPTH_TEST: number = Shader3D.propertyNameToID("s_DepthTest");
	static DEPTH_WRITE: number = Shader3D.propertyNameToID("s_DepthWrite");

	/**地形细节宏定义。*/
	static SHADERDEFINE_DETAIL_NUM1: ShaderDefine;
	static SHADERDEFINE_DETAIL_NUM2: ShaderDefine;
	static SHADERDEFINE_DETAIL_NUM3: ShaderDefine;
	static SHADERDEFINE_DETAIL_NUM4: ShaderDefine;
	static SHADERDEFINE_DETAIL_NUM5: ShaderDefine;

	/**
	 * @internal
	 */
	static __initDefine__(): void {
		ExtendTerrainMaterial.SHADERDEFINE_DETAIL_NUM1 = Shader3D.getDefineByName("ExtendTerrain_DETAIL_NUM1");
		ExtendTerrainMaterial.SHADERDEFINE_DETAIL_NUM2 = Shader3D.getDefineByName("ExtendTerrain_DETAIL_NUM2");
		ExtendTerrainMaterial.SHADERDEFINE_DETAIL_NUM3 = Shader3D.getDefineByName("ExtendTerrain_DETAIL_NUM3");
		ExtendTerrainMaterial.SHADERDEFINE_DETAIL_NUM4 = Shader3D.getDefineByName("ExtendTerrain_DETAIL_NUM4");
		ExtendTerrainMaterial.SHADERDEFINE_DETAIL_NUM5 = Shader3D.getDefineByName("ExtendTerrain_DETAIL_NUM5");
	}

	private _enableLighting: boolean = true;

	/**
	 * 获取splatAlpha贴图。
	 * @return splatAlpha贴图。
	 */
	get splatAlphaTexture(): BaseTexture {
		return this._shaderValues.getTexture(ExtendTerrainMaterial.SPLATALPHATEXTURE);
	}

	/**
	 * 设置splatAlpha贴图。
	 * @param value splatAlpha贴图。
	 */
	set splatAlphaTexture(value: BaseTexture) {
		this._shaderValues.setTexture(ExtendTerrainMaterial.SPLATALPHATEXTURE, value);
	}

	/**
	 * 设置第一层贴图。
	 * @param value 第一层贴图。
	 */
	set diffuseTexture1(value: BaseTexture) {
		this._shaderValues.setTexture(ExtendTerrainMaterial.DIFFUSETEXTURE1, value);
		this._setDetailNum(1);
	}

	/**
	 * 获取第二层贴图。
	 * @return 第二层贴图。
	 */
	get diffuseTexture2(): BaseTexture {
		return this._shaderValues.getTexture(ExtendTerrainMaterial.DIFFUSETEXTURE2);
	}

	/**
	 * 设置第二层贴图。
	 * @param value 第二层贴图。
	 */
	set diffuseTexture2(value: BaseTexture) {
		this._shaderValues.setTexture(ExtendTerrainMaterial.DIFFUSETEXTURE2, value);
		this._setDetailNum(2);
	}

	/**
	 * 获取第三层贴图。
	 * @return 第三层贴图。
	 */
	get diffuseTexture3(): BaseTexture {
		return this._shaderValues.getTexture(ExtendTerrainMaterial.DIFFUSETEXTURE3);
	}

	/**
	 * 设置第三层贴图。
	 * @param value 第三层贴图。
	 */
	set diffuseTexture3(value: BaseTexture) {
		this._shaderValues.setTexture(ExtendTerrainMaterial.DIFFUSETEXTURE3, value);
		this._setDetailNum(3);
	}

	/**
	 * 获取第四层贴图。
	 * @return 第四层贴图。
	 */
	get diffuseTexture4(): BaseTexture {
		return this._shaderValues.getTexture(ExtendTerrainMaterial.DIFFUSETEXTURE4);
	}

	/**
	 * 设置第四层贴图。
	 * @param value 第四层贴图。
	 */
	set diffuseTexture4(value: BaseTexture) {
		this._shaderValues.setTexture(ExtendTerrainMaterial.DIFFUSETEXTURE4, value);
		this._setDetailNum(4);
	}

	/**
	 * 获取第五层贴图。
	 * @return 第五层贴图。
	 */
	get diffuseTexture5(): BaseTexture {
		return this._shaderValues.getTexture(ExtendTerrainMaterial.DIFFUSETEXTURE5);
	}

	/**
	 * 设置第五层贴图。
	 * @param value 第五层贴图。
	 */
	set diffuseTexture5(value: BaseTexture) {
		this._shaderValues.setTexture(ExtendTerrainMaterial.DIFFUSETEXTURE5, value);
		this._setDetailNum(5);
	}

	private _setDetailNum(value: number): void {
		switch (value) {
			case 1:
				this._shaderValues.addDefine(ExtendTerrainMaterial.SHADERDEFINE_DETAIL_NUM1);
				this._shaderValues.removeDefine(ExtendTerrainMaterial.SHADERDEFINE_DETAIL_NUM2);
				this._shaderValues.removeDefine(ExtendTerrainMaterial.SHADERDEFINE_DETAIL_NUM3);
				this._shaderValues.removeDefine(ExtendTerrainMaterial.SHADERDEFINE_DETAIL_NUM4);
				this._shaderValues.removeDefine(ExtendTerrainMaterial.SHADERDEFINE_DETAIL_NUM5);
				break;
			case 2:
				this._shaderValues.addDefine(ExtendTerrainMaterial.SHADERDEFINE_DETAIL_NUM2);
				this._shaderValues.removeDefine(ExtendTerrainMaterial.SHADERDEFINE_DETAIL_NUM1);
				this._shaderValues.removeDefine(ExtendTerrainMaterial.SHADERDEFINE_DETAIL_NUM3);
				this._shaderValues.removeDefine(ExtendTerrainMaterial.SHADERDEFINE_DETAIL_NUM4);
				this._shaderValues.removeDefine(ExtendTerrainMaterial.SHADERDEFINE_DETAIL_NUM5);
				break;
			case 3:
				this._shaderValues.addDefine(ExtendTerrainMaterial.SHADERDEFINE_DETAIL_NUM3);
				this._shaderValues.removeDefine(ExtendTerrainMaterial.SHADERDEFINE_DETAIL_NUM1);
				this._shaderValues.removeDefine(ExtendTerrainMaterial.SHADERDEFINE_DETAIL_NUM2);
				this._shaderValues.removeDefine(ExtendTerrainMaterial.SHADERDEFINE_DETAIL_NUM4);
				this._shaderValues.removeDefine(ExtendTerrainMaterial.SHADERDEFINE_DETAIL_NUM5);
				break;
			case 4:
				this._shaderValues.addDefine(ExtendTerrainMaterial.SHADERDEFINE_DETAIL_NUM4);
				this._shaderValues.removeDefine(ExtendTerrainMaterial.SHADERDEFINE_DETAIL_NUM1);
				this._shaderValues.removeDefine(ExtendTerrainMaterial.SHADERDEFINE_DETAIL_NUM2);
				this._shaderValues.removeDefine(ExtendTerrainMaterial.SHADERDEFINE_DETAIL_NUM3);
				this._shaderValues.removeDefine(ExtendTerrainMaterial.SHADERDEFINE_DETAIL_NUM5);
				break;
			case 5:
				this._shaderValues.addDefine(ExtendTerrainMaterial.SHADERDEFINE_DETAIL_NUM5);
				this._shaderValues.removeDefine(ExtendTerrainMaterial.SHADERDEFINE_DETAIL_NUM1);
				this._shaderValues.removeDefine(ExtendTerrainMaterial.SHADERDEFINE_DETAIL_NUM2);
				this._shaderValues.removeDefine(ExtendTerrainMaterial.SHADERDEFINE_DETAIL_NUM3);
				this._shaderValues.removeDefine(ExtendTerrainMaterial.SHADERDEFINE_DETAIL_NUM4);
				break;
		}
	}

	set diffuseScaleOffset1(scaleOffset1: Vector4) {
		this._shaderValues.setVector(ExtendTerrainMaterial.DIFFUSESCALEOFFSET1, scaleOffset1);
	}

	set diffuseScaleOffset2(scaleOffset2: Vector4) {
		this._shaderValues.setVector(ExtendTerrainMaterial.DIFFUSESCALEOFFSET2, scaleOffset2);
	}

	set diffuseScaleOffset3(scaleOffset3: Vector4) {
		this._shaderValues.setVector(ExtendTerrainMaterial.DIFFUSESCALEOFFSET3, scaleOffset3);
	}

	set diffuseScaleOffset4(scaleOffset4: Vector4) {
		this._shaderValues.setVector(ExtendTerrainMaterial.DIFFUSESCALEOFFSET4, scaleOffset4);
	}

	set diffuseScaleOffset5(scaleOffset5: Vector4) {
		this._shaderValues.setVector(ExtendTerrainMaterial.DIFFUSESCALEOFFSET5, scaleOffset5);
	}

	/**
	 * 获取是否启用光照。
	 * @return 是否启用光照。
	 */
	get enableLighting(): boolean {
		return this._enableLighting;
	}

	/**
	 * 设置是否启用光照。
	 * @param value 是否启用光照。
	 */
	set enableLighting(value: boolean) {
		if (this._enableLighting !== value) {
			if (value) {
				this._disablePublicDefineDatas.remove(Scene3DShaderDeclaration.SHADERDEFINE_POINTLIGHT);
				this._disablePublicDefineDatas.remove(Scene3DShaderDeclaration.SHADERDEFINE_SPOTLIGHT);
				this._disablePublicDefineDatas.remove(Scene3DShaderDeclaration.SHADERDEFINE_DIRECTIONLIGHT);
			}
			else {
				this._disablePublicDefineDatas.add(Scene3DShaderDeclaration.SHADERDEFINE_POINTLIGHT);
				this._disablePublicDefineDatas.add(Scene3DShaderDeclaration.SHADERDEFINE_SPOTLIGHT);
				this._disablePublicDefineDatas.add(Scene3DShaderDeclaration.SHADERDEFINE_DIRECTIONLIGHT);
			}
			this._enableLighting = value;
		}
	}

	/**
	 * 设置渲染模式。
	 * @return 渲染模式。
	 */
	set renderMode(value: number) {
		switch (value) {
			case ExtendTerrainMaterial.RENDERMODE_OPAQUE:
				this.renderQueue = BaseMaterial.RENDERQUEUE_OPAQUE;
				this.depthWrite = true;
				this.cull = RenderState.CULL_BACK;
				this.blend = RenderState.BLEND_DISABLE;
				this.depthTest = RenderState.DEPTHTEST_LESS;
				break;
			case ExtendTerrainMaterial.RENDERMODE_TRANSPARENT:
				this.renderQueue = BaseMaterial.RENDERQUEUE_OPAQUE;
				this.depthWrite = false;
				this.cull = RenderState.CULL_BACK;
				this.blend = RenderState.BLEND_ENABLE_ALL;
				this.blendSrc = RenderState.BLENDPARAM_SRC_ALPHA;
				this.blendDst = RenderState.BLENDPARAM_ONE_MINUS_SRC_ALPHA;
				this.depthTest = RenderState.DEPTHTEST_LEQUAL;
				break;
			default:
				throw new Error("ExtendTerrainMaterial:renderMode value error.");
		}
	}

	/**
	 * 设置是否写入深度。
	 * @param value 是否写入深度。
	 */
	set depthWrite(value: boolean) {
		this._shaderValues.setBool(ExtendTerrainMaterial.DEPTH_WRITE, value);
	}

	/**
	 * 获取是否写入深度。
	 * @return 是否写入深度。
	 */
	get depthWrite(): boolean {
		return this._shaderValues.getBool(ExtendTerrainMaterial.DEPTH_WRITE);
	}

	/**
	 * 设置剔除方式。
	 * @param value 剔除方式。
	 */
	set cull(value: number) {
		this._shaderValues.setInt(ExtendTerrainMaterial.CULL, value);
	}

	/**
	 * 获取剔除方式。
	 * @return 剔除方式。
	 */
	get cull(): number {
		return this._shaderValues.getInt(ExtendTerrainMaterial.CULL);
	}

	/**
	 * 设置混合方式。
	 * @param value 混合方式。
	 */
	set blend(value: number) {
		this._shaderValues.setInt(ExtendTerrainMaterial.BLEND, value);
	}

	/**
	 * 获取混合方式。
	 * @return 混合方式。
	 */
	get blend(): number {
		return this._shaderValues.getInt(ExtendTerrainMaterial.BLEND);
	}

	/**
	 * 设置混合源。
	 * @param value 混合源
	 */
	set blendSrc(value: number) {
		this._shaderValues.setInt(ExtendTerrainMaterial.BLEND_SRC, value);
	}

	/**
	 * 获取混合源。
	 * @return 混合源。
	 */
	get blendSrc(): number {
		return this._shaderValues.getInt(ExtendTerrainMaterial.BLEND_SRC);
	}

	/**
	 * 设置混合目标。
	 * @param value 混合目标
	 */
	set blendDst(value: number) {
		this._shaderValues.setInt(ExtendTerrainMaterial.BLEND_DST, value);
	}

	/**
	 * 获取混合目标。
	 * @return 混合目标。
	 */
	get blendDst(): number {
		return this._shaderValues.getInt(ExtendTerrainMaterial.BLEND_DST);
	}

	/**
	 * 设置深度测试方式。
	 * @param value 深度测试方式
	 */
	set depthTest(value: number) {
		this._shaderValues.setInt(ExtendTerrainMaterial.DEPTH_TEST, value);
	}

	/**
	 * 获取深度测试方式。
	 * @return 深度测试方式。
	 */
	get depthTest(): number {
		return this._shaderValues.getInt(ExtendTerrainMaterial.DEPTH_TEST);
	}

	constructor() {
		super();
		this.setShaderName("ExtendTerrain");
		this.renderMode = ExtendTerrainMaterial.RENDERMODE_OPAQUE;
	}

	/**
	* 克隆。
	* @return	 克隆副本。
	* @override
	*/
	clone(): any {
		var dest: ExtendTerrainMaterial = new ExtendTerrainMaterial();
		this.cloneTo(dest);
		return dest;
	}

}


