import { BaseTexture } from "../../resource/BaseTexture";
import { Texture2D } from "../../resource/Texture2D";
import { TextureFormat } from "../../resource/TextureFormat";
import { RenderState } from "../core/material/RenderState";
import { VertexTrail } from "../core/trail/VertexTrail";
import { VertexMesh } from "../graphics/Vertex/VertexMesh";
import { VertexShuriKenParticle } from "../graphics/Vertex/VertexShuriKenParticle";
import { TextureGenerator } from "../resource/TextureGenerator";
import { Utils3D } from "../utils/Utils3D";
import BlitScreenPS from "./files/BlitScreen.fs";
import BlitScreenVS from "./files/BlitScreen.vs";
import EffectPS from "./files/Effect.fs";
import EffectVS from "./files/Effect.vs";
import extendTerrainPS from "./files/extendTerrain.fs";
import extendTerrainVS from "./files/extendTerrain.vs";
import LightingGLSL from "./files/Lighting.glsl";
import linePS from "./files/line.fs";
import lineVS from "./files/line.vs";
import MeshBlinnPhongPS from "./files/Mesh-BlinnPhong.fs";
import MeshBlinnPhongVS from "./files/Mesh-BlinnPhong.vs";
import ParticleShuriKenPS from "./files/ParticleShuriKen.fs";
import ParticleShuriKenVS from "./files/ParticleShuriKen.vs";
import BRDFGLSL from "./files/PBRLibs/BRDF.glsl";
import PBRSpecularLightingGLSL from "./files/PBRLibs/PBRSpecularLighting.glsl";
import PBRStandardLightingGLSL from "./files/PBRLibs/PBRStandardLighting.glsl";
import PBRUtilsGLSL from "./files/PBRLibs/PBRUtils.glsl";
import PBRSpecularPS from "./files/PBRSpecular.fs";
import PBRSpecularVS from "./files/PBRSpecular.vs";
import PBRStandardPS from "./files/PBRStandard.fs";
import PBRStandardVS from "./files/PBRStandard.vs";
import BloomVS from "./files/postProcess/Bloom.vs";
import BloomDownsample13PS from "./files/postProcess/BloomDownsample13.fs";
import BloomDownsample4PS from "./files/postProcess/BloomDownsample4.fs";
import BloomPrefilter13PS from "./files/postProcess/BloomPrefilter13.fs";
import BloomPrefilter4PS from "./files/postProcess/BloomPrefilter4.fs";
import BloomUpsampleBoxPS from "./files/postProcess/BloomUpsampleBox.fs";
import BloomUpsampleTentPS from "./files/postProcess/BloomUpsampleTent.fs";
import ColorsGLSL from "./files/postProcess/Colors.glsl";
import CompositePS from "./files/postProcess/Composite.fs";
import CompositeVS from "./files/postProcess/Composite.vs";
import SamplingGLSL from "./files/postProcess/Sampling.glsl";
import StdLibGLSL from "./files/postProcess/StdLib.glsl";
import ShadowHelperGLSL from "./files/ShadowHelper.glsl";
import SkyBoxPS from "./files/SkyBox.fs";
import SkyBoxVS from "./files/SkyBox.vs";
import SkyBoxProceduralPS from "./files/SkyBoxProcedural.fs";
import SkyBoxProceduralVS from "./files/SkyBoxProcedural.vs";
import TrailPS from "./files/Trail.fs";
import TrailVS from "./files/Trail.vs";
import UnlitPS from "./files/Unlit.fs";
import UnlitVS from "./files/Unlit.vs";
import WaterPrimaryPS from "./files/WaterPrimary.fs";
import WaterPrimaryVS from "./files/WaterPrimary.vs";
import { Shader3D } from "./Shader3D";
import { ShaderPass } from "./ShaderPass";
import { SubShader } from "./SubShader";




/**
 * @internal
 * <code>ShaderInit</code> 类用于初始化内置Shader。
 */
export class ShaderInit3D {
	/**@internal */
	static _rangeAttenTex: Texture2D;

	/**
	 * 创建一个 <code>ShaderInit</code> 实例。
	 */
	constructor() {
	}

	/**
	 * @internal
	 */
	static __init__(): void {
		ShaderInit3D._rangeAttenTex = Utils3D._buildTexture2D(1024, 1, TextureFormat.Alpha8, TextureGenerator.lightAttenTexture);//TODO:移动位置
		ShaderInit3D._rangeAttenTex.wrapModeU = BaseTexture.WARPMODE_CLAMP;
		ShaderInit3D._rangeAttenTex.wrapModeV = BaseTexture.WARPMODE_CLAMP;
		ShaderInit3D._rangeAttenTex.lock = true;
		Shader3D.SHADERDEFINE_HIGHPRECISION = Shader3D.getDefineByName("HIGHPRECISION");
		Shader3D.SHADERDEFINE_LEGACYSINGALLIGHTING = Shader3D.getDefineByName("LEGACYSINGLELIGHTING");


		Shader3D.addInclude("Lighting.glsl", LightingGLSL);
		Shader3D.addInclude("ShadowHelper.glsl", ShadowHelperGLSL);
		Shader3D.addInclude("BRDF.glsl", BRDFGLSL);
		Shader3D.addInclude("PBRUtils.glsl", PBRUtilsGLSL);
		Shader3D.addInclude("PBRStandardLighting.glsl", PBRStandardLightingGLSL);
		Shader3D.addInclude("PBRSpecularLighting.glsl", PBRSpecularLightingGLSL);
		Shader3D.addInclude("Colors.glsl", ColorsGLSL);
		Shader3D.addInclude("Sampling.glsl", SamplingGLSL);
		Shader3D.addInclude("StdLib.glsl", StdLibGLSL);

		var attributeMap: any = {
			'a_Position': VertexMesh.MESH_POSITION0,
			'a_Color': VertexMesh.MESH_COLOR0,
			'a_Normal': VertexMesh.MESH_NORMAL0,
			'a_Texcoord0': VertexMesh.MESH_TEXTURECOORDINATE0,
			'a_Texcoord1': VertexMesh.MESH_TEXTURECOORDINATE1,
			'a_BoneWeights': VertexMesh.MESH_BLENDWEIGHT0,
			'a_BoneIndices': VertexMesh.MESH_BLENDINDICES0,
			'a_Tangent0': VertexMesh.MESH_TANGENT0,
			'a_MvpMatrix': VertexMesh.MESH_MVPMATRIX_ROW0,
			'a_WorldMat': VertexMesh.MESH_WORLDMATRIX_ROW0
		};
		var uniformMap: any = {
			'u_Bones': Shader3D.PERIOD_CUSTOM,
			'u_DiffuseTexture': Shader3D.PERIOD_MATERIAL,
			'u_SpecularTexture': Shader3D.PERIOD_MATERIAL,
			'u_NormalTexture': Shader3D.PERIOD_MATERIAL,
			'u_AlphaTestValue': Shader3D.PERIOD_MATERIAL,
			'u_DiffuseColor': Shader3D.PERIOD_MATERIAL,
			'u_MaterialSpecular': Shader3D.PERIOD_MATERIAL,
			'u_Shininess': Shader3D.PERIOD_MATERIAL,
			'u_TilingOffset': Shader3D.PERIOD_MATERIAL,

			'u_WorldMat': Shader3D.PERIOD_SPRITE,
			'u_MvpMatrix': Shader3D.PERIOD_SPRITE,
			'u_LightmapScaleOffset': Shader3D.PERIOD_SPRITE,
			'u_LightMap': Shader3D.PERIOD_SPRITE,

			'u_CameraPos': Shader3D.PERIOD_CAMERA,
			'u_Viewport': Shader3D.PERIOD_CAMERA,
			'u_ProjectionParams': Shader3D.PERIOD_CAMERA,
			'u_View': Shader3D.PERIOD_CAMERA,

			'u_ReflectTexture': Shader3D.PERIOD_SCENE,
			'u_ReflectIntensity': Shader3D.PERIOD_SCENE,
			'u_FogStart': Shader3D.PERIOD_SCENE,
			'u_FogRange': Shader3D.PERIOD_SCENE,
			'u_FogColor': Shader3D.PERIOD_SCENE,
			'u_DirationLightCount': Shader3D.PERIOD_SCENE,
			'u_LightBuffer': Shader3D.PERIOD_SCENE,
			'u_LightClusterBuffer': Shader3D.PERIOD_SCENE,
			'u_AmbientColor': Shader3D.PERIOD_SCENE,
			'u_shadowMap1': Shader3D.PERIOD_SCENE,
			'u_shadowMap2': Shader3D.PERIOD_SCENE,
			'u_shadowMap3': Shader3D.PERIOD_SCENE,
			'u_shadowPSSMDistance': Shader3D.PERIOD_SCENE,
			'u_lightShadowVP': Shader3D.PERIOD_SCENE,
			'u_shadowPCFoffset': Shader3D.PERIOD_SCENE,

			//legacy lighting
			'u_DirectionLight.color': Shader3D.PERIOD_SCENE,
			'u_DirectionLight.direction': Shader3D.PERIOD_SCENE,
			'u_PointLight.position': Shader3D.PERIOD_SCENE,
			'u_PointLight.range': Shader3D.PERIOD_SCENE,
			'u_PointLight.color': Shader3D.PERIOD_SCENE,
			'u_SpotLight.position': Shader3D.PERIOD_SCENE,
			'u_SpotLight.direction': Shader3D.PERIOD_SCENE,
			'u_SpotLight.range': Shader3D.PERIOD_SCENE,
			'u_SpotLight.spot': Shader3D.PERIOD_SCENE,
			'u_SpotLight.color': Shader3D.PERIOD_SCENE
		};

		var stateMap: any = {
			's_Cull': Shader3D.RENDER_STATE_CULL,
			's_Blend': Shader3D.RENDER_STATE_BLEND,
			's_BlendSrc': Shader3D.RENDER_STATE_BLEND_SRC,
			's_BlendDst': Shader3D.RENDER_STATE_BLEND_DST,
			's_DepthTest': Shader3D.RENDER_STATE_DEPTH_TEST,
			's_DepthWrite': Shader3D.RENDER_STATE_DEPTH_WRITE
		}

		var shader: Shader3D = Shader3D.add("BLINNPHONG", null, null, true);
		var subShader: SubShader = new SubShader(attributeMap, uniformMap);
		shader.addSubShader(subShader);
		subShader.addShaderPass(MeshBlinnPhongVS, MeshBlinnPhongPS, stateMap);


		attributeMap = {
			'a_Position': VertexMesh.MESH_POSITION0,
			'a_Color': VertexMesh.MESH_COLOR0
		};
		uniformMap = {
			'u_MvpMatrix': Shader3D.PERIOD_SPRITE,
			'u_Color': Shader3D.PERIOD_MATERIAL
		};
		stateMap = {
			's_Cull': Shader3D.RENDER_STATE_CULL,
			's_Blend': Shader3D.RENDER_STATE_BLEND,
			's_BlendSrc': Shader3D.RENDER_STATE_BLEND_SRC,
			's_BlendDst': Shader3D.RENDER_STATE_BLEND_DST,
			's_DepthTest': Shader3D.RENDER_STATE_DEPTH_TEST,
			's_DepthWrite': Shader3D.RENDER_STATE_DEPTH_WRITE
		}

		shader = Shader3D.add("LineShader");
		subShader = new SubShader(attributeMap, uniformMap);
		shader.addSubShader(subShader);
		subShader.addShaderPass(lineVS, linePS, stateMap);

		//PBRStandard
		attributeMap = {
			'a_Position': VertexMesh.MESH_POSITION0,
			'a_Normal': VertexMesh.MESH_NORMAL0,
			'a_Tangent0': VertexMesh.MESH_TANGENT0,
			'a_Texcoord0': VertexMesh.MESH_TEXTURECOORDINATE0,
			'a_BoneWeights': VertexMesh.MESH_BLENDWEIGHT0,
			'a_BoneIndices': VertexMesh.MESH_BLENDINDICES0,
			'a_MvpMatrix': VertexMesh.MESH_MVPMATRIX_ROW0,
			'a_WorldMat': VertexMesh.MESH_WORLDMATRIX_ROW0
		};
		uniformMap = {
			'u_Bones': Shader3D.PERIOD_CUSTOM,
			'u_MvpMatrix': Shader3D.PERIOD_SPRITE,
			'u_WorldMat': Shader3D.PERIOD_SPRITE,
			'u_CameraPos': Shader3D.PERIOD_CAMERA,
			'u_AlphaTestValue': Shader3D.PERIOD_MATERIAL,
			'u_AlbedoColor': Shader3D.PERIOD_MATERIAL,
			'u_EmissionColor': Shader3D.PERIOD_MATERIAL,
			'u_AlbedoTexture': Shader3D.PERIOD_MATERIAL,
			'u_NormalTexture': Shader3D.PERIOD_MATERIAL,
			'u_ParallaxTexture': Shader3D.PERIOD_MATERIAL,
			'u_MetallicGlossTexture': Shader3D.PERIOD_MATERIAL,
			'u_OcclusionTexture': Shader3D.PERIOD_MATERIAL,
			'u_EmissionTexture': Shader3D.PERIOD_MATERIAL,
			'u_metallic': Shader3D.PERIOD_MATERIAL,
			'u_smoothness': Shader3D.PERIOD_MATERIAL,
			'u_smoothnessScale': Shader3D.PERIOD_MATERIAL,
			'u_occlusionStrength': Shader3D.PERIOD_MATERIAL,
			'u_normalScale': Shader3D.PERIOD_MATERIAL,
			'u_parallaxScale': Shader3D.PERIOD_MATERIAL,
			'u_TilingOffset': Shader3D.PERIOD_MATERIAL,
			'u_DirectionLight.Direction': Shader3D.PERIOD_SCENE,
			'u_DirectionLight.Color': Shader3D.PERIOD_SCENE,

			'u_PointLightMatrix': Shader3D.PERIOD_SCENE,
			'u_PointLight.Position': Shader3D.PERIOD_SCENE,
			'u_PointLight.Range': Shader3D.PERIOD_SCENE,
			'u_PointLight.Color': Shader3D.PERIOD_SCENE,

			//'u_SpotLightMatrix':  Shader3D.PERIOD_SCENE, 
			'u_SpotLight.Position': Shader3D.PERIOD_SCENE,
			'u_SpotLight.Direction': Shader3D.PERIOD_SCENE,
			'u_SpotLight.Range': Shader3D.PERIOD_SCENE,
			'u_SpotLight.SpotAngle': Shader3D.PERIOD_SCENE,
			'u_SpotLight.Color': Shader3D.PERIOD_SCENE,

			'u_RangeTexture': Shader3D.PERIOD_SCENE,
			//'u_AngleTexture':Shader3D.PERIOD_SCENE,

			'u_ReflectTexture': Shader3D.PERIOD_SCENE,
			'u_ReflectIntensity': Shader3D.PERIOD_SCENE,
			'u_AmbientColor': Shader3D.PERIOD_SCENE,
			'u_shadowMap1': Shader3D.PERIOD_SCENE,
			'u_shadowMap2': Shader3D.PERIOD_SCENE,
			'u_shadowMap3': Shader3D.PERIOD_SCENE,
			'u_shadowPSSMDistance': Shader3D.PERIOD_SCENE,
			'u_lightShadowVP': Shader3D.PERIOD_SCENE,
			'u_shadowPCFoffset': Shader3D.PERIOD_SCENE,
			'u_FogStart': Shader3D.PERIOD_SCENE,
			'u_FogRange': Shader3D.PERIOD_SCENE,
			'u_FogColor': Shader3D.PERIOD_SCENE
		};

		stateMap = {
			's_Cull': Shader3D.RENDER_STATE_CULL,
			's_Blend': Shader3D.RENDER_STATE_BLEND,
			's_BlendSrc': Shader3D.RENDER_STATE_BLEND_SRC,
			's_BlendDst': Shader3D.RENDER_STATE_BLEND_DST,
			's_DepthTest': Shader3D.RENDER_STATE_DEPTH_TEST,
			's_DepthWrite': Shader3D.RENDER_STATE_DEPTH_WRITE
		}

		shader = Shader3D.add("PBRStandard", null, null, true);
		subShader = new SubShader(attributeMap, uniformMap);
		shader.addSubShader(subShader);
		subShader.addShaderPass(PBRStandardVS, PBRStandardPS, stateMap);

		//PBRSpecular
		attributeMap = {
			'a_Position': VertexMesh.MESH_POSITION0,
			'a_Normal': VertexMesh.MESH_NORMAL0,
			'a_Tangent0': VertexMesh.MESH_TANGENT0,
			'a_Texcoord0': VertexMesh.MESH_TEXTURECOORDINATE0,
			'a_BoneWeights': VertexMesh.MESH_BLENDWEIGHT0,
			'a_BoneIndices': VertexMesh.MESH_BLENDINDICES0,
			'a_MvpMatrix': VertexMesh.MESH_MVPMATRIX_ROW0,
			'a_WorldMat': VertexMesh.MESH_WORLDMATRIX_ROW0
		};
		uniformMap = {
			'u_Bones': Shader3D.PERIOD_CUSTOM,
			'u_MvpMatrix': Shader3D.PERIOD_SPRITE,
			'u_WorldMat': Shader3D.PERIOD_SPRITE,
			'u_CameraPos': Shader3D.PERIOD_CAMERA,
			'u_AlphaTestValue': Shader3D.PERIOD_MATERIAL,
			'u_AlbedoColor': Shader3D.PERIOD_MATERIAL,
			'u_SpecularColor': Shader3D.PERIOD_MATERIAL,
			'u_EmissionColor': Shader3D.PERIOD_MATERIAL,
			'u_AlbedoTexture': Shader3D.PERIOD_MATERIAL,
			'u_NormalTexture': Shader3D.PERIOD_MATERIAL,
			'u_ParallaxTexture': Shader3D.PERIOD_MATERIAL,
			'u_SpecularTexture': Shader3D.PERIOD_MATERIAL,
			'u_OcclusionTexture': Shader3D.PERIOD_MATERIAL,
			'u_EmissionTexture': Shader3D.PERIOD_MATERIAL,
			'u_smoothness': Shader3D.PERIOD_MATERIAL,
			'u_smoothnessScale': Shader3D.PERIOD_MATERIAL,
			'u_occlusionStrength': Shader3D.PERIOD_MATERIAL,
			'u_normalScale': Shader3D.PERIOD_MATERIAL,
			'u_parallaxScale': Shader3D.PERIOD_MATERIAL,
			'u_TilingOffset': Shader3D.PERIOD_MATERIAL,
			'u_DirectionLight.Direction': Shader3D.PERIOD_SCENE,
			'u_DirectionLight.Color': Shader3D.PERIOD_SCENE,

			'u_PointLightMatrix': Shader3D.PERIOD_SCENE,
			'u_PointLight.Position': Shader3D.PERIOD_SCENE,
			'u_PointLight.Range': Shader3D.PERIOD_SCENE,
			'u_PointLight.Color': Shader3D.PERIOD_SCENE,

			//'u_SpotLightMatrix':  Shader3D.PERIOD_SCENE, 
			'u_SpotLight.Position': Shader3D.PERIOD_SCENE,
			'u_SpotLight.Direction': Shader3D.PERIOD_SCENE,
			'u_SpotLight.Range': Shader3D.PERIOD_SCENE,
			'u_SpotLight.SpotAngle': Shader3D.PERIOD_SCENE,
			'u_SpotLight.Color': Shader3D.PERIOD_SCENE,

			'u_RangeTexture': Shader3D.PERIOD_SCENE,
			//'u_AngleTexture': Shader3D.PERIOD_SCENE,

			'u_ReflectTexture': Shader3D.PERIOD_SCENE,
			'u_ReflectIntensity': Shader3D.PERIOD_SCENE,
			'u_AmbientColor': Shader3D.PERIOD_SCENE,
			'u_shadowMap1': Shader3D.PERIOD_SCENE,
			'u_shadowMap2': Shader3D.PERIOD_SCENE,
			'u_shadowMap3': Shader3D.PERIOD_SCENE,
			'u_shadowPSSMDistance': Shader3D.PERIOD_SCENE,
			'u_lightShadowVP': Shader3D.PERIOD_SCENE,
			'u_shadowPCFoffset': Shader3D.PERIOD_SCENE,
			'u_FogStart': Shader3D.PERIOD_SCENE,
			'u_FogRange': Shader3D.PERIOD_SCENE,
			'u_FogColor': Shader3D.PERIOD_SCENE
		};

		stateMap = {
			's_Cull': Shader3D.RENDER_STATE_CULL,
			's_Blend': Shader3D.RENDER_STATE_BLEND,
			's_BlendSrc': Shader3D.RENDER_STATE_BLEND_SRC,
			's_BlendDst': Shader3D.RENDER_STATE_BLEND_DST,
			's_DepthTest': Shader3D.RENDER_STATE_DEPTH_TEST,
			's_DepthWrite': Shader3D.RENDER_STATE_DEPTH_WRITE
		}

		shader = Shader3D.add("PBRSpecular", null, null, true);
		subShader = new SubShader(attributeMap, uniformMap);
		shader.addSubShader(subShader);

		subShader.addShaderPass(PBRSpecularVS, PBRSpecularPS, stateMap);

		//unlit
		attributeMap = {
			'a_Position': VertexMesh.MESH_POSITION0,
			'a_Color': VertexMesh.MESH_COLOR0,
			'a_Texcoord0': VertexMesh.MESH_TEXTURECOORDINATE0,
			'a_BoneWeights': VertexMesh.MESH_BLENDWEIGHT0,
			'a_BoneIndices': VertexMesh.MESH_BLENDINDICES0,
			'a_MvpMatrix': VertexMesh.MESH_MVPMATRIX_ROW0
		};
		uniformMap = {
			'u_Bones': Shader3D.PERIOD_CUSTOM,
			'u_AlbedoTexture': Shader3D.PERIOD_MATERIAL,
			'u_AlbedoColor': Shader3D.PERIOD_MATERIAL,
			'u_TilingOffset': Shader3D.PERIOD_MATERIAL,
			'u_AlphaTestValue': Shader3D.PERIOD_MATERIAL,
			'u_MvpMatrix': Shader3D.PERIOD_SPRITE,
			'u_FogStart': Shader3D.PERIOD_SCENE,
			'u_FogRange': Shader3D.PERIOD_SCENE,
			'u_FogColor': Shader3D.PERIOD_SCENE
		};
		stateMap = {
			's_Cull': Shader3D.RENDER_STATE_CULL,
			's_Blend': Shader3D.RENDER_STATE_BLEND,
			's_BlendSrc': Shader3D.RENDER_STATE_BLEND_SRC,
			's_BlendDst': Shader3D.RENDER_STATE_BLEND_DST,
			's_DepthTest': Shader3D.RENDER_STATE_DEPTH_TEST,
			's_DepthWrite': Shader3D.RENDER_STATE_DEPTH_WRITE
		}

		shader = Shader3D.add("Unlit", null, null, true);
		subShader = new SubShader(attributeMap, uniformMap);
		shader.addSubShader(subShader);
		subShader.addShaderPass(UnlitVS, UnlitPS, stateMap);

		//meshEffect
		attributeMap = {
			'a_Position': VertexMesh.MESH_POSITION0,
			'a_Texcoord0': VertexMesh.MESH_TEXTURECOORDINATE0,
			'a_BoneWeights': VertexMesh.MESH_BLENDWEIGHT0,
			'a_BoneIndices': VertexMesh.MESH_BLENDINDICES0,
			'a_MvpMatrix': VertexMesh.MESH_MVPMATRIX_ROW0
		};
		uniformMap = {
			'u_Bones': Shader3D.PERIOD_CUSTOM,
			'u_AlbedoTexture': Shader3D.PERIOD_MATERIAL,
			'u_AlbedoColor': Shader3D.PERIOD_MATERIAL,
			'u_TilingOffset': Shader3D.PERIOD_MATERIAL,
			'u_AlphaTestValue': Shader3D.PERIOD_MATERIAL,
			'u_MvpMatrix': Shader3D.PERIOD_SPRITE,
			'u_FogStart': Shader3D.PERIOD_SCENE,
			'u_FogRange': Shader3D.PERIOD_SCENE,
			'u_FogColor': Shader3D.PERIOD_SCENE
		};
		stateMap = {
			's_Cull': Shader3D.RENDER_STATE_CULL,
			's_Blend': Shader3D.RENDER_STATE_BLEND,
			's_BlendSrc': Shader3D.RENDER_STATE_BLEND_SRC,
			's_BlendDst': Shader3D.RENDER_STATE_BLEND_DST,
			's_DepthTest': Shader3D.RENDER_STATE_DEPTH_TEST,
			's_DepthWrite': Shader3D.RENDER_STATE_DEPTH_WRITE
		}

		shader = Shader3D.add("Effect", null, null, true);
		subShader = new SubShader(attributeMap, uniformMap);
		shader.addSubShader(subShader);
		subShader.addShaderPass(EffectVS, EffectPS, stateMap);

		//ShurikenParticle
		attributeMap = {
			'a_CornerTextureCoordinate': VertexShuriKenParticle.PARTICLE_CORNERTEXTURECOORDINATE0,
			'a_MeshPosition': VertexShuriKenParticle.PARTICLE_POSITION0,
			'a_MeshColor': VertexShuriKenParticle.PARTICLE_COLOR0,
			'a_MeshTextureCoordinate': VertexShuriKenParticle.PARTICLE_TEXTURECOORDINATE0,
			'a_ShapePositionStartLifeTime': VertexShuriKenParticle.PARTICLE_SHAPEPOSITIONSTARTLIFETIME,
			'a_DirectionTime': VertexShuriKenParticle.PARTICLE_DIRECTIONTIME,
			'a_StartColor': VertexShuriKenParticle.PARTICLE_STARTCOLOR0,
			'a_EndColor': VertexShuriKenParticle.PARTICLE_ENDCOLOR0,
			'a_StartSize': VertexShuriKenParticle.PARTICLE_STARTSIZE,
			'a_StartRotation0': VertexShuriKenParticle.PARTICLE_STARTROTATION,
			'a_StartSpeed': VertexShuriKenParticle.PARTICLE_STARTSPEED,
			'a_Random0': VertexShuriKenParticle.PARTICLE_RANDOM0,
			'a_Random1': VertexShuriKenParticle.PARTICLE_RANDOM1,
			'a_SimulationWorldPostion': VertexShuriKenParticle.PARTICLE_SIMULATIONWORLDPOSTION,
			'a_SimulationWorldRotation': VertexShuriKenParticle.PARTICLE_SIMULATIONWORLDROTATION
		};
		uniformMap = {
			'u_Tintcolor': Shader3D.PERIOD_MATERIAL,
			'u_TilingOffset': Shader3D.PERIOD_MATERIAL,
			'u_texture': Shader3D.PERIOD_MATERIAL,
			'u_WorldPosition': Shader3D.PERIOD_SPRITE,
			'u_WorldRotation': Shader3D.PERIOD_SPRITE,
			'u_PositionScale': Shader3D.PERIOD_SPRITE,
			'u_SizeScale': Shader3D.PERIOD_SPRITE,
			'u_ScalingMode': Shader3D.PERIOD_SPRITE,
			'u_Gravity': Shader3D.PERIOD_SPRITE,
			'u_ThreeDStartRotation': Shader3D.PERIOD_SPRITE,
			'u_StretchedBillboardLengthScale': Shader3D.PERIOD_SPRITE,
			'u_StretchedBillboardSpeedScale': Shader3D.PERIOD_SPRITE,
			'u_SimulationSpace': Shader3D.PERIOD_SPRITE,
			'u_CurrentTime': Shader3D.PERIOD_SPRITE,
			'u_ColorOverLifeGradientAlphas': Shader3D.PERIOD_SPRITE,
			'u_ColorOverLifeGradientColors': Shader3D.PERIOD_SPRITE,
			'u_MaxColorOverLifeGradientAlphas': Shader3D.PERIOD_SPRITE,
			'u_MaxColorOverLifeGradientColors': Shader3D.PERIOD_SPRITE,
			'u_VOLVelocityConst': Shader3D.PERIOD_SPRITE,
			'u_VOLVelocityGradientX': Shader3D.PERIOD_SPRITE,
			'u_VOLVelocityGradientY': Shader3D.PERIOD_SPRITE,
			'u_VOLVelocityGradientZ': Shader3D.PERIOD_SPRITE,
			'u_VOLVelocityConstMax': Shader3D.PERIOD_SPRITE,
			'u_VOLVelocityGradientMaxX': Shader3D.PERIOD_SPRITE,
			'u_VOLVelocityGradientMaxY': Shader3D.PERIOD_SPRITE,
			'u_VOLVelocityGradientMaxZ': Shader3D.PERIOD_SPRITE,
			'u_VOLSpaceType': Shader3D.PERIOD_SPRITE,
			'u_SOLSizeGradient': Shader3D.PERIOD_SPRITE,
			'u_SOLSizeGradientX': Shader3D.PERIOD_SPRITE,
			'u_SOLSizeGradientY': Shader3D.PERIOD_SPRITE,
			'u_SOLSizeGradientZ': Shader3D.PERIOD_SPRITE,
			'u_SOLSizeGradientMax': Shader3D.PERIOD_SPRITE,
			'u_SOLSizeGradientMaxX': Shader3D.PERIOD_SPRITE,
			'u_SOLSizeGradientMaxY': Shader3D.PERIOD_SPRITE,
			'u_SOLSizeGradientMaxZ': Shader3D.PERIOD_SPRITE,
			'u_ROLAngularVelocityConst': Shader3D.PERIOD_SPRITE,
			'u_ROLAngularVelocityConstSeprarate': Shader3D.PERIOD_SPRITE,
			'u_ROLAngularVelocityGradient': Shader3D.PERIOD_SPRITE,
			'u_ROLAngularVelocityGradientX': Shader3D.PERIOD_SPRITE,
			'u_ROLAngularVelocityGradientY': Shader3D.PERIOD_SPRITE,
			'u_ROLAngularVelocityGradientZ': Shader3D.PERIOD_SPRITE,
			'u_ROLAngularVelocityConstMax': Shader3D.PERIOD_SPRITE,
			'u_ROLAngularVelocityConstMaxSeprarate': Shader3D.PERIOD_SPRITE,
			'u_ROLAngularVelocityGradientMax': Shader3D.PERIOD_SPRITE,
			'u_ROLAngularVelocityGradientMaxX': Shader3D.PERIOD_SPRITE,
			'u_ROLAngularVelocityGradientMaxY': Shader3D.PERIOD_SPRITE,
			'u_ROLAngularVelocityGradientMaxZ': Shader3D.PERIOD_SPRITE,
			'u_ROLAngularVelocityGradientMaxW': Shader3D.PERIOD_SPRITE,
			'u_TSACycles': Shader3D.PERIOD_SPRITE,
			'u_TSASubUVLength': Shader3D.PERIOD_SPRITE,
			'u_TSAGradientUVs': Shader3D.PERIOD_SPRITE,
			'u_TSAMaxGradientUVs': Shader3D.PERIOD_SPRITE,
			'u_CameraPos': Shader3D.PERIOD_CAMERA,
			'u_CameraDirection': Shader3D.PERIOD_CAMERA,
			'u_CameraUp': Shader3D.PERIOD_CAMERA,
			'u_View': Shader3D.PERIOD_CAMERA,
			'u_Projection': Shader3D.PERIOD_CAMERA,
			'u_FogStart': Shader3D.PERIOD_SCENE,
			'u_FogRange': Shader3D.PERIOD_SCENE,
			'u_FogColor': Shader3D.PERIOD_SCENE
		};
		stateMap = {
			's_Cull': Shader3D.RENDER_STATE_CULL,
			's_Blend': Shader3D.RENDER_STATE_BLEND,
			's_BlendSrc': Shader3D.RENDER_STATE_BLEND_SRC,
			's_BlendDst': Shader3D.RENDER_STATE_BLEND_DST,
			's_DepthTest': Shader3D.RENDER_STATE_DEPTH_TEST,
			's_DepthWrite': Shader3D.RENDER_STATE_DEPTH_WRITE
		};

		shader = Shader3D.add("PARTICLESHURIKEN");
		subShader = new SubShader(attributeMap, uniformMap);
		shader.addSubShader(subShader);
		subShader.addShaderPass(ParticleShuriKenVS, ParticleShuriKenPS, stateMap);

		attributeMap = {
			'a_Position': VertexMesh.MESH_POSITION0
		};
		uniformMap = {
			'u_TintColor': Shader3D.PERIOD_MATERIAL,
			'u_Exposure': Shader3D.PERIOD_MATERIAL,
			'u_Rotation': Shader3D.PERIOD_MATERIAL,
			'u_CubeTexture': Shader3D.PERIOD_MATERIAL,
			'u_ViewProjection': Shader3D.PERIOD_CAMERA
		};//TODO:优化

		shader = Shader3D.add("SkyBox");
		subShader = new SubShader(attributeMap, uniformMap);
		shader.addSubShader(subShader);
		subShader.addShaderPass(SkyBoxVS, SkyBoxPS);

		attributeMap = {
			'a_Position': VertexMesh.MESH_POSITION0
		};
		uniformMap = {
			'u_SunSize': Shader3D.PERIOD_MATERIAL,
			'u_SunSizeConvergence': Shader3D.PERIOD_MATERIAL,
			'u_AtmosphereThickness': Shader3D.PERIOD_MATERIAL,
			'u_SkyTint': Shader3D.PERIOD_MATERIAL,
			'u_GroundTint': Shader3D.PERIOD_MATERIAL,
			'u_Exposure': Shader3D.PERIOD_MATERIAL,
			'u_ViewProjection': Shader3D.PERIOD_CAMERA,//TODO:优化
			'u_SunLight.direction': Shader3D.PERIOD_SCENE,
			'u_SunLight.color': Shader3D.PERIOD_SCENE,
		};

		shader = Shader3D.add("SkyBoxProcedural");
		subShader = new SubShader(attributeMap, uniformMap);
		shader.addSubShader(subShader);
		subShader.addShaderPass(SkyBoxProceduralVS, SkyBoxProceduralPS);

		//extendTerrain的shader
		attributeMap = {
			'a_Position': VertexMesh.MESH_POSITION0,
			'a_Normal': VertexMesh.MESH_NORMAL0,
			'a_Texcoord0': VertexMesh.MESH_TEXTURECOORDINATE0
		};
		uniformMap = {
			'u_MvpMatrix': Shader3D.PERIOD_SPRITE,
			'u_WorldMat': Shader3D.PERIOD_SPRITE,
			'u_CameraPos': Shader3D.PERIOD_CAMERA,
			'u_LightmapScaleOffset': Shader3D.PERIOD_SPRITE,
			'u_LightMap': Shader3D.PERIOD_SPRITE,
			'u_SplatAlphaTexture': Shader3D.PERIOD_MATERIAL,
			'u_DiffuseTexture1': Shader3D.PERIOD_MATERIAL,
			'u_DiffuseTexture2': Shader3D.PERIOD_MATERIAL,
			'u_DiffuseTexture3': Shader3D.PERIOD_MATERIAL,
			'u_DiffuseTexture4': Shader3D.PERIOD_MATERIAL,
			'u_DiffuseTexture5': Shader3D.PERIOD_MATERIAL,
			'u_DiffuseScaleOffset1': Shader3D.PERIOD_MATERIAL,
			'u_DiffuseScaleOffset2': Shader3D.PERIOD_MATERIAL,
			'u_DiffuseScaleOffset3': Shader3D.PERIOD_MATERIAL,
			'u_DiffuseScaleOffset4': Shader3D.PERIOD_MATERIAL,
			'u_DiffuseScaleOffset5': Shader3D.PERIOD_MATERIAL,
			'u_FogStart': Shader3D.PERIOD_SCENE,
			'u_FogRange': Shader3D.PERIOD_SCENE,
			'u_FogColor': Shader3D.PERIOD_SCENE,
			'u_DirectionLight.Direction': Shader3D.PERIOD_SCENE,
			'u_DirectionLight.Color': Shader3D.PERIOD_SCENE,
			'u_PointLight.Position': Shader3D.PERIOD_SCENE,
			'u_PointLight.Range': Shader3D.PERIOD_SCENE,
			'u_PointLight.Attenuation': Shader3D.PERIOD_SCENE,
			'u_PointLight.Color': Shader3D.PERIOD_SCENE,
			'u_SpotLight.Position': Shader3D.PERIOD_SCENE,
			'u_SpotLight.Direction': Shader3D.PERIOD_SCENE,
			'u_SpotLight.Range': Shader3D.PERIOD_SCENE,
			'u_SpotLight.Spot': Shader3D.PERIOD_SCENE,

			'u_SpotLight.Color': Shader3D.PERIOD_SCENE,
			'u_AmbientColor': Shader3D.PERIOD_SCENE,
			'u_shadowMap1': Shader3D.PERIOD_SCENE,
			'u_shadowMap2': Shader3D.PERIOD_SCENE,
			'u_shadowMap3': Shader3D.PERIOD_SCENE,
			'u_shadowPSSMDistance': Shader3D.PERIOD_SCENE,
			'u_lightShadowVP': Shader3D.PERIOD_SCENE,
			'u_shadowPCFoffset': Shader3D.PERIOD_SCENE
		};
		stateMap = {
			's_Cull': Shader3D.RENDER_STATE_CULL,
			's_Blend': Shader3D.RENDER_STATE_BLEND,
			's_BlendSrc': Shader3D.RENDER_STATE_BLEND_SRC,
			's_BlendDst': Shader3D.RENDER_STATE_BLEND_DST,
			's_DepthTest': Shader3D.RENDER_STATE_DEPTH_TEST,
			's_DepthWrite': Shader3D.RENDER_STATE_DEPTH_WRITE
		};

		shader = Shader3D.add("ExtendTerrain");
		subShader = new SubShader(attributeMap, uniformMap);
		shader.addSubShader(subShader);
		subShader.addShaderPass(extendTerrainVS, extendTerrainPS, stateMap);

		//Trail
		attributeMap = {
			'a_Position': VertexTrail.TRAIL_POSITION0,
			'a_OffsetVector': VertexTrail.TRAIL_OFFSETVECTOR,
			'a_Texcoord0X': VertexTrail.TRAIL_TEXTURECOORDINATE0X,
			'a_Texcoord0Y': VertexTrail.TRAIL_TEXTURECOORDINATE0Y,
			'a_BirthTime': VertexTrail.TRAIL_TIME0,
			'a_Color': VertexTrail.TRAIL_COLOR
		};
		uniformMap = {
			'u_MvpMatrix': Shader3D.PERIOD_SPRITE,
			'u_View': Shader3D.PERIOD_CAMERA,
			'u_Projection': Shader3D.PERIOD_CAMERA,
			'u_TilingOffset': Shader3D.PERIOD_MATERIAL,
			'u_MainTexture': Shader3D.PERIOD_MATERIAL,
			'u_MainColor': Shader3D.PERIOD_MATERIAL,
			'u_CurTime': Shader3D.PERIOD_SPRITE,
			'u_LifeTime': Shader3D.PERIOD_SPRITE,
			'u_WidthCurve': Shader3D.PERIOD_SPRITE,
			'u_WidthCurveKeyLength': Shader3D.PERIOD_SPRITE,
			'u_GradientColorkey': Shader3D.PERIOD_SPRITE,
			'u_GradientAlphakey': Shader3D.PERIOD_SPRITE
		};
		stateMap = {
			's_Cull': Shader3D.RENDER_STATE_CULL,
			's_Blend': Shader3D.RENDER_STATE_BLEND,
			's_BlendSrc': Shader3D.RENDER_STATE_BLEND_SRC,
			's_BlendDst': Shader3D.RENDER_STATE_BLEND_DST,
			's_DepthTest': Shader3D.RENDER_STATE_DEPTH_TEST,
			's_DepthWrite': Shader3D.RENDER_STATE_DEPTH_WRITE
		};

		shader = Shader3D.add("Trail");
		subShader = new SubShader(attributeMap, uniformMap);
		shader.addSubShader(subShader);
		subShader.addShaderPass(TrailVS, TrailPS, stateMap);

		//WaterPrimary
		attributeMap = {
			'a_Position': VertexMesh.MESH_POSITION0,
			'a_Normal': VertexMesh.MESH_NORMAL0,
			'a_Tangent0': VertexMesh.MESH_TANGENT0
		};
		uniformMap = {
			'u_MvpMatrix': Shader3D.PERIOD_SPRITE,
			'u_WorldMat': Shader3D.PERIOD_SPRITE,
			'u_CameraPos': Shader3D.PERIOD_CAMERA,
			'u_Time': Shader3D.PERIOD_SCENE,
			'u_MainTexture': Shader3D.PERIOD_MATERIAL,
			'u_NormalTexture': Shader3D.PERIOD_MATERIAL,
			'u_HorizonColor': Shader3D.PERIOD_MATERIAL,
			'u_WaveScale': Shader3D.PERIOD_MATERIAL,
			'u_WaveSpeed': Shader3D.PERIOD_MATERIAL
		};

		shader = Shader3D.add("WaterPrimary");
		subShader = new SubShader(attributeMap, uniformMap);
		shader.addSubShader(subShader);
		subShader.addShaderPass(WaterPrimaryVS, WaterPrimaryPS);


		//BlitScreen
		attributeMap = {
			'a_PositionTexcoord': VertexMesh.MESH_POSITION0
		};
		uniformMap = {
			'u_MainTex': Shader3D.PERIOD_MATERIAL
		};


		shader = Shader3D.add("BlitScreen");
		subShader = new SubShader(attributeMap, uniformMap);
		shader.addSubShader(subShader);
		var shaderPass: ShaderPass = subShader.addShaderPass(BlitScreenVS, BlitScreenPS);
		var renderState: RenderState = shaderPass.renderState;
		renderState.depthTest = RenderState.DEPTHTEST_ALWAYS;
		renderState.depthWrite = false;
		renderState.cull = RenderState.CULL_NONE;
		renderState.blend = RenderState.BLEND_DISABLE;


		//PostProcessBloom
		attributeMap = {
			'a_PositionTexcoord': VertexMesh.MESH_POSITION0
		};
		uniformMap = {
			'u_MainTex': Shader3D.PERIOD_MATERIAL,
			'u_BloomTex': Shader3D.PERIOD_MATERIAL,
			'u_AutoExposureTex': Shader3D.PERIOD_MATERIAL,
			'u_MainTex_TexelSize': Shader3D.PERIOD_MATERIAL,
			'u_SampleScale': Shader3D.PERIOD_MATERIAL,
			'u_Threshold': Shader3D.PERIOD_MATERIAL,
			'u_Params': Shader3D.PERIOD_MATERIAL
		};
		shader = Shader3D.add("PostProcessBloom", attributeMap, uniformMap);

		//subShader0
		subShader = new SubShader(null, null);
		shader.addSubShader(subShader);
		shaderPass = subShader.addShaderPass(BloomVS, BloomPrefilter13PS);
		renderState = shaderPass.renderState;
		renderState.depthTest = RenderState.DEPTHTEST_ALWAYS;
		renderState.depthWrite = false;
		renderState.cull = RenderState.CULL_NONE;
		renderState.blend = RenderState.BLEND_DISABLE;

		//subShader1
		subShader = new SubShader(null, null);
		shader.addSubShader(subShader);
		shaderPass = subShader.addShaderPass(BloomVS, BloomPrefilter4PS);
		renderState = shaderPass.renderState;
		renderState.depthTest = RenderState.DEPTHTEST_ALWAYS;
		renderState.depthWrite = false;
		renderState.cull = RenderState.CULL_NONE;
		renderState.blend = RenderState.BLEND_DISABLE;

		//subShader2
		subShader = new SubShader(null, null);
		shader.addSubShader(subShader);
		shaderPass = subShader.addShaderPass(BloomVS, BloomDownsample13PS);
		renderState = shaderPass.renderState;
		renderState.depthTest = RenderState.DEPTHTEST_ALWAYS;
		renderState.depthWrite = false;
		renderState.cull = RenderState.CULL_NONE;
		renderState.blend = RenderState.BLEND_DISABLE;

		//subShader3
		subShader = new SubShader(null, null);
		shader.addSubShader(subShader);
		shaderPass = subShader.addShaderPass(BloomVS, BloomDownsample4PS);
		renderState = shaderPass.renderState;
		renderState.depthTest = RenderState.DEPTHTEST_ALWAYS;
		renderState.depthWrite = false;
		renderState.cull = RenderState.CULL_NONE;
		renderState.blend = RenderState.BLEND_DISABLE;

		//subShader4
		subShader = new SubShader(null, null);
		shader.addSubShader(subShader);
		shaderPass = subShader.addShaderPass(BloomVS, BloomUpsampleTentPS);
		renderState = shaderPass.renderState;
		renderState.depthTest = RenderState.DEPTHTEST_ALWAYS;
		renderState.depthWrite = false;
		renderState.cull = RenderState.CULL_NONE;
		renderState.blend = RenderState.BLEND_DISABLE;

		//subShader5
		subShader = new SubShader(null, null);
		shader.addSubShader(subShader);
		shaderPass = subShader.addShaderPass(BloomVS, BloomUpsampleBoxPS);
		renderState = shaderPass.renderState;
		renderState.depthTest = RenderState.DEPTHTEST_ALWAYS;
		renderState.depthWrite = false;
		renderState.cull = RenderState.CULL_NONE;
		renderState.blend = RenderState.BLEND_DISABLE;

		//PostProcessBloom
		attributeMap = {
			'a_PositionTexcoord': VertexMesh.MESH_POSITION0
		};
		uniformMap = {
			'u_MainTex': Shader3D.PERIOD_MATERIAL,
			'u_BloomTex': Shader3D.PERIOD_MATERIAL,
			'u_AutoExposureTex': Shader3D.PERIOD_MATERIAL,
			'u_Bloom_DirtTileOffset': Shader3D.PERIOD_MATERIAL,
			'u_Bloom_DirtTex': Shader3D.PERIOD_MATERIAL,
			'u_BloomTex_TexelSize': Shader3D.PERIOD_MATERIAL,
			'u_Bloom_Settings': Shader3D.PERIOD_MATERIAL,
			'u_Bloom_Color': Shader3D.PERIOD_MATERIAL
		};
		shader = Shader3D.add("PostProcessComposite", attributeMap, uniformMap);

		subShader = new SubShader(null, null);
		shader.addSubShader(subShader);
		shaderPass = subShader.addShaderPass(CompositeVS, CompositePS);
		renderState = shaderPass.renderState;
		renderState.depthTest = RenderState.DEPTHTEST_ALWAYS;
		renderState.depthWrite = false;
		renderState.cull = RenderState.CULL_NONE;
		renderState.blend = RenderState.BLEND_DISABLE;
	}
}

