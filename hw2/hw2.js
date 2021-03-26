// defining colors for the clown
var bodyColor = "dodgerblue";
var headColor = "aquamarine";
var eyesColor = "indigo"
var legsColor = "magenta"
var footColor = "springgreen"
var rugColor = "lightpink"

// defining materials for the clown
var bodyMaterial = new THREE.MeshBasicMaterial({ color: bodyColor, side: THREE.DoubleSide });
var headMaterial = new THREE.MeshBasicMaterial({ color: headColor, side: THREE.DoubleSide });
var eyesMaterial = new THREE.MeshBasicMaterial({ color: eyesColor, side: THREE.DoubleSide });
var legsMaterial = new THREE.MeshBasicMaterial({ color: legsColor, side: THREE.DoubleSide });
var footMaterial = new THREE.MeshBasicMaterial({ color: footColor, side: THREE.DoubleSide });
var rugMaterial = new THREE.MeshBasicMaterial({ color: rugColor, side: THREE.DoubleSide });

/**
 * Returns a hat frame object created from hat rim and hat top geometries/meshes.
 * Input: dictionary of clown parameters.
 */
function createHat(params) {
    var hatFrame = new THREE.Object3D();
    var hatBrimGeom = new THREE.CircleGeometry(params.hatBrimRadius, 32);
    var hatCrownGeom = new THREE.CylinderGeometry(params.hatTopRadius, params.hatBottomRadius, params.hatHeight, 64, 64);
    var hatBrimMesh = new THREE.Mesh(hatBrimGeom, bodyMaterial);
    var hatCrownMesh = new THREE.Mesh(hatCrownGeom, bodyMaterial);

    hatCrownMesh.position.y = params.headRadius + params.hatHeight / 2;
    hatBrimMesh.position.y = params.headRadius;
    hatBrimMesh.rotation.x = Math.PI / 2;

    hatFrame.add(hatBrimMesh);
    hatFrame.add(hatCrownMesh);

    return hatFrame;
}

/**
 * Adds the hat frame object to the head.
 * Input: head object, dictionary of clown parameters.
 */
function addHat(head, params) {
    var hatFrame = createHat(params);

    hatFrame.position.y = params.hatOffset;
    hatFrame.rotation.x = params.hatRotationX;
    hatFrame.rotation.z = params.hatRotationZ;

    head.add(hatFrame);

    return head;
}

/**
 * Creates an eye geometry and returns an eye mesh.
 * Input: dictionary of clown parameters.
 */
function createEye(params) {
    var eyeGeom = new THREE.SphereGeometry(params.eyeRadius, 32, 32);
    var eyeMesh = new THREE.Mesh(eyeGeom, eyesMaterial);

    return eyeMesh;
}

/**
 * Adds the eye mesh to the eye frame object, then adds the eye object to the head.
 * Input: head object, dictionary of clown parameters, and side (left = 1, right = -1).
 */
function addEye(head, params, side) {
    var eyeFrame = new THREE.Object3D();
    var eyeMesh = createEye(params);

    eyeMesh.position.z = params.headRadius;
    eyeFrame.rotation.x = params.eyeRotationX
    eyeFrame.rotation.y = side * params.eyeRotationY;

    eyeFrame.add(eyeMesh);
    head.add(eyeFrame);
}

/**
 * Creates a nose geometry and returns a nose mesh.
 * Input: dictionary of clown parameters.
 */
function createNose(params) {
    var noseGeom = new THREE.SphereGeometry(params.noseRadius, 32, 32);
    var noseMesh = new THREE.Mesh(noseGeom, eyesMaterial);

    return noseMesh;
}

/**
 * Adds the nose mesh to the nose frame object, then adds the nose object to the head.
 * Input: head object, dictionary of clown parameters.
 */
function addNose(head, params) {
    var noseFrame = new THREE.Object3D();
    var noseMesh = createNose(params);

    noseMesh.position.z = params.headRadius;
    noseFrame.add(noseMesh);
    noseFrame.rotation.x = params.noseRotation;

    head.add(noseFrame);

    return head;
}

/**
 * Creates an ear geometry and returns an ear mesh.
 * Input: dictionary of clown parameters.
 */
function createEar(params) {
    var earGeom = new THREE.SphereGeometry(params.earRadius, 32, 32);
    var earMesh = new THREE.Mesh(earGeom, eyesMaterial);
    earMesh.scale.z = params.earScaleZ;

    return earMesh;
}

/**
 * Adds the ear mesh to the ear frame object, then adds the ear object to the head.
 * Input: head object, dictionary of clown parameters, and side (left = 1, right = -1).
 */
function addEar(head, params, side) {
    var earFrame = new THREE.Object3D();
    var earMesh = createEar(params);

    earMesh.position.x = side * params.headRadius;
    earFrame.rotation.z = side * params.earRotation;

    earFrame.add(earMesh);
    head.add(earFrame);
}

/**
 * Creates a mouth geometry and returns a mouth mesh.
 * Input: dictionary of clown parameters.
 */
function createMouth(params) {
    var mouthGeom = new THREE.TorusGeometry(params.mouthRadius, params.mouthWidth, 30, 200, -params.mouthArcLength);
    var mouthMesh = new THREE.Mesh(mouthGeom, legsMaterial);

    return mouthMesh;
}

/**
 * Adds the mouth mesh to the mouth frame object, then adds the mouth object to the head.
 * Input: head object, dictionary of clown parameters.
 */
function addMouth(head, params) {
    var mouthFrame = new THREE.Object3D();
    var mouthMesh = createMouth(params);

    mouthMesh.position.z = params.headRadius + 0.2;
    mouthFrame.rotation.x = params.mouthRotation;

    mouthFrame.add(mouthMesh);
    head.add(mouthFrame);
}

/**
 * Adds the head mesh to the head frame object, then adds the head object components to the head.
 * Input: dictionary of clown parameters.
 */
function createHead(params) {
    var headFrame = new THREE.Object3D();
    var headGeom = new THREE.SphereGeometry(params.headRadius, 32, 32);
    var headMesh = new THREE.Mesh(headGeom, headMaterial);

    headFrame.add(headMesh);

    addNose(headFrame, params);
    addMouth(headFrame, params);
    addEar(headFrame, params, 1);
    addEar(headFrame, params, -1);
    addEye(headFrame, params, 1);
    addEye(headFrame, params, -1);
    addHat(headFrame, params);

    return headFrame;
}

/**
 * Builds a arm frame object by creating a limb and adds it to the body.
 * Input: body object, dictionary of clown parameters, and side (left = 1, right = -1).
 */
function addArm(body, params, side) {
    var armFrame = createLimb(params.armRadius, params.armRadius, params.armLength, bodyMaterial, params);

    armFrame.position.set(side * (params.bodyRadius + params.shoulderOffset), params.bodyRadius, 0);
    armFrame.rotation.z = side * params.armRotation;

    addHand(armFrame, params, side);
    addShoulder(armFrame, params, side);

    body.add(armFrame);
}

/**
 * Builds a leg frame object by creating a limb and adds it to the body.
 * Input: leg object, dictionary of clown parameters, and side (left = 1, right = -1).
 */
function addLeg(body, params, side) {
    var legFrame = createLimb(params.legRadius, params.legRadius, params.legLength, legsMaterial, params);
    legFrame.position.set(side * params.hipWidth, -params.bodyRadius, 0);

    addFoot(legFrame, params, side);

    body.add(legFrame);
}

/**
 * Adds the limb mesh to the limb frame object and returns the limb object.
 * Input: limb dimensions (radii and length), limb material, and dictionary of clown parameters.
 */
function createLimb(radiusTop, radiusBottom, length, limbMaterial, params) {
    var limbFrame = new THREE.Object3D();
    var limbGeom = new THREE.CylinderGeometry(radiusTop, radiusBottom, length, 64, 64);
    var limbMesh = new THREE.Mesh(limbGeom, limbMaterial);

    limbMesh.position.y = -length / 2;
    limbFrame.add(limbMesh);

    return limbFrame;
}

/**
 * Creates a foot geometry and returns a foot mesh.
 * Input: dictionary of clown parameters.
 */
function createFoot(params) {
    var footGeom = new THREE.SphereGeometry(params.footRadius, 32, 32, 0, 7, 0, 1.5);
    var footMesh = new THREE.Mesh(footGeom, footMaterial);

    return footMesh;
}

/**
 * Adds the foot mesh to the foot frame object, then adds the foot object to the leg.
 * Input: leg object, dictionary of clown parameters.
 */
function addFoot(leg, params) {
    var footFrame = new THREE.Object3D();
    var footMesh = createFoot(params);

    footFrame.add(footMesh);

    footFrame.position.y = -params.legLength;

    leg.add(footFrame);
}

/**
 * Creates a hand geometry and returns a hand mesh.
 * Input: dictionary of clown parameters.
 */
function createHand(params) {
    var handGeom = new THREE.SphereGeometry(params.handRadius, 32, 32);
    var handMesh = new THREE.Mesh(handGeom, footMaterial);

    return handMesh;
}

/**
 * Adds the hand mesh to the hand frame object, then adds the hand object to the arm.
 * Input: arm object, dictionary of clown parameters.
 */
function addHand(arm, params) {
    var handFrame = new THREE.Object3D();
    var handMesh = createHand(params);

    handFrame.add(handMesh);

    handFrame.position.y = -params.armLength;

    arm.add(handFrame);
}

/**
 * Creates a shoulder geometry and returns a shoulder mesh.
 * Input: dictionary of clown parameters.
 */
function createShoulder(params) {
    var shoulderGeom = new THREE.SphereGeometry(params.shoulderRadius, 32, 32, 0);
    var shoulderMesh = new THREE.Mesh(shoulderGeom, legsMaterial);

    return shoulderMesh;
}

/**
 * Adds the shoulder mesh to the shoulder frame object, then adds the shoulder object to the arm.
 * Input: arm object, dictionary of clown parameters.
 */
function addShoulder(arm, params) {
    var shoulderFrame = new THREE.Object3D();
    var shoulderMesh = createShoulder(params);

    shoulderFrame.add(shoulderMesh);

    shoulderFrame.position.y = 0;

    arm.add(shoulderFrame);
}

/**
 * Adds the body mesh to the body frame object, then adds the body object components to the body.
 * Input: dictionary of clown parameters.
 */
function createBody(params) {
    var bodyFrame = new THREE.Object3D();
    var bodyGeom = new THREE.SphereGeometry(params.bodyRadius, 32, 32);
    var bodyMesh = new THREE.Mesh(bodyGeom, bodyMaterial);

    bodyFrame.add(bodyMesh);

    addArm(bodyFrame, params, 1);
    addArm(bodyFrame, params, -1);
    addLeg(bodyFrame, params, 1);
    addLeg(bodyFrame, params, -1);

    bodyMesh.scale.y = params.bodyScaleY;

    return bodyFrame;
}

/**
 * Adds the body and head meshes to the clown frame object, then returns the clown object.
 * Input: dictionary of clown parameters.
 */
function createClown(params) {
    var clownFrame = new THREE.Object3D();
    var bodyMesh = createBody(params);
    var headMesh = createHead(params);

    var bodyHeight = params.bodyScaleY;
    var bodyRadius = params.bodyRadius;
    var headRadius = params.headRadius;

    headMesh.position.y = bodyHeight * bodyRadius + headRadius - 0.5;

    clownFrame.add(bodyMesh);
    clownFrame.add(headMesh);

    return clownFrame;
}

var clown;  // global variable for the clown object (will be modified upon toggling the slider)

/** 
 * Adds the clown to the scene.
 */
function addClown(params) {
    clown = createClown(params);
    scene.add(clown);
    clown.position.y = params.legLength * 1.5;
}

/** 
 * Adds a rug to the scene.
 */
function addRug(params) {
    var rug = new THREE.Mesh(new THREE.PlaneGeometry(params.width, params.length, 32, 32), rugMaterial);
    rug.rotation.set(-Math.PI / 2, 0, 0);
    scene.add(rug);
}

function addOrigin(radius) {
    var originGeom = new THREE.SphereGeometry(originRadius, 32, 32);
    var originMaterial = new THREE.MeshBasicMaterial({ color: "yellow", side: THREE.DoubleSide });
    var originMesh = new THREE.Mesh(originGeom, originMaterial);
    scene.add(originMesh);
}

// ====================================================================

var scene = new THREE.Scene();  // creates the scene
scene.background = new THREE.Color("lightblue");

// creating origin with yellow dot and adding it to the scene
var originRadius = 0.5;
addOrigin(originRadius);

// global variables for the dimensions of the clown
var clownParams = {
    headRadius: 3.7,
    bodyRadius: 5,
    bodyScaleY: 1.3,

    hatHeight: 4.5,
    hatTopRadius: 3.7,
    hatBottomRadius: 2.5,
    hatBrimRadius: 4.2,
    hatOffset: -1,
    hatRotationX: -0.2,
    hatRotationZ: -0.2,

    eyeRadius: 0.35,
    eyeRotationX: -0.15,
    eyeRotationY: 0.35,

    noseRadius: 0.3,
    noseRotation: 0.05,

    mouthRadius: 0.55,
    mouthWidth: 0.15,
    mouthArcLength: 2.5,
    mouthRotation: 0.3,

    earRadius: 1,
    earScaleZ: 0.5,
    earRotation: 0,

    shoulderOffset: -1,
    shoulderRadius: 1.5,
    armLength: 8,
    armRadius: 0.7,
    armRotation: 0.6,
    handRadius: 1.2,

    hipWidth: 2,
    legLength: 9,
    legRadius: 0.53,
    footRadius: 2
}

addClown(clownParams);

var rugParams = {
    length: 100,
    width: 200,
}

addRug(rugParams);

// ====================================================================

/**
 * Callback function that redraws the clown with the new dimensions.
 */
function redrawClown() {
    scene.remove(clown);
    addClown(clownParams);
    state.render();
}

// sets up sliders with folders by body part to control the clown dimensions
var gui = new dat.GUI();
gui.add(clownParams, 'headRadius', 2, 5).onChange(redrawClown);
gui.add(clownParams, 'bodyRadius', 3, 7).onChange(redrawClown);
gui.add(clownParams, 'bodyScaleY', 1, 1.5).onChange(redrawClown);

var hatFolder = gui.addFolder('hat');
hatFolder.add(clownParams, 'hatHeight', 2, 5).onChange(redrawClown);
hatFolder.add(clownParams, 'hatTopRadius', 2, 5).onChange(redrawClown);
hatFolder.add(clownParams, 'hatBottomRadius', 1, 4).onChange(redrawClown);
hatFolder.add(clownParams, 'hatBrimRadius', 3, 5).onChange(redrawClown);
hatFolder.add(clownParams, 'hatRotationX', -0.5, 1).onChange(redrawClown);
hatFolder.add(clownParams, 'hatRotationZ', -Math.PI / 4, Math.PI / 4).onChange(redrawClown);

var eyesFolder = gui.addFolder('eyes');
eyesFolder.add(clownParams, 'eyeRadius', 0.15, 0.6).onChange(redrawClown);
eyesFolder.add(clownParams, 'eyeRotationX', -0.5, 0).onChange(redrawClown);
eyesFolder.add(clownParams, 'eyeRotationY', 0, 0.5).onChange(redrawClown);

var noseFolder = gui.addFolder('nose');
noseFolder.add(clownParams, 'noseRadius', 0.1, 0.5).onChange(redrawClown);
noseFolder.add(clownParams, 'noseRotation', -0.3, 0.5).onChange(redrawClown);

var mouthFolder = gui.addFolder('mouth');
mouthFolder.add(clownParams, 'mouthRadius', 0.4, 0.8).onChange(redrawClown);
mouthFolder.add(clownParams, 'mouthWidth', 0.1, 0.25).onChange(redrawClown);
mouthFolder.add(clownParams, 'mouthArcLength', 2, 3.3).onChange(redrawClown);
mouthFolder.add(clownParams, 'mouthRotation', 0, 0.5).onChange(redrawClown);

var earsFolder = gui.addFolder('ears');
earsFolder.add(clownParams, 'earRadius', 0.5, 1.5).onChange(redrawClown);
earsFolder.add(clownParams, 'earScaleZ', 0.2, 0.75).onChange(redrawClown);
earsFolder.add(clownParams, 'earRotation', 0, 0.5).onChange(redrawClown);

var armsFolder = gui.addFolder('arms');
armsFolder.add(clownParams, 'shoulderRadius', 1, 2).onChange(redrawClown);
armsFolder.add(clownParams, 'armLength', 5, 10).onChange(redrawClown);
armsFolder.add(clownParams, 'armRadius', 0.2, 1.5).onChange(redrawClown);
armsFolder.add(clownParams, 'armRotation', 0, 1).onChange(redrawClown);
armsFolder.add(clownParams, 'handRadius', 1, 2).onChange(redrawClown);

var legsFolder = gui.addFolder('legs');
legsFolder.add(clownParams, 'hipWidth', 1, 3).onChange(redrawClown);
legsFolder.add(clownParams, 'legLength', 3, 12).onChange(redrawClown);
legsFolder.add(clownParams, 'legRadius', 0.3, 2).onChange(redrawClown);
legsFolder.add(clownParams, 'footRadius', 1.5, 2.5).onChange(redrawClown);

// ====================================================================

// creates a renderer
var renderer = new THREE.WebGLRenderer();

TW.mainInit(renderer, scene);

// uses a default orbiting camera
state = TW.cameraSetup(renderer,
    scene,
    {
        minx: -10, maxx: 10,
        miny: -5, maxy: 40,
        minz: -10, maxz: 10
    }
);