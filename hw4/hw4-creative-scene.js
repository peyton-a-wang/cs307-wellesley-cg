// functions for creating components (crown, top light, tent) for the carousel top

/**
* Creates the carousel tent and mesh, then returns a tent object.
* Input: dictionary of carousel parameters.
*/
function createCrown(params) {
	var crownFrame = new THREE.Object3D();
	// TODO: add code for crown

	return crownFrame;
}

/**
* Creates the carousel spherical top with a point light.
* Input: dictionary of carousel parameters.
*/
function createTentTop(params) {
	var tentTopFrame = new THREE.Object3D();
	var topLightGeom = new THREE.SphereGeometry(params.topLightRadius, 32, 32);
	var topLightMesh = new THREE.Mesh(topLightGeom, topLightMaterial);
	var pointLight = new THREE.PointLight("white", 0.2, 0, 2);

	tentTopFrame.add(topLightMesh);
	tentTopFrame.add(pointLight);

	pointLight.position.y = params.topLightRadius * 5;

	return tentTopFrame;
}

/**
* Creates the carousel tent and mesh, then returns a tent object.
* Input: dictionary of carousel parameters.
*/
function createTent(params) {
	var tentFrame = new THREE.Object3D();
	var tentGeom = new THREE.ConeGeometry(params.tentRadius, params.tentHeight, params.tentSections, 64, true);
	var tentMesh = new THREE.Mesh(tentGeom, tentMaterial);

	var tentFrillGeom = new THREE.ConeGeometry(params.tentRadius / 2.5, params.tentHeight / 3, params.tentSections, 64, true);
	var tentFrillMesh = new THREE.Mesh(tentFrillGeom, tentMaterial);

	var tentTop = createTentTop(params);

	var crown = createCrown(params);

	tentFrame.add(tentMesh);
	tentFrame.add(tentFrillMesh);
	tentFrame.add(tentTop);
	tentFrame.add(crown);

	tentFrillMesh.position.y = params.tentHeight / 3;
	tentTop.position.y = params.tentHeight / 2;
	crown.position.y = -params.tentHeight / 2;

	return tentFrame;
}

// ====================================================================
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
	var beamsFrame = new THREE.Object3D();

	for (var i = 0; i < params.tentSections; i++) {
		var beamMesh = createBeam(params);

		beamsFrame.add(beamMesh);

		var radianFactor = (2 * Math.PI) / params.tentSections;
		var radius = params.tentRadius / 2;

		beamMesh.position.x = radius * Math.cos(i * radianFactor);
		beamMesh.position.z = radius * Math.sin(i * radianFactor);
		beamMesh.rotation.y = -i * radianFactor + Math.PI / 2;
	}

	return beamsFrame;
}

/**
 * Creates the carousel center mesh, then returns a carousel object.
 * Input: dictionary of carousel parameters.
 */
function createCenter(params) {
	var centerFrame = new THREE.Object3D();

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

	centerFrame.add(centerMesh);
	centerFrame.add(ringMesh);
	centerFrame.add(innerRingMesh);
	centerFrame.add(beamsMesh);

	ringMesh.position.y = ch / 2;
	innerRingMesh.position.y = ch / 2 + rh / 2;
	innerRingMesh.rotation.x = Math.PI / 2;
	beamsMesh.position.y = ch / 2 + rh / 2;

	return centerFrame;
}

// ====================================================================
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
 * Creates each hourse, then returns a horse object.
 * Input: dictionary of horse parameters.
 */
function createHorse(horsecolor1, horsecolor2, saddlecolor) {
	//object for a single horse
	horseObj = new THREE.Object3D();

	//material for the horse
	horseMat = [new THREE.MeshPhongMaterial({ color: new THREE.Color(horsecolor1) }),
	new THREE.MeshPhongMaterial({ color: new THREE.Color(horsecolor2) }),
	new THREE.MeshPhongMaterial({ color: new THREE.Color(saddlecolor) })]

	//making the head
	headObj = new THREE.Object3D();
	var face = new THREE.Mesh(new THREE.CylinderGeometry(4, 8, 15, 10), horseMat[0]);
	var head = new THREE.Mesh(new THREE.SphereGeometry(9, 8, 8), horseMat[0]);
	face.position.y = 9;
	headObj.add(face);
	headObj.add(head);

	headObj.rotation.z = 5 * Math.PI / 8;
	headObj.scale.z = 0.75;

	horseObj.add(headObj);

	//making the neck
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
	var polesFrame = new THREE.Object3D();

	for (var i = 0; i < params.tentSections; i++) {
		var horsePoleFrame = new THREE.Object3D();
		var poleMesh = createPole(params);
		var spotLight = createSpotLight(params);
		var horse = createHorse("brown", "white", "pink")

		horse.scale.x = 0.5;
		horse.scale.y = 0.5;
		horse.scale.z = 0.5;
		horse.position.x = -10;

		horsePoleFrame.add(poleMesh);
		horsePoleFrame.add(spotLight);
		horsePoleFrame.add(spotLight.target);
		horsePoleFrame.add(horse);

		var radianFactor = (2 * Math.PI) / params.tentSections;
		var radius = (params.platformRadius * 0.75);

		spotLight.position.y = params.centerHeight + params.platformHeight;

		horsePoleFrame.position.x = radius * Math.cos(i * radianFactor);
		horsePoleFrame.position.z = radius * Math.sin(i * radianFactor);
		horsePoleFrame.rotation.y = -i * radianFactor + Math.PI / 2;

		polesFrame.add(horsePoleFrame)
	}

	return polesFrame;
}

/**
 * Creates a carousel platform mesh, then returns a platform object.
 * Input: dictionary of carousel parameters.
 */
function createPlatform(params) {
	var platformFrame = new THREE.Object3D();
	var center = createCenter(params);

	var radius = params.platformRadius;
	var height = params.platformHeight;

	var platformGeom = new THREE.CylinderGeometry(radius, radius, height, 64, 64);
	var platformMesh = new THREE.Mesh(platformGeom, platformMaterial);

	platformFrame.add(platformMesh);
	platformFrame.add(center);

	center.position.y = params.centerHeight / 2;

	return platformFrame;
}

// ====================================================================
// functions for creating the main components (carousel, base) of the music box

/**
 * Adds the platform and tent to the carousel frame object, then returns the carousel object.
 * Input: dictionary of carousel parameters.
 */
function createCarousel(params) {
	var carouselFrame = new THREE.Object3D();
	var platform = createPlatform(params);
	var tent = createTent(params);
	var poles = createPoles(params);

	carouselFrame.add(platform);
	carouselFrame.add(tent);
	carouselFrame.add(poles);

	var ch = params.centerHeight;
	var ph = params.platformHeight;
	var th = params.tentHeight;

	tent.position.y = ch + ph + th / 2;
	poles.position.y = (ch + ph) / 2;

	return carouselFrame;
}

/**
 * Creates the music box base.
 * Input: dictionary of music box parameters.
 */
function createBase(params) {
	var baseFrame = new THREE.Object3D();

	var radius = params.baseRadius;
	var height = params.baseHeight;

	var baseGeom = new THREE.CylinderGeometry(radius, radius, height, 32, 32);
	var baseMesh = new THREE.Mesh(baseGeom, baseMaterial);

	baseFrame.add(baseMesh);

	return baseFrame
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
 * Adds a floor to the scene.
 */
function addfloor(params) {
	var floor = new THREE.Mesh(new THREE.PlaneGeometry(params.width, params.length, 32, 32), floorMaterial);
	floor.rotation.x = -Math.PI / 2;
	scene.add(floor);
}

// ====================================================================
// functions for creating light components

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
 * Adds the lights to the scene.
 */
function addLights() {
	var dirLight = new THREE.DirectionalLight(TW.WHITE, 0.3);
	var ambLight = new THREE.AmbientLight(TW.WHITE, 0.5);

	dirLight.position.set(1, 1, 1);

	scene.add(dirLight);
	scene.add(ambLight);
}


function showResult(textures) {
	textures[0].wrapS = THREE.RepeatWrapping;
	textures[0].wrapT = THREE.RepeatWrapping;
	textures[0].repeat.set(4, 4);
	textures[0].needsUpdate = true;

	// defining materials
	platformMaterial = new THREE.MeshPhongMaterial({
		color: "pink",
		side: THREE.DoubleSide
	});

	baseMaterial = new THREE.MeshPhongMaterial({
		color: "gold",
		shininess: 70,
		specular: 0x444444,
		side: THREE.DoubleSide
	});

	tentMaterial = new THREE.MeshLambertMaterial({
		color: "lavender",
		side: THREE.DoubleSide
	});

	crownMaterial = new THREE.MeshPhongMaterial({
		color: "plum",
		side: THREE.DoubleSide
	});

	floorMaterial = new THREE.MeshPhongMaterial({
		color: "chocolate",
		map: textures[0],
		side: THREE.DoubleSide
	});

	topLightMaterial = new THREE.MeshPhongMaterial({
		color: "yellow",
		opacity: 0.5,
		transparent: true,
		side: THREE.DoubleSide
	});

	addMusicBox();
	addLights();
	addfloor(floorParams);
	TW.render();
}

function addTextures() {
	TW.loadTextures(["images/wall.jpg"],
		function (textures) {
			showResult(textures);
		});
}

// ====================================================================

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
	topLightRadius: 4
}

var musicBoxParams = {
	baseRadius: 60,
	baseHeight: 30
}

var floorParams = {
	width: 300,
	length: 300
}

var sceneParams = {
	minMaxX: musicBoxParams.baseRadius * 1.5,
	minMaxY: (musicBoxParams.baseHeight + carouselParams.platformHeight + carouselParams.tentHeight) * 1.25,
	minMaxZ: musicBoxParams.baseRadius * 1.5
}

addTextures();

// ====================================================================

// creates a renderer
var renderer = new THREE.WebGLRenderer();

TW.mainInit(renderer, scene);

// uses a default orbiting camera
state = TW.cameraSetup(renderer,
	scene,
	{
		minx: -sceneParams.minMaxX, maxx: sceneParams.minMaxX,
		miny: -10, maxy: sceneParams.minMaxY,
		minz: -sceneParams.minMaxZ, maxz: sceneParams.minMaxZ
	}
);