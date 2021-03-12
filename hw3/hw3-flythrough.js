// create a scene with a barn, 3 fences, and ground

function makeBarnScene() {
    // create three fences and add them to the scene
    fence1 = makeFence(40);
    fence1.translateX(5);
    fence2 = fence1.clone();
    fence2.translateZ(-10);
    fence3 = makeFence(100);
    fence3.translateX(9.2);
    fence3.rotation.y = Math.PI / 2;
    scene.add(fence1);
    scene.add(fence2);
    scene.add(fence3);
    // create a barn and add it to the scene
    var barn = new TW.createMesh(TW.createBarn(5, 5, 10));
    scene.add(barn);
    // create the ground plane and add it to the scene
    var gc = THREE.ColorKeywords.darkgreen;
    var ground = new THREE.Mesh(new THREE.PlaneGeometry(20, 20),
        new THREE.MeshBasicMaterial({ color: gc }));
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);
}

function makeFence(numPickets) {
    // makes a fence with the left end at the origin and proceeding
    // down the x axis. The pickets are made from barn objects, scaled
    // to be unit height (at the shoulder) and very thin
    var fence = new THREE.Object3D();
    var picketG = TW.createBarn(.09, 1, 0.1);
    var picket = new THREE.Mesh(picketG, new THREE.MeshNormalMaterial());
    for (var i = 0; i < numPickets; ++i) {
        picket = picket.clone();
        picket.translateX(0.1);
        fence.add(picket);
    }
    return fence;
}

// ====================================================================

/**
 * Creates and returns a camera with the desired parameters.
 * Input: dictionary of camera parameters.
 */
function setupCamera(cameraParameters) {
    var cp = cameraParameters;
    var camera = new THREE.PerspectiveCamera(cp.fov, cp.aspectRatio,
        cp.near, cp.far);
    camera.position.set(cp.eyeX, cp.eyeY, cp.eyeZ);
    camera.up.set(cp.upX, cp.upY, cp.upZ);
    camera.lookAt(new THREE.Vector3(cp.atX, cp.atY, cp.atZ));
    return camera;
}

/**
 * Renders the scene with the camera.
 */
function render() {
    renderer.render(scene, camera);
}

/**
 * Updates the frame number of the frameNum DOM.
 * When the user tries to see the frame after 10,
 * the scene resets to 0. Similarly, when the user tries
 * to see the frame before 0, the scene resets to 10.
 */
function updateFrameNum(isLanding) {
    var frameDOM = document.getElementById('frameNum');
    var frameInfo = frameDOM.innerHTML;
    if (isLanding) {
        var num = parseInt(frameInfo.split(" ")[1]) + 1;
    } else {
        var num = parseInt(frameInfo.split(" ")[1]) - 1;
    }

    if (num > 10) {
        num = 0;  // reset frame number to 0
    }

    if (num < 0) {
        num = 10;  // reset frame number to 10
    }

    frameDOM.innerHTML = "Frame " + num;

    return num;
}

/**
 * Removes and adds a new camera with the updated camera parameters.
 * Gets the callback function's KeyBoardEvent dictionary to
 * determine which key was pressed.
 * If n was pressed, zoom in,
 * If d was pressed, zoom out.
 */
function redoCamera(keyBoardEvent) {
    // if true, n was pressed, otherwise, d was pressed
    var isLanding = keyBoardEvent['key'] == 'n';
    // copy the global parameters (don't modify the original)
    var newCP = { ...cameraParams };
    scene.remove(camera);
    frame = updateFrameNum(isLanding);

    // decrease new eyeY
    newCP.eyeY = cameraParams.eyeY - cameraParams.changeX * frame;
    // decrease new eyeZ   
    newCP.eyeZ = cameraParams.eyeZ - cameraParams.changeY * frame;
    newCP.atY = frame;

    camera = setupCamera(newCP);
    scene.add(camera);
    render();
}

// ====================================================================

// global variables for the camera dimensions
var cameraParams = {
    near: 1,
    far: 100,
    fov: 90,  // degrees
    aspectRatio: 800 / 500,  // from dimensions of the canvas, see CSS
    atX: 0,
    atY: 0,
    atZ: 0,
    eyeX: 0,
    eyeY: 60,
    eyeZ: 60,
    upX: 0,
    upY: 1,
    upZ: 0,
    changeX: 5.5,  // how much to change the eyeY variable by
    changeY: 4.5  // how much to change the eyeX variable by
};

var scene = new THREE.Scene();
makeBarnScene();

var renderer = new THREE.WebGLRenderer();  // create a renderer
TW.mainInit(renderer, scene);

// create camera, add to scene, and render scene with new camera
var camera = setupCamera(cameraParams);
scene.add(camera);
render();

TW.setKeyboardCallback('n', redoCamera, "land closer");
TW.setKeyboardCallback('d', redoCamera, "fly away");