// creating the scene and relative params for objects in the scene

var scene = new THREE.Scene();  // creates the scene

// global variables for the dimensions of the carousel
var carouselParams = {
	platformRadius: 50,
	platformHeight: 5,
	centerTopRadius: 20,
	centerBottomRadius: 15,
	centerHeight: 60,
	ringHeight: 10,
	tentRadius: 80,
	tentHeight: 70,
	tentSections: 8,
	poleRadius: 0.5,
	beamWidth: 1,
	topLightRadius: 4,
	crownHeight: 10
}

// global variables for the dimensions of the music box
var musicBoxParams = {
	baseRadius: 60,
	baseHeight: 50
}

// global variables for the dimensions of the background (floor/dome)
var backgroundParams = {
	floorWidth: 600,
	floorLength: 600,
	domeWidth: 300
}

// global variables for the dimensions and colors of the horses
var horseParams = {
	hScale: 0.5,
	hColor1: ["dimgrey", "saddlebrown", "khaki"],
	hColor2: ["peru", "tan", "sandybrown"],
	hColor3: ["sienna", "cornflowerblue", "steelblue"]
}

// global variables for the dimensions of the tent decorations
var decParams = {
	decHangHeight: carouselParams.tentHeight,
	decHeight: carouselParams.tentHeight/4
}

// global variables for the min and max dimensions of scene
var sceneParams = {
	minMaxX: musicBoxParams.baseRadius * 1.5,
	minMaxY: (musicBoxParams.baseHeight + carouselParams.platformHeight + carouselParams.tentHeight) * 1.25,
	minMaxZ: musicBoxParams.baseRadius * 1.5
}

// global variables for the user interaction
var uiParams = {
	lightOn: false
}

var spinParams = {
	handleAngle: 0,
	currentStep: 0,
	windStepCycle: 35,
	total: 0
}

//===============================================================================================
// defining materials for the scene's components

platformMaterial = new THREE.MeshPhongMaterial({
	color: "pink",
	side: THREE.DoubleSide
});

handleMaterial = new THREE.MeshPhongMaterial({
	color: "silver",
	shininess: 100,
	specular: 0x444444,
	side: THREE.DoubleSide
});

baseMaterial = new THREE.MeshPhongMaterial({
	color: "gold",
	shininess: 70,
	specular: 0x444444,
	side: THREE.DoubleSide
});

tentMaterial = new THREE.MeshLambertMaterial({
	color: 0xbcb4d7,
	side: THREE.DoubleSide
});

crownMaterial = new THREE.MeshPhongMaterial({
	color: "plum",
	side: THREE.DoubleSide
});

lightTopMaterial = new THREE.MeshPhongMaterial({
		color: "yellow",
		opacity: 0.5,
		transparent: true,
		side: THREE.DoubleSide
});

lightSwitchMaterial = new THREE.MeshPhongMaterial({
		color: "lightgrey",
});

//===============================================================================================
// functions for creating components (crown, top light, tent) for the carousel top

/**
* Creates the carousel crown geometry and returns the crown mesh.
* Input: dictionary of carousel parameters.
*/
function createCrown(params) {
	var cr = params.tentRadius;
	var crownGeom = new THREE.CylinderGeometry(cr, cr, params.crownHeight, params.tentSections, 64, true);
	var crownMesh = new THREE.Mesh(crownGeom, crownMaterial);

	return crownMesh;
}

/**
* Creates the carousel tent and mesh, then returns a tent object.
* Input: dictionary of carousel parameters.
*/
function createTent(params) {
	var tentObj = new THREE.Object3D();
	var tentGeom = new THREE.ConeGeometry(params.tentRadius, params.tentHeight, params.tentSections, 64, true);
	var tentMesh = new THREE.Mesh(tentGeom, tentMaterial);

	var tentFrillGeom = new THREE.ConeGeometry(params.tentRadius / 2.5, params.tentHeight / 3, params.tentSections, 64, true);
	var tentFrillMesh = new THREE.Mesh(tentFrillGeom, tentMaterial);

	var crown = createCrown(params);

	tentObj.add(tentMesh);
	tentObj.add(tentFrillMesh);
	tentObj.add(crown);

	tentFrillMesh.position.y = params.tentHeight / 3;
	crown.position.y = -params.tentHeight / 2;

	return tentObj;
}

//===============================================================================================
// functions for creating components (center, beams) for the carousel structure

/**
* Creates a beam and returns a beam mesh.
* Input: dictionary of carousel parameters.
*/
function createBeam(params) {
	var bw = params.beamWidth;
	var bd = params.tentRadius;

	var beamGeom = new THREE.BoxGeometry(bw, bw, bd, 10, 10, 10)
	var beamMesh = new THREE.Mesh(beamGeom, platformMaterial);

	return beamMesh;
}

/**
 * Creates each carousel pole with a horse, then returns a poles object.
 * Input: dictionary of carousel parameters.
 */
function createBeams(params) {
	var beamsObj = new THREE.Object3D();

	for (var i = 0; i < params.tentSections; i++) {
		var beamMesh = createBeam(params);

		beamsObj.add(beamMesh);

		var radianFactor = (2 * Math.PI) / params.tentSections;
		var radius = params.tentRadius / 2;

		beamMesh.position.x = radius * Math.cos(i * radianFactor);
		beamMesh.position.z = radius * Math.sin(i * radianFactor);
		beamMesh.rotation.y = -i * radianFactor + Math.PI / 2;
	}

	return beamsObj;
}

/**
 * Creates the carousel center mesh, then returns a carousel object.
 * Input: dictionary of carousel parameters.
 */
function createCenter(params) {
	var centerObj = new THREE.Object3D();

	var cr1 = params.centerTopRadius;
	var cr2 = params.centerBottomRadius;
	var ch = params.centerHeight;

	var centerGeom = new THREE.CylinderGeometry(cr1, cr2, ch, 32, 32);
	var centerMesh = new THREE.Mesh(centerGeom, platformMaterial);

	var rr = params.platformRadius;
	var rh = params.ringHeight;
	var ringGeom = new THREE.CylinderGeometry(rr, rr, rh, 64, 64, true);
	var ringMesh = new THREE.Mesh(ringGeom, platformMaterial);

	var innerRingGeom = new THREE.TorusGeometry(rr * 0.75, params.beamWidth / 2, 30, 200);
	var innerRingMesh = new THREE.Mesh(innerRingGeom, platformMaterial);

	var beamsMesh = createBeams(params);

	centerObj.add(centerMesh);
	centerObj.add(ringMesh);
	centerObj.add(innerRingMesh);
	centerObj.add(beamsMesh);

	ringMesh.position.y = ch / 2;
	innerRingMesh.position.y = ch / 2 + rh / 2;
	innerRingMesh.rotation.x = Math.PI / 2;
	beamsMesh.position.y = ch / 2 + rh / 2;

	return centerObj;
}

//===============================================================================================
// functions for creating components (pole, horse) attached to the carousel platform

/**
* Creates a pole and returns a pole mesh.
* Input: dictionary of carousel parameters.
*/
function createPole(params) {
	var pr = params.poleRadius;
	var ph = params.centerHeight + params.platformHeight;

	var poleGeom = new THREE.CylinderGeometry(pr, pr, ph, 32, 32)
	var poleMesh = new THREE.Mesh(poleGeom, baseMaterial);

	return poleMesh;
}

/**
 * Creates each horse, then returns a horse object.
 * Input: colors for the horse.
 */
function createHorse(horsecolor1, horsecolor2, saddlecolor) {
	// object for a single horse
	horseObj = new THREE.Object3D();

	// material for the horse
	horseMat = [new THREE.MeshPhongMaterial({ color: new THREE.Color(horsecolor1) }),
	new THREE.MeshPhongMaterial({ color: new THREE.Color(horsecolor2) }),
	new THREE.MeshPhongMaterial({ color: new THREE.Color(saddlecolor) })]

	// making the head
	headObj = new THREE.Object3D();
	var face = new THREE.Mesh(new THREE.CylinderGeometry(4, 8, 15, 10), horseMat[0]);
	var head = new THREE.Mesh(new THREE.SphereGeometry(9, 8, 8), horseMat[0]);
	face.position.y = 9;
	headObj.add(face);
	headObj.add(head);

	headObj.rotation.z = 5 * Math.PI / 8;
	headObj.scale.z = 0.75;

	horseObj.add(headObj);

	// making the neck
	var neck = new THREE.Mesh(new THREE.CylinderGeometry(5, 8, 20, 10), horseMat[0]);
	neck.position.set(5, -10, 0);
	neck.rotation.z = Math.PI / 6;
	neck.scale.z = 0.5
	horseObj.add(neck);

	// making the torso
	torsoObj = new THREE.Object3D();
	var torso1 = new THREE.Mesh(new THREE.CylinderGeometry(9, 12, 20, 10), horseMat[0]);
	var torso2 = new THREE.Mesh(new THREE.SphereGeometry(9, 8, 8), horseMat[0]);
	var torso3 = new THREE.Mesh(new THREE.SphereGeometry(12, 8, 8), horseMat[0]);
	torso1.position.set(0, 0, 0);
	torso2.position.set(0, 10, 0);
	torso3.position.set(0, -10, 0);

	torsoObj.add(torso1);
	torsoObj.add(torso2);
	torsoObj.add(torso3);
	torsoObj.position.x = 20;
	torsoObj.position.y = -20;
	torsoObj.rotation.z = Math.PI / 2;
	torsoObj.scale.z = 0.75;

	horseObj.add(torsoObj);

	// making horse's legs

	// front leg
	var ftleg1 = new THREE.Mesh(new THREE.CylinderGeometry(5, 5, 12, 4), horseMat[0]);
	var ftleg2 = new THREE.Mesh(new THREE.CylinderGeometry(4, 4, 12, 4), horseMat[0]);
	var ftleg3 = new THREE.Mesh(new THREE.CylinderGeometry(3, 3, 7, 4), horseMat[0]);
	var ftleg4 = new THREE.Mesh(new THREE.CylinderGeometry(3, 3, 4, 4), horseMat[1]);
	ftleg1.rotation.x = -Math.PI / 6;
	ftleg1.rotation.y = Math.PI / 6;
	ftleg1.rotation.z = Math.PI / 4;

	ftleg2.rotation.y = Math.PI / 6;
	ftleg2.position.set(3, -8, 0);

	ftleg3.rotation.x = Math.PI / 6;
	ftleg3.rotation.y = Math.PI / 6;
	ftleg3.rotation.z = -Math.PI / 4;
	ftleg3.position.set(1, -15, 0);

	ftleg4.rotation.x = Math.PI / 6;
	ftleg4.rotation.y = Math.PI / 6;
	ftleg4.rotation.z = -Math.PI / 3;
	ftleg4.position.set(-2, -18, 0);

	frontleg1Obj = new THREE.Object3D();
	frontleg1Obj.add(ftleg1);
	frontleg1Obj.add(ftleg2);
	frontleg1Obj.add(ftleg3);
	frontleg1Obj.add(ftleg4);

	frontleg1Obj.scale.z = 0.75;
	frontleg1Obj.scale.x = -1;
	frontleg1Obj.position.set(5, -25, 3);

	var frontleg2Obj = frontleg1Obj.clone();
	frontleg2Obj.rotation.z = Math.PI / 6;
	frontleg2Obj.position.set(5, -25, -3);

	horseObj.add(frontleg1Obj);
	horseObj.add(frontleg2Obj);

	// back leg
	var bkleg1 = new THREE.Mesh(new THREE.CylinderGeometry(6, 6, 24, 4), horseMat[0]);
	var bkleg2 = new THREE.Mesh(new THREE.CylinderGeometry(4, 4, 13, 4), horseMat[0]);
	var bkleg3 = new THREE.Mesh(new THREE.CylinderGeometry(4, 4, 6, 4), horseMat[1]);

	bkleg1.rotation.x = -Math.PI / 6;
	bkleg1.rotation.y = Math.PI / 6;
	bkleg1.rotation.z = Math.PI / 4;
	bkleg1.scale.x = -1;

	bkleg2.rotation.x = -Math.PI / 6;
	bkleg2.rotation.y = -Math.PI / 4;
	bkleg2.rotation.z = -Math.PI / 4;
	bkleg2.position.set(3, -12, 0);

	bkleg3.rotation.x = -Math.PI / 6;
	bkleg3.rotation.y = -Math.PI / 4;
	bkleg3.rotation.z = -Math.PI / 4;
	bkleg3.position.set(0, -18, 0);

	backleg1Obj = new THREE.Object3D();
	backleg1Obj.add(bkleg1);
	backleg1Obj.add(bkleg2);
	backleg1Obj.add(bkleg3);

	backleg1Obj.scale.z = 0.75;
	backleg1Obj.position.set(35, -30, 4);

	var backleg2Obj = backleg1Obj.clone();
	backleg2Obj.rotation.z = Math.PI / 6;
	backleg2Obj.position.set(35, -30, -4);

	horseObj.add(backleg1Obj);
	horseObj.add(backleg2Obj);

	// make horse's ears
	var ear1 = new THREE.Mesh(new THREE.CylinderGeometry(0, 4, 10, 4), horseMat[0]);
	ear1.position.set(0, 8, 5);
	ear1.scale.x = 0.5;
	ear1.rotation.x = Math.PI / 8;

	var ear2 = new THREE.Mesh(new THREE.CylinderGeometry(0, 4, 10, 4), horseMat[0]);
	ear2.position.set(0, 8, -5);
	ear2.scale.x = 0.5;
	ear2.rotation.x = -Math.PI / 8;
	horseObj.add(ear1);
	horseObj.add(ear2);

	// make horse's mane
	var bezierCurve = new THREE.CubicBezierCurve3(
		new THREE.Vector3(-5, -11, 0), new THREE.Vector3(1.5, -3, 0), new THREE.Vector3(14, -9, 0), new THREE.Vector3(13, 5, 0));
	var radii = [0, 1.5, 2.5, 4];

	var mane = new THREE.Mesh(new THREE.TubeRadialGeometry(bezierCurve, 32, radii, 16, false), horseMat[1]);
	mane.rotation.z = 2 * Math.PI / 3;
	mane.scale.set(0.5, 0.5, 0.5);
	mane.position.set(7, 2, 0);
	horseObj.add(mane);

	for (var i = 0; i < 8; i++) {
		var maneClone = mane.clone();
		maneClone.position.x += 0.5 * i;
		maneClone.position.y += (-3 * i);
		maneClone.scale.y += 0.1 * i;
		horseObj.add(maneClone);
	}

	// using the same geometry for tail and mane
	var tail = new THREE.Mesh(new THREE.TubeRadialGeometry(bezierCurve, 32, radii, 16, false), horseMat[1]);
	tail.rotation.z = 2 * Math.PI / 5;
	tail.position.set(38, -30, 0);
	horseObj.add(tail);

	// saddle
	var saddle = new THREE.Mesh(new THREE.CylinderGeometry(9, 10, 15, 10, 1, false, 0, Math.PI), horseMat[2]);
	saddle.rotation.z = Math.PI / 2;
	saddle.position.set(20, -18, 0);
	horseObj.add(saddle);

	return horseObj;
}

/**
 * Creates each carousel pole with a horse, then returns a poles object.
 * Input: dictionary of carousel parameters.
 */
function createPoles(params) {
	var polesObj = new THREE.Object3D();

	for (var i = 0; i < params.tentSections; i++) {
		var horsePoleObj = new THREE.Object3D();
		var poleMesh = createPole(params);
		var spotLight = createSpotLight(params);

		// creating horses with colors based on array
		var horseColorIndex = i;
		if (i > horseParams.hColor1.length - 1 ){
			horseColorIndex = horseColorIndex % horseParams.hColor1.length;
		}
		var horse = createHorse(horseParams.hColor1[horseColorIndex], horseParams.hColor2[horseColorIndex], horseParams.hColor3[horseColorIndex]);

		horse.scale.x = horseParams.hScale;
		horse.scale.y = horseParams.hScale;
		horse.scale.z = horseParams.hScale;
		horse.position.x = -10;

		horsePoleObj.add(poleMesh);
		horsePoleObj.add(spotLight);
		horsePoleObj.add(spotLight.target);
		horsePoleObj.add(horse);

		var radianFactor = (2 * Math.PI) / params.tentSections;
		var radius = (params.platformRadius * 0.75);

		spotLight.position.y = params.centerHeight + params.platformHeight;

		horsePoleObj.position.x = radius * Math.cos(i * radianFactor);
		horsePoleObj.position.z = radius * Math.sin(i * radianFactor);
		horsePoleObj.rotation.y = -i * radianFactor + Math.PI / 2;

		polesObj.add(horsePoleObj)
	}

	return polesObj;
}

/**
 * Creates a carousel platform mesh, then returns a platform object.
 * Input: dictionary of carousel parameters.
 */
function createPlatform(params) {
	var platformObj = new THREE.Object3D();
	var center = createCenter(params);

	var radius = params.platformRadius;
	var height = params.platformHeight;

	var platformGeom = new THREE.CylinderGeometry(radius, radius, height, 64, 64);
	var platformMesh = new THREE.Mesh(platformGeom, platformMaterial);

	platformObj.add(platformMesh);
	platformObj.add(center);

	center.position.y = params.centerHeight / 2;

	return platformObj;
}

// ==================================================================================
// functions for creating the components of the music box base (handle, switch)

/**
 * Creates the music box handle.
 * Input: dictionary of music box parameters.
 */
	function createHandle(params) {
	var handleObj = new THREE.Object3D();

	var path = new THREE.CubicBezierCurve3(
		new THREE.Vector3(40, -20, 0),
		new THREE.Vector3(10, -20, 0),
		new THREE.Vector3(35, 0, 0),
		new THREE.Vector3(0, 0, 0));

	var handleGeom = new THREE.TubeGeometry( path, 20, 2, 8, false );
	var handleMesh = new THREE.Mesh(handleGeom, handleMaterial );

	var handleKnobGeom = new THREE.CylinderGeometry(4, 4, 10);
	var handleKnobMesh = new THREE.Mesh(handleKnobGeom, handleMaterial );

	handleObj.add(handleMesh);
	handleObj.add(handleKnobMesh);

	handleKnobMesh.rotation.z = Math.PI/2;
	handleKnobMesh.position.x = 40;
	handleKnobMesh.position.y = -20;

	return handleObj;
}

// ==================================================================================
// functions for creating and adding the main components (carousel, base) of the music box and the background (floor, sky)

/**
 * Adds the platform and tent to the carousel frame object, then returns the carousel object.
 * Input: dictionary of carousel parameters.
 */
function createCarousel(params) {
	var carouselObj = new THREE.Object3D();
	var platform = createPlatform(params);
	var tent = createTent(params);

	carouselObj.add(platform);
	carouselObj.add(tent);

	var ch = params.centerHeight;
	var ph = params.platformHeight;
	var th = params.tentHeight;

	tent.position.y = ch + ph + th / 2;

	return carouselObj;
}

/**
 * Creates the music box base.
 * Input: dictionary of music box parameters.
 */
function createBase(params) {
	var baseObj = new THREE.Object3D();

	var radius = params.baseRadius;
	var height = params.baseHeight;

	var baseGeom = new THREE.CylinderGeometry(radius, radius, height, 32, 32);
	var baseMesh = new THREE.Mesh(baseGeom, baseMaterial);

	baseObj.add(baseMesh);

	return baseObj
}

// making handle as a global variable so it can be controlled with ui
var handle = createHandle(musicBoxParams);

/**
* adds the handle to the scene
*/
function addHandle(params){
	handle.position.x = params.baseRadius;
	handle.position.y = params.baseHeight / 2;
	handle.rotation.x = spinParams.handleAngle;
	scene.add(handle);
}

/**
 * Adds the music box to the scene using all the music box components.
 */
function addMusicBox() {
	var musicBox = new THREE.Object3D();
	base = createBase(musicBoxParams);
	carousel = createCarousel(carouselParams);

	musicBox.add(base);
	musicBox.add(carousel);

	carousel.position.y = (musicBoxParams.baseHeight + carouselParams.platformHeight) / 2;
	musicBox.position.y = musicBoxParams.baseHeight / 2;

	scene.add(musicBox);
}

/**
 * Creates a floor geometry and mesh, then adds it to the scene.
 */
function addFloor(params) {
	var floorGeom = new THREE.PlaneGeometry(params.floorWidth, params.floorLength, 32, 32);
	var floorMesh = new THREE.Mesh(floorGeom, floorMaterial);
	floorMesh.rotation.x = -Math.PI / 2;
	scene.add(floorMesh);
}

/**
 * Creates a sky geometry and mesh, then adds it to the scene.
 */
function addSky(params) {
	var skyGeom = new THREE.SphereGeometry(params.domeWidth, 32, 32, 2*Math.PI, 2*Math.PI, 0, Math.PI/2);
	var skyMesh = new THREE.Mesh(skyGeom, skyMaterial);
	scene.add(skyMesh);
}

//===============================================================================================
// functions for tent decorations (moon, planet, and top lights) 

/**
* This function creates the decorations hanging from the side of carousel
* Inputs: dictionary of decorations parameters and type of decoration used
*/
function makeDecoration(params, decType) {

	var decObj = new THREE.Object3D();

	var hang = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, params.decHangHeight/2),
	new THREE.MeshPhongMaterial({ color: 0x666D75 }));  // greyish dark blue color

	hang.position.set(0,params.decHeight,0);
	decObj.add(hang);

	if (decType == 1){ // if true, make planet

		var planet = new THREE.Mesh(new THREE.SphereGeometry(params.decHeight*0.4, 32, 32),
		new THREE.MeshPhongMaterial({ color: 0x6A81A6 }));  // greyish blue color

		var ring = new THREE.Mesh(new THREE.CylinderGeometry( params.decHeight/2, params.decHeight/2, params.decHeight/7 ),
			new THREE.MeshPhongMaterial({ color: 0xE8DE1D, transparent: true, opacity: 0.5, side: THREE.DoubleSide}) );

		decObj.add(planet);
		decObj.add(ring);

	} else if (decType == 2){

		var moonShape = new THREE.Shape();
		moonShape.moveTo(0, 0);
		moonShape.bezierCurveTo ( params.decHeight/4, 0,  params.decHeight/4, params.decHeight, 0, params.decHeight) ;
		moonShape.bezierCurveTo (  params.decHeight*0.75 , params.decHeight,  params.decHeight*0.75, 0, 0, 0) ;

		var extrudeSettings = {
			steps: 2,
			depth: params.decHeight*0.75,
			bevelEnabled: true,
			bevelThickness: 1,
			bevelSize: 1,
			bevelOffset: 0,
			bevelSegments: 2
		};

		var moon = new THREE.Mesh(new THREE.ExtrudeGeometry( moonShape, extrudeSettings ),
			new THREE.MeshPhongMaterial({ color: 0xE8DE1D, transparent: true, opacity: 0.5, side: THREE.DoubleSide}));

		moon.position.set(-params.decHeight/4, -params.decHeight*0.75, -params.decHeight/4);

		decObj.add(moon);
	}

	return decObj;
}

/**
* Creates the carousel spherical top with a point light.
* Input: dictionary of carousel parameters.
*/
function createTentTop(params) {
	var tentTopObj = new THREE.Object3D();
	var topLightGeom = new THREE.SphereGeometry(params.topLightRadius, 32, 32);
	var topLightMesh = new THREE.Mesh(topLightGeom, lightTopMaterial);

	tentTopObj.add(topLightMesh);
	tentTopObj.add(topLight);

	return tentTopObj;
}

/**
* Adds the light decorations to the carousel.
* Input: dictionary of carousel parameters.
*/
function addDecs(params) {
	var topLight = createTentTop(carouselParams);
	topLight.position.x = 0;
	topLight.position.y = carouselParams.platformHeight + carouselParams.centerHeight + carouselParams.tentHeight*1.75;
	topLight.position.z = 0;
	scene.add(topLight);

	var dec1 = makeDecoration(decParams, 1);
	var dec2 = makeDecoration(decParams, 2);

	dec1.position.x = carouselParams.tentRadius/2;
	dec1.position.y = carouselParams.platformHeight + carouselParams.centerHeight + decParams.decHeight + 10;
	dec1.position.z = carouselParams.tentRadius/2;

	dec2.position.x = -carouselParams.tentRadius/2;
	dec2.position.y = carouselParams.platformHeight + carouselParams.centerHeight + decParams.decHeight + 10;
	dec2.position.z = carouselParams.tentRadius/2;

	scene.add(dec1);
	scene.add(dec2);
}

// global variable names for light decorations to be removed
var planetLight1;
var planetLight2;
var planetLight3;
var moonLight;
var topLight;

function addLightToDec(bool) {
	var sin30 = decParams.decHeight/2 * Math.sin(Math.PI/6);
	var cos60 = decParams.decHeight/2 * Math.cos(Math.PI/3);
	
	planetLight1 = new THREE.PointLight("white", 0.2, 0, 2);
	planetLight1.position.set(carouselParams.tentRadius/2 + cos60,carouselParams.platformHeight + carouselParams.centerHeight
		+ decParams.decHeight/2, carouselParams.tentRadius/2 - sin30);
	planetLight1.visible = bool;
	scene.add(planetLight1);


	planetLight2 = new THREE.PointLight("white", 0.2, 0, 2);
	planetLight2.position.set(carouselParams.tentRadius/2 - cos60, carouselParams.platformHeight + carouselParams.centerHeight + decParams.decHeight/2,
		carouselParams.tentRadius/2 - sin30);
	planetLight2.visible = bool;
	scene.add(planetLight2);

	planetLight3 = new THREE.PointLight("white", 0.2, 0, 2);
	planetLight3.position.set(carouselParams.tentRadius/2, carouselParams.platformHeight + carouselParams.centerHeight + decParams.decHeight/2,
		carouselParams.tentRadius/20 + decParams.decHeight);
	planetLight3.visible = bool;
	scene.add(planetLight3);

	moonLight = new THREE.PointLight("white", 0.2, 0, 2);
	moonLight.position.set(-carouselParams.tentRadius/2, carouselParams.platformHeight + carouselParams.centerHeight + decParams.decHeight/2,-carouselParams.tentRadius/2);
	moonLight.visible = bool;
	scene.add(moonLight);

	topLight = new THREE.PointLight("white", 0.3, 0, 2);
	topLight.position.y = carouselParams.platformHeight + carouselParams.centerHeight + carouselParams.tentHeight*1.75;
	topLight.visible = bool;
	scene.add(topLight);

	renderer.render(scene, camera);
}

function changeLight(){
	scene.remove(planetLight1);
	scene.remove(planetLight2);
	scene.remove(planetLight3);
	scene.remove(moonLight);
	scene.remove(topLight);
	uiParams.lightOn = !uiParams.lightOn;
	addLightToDec(uiParams.lightOn);
	renderer.render(scene, camera);
}

/**
* Creates the carousel spotlight, then returns a spot light object.
* Input: dictionary of carousel parameters.
*/
function createSpotLight(params) {
	var spotlightAngle = Math.atan(0.1);
	var spotlight = new THREE.SpotLight(new THREE.Color("pink"), 0.4, 0, spotlightAngle);

	spotlight.position.y = musicBoxParams.baseHeight + params.platformHeight + params.ringHeight + params.tentHeight;

	var lightTarget = new THREE.Object3D();
	lightTarget.position.y = 0;
	spotlight.target = lightTarget;

	return spotlight;
}

/**
 * Adds the directional and ambient lights to the scene.
 */
function addGeneralLights() {
	var dirLight = new THREE.DirectionalLight(TW.WHITE, 0.5);
	var ambLight = new THREE.AmbientLight(TW.WHITE, 0.4);

	ambLight.position.y = backgroundParams.domeWidth;
	dirLight.position.y = backgroundParams.domeWidth;

	scene.add(dirLight);
	scene.add(ambLight);
}

//===============================================================================================
// creates a renderer
var renderer = new THREE.WebGLRenderer();

TW.mainInit(renderer, scene);

var camera = new THREE.PerspectiveCamera(70, 1, 1, 1000);
camera.position.set(0, 80, 270);
camera.lookAt(new THREE.Vector3(0, 70, 0));
scene.add(camera);

// // uses a default orbiting camera
state = TW.cameraSetup(renderer,
	scene,
	{
		minx: -sceneParams.minMaxX, maxx: sceneParams.minMaxX,
		miny: -10, maxy: sceneParams.minMaxY,
		minz: -sceneParams.minMaxZ, maxz: sceneParams.minMaxZ
	}
);

/**
 * Texture maps the wooden floor and sky background, then adds them to the scene.
 */
function addTextures(textures) {
	textures[0].wrapS = THREE.RepeatWrapping;
	textures[0].wrapT = THREE.RepeatWrapping;
	textures[0].repeat.set(4, 4);
	textures[0].needsUpdate = true;

	textures[1].wrapS = THREE.MirroredRepeatWrapping;
	textures[1].wrapT = THREE.RepeatWrapping;
	textures[1].repeat.set(2, 1);
	textures[1].needsUpdate = true;

	floorMaterial = new THREE.MeshPhongMaterial({
		color: "chocolate",
		map: textures[0],
		side: THREE.DoubleSide
	});

	skyMaterial = new THREE.MeshPhongMaterial({
		color: "steelblue",
		map: textures[1],
		side: THREE.DoubleSide
	});

	addFloor(backgroundParams);
	addSky(backgroundParams);
	renderer.render(scene, camera);
}

addLightToDec(uiParams.lightOn);

/**
 * Adds all the components to the scene.
 */
function showResult() {
	TW.loadTextures(["images/floor.jpg", "images/sky.jpg"],
		function (textures) {
			addTextures(textures);
	});
	addMusicBox();
	addDecs(carouselParams);
	addGeneralLights();
	addLightSwitch(musicBoxParams);
	addHandle(musicBoxParams);
	
	renderer.render(scene, camera);
}

showResult();

// ======================================================================================
// functions for animation with spinning carousel

// event listeners for winding up and releasing the handle to start the animation
TW.setKeyboardCallback('w', windUp, "wind up");  
TW.setKeyboardCallback('r', release, "release handle");

var spinPart = createPoles(carouselParams);
spinPart.position.y = (musicBoxParams.baseHeight/2 + carouselParams.centerHeight + carouselParams.platformHeight/2);
scene.add(spinPart);

var animationID = null;  // global variable allows us to discontinue the animation

/**
 * Callback function for the click event that winds up the handle.
 */
function windUp() {
	scene.remove(handle);
	spinParams.handleAngle += Math.PI/100;

	scene.remove(spinPart);
	spinPart.rotation.y += Math.PI/100;
	scene.add(spinPart);

	spinParams.currentStep += 1;
	spinParams.total += 1;
	addHandle(musicBoxParams);
	
	renderer.render(scene, camera);
	if (spinParams.currentStep > spinParams.windStepCycle) {
		stopAnimation();
	} else {
		animationID = requestAnimationFrame(windUp);
	}
}

/**
 * Callback function for click event that releases the handle. 
 */
function release() {
	scene.remove(handle);
	spinParams.handleAngle -= Math.PI/30;

	scene.remove(spinPart);
	spinPart.rotation.y -= Math.PI/60;
	scene.add(spinPart);

	spinParams.total -= 1;
	addHandle(musicBoxParams);
	
	renderer.render(scene, camera);
	if (spinParams.total <= 0) {
		stopAnimation();
	} else {
		animationID = requestAnimationFrame(release);
	}
}

/**
 * Halts the animation.
 */
function stopAnimation() {
	spinParams.currentStep = 0;
	
	if (animationID != null) {
		cancelAnimationFrame(animationID);
	}
}

// ======================================================================================
// user interaction for light switches
var lightSwitch;

/**
 * Creates the music box light switch.
 * Input: dictionary of music box parameters.
 */
function addLightSwitch(params) {
	lightSwitch = new THREE.Mesh(new THREE.CylinderGeometry(7, 8, 10, 64), lightSwitchMaterial);
	lightSwitch.name = "switch";
	scene.add(lightSwitch);

	if (uiParams.lightOn) {
		lightSwitch.position.z = params.baseRadius-5;
		console.log('on');
	} else {
		lightSwitch.position.z = params.baseRadius;
	}

	lightSwitch.rotation.x = Math.PI/2
	lightSwitch.position.y = params.baseHeight/2;
}

document.addEventListener('click', onClick, false);  // event listener to handle mouse clicks

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector3();

var c1 = renderer.domElement;

/**
 * Turns the lights on upon clicking the light switch.
 */
function onClick(event) {
	if (event.target == c1) {
		var rect = event.target.getBoundingClientRect();
		var canvasx = event.clientX - rect.left;
		var canvasy = event.clientY - rect.top;
	} else {
		return;
	}

	// gets mouse coordinates
	mouse.x = (canvasx / 600) * 2 - 1;
	mouse.y = -(canvasy / 600) * 2 + 1;

	raycaster.setFromCamera(mouse, camera);  // sets up raycaster using mouse position and camera
	
	var intersects = raycaster.intersectObjects(scene.children, true);

	// debugging issues with mouse position and click event
	console.log(scene.children);
	console.log(intersects);
	console.log(mouse.x);
	console.log(mouse.y);

	for (obj of intersects){
		if (obj.object.name == "switch") {
			changeLight();
			scene.remove(lightSwitch);
			addLightSwitch(musicBoxParams);
			renderer.render(scene, camera);
		};
	}
}

renderer.render(scene, camera);