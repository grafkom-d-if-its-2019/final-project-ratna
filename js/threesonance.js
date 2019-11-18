import * as THREE from './three.module.js'
import { RectAreaLightUniformsLib } from './RectAreaLightUniformsLib.js'

var threesonance = {}
const width = window.innerWidth
const height = window.innerHeight
const camSpeed = -0.1
// const material = new THREE.MeshBasicMaterial()
const material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.0,
    metalness: 0.5,
    reflectivity: 1.0,
    side: THREE.DoubleSide
})
const buttonGeometry = new THREE.BoxGeometry(.5, .4, .7)
var key = []
var font = undefined
var current = undefined

const onKeyDown = event => {
    if (event.code == 'KeyS') key[0] = true
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
    if (event.code == 'KeyS') key[0] = false
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

threesonance.initGrid = length => {
    const scaleZ = 1
    var arr = []
    for (let i = 0; i < length; i++) {
        var grid = new THREE.GridHelper(14, 7, 0x888888, 0x888888)
        grid.position.set(0, 0, 0-i*14*scaleZ)
        grid.scale.set(.5, 1, scaleZ)
        arr.push(grid)
    }
    return arr
}

threesonance.initWorld = () => {
    var boxG = new THREE.BoxGeometry(10, 10, 1000)
    threesonance.lorong = new THREE.Mesh(boxG, material)
    threesonance.lorong.position.set(0, 2.25, 0)
    for (var i=0;i<10;i++) {
        var light = new THREE.RectAreaLight(0x00ffff, 0, 1, 1)
        light.position.set(0, 3, -3*i)
        if (i%3==0) light.color.setHex(0x00ffff)
        if (i%3==1) light.color.setHex(0xff00ff)
        if (i%3==2) light.color.setHex(0xffff00)
        light.lookAt(0,3,1)
        threesonance.lorong.add(light)
    }
    threesonance.scene.add(threesonance.lorong)
}

threesonance.moveUI = () => {
    threesonance.camera.position.z += camSpeed
    threesonance.score.position.z += camSpeed
    for (let i = 0; i < threesonance.button.length; i++) {
        threesonance.button[i].position.z += camSpeed
        if (key[i]) {
            threesonance.button[i].position.y = 0
            threesonance.button[i].children[1].intensity = 3
        }
        else {
            threesonance.button[i].position.y = .2
            if (threesonance.button[i].children[1].intensity > 0)
                threesonance.button[i].children[1].intensity -= .25
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
    threesonance.resonance()
    threesonance.fade()
    threesonance.renderer.render(threesonance.scene, threesonance.camera)
}

threesonance.init = () => {
    console.log('threesonance init')
    THREE.Cache.enabled = true;
    threesonance.scene = new THREE.Scene()
    threesonance.scene.background = new THREE.Color(0x000000)
    RectAreaLightUniformsLib.init()
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
    var grids = threesonance.initGrid(100)
    for (let i = 0; i < grids.length; i++) {
        threesonance.scene.add(grids[i])
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