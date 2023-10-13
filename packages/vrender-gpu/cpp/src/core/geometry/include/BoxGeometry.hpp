//
// Created by ByteDance on 2023/8/16.
//

#ifndef VRENDER_GPU_BOXGEOMETRY_HPP
#define VRENDER_GPU_BOXGEOMETRY_HPP

#include "BufferGeometry.hpp"

class BoxGeometry: public BufferGeometry {
public:
    BoxGeometry(): BufferGeometry() {
        mUpdateIndices = false;
        mUseIndices = false;
    };
    ~BoxGeometry() override = default;
    void InIt(float size) override;
private:
    static std::vector<glm::vec<3, float>> sCommonVertices;
    static std::vector<glm::vec<3, float>> sCommonNormals;
    static std::vector<glm::vec<2, float>> sTextureCoords;
//    static std::vector<glm::vec<3, unsigned int>> sCommonIndices;
};

#endif //VRENDER_GPU_BOXGEOMETRY_HPP
