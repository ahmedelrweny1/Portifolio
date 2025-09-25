;(function () {
	const canvas = document.getElementById('hero-canvas');
	if (!canvas || !window.THREE) return;

	const THREE = window.THREE;
	const renderer = new THREE.WebGLRenderer({
		canvas,
		antialias: true,
		alpha: true,
		powerPreference: 'high-performance'
	});
	renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
	renderer.outputColorSpace = THREE.SRGBColorSpace;
	renderer.toneMapping = THREE.ACESFilmicToneMapping;
	renderer.toneMappingExposure = 1.5;

	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(60, 2, 0.1, 1000);
	camera.position.set(0, 0, 18);

	function getAccent() {
		const styles = getComputedStyle(document.body);
		const a = styles.getPropertyValue('--accent').trim() || '#7c5cff';
		const b = styles.getPropertyValue('--accent-2').trim() || '#19d3da';
		return { a, b };
	}

	const isMobile = window.innerWidth < 820;
	let colors = getAccent();

	// Fluid noise waves (layered)
	const colA = new THREE.Color(colors.a);
	const colB = new THREE.Color(colors.b);

	function makeWave(width, height, segX, segY, amp, alpha, speed, yOffset){
		const geom = new THREE.PlaneGeometry(width, height, segX, segY);
		const mat = new THREE.ShaderMaterial({
			uniforms: {
				uTime: { value: 0 },
				uMouse: { value: new THREE.Vector2(0,0) },
				uAmp: { value: amp },
				uSpeed: { value: speed },
				uA: { value: new THREE.Color(colors.a) },
				uB: { value: new THREE.Color(colors.b) },
				uAlpha: { value: alpha }
			},
			vertexShader: `
				uniform float uTime; uniform float uAmp; uniform float uSpeed; uniform vec2 uMouse;
				varying vec2 vUv;
				// simple hash noise
				float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
				float noise(vec2 p){ vec2 i=floor(p); vec2 f=fract(p); float a=hash(i); float b=hash(i+vec2(1.,0.)); float c=hash(i+vec2(0.,1.)); float d=hash(i+vec2(1.,1.)); vec2 u=f*f*(3.-2.*f); return mix(a,b,u.x)+ (c-a)*u.y*(1.-u.x) + (d-b)*u.x*u.y; }
				void main(){
					vUv = uv;
					vec3 p = position;
					float n = 0.0;
					n += noise(uv*2.0 + uTime*0.15*uSpeed);
					n += 0.5*noise(uv*4.0 + uTime*0.22*uSpeed);
					n += 0.25*noise(uv*8.0 + uTime*0.35*uSpeed);
					p.z += (n-0.5) * uAmp;
					// slight mouse pull
					p.y += (uMouse.y)*0.6;
					gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
				}
			`,
			fragmentShader: `
				uniform vec3 uA; uniform vec3 uB; uniform float uAlpha; varying vec2 vUv;
				void main(){
					float g = smoothstep(0.0,1.0,vUv.x);
					vec3 c = mix(uA,uB,g);
					float mask = smoothstep(0.05,0.25,vUv.y) * (1.0 - smoothstep(0.75,0.98,vUv.y));
					gl_FragColor = vec4(c, uAlpha * mask);
				}
			`,
			transparent: true,
			depthWrite: false,
			blending: THREE.AdditiveBlending
		});
		const mesh = new THREE.Mesh(geom, mat);
		mesh.rotation.x = -0.45;
		mesh.position.z = -6;
		mesh.position.y = yOffset;
		return { mesh, mat };
	}

	const waveBack = makeWave(48, 18, 200, 60, 2.1, 0.22, 1.0, 0.6);
	const waveFront = makeWave(44, 16, 180, 50, 1.4, 0.28, 1.4, -0.2);
	scene.add(waveBack.mesh, waveFront.mesh);

	// Lights (soft)
	const ambient = new THREE.AmbientLight(0xffffff, 0.6);
	scene.add(ambient);
	const key = new THREE.PointLight(colA, 1.5);
	key.position.set(8, 6, 10);
	scene.add(key);
	const fill = new THREE.PointLight(colB, 1.2);
	fill.position.set(-8, -4, 8);
	scene.add(fill);
	const hemi = new THREE.HemisphereLight(0xbfd6ff, 0x0b0d10, 0.7);
	scene.add(hemi);

	// Robot removed

 

 

	// Eyes
 

 

	// Eyelids
 

	// Mouth EQ
 

	// Antenna
 

	// Halo glow
 

	// --- Body (torso, arms, legs) ---
 

	// Torso
 

	// Shoulders
 

	// Arms
 

	// Pelvis
 

	// Legs
 

	// Keep flexible background animation only

	// Input
	const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
	function setMouse(clientX, clientY){
		const rect = canvas.getBoundingClientRect();
		mouse.tx = ((clientX - rect.left) / rect.width) * 2 - 1;
		mouse.ty = -((clientY - rect.top) / rect.height) * 2 + 1;
	}
	window.addEventListener('mousemove', (e)=> setMouse(e.clientX, e.clientY), { passive: true });
	window.addEventListener('touchmove', (e)=>{ if(e.touches[0]) setMouse(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true });

	// Theme reactive
	const themeObserver = new MutationObserver(()=>{
		colors = getAccent();
		const ca = new THREE.Color(colors.a), cb = new THREE.Color(colors.b);
		key.color = ca; fill.color = cb;
		waveBack.mat.uniforms.uA.value = ca; waveBack.mat.uniforms.uB.value = cb;
		waveFront.mat.uniforms.uA.value = ca; waveFront.mat.uniforms.uB.value = cb;
	});
	themeObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });

	function handleResize(){
		const width = canvas.clientWidth;
		const height = canvas.clientHeight || window.innerHeight;
		if (canvas.width !== width || canvas.height !== height){
			renderer.setSize(width, height, false);
			camera.aspect = width / height;
			camera.updateProjectionMatrix();
		}
	}

	const clock = new THREE.Clock();
	let rotationBase = 0;

	function animate(){
		requestAnimationFrame(animate);
		handleResize();
		const t = clock.getElapsedTime();
		mouse.x += (mouse.tx - mouse.x) * 0.05;
		mouse.y += (mouse.ty - mouse.y) * 0.05;

		// Parallax camera (smoother)
		camera.position.x += (mouse.x * 2.2 - camera.position.x) * 0.06;
		camera.position.y += (0.8 + mouse.y * 1.4 - camera.position.y) * 0.06;
		camera.lookAt(0,0,0);

		// Waves flow
		waveBack.mat.uniforms.uTime.value = t;
		waveBack.mat.uniforms.uMouse.value.set(mouse.x, mouse.y);
		waveFront.mat.uniforms.uTime.value = t * 1.2;
		waveFront.mat.uniforms.uMouse.value.set(mouse.x, mouse.y);
		waveBack.mesh.rotation.z = Math.sin(t * 0.08) * 0.06;
		waveFront.mesh.rotation.z = Math.cos(t * 0.1) * 0.08;



		renderer.render(scene, camera);
	}

	animate();
})();