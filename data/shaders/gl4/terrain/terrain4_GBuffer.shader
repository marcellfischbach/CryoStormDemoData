program {
  shaders {
    shader "terrain4_GBuffer.vert",
    shader "terrain4_GBuffer.frag",
  }
  attributes {
    attribute "Layer",
    attribute "Mask",
    attribute "DiffuseRoughness0",
    attribute "DiffuseRoughness1",
    attribute "DiffuseRoughness2",
    attribute "DiffuseRoughness3",
    attribute "Normal0",
    attribute "Normal1",
    attribute "Normal2",
    attribute "Normal3",

  }
}