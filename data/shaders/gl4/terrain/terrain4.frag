#version 330

layout(location = 0) out vec4 cs_FragColor;

uniform sampler2D cs_Layer;
uniform sampler2D cs_Mask;
uniform sampler2D cs_DiffuseRoughness0;
uniform sampler2D cs_DiffuseRoughness1;
uniform sampler2D cs_DiffuseRoughness2;
uniform sampler2D cs_DiffuseRoughness3;
uniform sampler2D cs_Normal0;
uniform sampler2D cs_Normal1;
uniform sampler2D cs_Normal2;
uniform sampler2D cs_Normal3;


in vec4 color;
in vec2 texCoord;
in vec3 world_position;
in vec3 world_normal;
in vec3 camera_space_position;
in vec3 viewer_world_position;
in vec2 screen_coord;

#include <../common/lighting.glsl>

float loc_roughness = 0.0;

lighting_result_t calc_lighting (float n_dot_l, float n_dot_v, float n_dot_h, float h_dot_l, float h_dot_v)
{
    lighting_result_t res;
    res.ambient = 0.0;
    res.diffuse = oren_nayar (n_dot_l, n_dot_v, loc_roughness);
    res.specular = cook_torrance(0.8, n_dot_l, n_dot_v, n_dot_h, h_dot_v, loc_roughness);
    return res;
}


void main()
{
    vec3 norm = normalize(world_normal);

    vec4 layer = texture(cs_Layer, texCoord);

    vec3 diffuse = vec3(0.0, 0.0, 0.0);
    loc_roughness = 0.0;
    if (layer.x > 0.0)
    {
        vec4 diffuseRoughness = texture (cs_DiffuseRoughness0, texCoord * 3);
        diffuse += diffuseRoughness.rgb * layer.x;
        loc_roughness += diffuseRoughness.a * layer.x;
    }
    if (layer.y > 0.0)
    {
        vec4 diffuseRoughness = texture (cs_DiffuseRoughness1, texCoord * 3);
        diffuse += diffuseRoughness.rgb * layer.y;
        loc_roughness += diffuseRoughness.a * layer.y;
    }
    if (layer.z > 0.0)
    {
        vec4 diffuseRoughness = texture (cs_DiffuseRoughness2, texCoord * 3);
        diffuse += diffuseRoughness.rgb * layer.z;
        loc_roughness += diffuseRoughness.a * layer.z;
    }
//    if (layer.w > 0.0)
//    {
//        vec4 diffuseRoughness = texture (cs_DiffuseRoughness3, texCoord * 3);
//        diffuse += diffuseRoughness.rgb * layer.w;
//        roughness += diffuseRoughness.a * layer.w;
//    }


    light_result_t light = calc_lights(world_position, norm, camera_space_position, viewer_world_position);
    vec3 dielectric = light.diffuse  * diffuse.rgb + light.specular;
    cs_FragColor = vec4(dielectric, color.a);
//    cs_FragColor = vec4(loc_roughness, loc_roughness, loc_roughness, 1.0);
//    cs_FragColor = vec4(diffuse.rgb, 1.0);

//    cs_FragColor =  vec4(frag_light * diffuse, 1.0);
    //    cs_FragColor = vec4(frag_light, 1.0) * cs_Color;// * texColor;
    //    cs_FragColor = vec4(norm * 0.5 + 0.5, 1.0) * texColor;
}

