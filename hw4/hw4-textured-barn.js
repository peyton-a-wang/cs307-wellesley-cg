// global parameters for barn
var params = {
	barnWidth: 20,
	barnHeight: 10,
	barnDepth: 50,
};

// declaring a global variable for the barn mesh
var barnMesh;

// adds texture coordinates to all the barn vertices
function addTextureCoords(barnGeom, textures) {
	if (!barnGeom instanceof THREE.Geometry) {
		throw "not a THREE.Geometry: " + barnGeom;
	}
	// array of face descriptors
	var UVs = [];
	function faceCoords(as, at, bs, bt, cs, ct) {
		UVs.push([new THREE.Vector2(as, at),
		new THREE.Vector2(bs, bt),
		new THREE.Vector2(cs, ct)]);
	}
	// front (faces 0-2)
	faceCoords(0, 0, 1, 0, 1, 0.5);
	faceCoords(0, 0.5, 1, 1, 0, 1);
	faceCoords(0, 1, 1, 1, 0.5, 0.5);  // upper triangle
	// back (faces 3-5)
	faceCoords(1, 0, 0, 0.5, 0, 0);
	faceCoords(1, 0.5, 1, 1, 0, 1);
	faceCoords(0, 1, 1, 1, 0.5, 0.5);  // upper triangle
	// roof (faces 6-9)
	faceCoords(1, 0, 1, 1, 0, 0);
	faceCoords(1, 1, 0, 1, 0, 0);
	faceCoords(0, 0, 1, 0, 1, 1);
	faceCoords(0, 1, 0, 0, 1, 1);
	// sides (faces 10-13)
	faceCoords(1, 0, 0, 1, 0, 0);
	faceCoords(1, 1, 0, 1, 1, 0);
	faceCoords(1, 0, 1, 1, 0, 0);
	faceCoords(1, 1, 0, 1, 0, 0);
	// floor (faces 14-15)
	faceCoords(0, 0, 1, 0, 0, 1);
	faceCoords(1, 0, 1, 1, 0, 1);

	// attach this to the geometry
	barnGeom.faceVertexUvs = [UVs];
}

// ====================================================================

// makes a minimal grayscale barn and adds it to the scene
function makeBasicBarn() {
	var barnGeom = TW.createBarn(params.barnWidth, params.barnHeight, params.barnDepth);
	var barnMat = new THREE.MeshPhongMaterial({ color: 0xdddddd });
	barnMesh = new THREE.Mesh(barnGeom, barnMat);
	scene.add(barnMesh);
}

// callback to show only lighting
function showLighting() {
	// remove the current barn mesh
	scene.remove(barnMesh);
	//add new barn mesh ith no texture
	makeBasicBarn();
	//rerender the scene
	TW.render();
}

// callback to show both lighting and texture
function showResult(textures) {
	// remove old barn mesh
	scene.remove(barnMesh);

	// creating a new barn with textures
	var barnGeom = TW.createBarn(params.barnWidth, params.barnHeight, params.barnDepth);

	// setting the textures
	textures[0].wrapS = THREE.RepeatWrapping;
	textures[0].wrapT = THREE.RepeatWrapping;
	textures[0].repeat.set(2, 2);
	textures[0].needsUpdate = true;
	textures[1].wrapS = THREE.RepeatWrapping;
	textures[1].wrapT = THREE.RepeatWrapping;
	textures[1].repeat.set(2, 2);
	textures[1].needsUpdate = true;

	var wallMaterial = new THREE.MeshPhongMaterial({
		color: 0xffffff,
		map: textures[0]
	});
	var roofMaterial = new THREE.MeshPhongMaterial({
		color: 0xffffff,
		map: textures[1]
	});

	var barnMat = [wallMaterial, roofMaterial];
	addTextureCoords(barnGeom, textures);
	barnMesh = new THREE.Mesh(barnGeom, barnMat);

	// setting material for difference faces of the barn
	TW.setMaterialForFaces(barnGeom, 0, 0, 1, 2, 3, 4, 5, 10, 11, 12, 13, 14, 15);
	TW.setMaterialForFaces(barnGeom, 1, 6, 7, 8, 9);

	// add new barn to scene and rerender
	scene.add(barnMesh);
	TW.render();
}

// ===================================================================

// creating the scene, renderer, and camera
var scene = new THREE.Scene();
scene.background = new THREE.Color("white");
var renderer = new THREE.WebGLRenderer();

TW.mainInit(renderer, scene);

TW.cameraSetup(renderer, scene,
	{
		minx: 0, maxx: params.barnWidth,
		miny: 0, maxy: params.barnHeight,
		minz: -params.barnDepth, maxz: 0
	});
//TW.render();

// create ambient light and add to the scene
var ambLight = new THREE.AmbientLight(0x808080);
scene.add(ambLight);

// create directional light and add to the scene
var dLight = new THREE.DirectionalLight(TW.WHITE, 0.5);
dLight.position.set(1, 1, 2);
scene.add(dLight);

// rendering the scene with only lighting on barn
showLighting();

// creating GUI
var gui = new dat.GUI();

// call back function for GUI
var sceneParams = {
	showLighting: true,
	showResult: false,
}

var settings = {
	mode: "showLighting"
}
var mode = gui.add(settings, 'mode', ['showLighting', 'showResult']);
mode.onChange(changeMode);

function changeMode() {
	if (settings.mode == "showLighting") {
		showLighting();
	} else {
		// wall: https://images.app.goo.gl/fSBmThBoMYXv3DZK9
		// roof: https://www.wildtextures.com/free-textures/white-brick-wall-tileable-texture/
		TW.loadTextures(["images/wall.jpg", "images/roof.jpg"],
			function (textures) {
				showResult(textures);
			});
	}
}