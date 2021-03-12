/**
 * Creates a ball geometry/material and returns a ball mesh.
 * Input: dictionary of scene parameters.
 */
function createBall(params) {
    var ballGeom = new THREE.SphereGeometry(params.ballRadius, 32, 32);

    var ballMaterial = new THREE.MeshPhongMaterial({
        color: params.ballColor,
        specular: params.ballSpecular,
        shininess: params.ballShininess,
        side: THREE.DoubleSide
    });

    var ballMesh = new THREE.Mesh(ballGeom, ballMaterial);

    return ballMesh;
};

/** 
 * Creates a cone geometry/material and returns a cone mesh.
 * Input: dictionary of scene parameters.
 */
function createCone(params) {
    var coneGeom = new THREE.ConeGeometry(params.coneRadius,
        params.coneHeight, 64, 64, true);

    var coneMaterial = new THREE.MeshPhongMaterial({
        color: params.coneColor,
        specular: params.coneSpecular,
        shininess: params.coneShininess,
        side: THREE.DoubleSide
    });

    var coneMesh = new THREE.Mesh(coneGeom, coneMaterial);

    return coneMesh;
}

/**
 * Creates and returns an hourglass object that consists of 2 cones.
 * Input: dictionary of scene parameters.
 */
function createHourglass(params) {
    var hourglassObj = new THREE.Object3D();
    var cone1Mesh = createCone(params);
    var cone2Mesh = createCone(params);

    cone2Mesh.rotation.z = Math.PI;
    cone2Mesh.position.y = params.coneHeight;

    hourglassObj.add(cone1Mesh);
    hourglassObj.add(cone2Mesh);

    return hourglassObj;
};

// materials for boxes
var boxMaterials = [];
var boxColors = ['deepskyblue', 'deepskyblue', 'mediumseagreen',
    'navajowhite', 'deepskyblue', 'deepskyblue'];

// adds materials to the boxMaterials array
for (var i = 0; i < 6; i++) {
    boxMaterials.push(new THREE.MeshPhongMaterial({
        color: boxColors[i],
        side: THREE.BackSide // only show the inside of the box
    }));
}

/* Creates a box geometry and returns a box mesh using the material
 * array created above.
 * Input: dictionary of scene parameters.
 */
function createBox(params) {
    var length = params.boxLength;
    var boxGeom = new THREE.BoxGeometry(length, length, length);
    var boxMesh = new THREE.Mesh(boxGeom, boxMaterials);

    return boxMesh;
};

/**
 * Creates a sconce from a box that contains an hourglass and ball.
 * Input: dictionary of scene parameters.
 */
function createSconce(params) {
    var sconceObj = new THREE.Object3D();
    var box = createBox(params);
    var hourglass = createHourglass(params);
    var ball = createBall(params);

    var ballPosX = params.boxLength / 2.5;
    var ballPosY = params.boxLength / 2 - params.ballRadius;
    var hourglassPosZ = params.boxLength / 2 - params.coneRadius;

    // space the ball a little bit farther from the wall
    hourglass.position.set(-ballPosX + 5, 0, -hourglassPosZ);
    ball.position.set(-ballPosX + 5, -ballPosY, -ballPosX);

    sconceObj.add(box);
    sconceObj.add(hourglass);
    sconceObj.add(ball);

    return sconceObj;
}

// ====================================================================

// global variables for the scene dimensions
var sceneParams = {
    boxLength: 100,
    ballRadius: 10,
    ballColor: 'mediumpurple',
    ballSpecular: 0xffffff,
    ballShininess: 35,
    coneRadius: 4,
    coneHeight: 8,
    coneColor: 'white',
    coneSpecular: 0x444444,
    coneShininess: 27,
    ambientOn: true,
    directionalOn: true,
    spotlightOn: true,
    rugLength: 80,
    paintingLength: 50,
}

// ====================================================================

var scene = new THREE.Scene();  // creates the scene

var light0, light1, light2, light3;

/**
 * Adds the three types of lights to the scene .
 */
function makeLights() {
    // using global variables for the lights, for the GUI
    light0 = new THREE.AmbientLight(0x6C6C6C); // 43%
    scene.add(light0);

    light1 = new THREE.DirectionalLight(TW.WHITE, 0.6);
    light1.position.set(1, 1, 2);
    scene.add(light1);

    /**
     * Creates and returns a spotlight.
     * Input: dictionary of scene parameters, y position of the light target, and x and z position of the light.
     */
    function createSpotLight(params, posX, targetPosY, posZ) {
        var spotAngle = Math.atan(0.5);  // angle for cone with r=4, h=8
        var light = new THREE.SpotLight(new THREE.Color("white"),
            1, 0, spotAngle, 0, 1);
        light.position.set(posX, params.coneHeight / 2, posZ);

        var lightTarget = new THREE.Object3D();
        lightTarget.position.set(posX, targetPosY, posZ);
        light.target = lightTarget;

        return light;
    }

    // places the lights at the tip of the cone
    var lightX = - sceneParams.boxLength / 2.5 + 5;
    var lightZ = sceneParams.coneRadius - sceneParams.boxLength / 2;
    var targetY = sceneParams.boxLength / 2;
    light2 = createSpotLight(sceneParams, lightX, -targetY, lightZ);
    light3 = createSpotLight(sceneParams, lightX, targetY, lightZ);

    scene.add(light2);
    scene.add(light2.target);
    scene.add(light3);
    scene.add(light3.target);
}

makeLights();

/** 
 * Updates the lights for the GUI controls. 
 * Sets the light to be in the same mode as the respective parameter.
 */
function updateLights() {
    light0.visible = sceneParams.ambientOn;
    light1.visible = sceneParams.directionalOn;
    light2.visible = sceneParams.spotlightOn;
    light3.visible = sceneParams.spotlightOn;

    TW.render();
}

var sconce = createSconce(sceneParams);
scene.add(sconce);

// ====================================================================

/** 
 * Callback function that displays the extra features (rug and painting).
 * Input: Array of images passed to callback function.
 */
function displayExtraFeatures(textures) {
    var rugLength = sceneParams.rugLength;
    var rugGeom = new THREE.PlaneGeometry(rugLength, rugLength);
    var rugMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        map: textures[0]
    });
    var rugMesh = new THREE.Mesh(rugGeom, rugMaterial);

    var paintingLength = sceneParams.paintingLength;
    var paintingGeom = new THREE.PlaneGeometry(paintingLength, paintingLength);
    var paintingMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        map: textures[1]
    });
    var paintingMesh = new THREE.Mesh(paintingGeom, paintingMaterial);

    rugMesh.rotation.x = -Math.PI / 2;
    rugMesh.position.y = -sceneParams.boxLength / 2 + 1;
    paintingMesh.rotation.y = Math.PI / 2;
    paintingMesh.position.x = -sceneParams.boxLength / 2 + 1;

    scene.add(rugMesh);
    scene.add(paintingMesh);

    TW.render();
}

TW.loadTextures(['images/rug.png', 'images/painting.png'],
    function (textures) {
        displayExtraFeatures(textures);
    });

// ====================================================================

var renderer = new THREE.WebGLRenderer();  // creates a renderer

TW.mainInit(renderer, scene);

// uses a default orbiting camera
TW.cameraSetup(renderer,
    scene,
    {
        minx: -50, maxx: 50,
        miny: -50, maxy: 50,
        minz: -50, maxz: 50
    });

var gui = new dat.GUI();
gui.add(sceneParams, 'ambientOn').onChange(updateLights);
gui.add(sceneParams, 'directionalOn').onChange(updateLights);
gui.add(sceneParams, 'spotlightOn').onChange(updateLights);