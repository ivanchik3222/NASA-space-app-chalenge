const width = window.innerWidth, height = window.innerHeight;

// init

const camera = new THREE.PerspectiveCamera( 70, width / height, 0.01, 10 );
camera.position.z = 3;

const scene = new THREE.Scene();

//add

const loader = new THREE.TextureLoader();

const texture_earth = loader.load('static/texture.png');

//add objects

const geometry2 = new THREE.SphereGeometry( 0.3, 32, 32 );
const material2 = new THREE.MeshBasicMaterial({map: texture_earth,});


const mesh2 = new THREE.Mesh( geometry2, material2 );
scene.add( mesh2 );

//render settings

const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setSize( width, height );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

// animation

function animate( time ) {

    mesh2.rotation.y = time / 1000;
    // mesh2.rotation.x = time / 2000;

    renderer.render( scene, camera );

}