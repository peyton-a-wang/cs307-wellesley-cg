/** 
 * Returns an obelisk geometry, such that the origin is at the center of the base. 
 * Inputs: base width, top width, main height, top height
 */
function createObelisk(bw, tw, mh, tp) {

	var obeliskGeom = new THREE.Geometry();

	// adds vertices for the base
	obeliskGeom.vertices.push(new THREE.Vector3(-0.5 * bw, 0, 0.5 * bw));
	obeliskGeom.vertices.push(new THREE.Vector3(0.5 * bw, 0, 0.5 * bw));
	obeliskGeom.vertices.push(new THREE.Vector3(0.5 * bw, 0, -0.5 * bw));
	obeliskGeom.vertices.push(new THREE.Vector3(-0.5 * bw, 0, -0.5 * bw));

	// adds vertices for the pyramidion
	obeliskGeom.vertices.push(new THREE.Vector3(-0.5 * tw, mh, 0.5 * tw));
	obeliskGeom.vertices.push(new THREE.Vector3(0.5 * tw, mh, 0.5 * tw));
	obeliskGeom.vertices.push(new THREE.Vector3(0.5 * tw, mh, -0.5 * tw));
	obeliskGeom.vertices.push(new THREE.Vector3(-0.5 * tw, mh, -0.5 * tw));
	obeliskGeom.vertices.push(new THREE.Vector3(0, mh + tp, 0));

	// uses vertices to define 4 parallelogram faces of the tower
	obeliskGeom.faces.push(new THREE.Face3(0, 1, 5));
	obeliskGeom.faces.push(new THREE.Face3(0, 5, 4));
	obeliskGeom.faces.push(new THREE.Face3(1, 2, 5));
	obeliskGeom.faces.push(new THREE.Face3(2, 6, 5));
	obeliskGeom.faces.push(new THREE.Face3(2, 3, 6));
	obeliskGeom.faces.push(new THREE.Face3(3, 7, 6));
	obeliskGeom.faces.push(new THREE.Face3(3, 0, 7));
	obeliskGeom.faces.push(new THREE.Face3(0, 4, 7));

	// uses vertices to define 4 triangular faces of the pyramidion
	obeliskGeom.faces.push(new THREE.Face3(4, 5, 8));
	obeliskGeom.faces.push(new THREE.Face3(5, 6, 8));
	obeliskGeom.faces.push(new THREE.Face3(6, 7, 8));
	obeliskGeom.faces.push(new THREE.Face3(7, 4, 8));

	return obeliskGeom;
}

var randomColor = false; //variable deciding whether the color for obelisk is randomly generated

/** 
 * Creates and returns an obelisk mesh.
 * Inputs: an obelisk geometry.
 */
function createObeliskMesh(obeliskGeom) {
	// array of THREE.MeshBasicMaterial with instances created from 8 colors
	var obeliskMaterials = [
		new THREE.MeshBasicMaterial({ color: THREE.ColorKeywords.lavender }),  // lavender: Three.js keyword
		new THREE.MeshBasicMaterial({ color: new THREE.Color(0.60, 0.7, 0.85) }), // pastel dark blue: color cube
		new THREE.MeshBasicMaterial({ color: 0xbecedd }), // light blue: hexadecimal number
		new THREE.MeshBasicMaterial({ color: "whitesmoke" }),  // white smoke: CSS color name
		new THREE.MeshBasicMaterial({ color: "rgb(140,109,147)" }), // dark purple: CSS string
		new THREE.MeshBasicMaterial({ color: "rgb(77,89,110)" }),  // dark blue
		new THREE.MeshBasicMaterial({ color: "rgb(106,132,159)" }),  // medium blue
		new THREE.MeshBasicMaterial({ color: "rgb(217,205,205)" })  // purple grey
	];

	// array of THREE.MeshBasicMaterial with randomly generated colors
	var obeliskMaterialsRandom = [
		new THREE.MeshBasicMaterial({ color: TW.randomColor() }),
		new THREE.MeshBasicMaterial({ color: TW.randomColor() }),
		new THREE.MeshBasicMaterial({ color: TW.randomColor() }),
		new THREE.MeshBasicMaterial({ color: TW.randomColor() }),
		new THREE.MeshBasicMaterial({ color: TW.randomColor() }),
		new THREE.MeshBasicMaterial({ color: TW.randomColor() }),
		new THREE.MeshBasicMaterial({ color: TW.randomColor() }),
		new THREE.MeshBasicMaterial({ color: TW.randomColor() })
	];

	// sets the material index for each of the 4 tower faces 
	TW.setMaterialForFaces(obeliskGeom, 0, 0, 1);
	TW.setMaterialForFaces(obeliskGeom, 1, 2, 3);
	TW.setMaterialForFaces(obeliskGeom, 2, 4, 5);
	TW.setMaterialForFaces(obeliskGeom, 3, 6, 7);

	// sets the material index for each of the 4 pyramidion faces 
	TW.setMaterialForFaces(obeliskGeom, 4, 8);
	TW.setMaterialForFaces(obeliskGeom, 5, 9);
	TW.setMaterialForFaces(obeliskGeom, 6, 10);
	TW.setMaterialForFaces(obeliskGeom, 7, 11);

	if (randomColor) {
		return new THREE.Mesh(obeliskGeom, obeliskMaterialsRandom);
	}
	else {
		return new THREE.Mesh(obeliskGeom, obeliskMaterials);
	}

	return new THREE.Mesh(obeliskGeom, obeliskMaterials);
}

var obeliskMesh;  // global variable for the obelisk mesh (will be modified upon toggling the slider)

/** 
 * Adds the obelisk mesh to the scene. 
 */
function addObelisk(bw, tw, mh, tp) {
	let obeliskGeom = createObelisk(bw, tw, mh, tp);
	obeliskMesh = createObeliskMesh(obeliskGeom);
	scene.add(obeliskMesh);
}

/** 
 * Callback function that redraws the obelisk with the new dimensions. 
 */
function redrawObelisk() {
	scene.remove(obeliskMesh);
	addObelisk(sceneParams.baseWidth, sceneParams.topWidth, sceneParams.mainHeight, sceneParams.topHeight);
	TW.render();
}

/** 
 * Callback function that widens the base width of the obelisk.
 * Base width increases based on the global variable increment.
 */
function widenObeliskBaseWidth() {
	// displays alert when max base width reached
	if ((sceneParams.baseWidth + increment > sliderParams.maxBaseWidth)) {
		alert("Maximum base width reached: cannot widen obelisk anymore.");
	}
	else {
		sceneParams.baseWidth += increment;
		sceneParams.baseWidth += increment;
		redrawObelisk();
		changeSlider();
	}
}

/** 
 * Callback function that narrows the base width of the obelisk.
 * Base width decreases based on the global variable decrement.
 */
function narrowObeliskBaseWidth() {
	// displays alert when min base width reached
	if ((sceneParams.baseWidth - decrement < sliderParams.minBaseWidth)) {
		alert("Minimum base width reached: cannot narrow obelisk anymore.");
	}
	else {
		sceneParams.baseWidth -= decrement;
		sceneParams.baseWidth -= decrement;
		redrawObelisk();
		changeSlider();
	}
}

/** 
 * Helper function for changing the GUI when the base width is altered using keyboard controls.
 */
function changeSlider() {
	gui.__controllers[0].setValue(sceneParams.baseWidth);
}

/**
 * Changes the color of obelisk to randomColor.
 */
function randomObelisk() {
	randomColor = true;
	redrawObelisk();
	randomColor = false;
}

// ====================================================================

var scene = new THREE.Scene();  // creates the scene
scene.background = new THREE.Color("darkseagreen");

// global variables for the dimensions of the obelisk
var sceneParams = {
	baseWidth: 55,
	topWidth: 34,
	mainHeight: 555,
	topHeight: 55
};

// global variables for how much to increment/decrement the base width using keyboard controls
var increment = 5;
var decrement = 2;

addObelisk(sceneParams.baseWidth, sceneParams.topWidth, sceneParams.mainHeight, sceneParams.topHeight);

// ====================================================================

// global variables for the value ranges of the slider
var sliderParams = {
	minBaseWidth: 20,
	maxBaseWidth: 100,
	minTopWidth: 20,
	maxTopWidth: 70,
	minMainHeight: 200,
	maxMainHeight: 900,
	minTopHeight: 20,
	maxTopHeight: 100
};

// sets up sliders to control the box dimensions
var gui = new dat.GUI();
gui.add(sceneParams, 'baseWidth', sliderParams.minBaseWidth, sliderParams.maxBaseWidth).onChange(redrawObelisk);
gui.add(sceneParams, 'topWidth', sliderParams.minTopWidth, sliderParams.maxTopWidth).onChange(redrawObelisk);
gui.add(sceneParams, 'mainHeight', sliderParams.minMainHeight, sliderParams.maxMainHeight).onChange(redrawObelisk);
gui.add(sceneParams, 'topHeight', sliderParams.minTopHeight, sliderParams.maxTopHeight).onChange(redrawObelisk);

// ====================================================================

// creates a renderer
var renderer = new THREE.WebGLRenderer();

TW.mainInit(renderer, scene);

// keyboard controls
TW.setKeyboardCallback('+', widenObeliskBaseWidth, "widen obelisk base");
TW.setKeyboardCallback('-', narrowObeliskBaseWidth, "narrow obelisk base");
TW.setKeyboardCallback('r', randomObelisk, "assign random colors to obelisk (reverts to default colors when dimensions change)");


// uses a default orbiting camera
TW.cameraSetup(renderer,
	scene,
	{
		minx: -0.5 * sliderParams.maxBaseWidth, maxx: 0.5 * sliderParams.maxBaseWidth,
		miny: 0, maxy: sliderParams.maxMainHeight + sliderParams.maxTopHeight,
		minz: -0.5 * sliderParams.maxBaseWidth, maxz: 0.5 * sliderParams.maxBaseWidth
	}
);