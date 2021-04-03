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

var musicBoxParams = {
	baseRadius: 60,
	baseHeight: 50
}

var backgroundParams = {
	floorWidth: 600,
	floorLength: 600,
	domeWidth: 300
}

// hColor1 is for the body color, hColor2 is for the mane color, and hColor3 is for the saddle color
var horseParams = {
	hScale: 0.5,
	hColor1: [0xc67b52, 0x939b9e, "palevioletred", 0x998b76],
	hColor2: [0xe4ae83, "cornsilk", "peru"],
	hColor3: [0x876e8f, "steelblue", "papayawhip"]
}

var decParams = {
	decHangHeight: carouselParams.tentHeight,
	decHeight: carouselParams.tentHeight/4
}

var sceneParams = {
	minMaxX: musicBoxParams.baseRadius * 1.5,
	minMaxY: (musicBoxParams.baseHeight + carouselParams.platformHeight + carouselParams.tentHeight) * 1.25,
	minMaxZ: musicBoxParams.baseRadius * 1.5
}

var uiParams = { lightOn: false }

var spinParams = {
	handleAngle: 0,
	currentStep: 0,
	windStepCycle: 35,
	total: 0
}

//===============================================================================================
// defining materials for the scene's components

platformMaterial = new THREE.MeshPhongMaterial({ color: "pink", side: THREE.DoubleSide });

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

tentMaterial = new THREE.MeshLambertMaterial({ color: 0xbcb4d7, side: THREE.DoubleSide });

crownMaterial = new THREE.MeshPhongMaterial({ color: "plum", side: THREE.DoubleSide });

lightTopMaterial = new THREE.MeshPhongMaterial({
	color: "yellow",
	opacity: 0.5,
	transparent: true,
	side: THREE.DoubleSide
});

lightSwitchMaterial = new THREE.MeshPhongMaterial({ color: "lightgrey" });

//===============================================================================================
// functions for creating components (crown, top light, tent) for the carousel top

/**
* Creates the carousel tent and mesh, then returns a tent object.
* Input: dictionary of carousel parameters.
*/
function createTent(params) {
	var tentObj = new THREE.Object3D();
	var tentMesh = new THREE.Mesh(new THREE.ConeGeometry(params.tentRadius, params.tentHeight, params.tentSections, 64, true), tentMaterial);

	var tentFrillMesh = new THREE.Mesh(new THREE.ConeGeometry(params.tentRadius / 2.5, params.tentHeight / 3, params.tentSections, 64, true), tentMaterial);

	var cr = params.tentRadius;
	var crownMesh = new THREE.Mesh(new THREE.CylinderGeometry(cr, cr, params.crownHeight, params.tentSections, 64, true), crownMaterial);
	crownMesh.position.y = -params.tentHeight / 2;

	tentFrillMesh.position.y = params.tentHeight / 3;

	tentObj.add(tentMesh, tentFrillMesh, crownMesh);

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

	var beamMesh = new THREE.Mesh(new THREE.BoxGeometry(bw, bw, bd, 10, 10, 10), platformMaterial);

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

		beamMesh.position.set(radius * Math.cos(i * radianFactor), 0, radius * Math.sin(i * radianFactor));
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

	var centerMesh = new THREE.Mesh(new THREE.CylinderGeometry(cr1, cr2, ch, 32, 32), platformMaterial);

	var rr = params.platformRadius;
	var rh = params.ringHeight;
	var ringMesh = new THREE.Mesh(new THREE.CylinderGeometry(rr, rr, rh, 64, 64, true), platformMaterial);

	var innerRingMesh = new THREE.Mesh(new THREE.TorusGeometry(rr * 0.75, params.beamWidth / 2, 30, 200), platformMaterial);

	var beamsMesh = createBeams(params);

	centerObj.add(centerMesh, ringMesh, innerRingMesh, beamsMesh);

	ringMesh.position.y = ch/2;
	innerRingMesh.position.y = ch/2 + rh/2;
	innerRingMesh.rotation.x = Math.PI/2;
	beamsMesh.position.y = ch/2 + rh/2;

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

	var poleMesh = new THREE.Mesh(new THREE.CylinderGeometry(pr, pr, ph, 32, 32), baseMaterial);

	return poleMesh;
}

/**
	* Creates each horse, then returns a horse object.
	* Inputs: colors for the horse.
	*/
function createHorse(horsecolor1, horsecolor2, saddlecolor) {
	horseObj = new THREE.Object3D();

	var horseMaterial = [new THREE.MeshPhongMaterial({ color: new THREE.Color(horsecolor1) }),
		new THREE.MeshPhongMaterial({ color: new THREE.Color(horsecolor2) }),
		new THREE.MeshPhongMaterial({ color: new THREE.Color(saddlecolor) })]

	// making the head
	headObj = new THREE.Object3D();
	var face = new THREE.Mesh(new THREE.CylinderGeometry(4, 8, 15, 10), horseMaterial[0]);
	var head = new THREE.Mesh(new THREE.SphereGeometry(9, 8, 8), horseMaterial[0]);
	face.position.y = 9;
	
	headObj.add(face, head);
	headObj.rotation.z = 5 * Math.PI / 8;
	headObj.scale.z = 0.75;

	// making the neck
	var neck = new THREE.Mesh(new THREE.CylinderGeometry(5, 8, 20, 10), horseMaterial[0]);
	neck.position.set(5, -10, 0);
	neck.rotation.z = Math.PI / 6;
	neck.scale.z = 0.5

	// making the torso
	torsoObj = new THREE.Object3D();
	var torso1 = new THREE.Mesh(new THREE.CylinderGeometry(9, 12, 20, 10), horseMaterial[0]);
	var torso2 = new THREE.Mesh(new THREE.SphereGeometry(9, 8, 8), horseMaterial[0]);
	var torso3 = new THREE.Mesh(new THREE.SphereGeometry(12, 8, 8), horseMaterial[0]);
	
	torso1.position.set(0, 0, 0);
	torso2.position.set(0, 10, 0);
	torso3.position.set(0, -10, 0);

	torsoObj.add(torso1, torso2, torso3);
	torsoObj.position.set(20, -20, 0);
	torsoObj.rotation.z = Math.PI / 2;
	torsoObj.scale.z = 0.75;

	// make horses front legs
	var ftleg1 = new THREE.Mesh(new THREE.CylinderGeometry(5, 5, 12, 4), horseMaterial[0]);
	var ftleg2 = new THREE.Mesh(new THREE.CylinderGeometry(4, 4, 12, 4), horseMaterial[0]);
	var ftleg3 = new THREE.Mesh(new THREE.CylinderGeometry(3, 3, 7, 4), horseMaterial[0]);
	var ftleg4 = new THREE.Mesh(new THREE.CylinderGeometry(3, 3, 4, 4), horseMaterial[1]);
	
	ftleg1.rotation.set(-Math.PI/6, Math.PI/6, Math.PI/4);

	ftleg2.rotation.y = Math.PI / 6;
	ftleg2.position.set(3, -8, 0);
	
	ftleg3.rotation.set(Math.PI/6, Math.PI/6, -Math.PI/4);
	ftleg3.position.set(1, -15, 0);

	ftleg4.rotation.set(Math.PI/6, Math.PI/6, -Math.PI/3);
	ftleg4.position.set(-2, -18, 0);

	frontleg1Obj = new THREE.Object3D();
	frontleg1Obj.add(ftleg1, ftleg2, ftleg3, ftleg4);

	frontleg1Obj.scale.set(-1, 1, 0.75);
	frontleg1Obj.position.set(5, -25, 3);

	var frontleg2Obj = frontleg1Obj.clone();
	frontleg2Obj.rotation.z = Math.PI/6;
	frontleg2Obj.position.set(5, -25, -3);

	// make horses back legs
	var bkleg1 = new THREE.Mesh(new THREE.CylinderGeometry(6, 6, 24, 4), horseMaterial[0]);
	var bkleg2 = new THREE.Mesh(new THREE.CylinderGeometry(4, 4, 13, 4), horseMaterial[0]);
	var bkleg3 = new THREE.Mesh(new THREE.CylinderGeometry(4, 4, 6, 4), horseMaterial[1]);

	bkleg1.rotation.set(-Math.PI/6, Math.PI/6, Math.PI/4); 
	bkleg1.scale.x = -1;

	bkleg2.rotation.set(-Math.PI/6, -Math.PI/6, -Math.PI/4); 
	bkleg2.position.set(3, -12, 0);

	bkleg3.rotation.set(-Math.PI/6, -Math.PI/6, -Math.PI/4);
	bkleg3.position.set(0, -18, 0);

	backleg1Obj = new THREE.Object3D();
	backleg1Obj.add(bkleg1, bkleg2, bkleg3);
	backleg1Obj.scale.z = 0.75;
	backleg1Obj.position.set(35, -30, 4);

	var backleg2Obj = backleg1Obj.clone();
	backleg2Obj.rotation.z = Math.PI / 6;
	backleg2Obj.position.set(35, -30, -4);

	// make horse's ears
	var ear1 = new THREE.Mesh(new THREE.CylinderGeometry(0, 4, 10, 4), horseMaterial[0]);
	ear1.position.set(0, 8, 5);
	ear1.scale.x = 0.5;
	ear1.rotation.x = Math.PI / 8;

	var ear2 = new THREE.Mesh(new THREE.CylinderGeometry(0, 4, 10, 4), horseMaterial[0]);
	ear2.position.set(0, 8, -5);
	ear2.scale.x = 0.5;
	ear2.rotation.x = -Math.PI / 8;

	// make horse's mane
	var bezierCurve = new THREE.CubicBezierCurve3(
		new THREE.Vector3(-5, -11, 0), new THREE.Vector3(1.5, -3, 0), new THREE.Vector3(14, -9, 0), new THREE.Vector3(13, 5, 0));
	var radii = [0, 1.5, 2.5, 4];

	var mane = new THREE.Mesh(new THREE.TubeRadialGeometry(bezierCurve, 32, radii, 16, false), horseMaterial[1]);
	mane.rotation.z = 2 * Math.PI / 3;
	mane.scale.set(0.5, 0.5, 0.5);
	mane.position.set(7, 2, 0);

	for (var i = 0; i < 8; i++) {
		var maneClone = mane.clone();
		maneClone.position.x += 0.5 * i;
		maneClone.position.y += (-3 * i);
		maneClone.scale.y += 0.1 * i;
		horseObj.add(maneClone);
	}

	// use same geometry for tail and mane
	var tail = new THREE.Mesh(new THREE.TubeRadialGeometry(bezierCurve, 32, radii, 16, false), horseMaterial[1]);
	tail.rotation.z = 2 * Math.PI / 5;
	tail.position.set(38, -30, 0);

	var saddle = new THREE.Mesh(new THREE.CylinderGeometry(9, 10, 15, 10, 1, false, 0, Math.PI), horseMaterial[2]);
	saddle.rotation.z = Math.PI / 2;
	saddle.position.set(20, -18, 0);

	horseObj.add(headObj, neck, torsoObj, frontleg1Obj, frontleg2Obj, backleg1Obj, backleg2Obj, ear1, ear2, mane, tail, saddle);

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
		var horseColor1Index = i % horseParams.hColor1.length;
		var horseColor2Index = i % horseParams.hColor2.length;
		var horseColor3Index = i % horseParams.hColor3.length;

		var horse = createHorse(horseParams.hColor1[horseColor1Index],
			horseParams.hColor2[horseColor2Index], horseParams.hColor3[horseColor3Index]);

		horse.scale.set(horseParams.hScale, horseParams.hScale, horseParams.hScale)
		horse.position.x = -10;

		horsePoleObj.add(horse, poleMesh, spotLight, spotLight.target);

		var radianFactor = (2 * Math.PI) / params.tentSections;
		var radius = (params.platformRadius * 0.75);

		spotLight.position.y = params.centerHeight + params.platformHeight;

		horsePoleObj.position.set(radius * Math.cos(i*radianFactor), 0, radius * Math.sin(i*radianFactor));
		horsePoleObj.rotation.y = -i * radianFactor + Math.PI / 2;

		polesObj.add(horsePoleObj);
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
	var platformMesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, height, 64, 64), platformMaterial);

	platformObj.add(platformMesh, center);

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

	var handleMesh = new THREE.Mesh(new THREE.TubeGeometry(path, 20, 2, 8, false ), handleMaterial);
	var handleKnobMesh = new THREE.Mesh(new THREE.CylinderGeometry(4, 4, 10), handleMaterial );

	handleObj.add(handleMesh, handleKnobMesh);

	handleKnobMesh.rotation.z = Math.PI/2;
	handleKnobMesh.position.set(40, -20, 0);

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

	carouselObj.add(platform, tent);

	tent.position.y = params.centerHeight + params.platformHeight + params.tentHeight / 2;

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

	var baseMesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, height, 32, 32), baseMaterial);

	baseObj.add(baseMesh);

	return baseObj
}

var handle = createHandle(musicBoxParams);  // global variable so it can be controlled with ui

/**
	* Adds the handle to the scene.
	* Input: dictionary of music box parameters.
	*/
function addHandle(params){
	handle.position.set(params.baseRadius, params.baseHeight/2, 0);
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

	musicBox.add(base, carousel);

	carousel.position.y = (musicBoxParams.baseHeight + carouselParams.platformHeight) / 2;
	musicBox.position.y = musicBoxParams.baseHeight / 2;

	scene.add(musicBox);
}

/**
	* Creates a floor mesh and sky mesh, then adds it to the scene.
	* Input: dictionary of background parameters.
	*/
function addBackground(params) {
	var floorMesh = new THREE.Mesh(new THREE.CircleGeometry(params.floorWidth/2, 32), floorMaterial);
	floorMesh.rotation.x = -Math.PI / 2;
	var skyMesh = new THREE.Mesh(new THREE.SphereGeometry(params.domeWidth, 32, 32, 2*Math.PI, 2*Math.PI, 0, Math.PI/2), skyMaterial);
	
	scene.add(skyMesh, floorMesh);
}

//===============================================================================================
// functions for tent decorations (moon, planet, and top lights)

/**
* Creates the decorations hanging from the side of carousel
* Inputs: dictionary of decorations parameters and type of decoration used
*/
function createLightDecs(params, decType) {
	var decObj = new THREE.Object3D();

	var lightHanger = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, params.decHangHeight/3),
	new THREE.MeshPhongMaterial({ color: 0x666D75 }));  // greyish dark blue color

	lightHanger.position.y = params.decHeight*0.9;
	decObj.add(lightHanger);

	var decMaterial = [];

	if (uiParams.lightOn) {
		decMaterial = [new THREE.MeshPhongMaterial({ color: 0x4696e0 }),
		new THREE.MeshBasicMaterial({ color: 0xebcf1a, side: THREE.DoubleSide})]
	} else {
		decMaterial = [new THREE.MeshPhongMaterial({ color: 0x525b75 }),
		new THREE.MeshPhongMaterial({ color: 0xffd900, transparent: true, opacity: 0.5, side: THREE.DoubleSide})]
	}

	if (decType == "planet") {
		var planet = new THREE.Mesh(new THREE.SphereGeometry(params.decHeight*0.4, 32, 32),	decMaterial[0]);  // greyish blue color
		var ring = new THREE.Mesh(new THREE.CylinderGeometry(params.decHeight/2, params.decHeight/2, params.decHeight/7), decMaterial[1]);

		ring.rotation.z = Math.PI/5;

		decObj.add(planet, ring);

	} else if (decType == 'moon') {

		var moonShape = new THREE.Shape();
		moonShape.moveTo(0, 0);
		moonShape.bezierCurveTo(params.decHeight/4, 0, params.decHeight/4, params.decHeight, 0, params.decHeight);
		moonShape.bezierCurveTo( params.decHeight*0.75, params.decHeight, params.decHeight*0.75, 0, 0, 0);

		var extrudeSettings = {
			steps: 2,
			depth: params.decHeight*0.75,
			bevelEnabled: true,
			bevelThickness: 1,
			bevelSize: 1,
			bevelOffset: 0,
			bevelSegments: 2
		};

		var moon = new THREE.Mesh(new THREE.ExtrudeGeometry( moonShape, extrudeSettings ), decMaterial[1]);

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
	var lightTopMaterial;

	if (uiParams.lightOn) {  // light looks brighter when on
		lightTopMaterial = new THREE.MeshBasicMaterial({ color: 0xebcf1a, side: THREE.DoubleSide });
	} else {
		lightTopMaterial = new THREE.MeshPhongMaterial({  // light looks more opaque when off
				color: 0xffd900,
				opacity: 0.5,
				transparent: true,
				side: THREE.DoubleSide
		});
	}
	var topLightMesh = new THREE.Mesh(new THREE.SphereGeometry(params.topLightRadius, 32, 32), lightTopMaterial);

	tentTopObj.add(topLightMesh, topLight);

	return tentTopObj;
}

var decLights = new THREE.Object3D();  // global variable for all lights to easily change material

/**
* Adds the light decorations to the carousel.
* Input: dictionary of carousel parameters.
*/
function addLightDecs(params) {
	var topLight = createTentTop(params);
	topLight.position.y = params.platformHeight + params.centerHeight + params.tentHeight*1.75;

	var dec1 = createLightDecs(decParams, "planet");
	var dec2 = createLightDecs(decParams, "moon");

	var tr = params.tentRadius;

	dec1.position.set(tr/2, params.platformHeight + params.centerHeight + decParams.decHeight + 10, tr/2)
	dec2.position.set(-tr/2, params.platformHeight + params.centerHeight + decParams.decHeight + 10, tr/2)

	decLights.add(topLight, dec1, dec2);

	scene.add(decLights);
}

// global variable names for light decorations to be removed
var planetLight;
var moonLight;
var topLight;

/**
* Adds the lights to the light decorations.
* Input: dictionary of carousel parameters.
*/
function addLightToDecs(params) {
	var x = decParams.decHeight/2 * Math.cos(Math.PI/3);
	var y = decParams.decHeight/2 * Math.sin(Math.PI/6);

	planetLight = new THREE.PointLight("white", 0.2, 0, 2);
	planetLight.position.set(params.tentRadius/2 + x, params.platformHeight + params.centerHeight
		+ decParams.decHeight/2, params.tentRadius/2 - y);
	planetLight.visible = uiParams.lightOn;

	moonLight = new THREE.PointLight("white", 0.2, 0, 2);
	moonLight.position.set(-params.tentRadius/2, params.platformHeight + params.centerHeight + decParams.decHeight/2, -params.tentRadius/2);
	moonLight.visible = uiParams.lightOn;

	topLight = new THREE.PointLight("white", 0.3, 0, 2);
	topLight.position.y = params.platformHeight + params.centerHeight + params.tentHeight*1.75;
	topLight.visible = uiParams.lightOn;
	
	scene.add(planetLight, moonLight, topLight);

	renderer.render(scene, camera);
}

function changeLight(){
	scene.remove(planetLight, moonLight, topLight, decLights);
	
	while (decLights.children.length > 0) {  // remove all decoration lights
		decLights.remove(decLights.children[0]);
	}

	uiParams.lightOn = !uiParams.lightOn;
	addLightToDecs(carouselParams);
	addLightDecs(carouselParams,uiParams.lightOn);
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

	scene.add(dirLight, ambLight);
}

//===============================================================================================
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

var camera = state.cameraObject;  // allows for usage with raycaster
camera.position.set(0, 80, 200);
camera.lookAt(new THREE.Vector3(0, 70, 0));
scene.add(camera);

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

	floorMaterial = new THREE.MeshPhongMaterial({ color: "chocolate", map: textures[0], side: THREE.DoubleSide });

	skyMaterial = new THREE.MeshPhongMaterial({ color: "steelblue", map: textures[1], side: THREE.DoubleSide });

	addBackground(backgroundParams);
	renderer.render(scene, camera);
}

/**
	* Adds all the components to the scene.
	*/
function showResult() {
	TW.loadTextures(["images/floor.jpg", "images/sky.jpg"],
		function (textures) {
			addTextures(textures);
	});
	
	addMusicBox();
	addLightToDecs(carouselParams);
	addLightDecs(carouselParams);
	addGeneralLights();
	addLightSwitch(musicBoxParams);
	addHandle(musicBoxParams);

	renderer.render(scene, camera);
}

showResult();

// ======================================================================================
// music for carousel

var listener = new THREE.AudioListener();
camera.add(listener);

var sound = new THREE.Audio(listener);
var audioLoader = new THREE.AudioLoader();

audioLoader.load('sounds/carousel.mp3', function (buffer) {
	sound.setBuffer(buffer);
	sound.setVolume(0.5);
});

// ======================================================================================
// functions for animation with spinning carousel

// event listeners for winding up and releasing the handle to start the animation
TW.setKeyboardCallback('w', windUp, "wind up");
TW.setKeyboardCallback('r', release, "release handle");

var spinPart = createPoles(carouselParams);  // global variable for animation
spinPart.position.y = (musicBoxParams.baseHeight/2 + carouselParams.centerHeight + carouselParams.platformHeight/2);
scene.add(spinPart);

var animationID = null;  // global variable allows us to discontinue the animation

/**
	* Callback function for the click event that winds up the handle.
	*/
function windUp() {
	scene.remove(handle, spinPart);
	spinParams.handleAngle += Math.PI/100;
	spinPart.rotation.y += Math.PI/100;
	scene.add(spinPart);
	addHandle(musicBoxParams);

	spinParams.currentStep += 1;
	spinParams.total += 1;

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
	if (!sound.isPlaying) {
		sound.play();
	}
	scene.remove(handle, spinPart);
	spinParams.handleAngle -= Math.PI/30;
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
function stopAnimation(isRelease) {
	spinParams.currentStep = 0;

	if (sound.isPlaying) {  // stop playing music at the end of the cycle
		sound.stop();
	}
	if (animationID != null) {
		cancelAnimationFrame(animationID);
	}
}

// ======================================================================================
// user interaction for light switches

var lightSwitch;  // global variable to move the switch upon clicking it

/**
	* Creates the music box light switch.
	* Input: dictionary of music box parameters.
	*/
function addLightSwitch(params) {
	lightSwitch = new THREE.Mesh(new THREE.CylinderGeometry(7, 8, 10, 64), lightSwitchMaterial);
	lightSwitch.name = "switch";  // name the switch so it is identifiable with the raycaster
	scene.add(lightSwitch);

	if (uiParams.lightOn) {
		lightSwitch.position.z = params.baseRadius-5;  // move switch inward
	} else {
		lightSwitch.position.z = params.baseRadius;  // move switch outward
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
	mouse.x = (canvasx / 900) * 2 - 1;
	mouse.y = -(canvasy / 450) * 2 + 1;

	raycaster.setFromCamera(mouse, camera);  // sets up raycaster using mouse position and camera

	var intersects = raycaster.intersectObjects(scene.children, true);

	if (intersects.length > 0) {
		if (intersects[0].object.name == "switch") { // turns on lights if object closest to the camera has the name of switch
			changeLight();
			scene.remove(lightSwitch);
			addLightSwitch(musicBoxParams);
			renderer.render(scene, camera);
		};
	}
}

renderer.render(scene, camera);