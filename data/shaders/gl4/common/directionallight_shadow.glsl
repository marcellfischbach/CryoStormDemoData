

uniform float cs_DirectionalLightShadowMapLayersBias[4];
uniform mat4 cs_DirectionalLightShadowMapViewProjectionMatrix[16]; // 4(MaxLight) * 4(PSSM-Splits)
uniform sampler2DArrayShadow cs_DirectionalLightShadowMapDepth[4];
uniform vec4 cs_DirectionalLightShadowMapSplitLayers[4];



float calc_directional_shadow(int lightIdx, vec3 world_position, float distance_to_camera)
{
	vec4 layerDepth = cs_DirectionalLightShadowMapSplitLayers[lightIdx];
	float fadeOut = 0.0f;
	int layer = lightIdx * 4;

	if (distance_to_camera <= layerDepth.x)
	{
		layer += 0;
	}
	else if (distance_to_camera <= layerDepth.y)
	{
		layer += 1;
	}
	else if (distance_to_camera <= layerDepth.z)
	{
		layer += 2;
	}
	else if (distance_to_camera <= layerDepth.w)
	{
		layer += 3;

		fadeOut = smoothstep(layerDepth.w - (layerDepth.w - layerDepth.z) * 0.1, layerDepth.w, distance_to_camera);
	}
	else
	{
		return 1.0;
	}

	vec4 camSpace = cs_DirectionalLightShadowMapViewProjectionMatrix[layer] * vec4(world_position, 1.0);
	camSpace /= camSpace.w;
	camSpace = camSpace * 0.5 + 0.5;
	camSpace.z -= cs_DirectionalLightShadowMapLayersBias[lightIdx];

	float shadow_value = texture(cs_DirectionalLightShadowMapDepth[lightIdx], vec4(camSpace.xy, layer, camSpace.z));
	return mix(shadow_value, 1.0, fadeOut);
}