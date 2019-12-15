var threesonance = {}
const width = window.innerWidth
const height = window.innerHeight
const camSpeed = -0.01
const eps = 75
var rng

// GRID MATERIAL
var material_1 = new THREE.MeshPhongMaterial({ 
    color: new THREE.Color('gray'), 
    emissive: new THREE.Color('black'), 
    specular: 0x111111, 
    shininess: 143, 
    transparent: true, 
    opacity: 0.5,
    side: THREE.DoubleSide
});
var material_2 = new THREE.MeshPhongMaterial({ 
    color: new THREE.Color('gray'), 
    emissive: new THREE.Color('black'), 
    specular: 0x111111, 
    shininess: 143, 
    transparent: true, 
    opacity: 0.5,
    side: THREE.DoubleSide
});
var material_3 = new THREE.MeshPhongMaterial({ 
    color: new THREE.Color('gray'), 
    emissive: new THREE.Color('black'), 
    specular: 0x111111, 
    shininess: 143, 
    transparent: true, 
    opacity: 0.5,
    side: THREE.DoubleSide
});
var material_4 = new THREE.MeshPhongMaterial({ 
    color: new THREE.Color('gray'), 
    emissive: new THREE.Color('black'), 
    specular: 0x111111, 
    shininess: 143, 
    transparent: true, 
    opacity: 0.5,
    side: THREE.DoubleSide
});
var material_5 = new THREE.MeshPhongMaterial({ 
    color: new THREE.Color('gray'), 
    emissive: new THREE.Color('black'), 
    specular: 0x111111, 
    shininess: 143, 
    transparent: true, 
    opacity: 0.5,
    side: THREE.DoubleSide
});
var material_6 = new THREE.MeshPhongMaterial({ 
    color: new THREE.Color('gray'), 
    emissive: new THREE.Color('black'), 
    specular: 0x111111, 
    shininess: 143, 
    transparent: true, 
    opacity: 0.5,
    side: THREE.DoubleSide
});
var material_7 = new THREE.MeshPhongMaterial({ 
    color: new THREE.Color('gray'), 
    emissive: new THREE.Color('black'), 
    specular: 0x111111, 
    shininess: 143, 
    transparent: true, 
    opacity: 0.5,
    side: THREE.DoubleSide
});

// SpotLight


var lightHelper1, lightHelper2, lightHelper3;

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
var songStart = undefined
var materialGrid = []
var score = 0, streak = 0

materialGrid.push(material_1);
materialGrid.push(material_2);
materialGrid.push(material_3);
materialGrid.push(material_4);
materialGrid.push(material_5);
materialGrid.push(material_6);
materialGrid.push(material_7);

const onKeyDown = event => {
    if (event.code == 'KeyS') {
        key[0] = true
        threesonance.checkHit(0)
    }
    if (event.code == 'KeyD') {
        key[1] = true
        threesonance.checkHit(1)
    }
    if (event.code == 'KeyF') {
        key[2] = true
        threesonance.checkHit(2)
    }
    if (event.code == 'Space') {
        key[3] = true
        threesonance.checkHit(3)
    }
    if (event.code == 'KeyJ') {
        key[4] = true
        threesonance.checkHit(4)
    }
    if (event.code == 'KeyK') {
        key[5] = true
        threesonance.checkHit(5)
    }
    if (event.code == 'KeyL') {
        key[6] = true
        threesonance.checkHit(6)
    }
    // if (event.code == 'ArrowDown') {
    //     threesonance.camera.position.y -= .1
    // }
    // if (event.code == 'ArrowUp') {
    //     threesonance.camera.position.y += .1
    // }
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
        threesonance.renderer.render(threesonance.scene, threesonance.camera)
    });
    const loader2 = new THREE.TextureLoader();
    loader2.load('./world/sky.jpg' , function(texture)
    {
        threesonance.scene.background = texture;
        threesonance.renderer.render(threesonance.scene, threesonance.camera)
    });
}

threesonance.moveUI = () => {
    var temp = new Date()
    var delta = temp - current
    var speed = camSpeed*delta
    threesonance.camera.position.z += speed
    for (let i = 0; i < threesonance.button.length; i++) {
        threesonance.button[i].position.z += speed
        if (key[i]) {
            threesonance.button[i].position.y = 0
            threesonance.button[i].children[1].intensity = 10
            threesonance.grids[i].material.opacity = 1;
            switch (i) {
                case 0:
                case 2:
                case 4:
                case 6:
                    threesonance.grids[i].material.emissive.setHex(0x00ffff);
                    break
                case 1:
                case 5:
                    threesonance.grids[i].material.emissive.setHex(0xFFFF00);
                    break
                default:
                    threesonance.grids[i].material.emissive.setHex(0xFF00FF);
                    break
            }
        }
        else {
            threesonance.button[i].position.y = .2
            if (threesonance.button[i].children[1].intensity > 0)
                threesonance.button[i].children[1].intensity -= .5
                threesonance.grids[i].material.emissive.setHex(0x000000);
                threesonance.grids[i].material.opacity = 0.5;
        }
    }
    current = temp
}

threesonance.fade = () => {
    if (threesonance.spotLight3.intensity > 0)
        threesonance.spotLight3.intensity -= 5
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

threesonance.checkMiss = () => {
    var time = new Date() - songStart
    for (var i = 0;i<7;i++) {
        if (time>threesonance.noteTime[i][0]*1000+2*eps) {
            threesonance.spotLight3.color.setHex(0xFF00FF)
            threesonance.spotLight3.intensity = 100
            threesonance.scene.remove(threesonance.notes[i][0])
            threesonance.notes[i].shift()
            threesonance.noteTime[i].shift()
            streak = 0
            threesonance.refreshScore()
            console.log('miss!')
        }
    }
}

threesonance.checkHit = (lane) => {
    var time = new Date() - songStart
    if (time<threesonance.noteTime[lane][0]*1000+eps && time>threesonance.noteTime[lane][0]*1000-eps) {
        threesonance.spotLight3.color.setHex(0x00ffff)
        threesonance.spotLight3.intensity = 100
        threesonance.scene.remove(threesonance.notes[lane][0])
        threesonance.notes[lane].shift()
        threesonance.noteTime[lane].shift()
        if (streak > 0)
            score += (200*streak)
        else score += 200
        streak++
        threesonance.refreshScore()
        console.log('perfect!')
    }
    else if (time<threesonance.noteTime[lane][0]*1000+2*eps && time>threesonance.noteTime[lane][0]*1000+eps) {
        threesonance.spotLight3.color.setHex(0xffff0)
        threesonance.spotLight3.intensity = 100
        threesonance.scene.remove(threesonance.notes[lane][0])
        threesonance.notes[lane].shift()
        threesonance.noteTime[lane].shift()
        if (streak > 0)
            score += (100*streak)
        else score += 100
        streak++
        threesonance.refreshScore()
        console.log('late!')
    }
    else if (time<threesonance.noteTime[lane][0]*1000-eps && time>threesonance.noteTime[lane][0]*1000-2*eps) {
        threesonance.spotLight3.color.setHex(0xffff00)
        threesonance.spotLight3.intensity = 100
        threesonance.scene.remove(threesonance.notes[lane][0])
        threesonance.notes[lane].shift()
        threesonance.noteTime[lane].shift()
        if (streak > 0)
            score += (100*streak)
        else score += 100
        streak++
        threesonance.refreshScore()
        console.log('early!')
    }
}

threesonance.refreshScore = () => {
    jQuery('#score').html('Score: '+score+'<br>Streak: '+streak+'x')
}

threesonance.initNotes = () => {
    var arr = []
    var peaks = threesonance.peakData
    threesonance.noteTime = []
    for (var i =0;i<7;i++) {
        arr.push([])
        threesonance.noteTime.push([])
    }
    for (var i = 0;i<peaks.length;i++) {
        var noteMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.0,
            metalness: 0.5,
            reflectivity: 1.0,
            side: THREE.DoubleSide
        })
        var x = Math.floor(rng()*7)
        switch (x) {
            case 0:
                case 2:
                case 4:
                case 6:
                    noteMaterial.emissive.setHex(0x00ffff);
                    noteMaterial.color.setHex(0x00ffff);
                    break
                case 1:
                case 5:
                    noteMaterial.emissive.setHex(0xFFFF00);
                    noteMaterial.color.setHex(0xFFFF00);
                    break
                default:
                    noteMaterial.emissive.setHex(0xFF00FF);
                    noteMaterial.color.setHex(0xFF00FF);
                    break
        }
        var mesh = new THREE.Mesh(buttonGeometry, noteMaterial)
        mesh.position.set(-3+x, .2, 12.6+(peaks[i]+2)*camSpeed*1000)
        // console.log(mesh.position.z)
        arr[x].push(mesh)
        threesonance.noteTime[x].push(peaks[i])
    }
    threesonance.notes = arr
    for (let j = 0;j<7;j++) {    
        threesonance.scene.add(...threesonance.notes[j])
    }
    threesonance.renderer.render(threesonance.scene, threesonance.camera)
}

threesonance.anim = () => {
    requestAnimationFrame(threesonance.anim)
    threesonance.moveUI()
    // threesonance.resonance()
    threesonance.fade()
    threesonance.checkMiss()
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

    threesonance.spotLight1 = new THREE.SpotLight( 0xFF7F00 )
    threesonance.spotLight2 = new THREE.SpotLight( 0x7f00dc )
    threesonance.spotLight3 = new THREE.SpotLight( 0xFF0000 )

    threesonance.spotLight1.intensity = 10  
    threesonance.spotLight1.angle = 9

    threesonance.spotLight2.intensity = 100
    threesonance.spotLight2.angle = 9   

    threesonance.spotLight3.intensity = 0
    threesonance.spotLight3.angle = Math.PI

    threesonance.spotLight1.position.set( 0, .4, -1000 )
    threesonance.spotLight2.position.set( 0, 0, 100 )
    threesonance.spotLight3.position.set( 0, 2.25, 15 )

    threesonance.camera.add(threesonance.spotLight3)
    
    threesonance.renderer.setSize(width, height)
    threesonance.renderer.setPixelRatio(devicePixelRatio)
    document.body.appendChild(threesonance.renderer.domElement)
    threesonance.initWorld()
    threesonance.grids = threesonance.initGrid()
    threesonance.scene.add(...threesonance.grids)
    threesonance.button = threesonance.initButton()
    threesonance.scene.add(...threesonance.button)
    threesonance.scene.add(threesonance.spotLight1)
    threesonance.scene.add(threesonance.spotLight2)
    threesonance.scene.add(threesonance.spotLight3)
    threesonance.scene.add(threesonance.camera)
    threesonance.renderer.render(threesonance.scene, threesonance.camera)
}
//FILE LOAD


function musicLoad(){
    var AudioSourceNode = null;
    var PlaySourceNode = null;
    var audioCtx = new AudioContext()

    threesonance.init()

    jQuery('#__drop').on('drop', function(e){
        e.stopPropagation();
        e.preventDefault();
        var data = e.originalEvent.dataTransfer;
        var file = data.files[0];
        
        var file_name = file.name
        console.log(file_name);
        uploadFile(file,data)
    });

    jQuery(document).on('dragover', function(){
        return false;
    });

    function uploadFile(file,data) {
        var url = 'http://127.0.0.1:3000/generate'
        var xhr = new XMLHttpRequest()
        var formData = new FormData()
        xhr.open('POST', url, true)
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
      
        xhr.addEventListener('readystatechange', function(e) {
          if (xhr.readyState == 4 && xhr.status == 200) {
            threesonance.peakData = JSON.parse(xhr.responseText).beats
            rng = new Math.seedrandom(JSON.parse(xhr.responseText).hash) 
            console.log(JSON.parse(xhr.responseText).hash)
            jQuery.when(initAudio(file)).done(function(b){
                jQuery('#__drop').css('display', 'none')
                makeAudio(b);
            });
          }
          else if (xhr.readyState == 4 && xhr.status != 200) {
            console.log('Error!')
            console.log(xhr.responseText)
          }
        })
      
        formData.append('upload_preset', 'ujpu6gyk')
        formData.append('song', file)
        xhr.send(formData)
      }

    function generatePeaksArray(buffer, threshold, bufferstart){
        var result = []
    
        var length = buffer.length
        for(var i =0; i<length; i++){
            if(buffer[i] > threshold){
                result.push([i+bufferstart, (i+bufferstart)/sampleRate, buffer[i]]);
                // console.log(i)
                i+=3000;
            }
            i++;
        }
        return result;
    }

    function normalize(x){
        return x-(-1)/(1-(-1));
    }
    
    function median(values){
        if(values.length ===0) return 0;
        
        values.sort(function(a,b){
            return a-b;
        });
        
        var half = Math.floor(values.length / 2);
        
        if (values.length % 2)
            return values[half];
        
        return (values[half - 1] + values[half]) / 2.0;
        }

    function initAudio(data) {
        var audioRequest = new XMLHttpRequest();
        var dfd = jQuery.Deferred();

        audioRequest.open("GET", URL.createObjectURL(data), true);
        audioRequest.responseType = "arraybuffer";
        audioRequest.onload = function () {
            audioCtx.decodeAudioData(audioRequest.response,
                    function (buffer) {
                        dfd.resolve(buffer);
                    });
        }
        audioRequest.send();

        return dfd.promise();
    }

    var sampleRate;

    function makeAudio(buffer){
        var offAudioCtx = new OfflineAudioContext(1, buffer.length, buffer.sampleRate)
        sampleRate = buffer.sampleRate
        // AudioSourceNode = offAudioCtx.createBufferSource()
        // AudioSourceNode.buffer = buffer;
    
        PlaySourceNode = audioCtx.createBufferSource()
        PlaySourceNode.buffer = buffer;
        PlaySourceNode.connect(audioCtx.destination);
    
        // var lowfilter = offAudioCtx.createBiquadFilter()
        // lowfilter.type = "lowpass";
        // // filter.gain.value  = 20;
        // lowfilter.frequency.value = 150;
        // // filter.Q.value = 15;
    
        // var highfilter = offAudioCtx.createBiquadFilter()
        // highfilter.type = "highpass"
        // highfilter.frequency.value=1000
    
        // AudioSourceNode.connect(lowfilter)
        // lowfilter.connect(offAudioCtx.destination)
    
        // AudioSourceNode.start();
        // offAudioCtx.startRendering();
    
        // var result;
        // var peaks= [];
        // offAudioCtx.oncomplete = async function(e){
        //     result = e.renderedBuffer;
        //     // console.log(result.duration)
        //     // console.log(result);
        //     var buffArr = e.renderedBuffer.getChannelData(0);
        //     var avg = 0;
        //     // for(var i = 0; i<buffArr.length; i++){
        //     //     avg+=buffArr[i];
        //     // }
        //     // avg = avg/buffArr.length;
        //     var totalLength = buffArr.length
        //     var interval = 0.5
        //     var skip = result.sampleRate * interval
        //     var sortArr;
    
        //     for(var i = skip; i<totalLength-1; i+=skip){
        //         var split = buffArr.slice(i-skip,i-1)
        //         // console.log(skip)
    
        //         sortArr = [... split];
        //         var med = median(sortArr);
    
        //         // console.log(normalize(med));
        //         var temppeaks = generatePeaksArray(split,normalize(med)+0.01,i-skip)
        //         peaks = [].concat(peaks,temppeaks)
    
        //         // console.log(i +" / "+ totalLength)
        //         if(i+skip>=totalLength) skip=(totalLength-1)-i
        //     }
        async function start(){
            // console.log(peaks)
            threesonance.AudioNode = new AudioContext();
            threesonance.AudioNode = PlaySourceNode;
            // PlaySourceNode.start(0);
            threesonance.initNotes()
            current = new Date()
            threesonance.anim()
            await sleep(2000)
            songStart = new Date()
            threesonance.AudioNode.start(0)
        }
        start()
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

musicLoad()