export class skeletonUtils {

    public static clone(source) {

        const sourceLookup = new Map();
        const cloneLookup = new Map();
        const clone = source.clone();
        skeletonUtils.parallelTraverse(source, clone, function (sourceNode, clonedNode) {

            sourceLookup.set(clonedNode, sourceNode);
            cloneLookup.set(sourceNode, clonedNode);

        });
        clone.traverse(function (node) {

            if (!node.isSkinnedMesh) return;
            const clonedMesh = node;
            const sourceMesh = sourceLookup.get(node);
            const sourceBones = sourceMesh.skeleton.bones;
            clonedMesh.skeleton = sourceMesh.skeleton.clone();
            clonedMesh.bindMatrix.copy(sourceMesh.bindMatrix);
            clonedMesh.skeleton.bones = sourceBones.map(function (bone) {

                return cloneLookup.get(bone);

            });
            clonedMesh.bind(clonedMesh.skeleton, clonedMesh.bindMatrix);

        });
        return clone;

    }

    public static parallelTraverse(a, b, callback) {

        callback(a, b);

        for (let i = 0; i < a.children.length; i++) {

            skeletonUtils.parallelTraverse(a.children[i], b.children[i], callback);

        }

    }
}