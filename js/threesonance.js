var threesonance = {}
const width = window.innerWidth
const height = window.innerHeight
const camSpeed = -0.1

// GRID MATERIAL
var material_1 = new THREE.MeshPhongMaterial({ 
    color: new THREE.Color('gray'), 
    emissive: new THREE.Color('black'), 
    specular: 0x111111, 
    shininess: 143, 
    transparent: true, 
    opacity: 0.3,
    side: THREE.DoubleSide
});
var material_2 = new THREE.MeshPhongMaterial({ 
    color: new THREE.Color('gray'), 
    emissive: new THREE.Color('black'), 
    specular: 0x111111, 
    shininess: 143, 
    transparent: true, 
    opacity: 0.3,
    side: THREE.DoubleSide
});
var material_3 = new THREE.MeshPhongMaterial({ 
    color: new THREE.Color('gray'), 
    emissive: new THREE.Color('black'), 
    specular: 0x111111, 
    shininess: 143, 
    transparent: true, 
    opacity: 0.3,
    side: THREE.DoubleSide
});
var material_4 = new THREE.MeshPhongMaterial({ 
    color: new THREE.Color('gray'), 
    emissive: new THREE.Color('black'), 
    specular: 0x111111, 
    shininess: 143, 
    transparent: true, 
    opacity: 0.3,
    side: THREE.DoubleSide
});
var material_5 = new THREE.MeshPhongMaterial({ 
    color: new THREE.Color('gray'), 
    emissive: new THREE.Color('black'), 
    specular: 0x111111, 
    shininess: 143, 
    transparent: true, 
    opacity: 0.3,
    side: THREE.DoubleSide
});
var material_6 = new THREE.MeshPhongMaterial({ 
    color: new THREE.Color('gray'), 
    emissive: new THREE.Color('black'), 
    specular: 0x111111, 
    shininess: 143, 
    transparent: true, 
    opacity: 0.3,
    side: THREE.DoubleSide
});
var material_7 = new THREE.MeshPhongMaterial({ 
    color: new THREE.Color('gray'), 
    emissive: new THREE.Color('black'), 
    specular: 0x111111, 
    shininess: 143, 
    transparent: true, 
    opacity: 0.3,
    side: THREE.DoubleSide
});

// BUTTON MATERIAL
const material = new THREE.MeshStandardMaterial({
    color: 0x787878,
    roughness: 0.0,
    metalness: 0.5,
    reflectivity: 1.0,
    side: THREE.DoubleSide
})

const material_trans = new THREE.MeshBasicMaterial({
    color: "purple", 
    wireframe: true,
    transparent: true, opacity: 0.25
})

const buttonGeometry = new THREE.BoxGeometry(.5, .4, .7)
const grid = new THREE.PlaneGeometry(0.88, 10000, 10);
var key = []
var font = undefined
var current = undefined
var materialGrid = [];

materialGrid.push(material_1);
materialGrid.push(material_2);
materialGrid.push(material_3);
materialGrid.push(material_4);
materialGrid.push(material_5);
materialGrid.push(material_6);
materialGrid.push(material_7);

const onKeyDown = event => {
    if (event.code == 'KeyS') {
        key[0] = true;
    }
    if (event.code == 'KeyD') key[1] = true
    if (event.code == 'KeyF') key[2] = true
    if (event.code == 'Space') key[3] = true
    if (event.code == 'KeyJ') key[4] = true
    if (event.code == 'KeyK') key[5] = true
    if (event.code == 'KeyL') key[6] = true
    if (event.code == 'ArrowDown') {
        threesonance.camera.position.y -= .1
    }
    if (event.code == 'ArrowUp') {
        threesonance.camera.position.y += .1
    }
}

const onKeyUp = event => {
    if (event.code == 'KeyS') {
        key[0] = false;
        
    }
    if (event.code == 'KeyD') key[1] = false
    if (event.code == 'KeyF') key[2] = false
    if (event.code == 'Space') key[3] = false
    if (event.code == 'KeyJ') key[4] = false
    if (event.code == 'KeyK') key[5] = false
    if (event.code == 'KeyL') key[6] = false
}

document.addEventListener("keydown", onKeyDown)
document.addEventListener("keyup", onKeyUp)

threesonance.initButton = () => {
    var arr = []
    for (let i = 0; i < 7; i++) {
        var mesh = new THREE.Mesh(buttonGeometry, material)
        mesh.position.set(-3+i, .2, 12.6)
        var light = new THREE.PointLight(0xffffff, 1, 1)
        light.position.set(0, .4, 0)
        var glow = new THREE.PointLight(0x00ffff, 0, 1)
        glow.position.set(0, .4, 0)
        if (i%2) glow.color.setHex(0xffff00)
        else glow.color.setHex(0x00ffff)
        if (i==3) glow.color.setHex(0xff00ff)
        mesh.add(light)
        mesh.add(glow)
        arr.push(mesh)
    }
    return arr
}

threesonance.initGrid = () => {
    var arr = []
    for (let i = 0; i < 7; i++) {
        var plane = new THREE.Mesh(grid, materialGrid[i]);
        plane.position.x = -3+i
        plane.position.y = 0
        plane.position.z = 0
        plane.rotation.x = Math.PI / 2
        arr.push(plane)
    }
    return arr
}

threesonance.initWorld = () => {
    let loader = new THREE.GLTFLoader();
    loader.load('./world/map.glb', function(gltf){
        var cube2 = gltf.scene.children[0];
    //     cube2.scale.set(1,1,1);
        gltf.scene.position.set(0,-1,3.2);
        threesonance.scene.add(gltf.scene);
    });
}

threesonance.moveUI = () => {
    threesonance.camera.position.z += camSpeed
    threesonance.score.position.z += camSpeed
    for (let i = 0; i < threesonance.button.length; i++) {
        threesonance.button[i].position.z += camSpeed
        if (key[i]) {
            threesonance.button[i].position.y = 0
            threesonance.button[i].children[1].intensity = 10
            threesonance.grids[i].material.emissive.setHex(0xFF0000);
            threesonance.grids[i].material.opacity = 1;
        }
        else {
            threesonance.button[i].position.y = .2
            if (threesonance.button[i].children[1].intensity > 0)
                threesonance.button[i].children[1].intensity -= .5
                threesonance.grids[i].material.emissive.setHex(0x000000);
                threesonance.grids[i].material.opacity = 0.3;
        }
    }
}

threesonance.fade = () => {
    for (var i = 0;i<threesonance.lorong.children.length;i++) {
        if (threesonance.lorong.children[i].intensity > 0)
            threesonance.lorong.children[i].intensity -= 5
    }
}

threesonance.resonance = () => {
    var next = new Date().getSeconds()
    if (current != next) {
        current = next
        for (var i = 0;i<threesonance.lorong.children.length;i++) {
            threesonance.lorong.children[i].intensity = 100
        }
    }
}

threesonance.anim = () => {
    requestAnimationFrame(threesonance.anim)
    threesonance.moveUI()
    // threesonance.resonance()
    // threesonance.fade()
    threesonance.renderer.render(threesonance.scene, threesonance.camera)
}

threesonance.init = () => {
    console.log('threesonance init')
    THREE.Cache.enabled = true;
    threesonance.scene = new THREE.Scene()
    threesonance.scene.background = new THREE.Color(0x000000)
    threesonance.scene.add(new THREE.AmbientLight({color: new THREE.Color('white'), intensity: 0.0001}) )
    // RectAreaLightUniformsLib.init()
    threesonance.camera = new THREE.PerspectiveCamera(
        90, 
        width / height, 
        .1, 
        1000
    )
    threesonance.camera.position.set(0, 2.25, 15)
    threesonance.renderer = new THREE.WebGLRenderer({ 
        antialias: true
    })
    threesonance.renderer.setSize(width, height)
    threesonance.renderer.setPixelRatio(devicePixelRatio)
    document.body.appendChild(threesonance.renderer.domElement)
    threesonance.initWorld()
    threesonance.grids = threesonance.initGrid()
    for (let i = 0; i < threesonance.grids.length; i++) {
        threesonance.scene.add(threesonance.grids[i])
    }
    threesonance.button = threesonance.initButton()
    for (let i = 0; i < threesonance.button.length; i++) {
        threesonance.scene.add(threesonance.button[i])
    }
    threesonance.scene.add(threesonance.camera)
    var loader = new THREE.FontLoader()
    loader.load( 'font/droid_sans_regular.typeface.json', res => {
        font = res
        var scoreGeometry = new THREE.TextGeometry( 'Score: 0', {
            font: font,
            size: .5,
            height: .025,
            curveSegments: 5,
            bevelEnabled: false,
        } )
        threesonance.score = new THREE.Mesh(scoreGeometry, material)
        threesonance.score.position.set(-9, 6, 10)
        threesonance.scene.add(threesonance.score)
        // threesonance.renderer.render(threesonance.scene, threesonance.camera)
        current = new Date().getSeconds()
        threesonance.anim()
    } )
}

threesonance.init()