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
	renderer.toneMappingExposure = 1.4;
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;

	const scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2(0x000000, 0.02);
	
	const camera = new THREE.PerspectiveCamera(60, 2, 0.1, 1000);
	camera.position.set(0, 0, 25);

	// Get theme colors
	function getAccent() {
		const styles = getComputedStyle(document.body);
		const a = styles.getPropertyValue('--accent').trim() || '#7c5cff';
		const b = styles.getPropertyValue('--accent-2').trim() || '#19d3da';
		return { a, b };
	}

	const isMobile = window.innerWidth < 820;
	const colors = getAccent();

	// Central Morphing Blob
	const blobGeometry = new THREE.IcosahedronGeometry(4, 4);
	const blobMaterial = new THREE.MeshPhysicalMaterial({
		color: new THREE.Color(colors.a),
		emissive: new THREE.Color(colors.b),
		emissiveIntensity: 0.2,
		metalness: 0.9,
		roughness: 0.1,
		clearcoat: 1.0,
		clearcoatRoughness: 0.0,
		reflectivity: 1,
		envMapIntensity: 1,
		side: THREE.DoubleSide,
		transparent: true,
		opacity: 0.9
	});

	const blob = new THREE.Mesh(blobGeometry, blobMaterial);
	blob.castShadow = true;
	blob.receiveShadow = true;
	scene.add(blob);

	// Morph the blob vertices
	const originalPositions = blob.geometry.attributes.position.array.slice();
	
	// Orbiting Particles with Trails
	const PARTICLE_COUNT = isMobile ? 500 : 1000;
	const particleGeometry = new THREE.BufferGeometry();
	const particlePositions = new Float32Array(PARTICLE_COUNT * 3);
	const particleColors = new Float32Array(PARTICLE_COUNT * 3);
	const particleSizes = new Float32Array(PARTICLE_COUNT);
	const particlePhases = new Float32Array(PARTICLE_COUNT);
	const particleRadii = new Float32Array(PARTICLE_COUNT);
	const particleSpeeds = new Float32Array(PARTICLE_COUNT);

	for (let i = 0; i < PARTICLE_COUNT; i++) {
		// Create particles in spherical distribution
		const radius = 8 + Math.random() * 15;
		const theta = Math.random() * Math.PI * 2;
		const phi = Math.acos(2 * Math.random() - 1);
		
		particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
		particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
		particlePositions[i * 3 + 2] = radius * Math.cos(phi);
		
		// Random colors between accent colors
		const color = new THREE.Color().lerpColors(
			new THREE.Color(colors.a),
			new THREE.Color(colors.b),
			Math.random()
		);
		particleColors[i * 3] = color.r;
		particleColors[i * 3 + 1] = color.g;
		particleColors[i * 3 + 2] = color.b;
		
		particleSizes[i] = Math.random() * 3 + 1;
		particlePhases[i] = Math.random() * Math.PI * 2;
		particleRadii[i] = radius;
		particleSpeeds[i] = Math.random() * 0.5 + 0.5;
	}

	particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
	particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
	particleGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));

	const particleMaterial = new THREE.ShaderMaterial({
		uniforms: {
			uTime: { value: 0 },
			uPixelRatio: { value: renderer.getPixelRatio() }
		},
		vertexShader: `
			attribute float size;
			attribute vec3 color;
			varying vec3 vColor;
			uniform float uTime;
			
			void main() {
				vColor = color;
				vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
				float pulse = sin(uTime * 2.0 + position.x * 0.1) * 0.5 + 1.0;
				gl_PointSize = size * pulse * (300.0 / -mvPosition.z);
				gl_Position = projectionMatrix * mvPosition;
			}
		`,
		fragmentShader: `
			varying vec3 vColor;
			uniform float uTime;
			
			void main() {
				vec2 center = gl_PointCoord - 0.5;
				float dist = length(center);
				float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
				
				// Add sparkle effect
				float sparkle = sin(uTime * 10.0 + vColor.r * 100.0) * 0.5 + 0.5;
				vec3 finalColor = vColor * (1.0 + sparkle * 0.5);
				
				gl_FragColor = vec4(finalColor, alpha * 0.8);
			}
		`,
		blending: THREE.AdditiveBlending,
		depthTest: false,
		transparent: true,
		vertexColors: true
	});

	const particles = new THREE.Points(particleGeometry, particleMaterial);
	scene.add(particles);

	// Nebula Clouds
	const nebulaCount = isMobile ? 3 : 5;
	const nebulaClouds = [];
	
	for (let i = 0; i < nebulaCount; i++) {
		const cloudGeometry = new THREE.IcosahedronGeometry(15, 2);
		const cloudMaterial = new THREE.ShaderMaterial({
			uniforms: {
				uTime: { value: 0 },
				uColor1: { value: new THREE.Color(colors.a) },
				uColor2: { value: new THREE.Color(colors.b) },
				uOpacity: { value: 0.15 }
			},
			vertexShader: `
				varying vec3 vPosition;
				varying vec3 vNormal;
				
				void main() {
					vPosition = position;
					vNormal = normal;
					gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
				}
			`,
			fragmentShader: `
				uniform float uTime;
				uniform vec3 uColor1;
				uniform vec3 uColor2;
				uniform float uOpacity;
				varying vec3 vPosition;
				varying vec3 vNormal;
				
				void main() {
					float noise = sin(vPosition.x * 0.5 + uTime) * 
								  cos(vPosition.y * 0.5 + uTime * 0.8) * 
								  sin(vPosition.z * 0.5 + uTime * 1.2);
					
					vec3 color = mix(uColor1, uColor2, noise * 0.5 + 0.5);
					float alpha = uOpacity * (1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))));
					
					gl_FragColor = vec4(color, alpha);
				}
			`,
			transparent: true,
			side: THREE.DoubleSide,
			depthWrite: false,
			blending: THREE.AdditiveBlending
		});
		
		const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
		cloud.position.set(
			(Math.random() - 0.5) * 30,
			(Math.random() - 0.5) * 30,
			(Math.random() - 0.5) * 10 - 10
		);
		cloud.rotation.set(
			Math.random() * Math.PI,
			Math.random() * Math.PI,
			Math.random() * Math.PI
		);
		cloud.scale.setScalar(Math.random() * 0.5 + 0.5);
		
		nebulaClouds.push({
			mesh: cloud,
			rotationSpeed: new THREE.Vector3(
				(Math.random() - 0.5) * 0.001,
				(Math.random() - 0.5) * 0.001,
				(Math.random() - 0.5) * 0.001
			)
		});
		
		scene.add(cloud);
	}

	// Glowing Energy Orbs
	const orbCount = isMobile ? 8 : 15;
	const orbs = [];
	
	for (let i = 0; i < orbCount; i++) {
		const orbGroup = new THREE.Group();
		
		// Core orb
		const coreGeometry = new THREE.SphereGeometry(0.5, 32, 32);
		const coreMaterial = new THREE.MeshPhysicalMaterial({
			color: new THREE.Color().lerpColors(
				new THREE.Color(colors.a),
				new THREE.Color(colors.b),
				Math.random()
			),
			emissive: new THREE.Color().lerpColors(
				new THREE.Color(colors.a),
				new THREE.Color(colors.b),
				Math.random()
			),
			emissiveIntensity: 2,
			metalness: 0.5,
			roughness: 0,
			clearcoat: 1,
			transparent: true,
			opacity: 0.9
		});
		const core = new THREE.Mesh(coreGeometry, coreMaterial);
		orbGroup.add(core);
		
		// Glow effect
		const glowGeometry = new THREE.SphereGeometry(1, 16, 16);
		const glowMaterial = new THREE.ShaderMaterial({
			uniforms: {
				uTime: { value: 0 },
				uColor: { value: coreMaterial.color }
			},
			vertexShader: `
				varying vec3 vNormal;
				void main() {
					vNormal = normalize(normalMatrix * normal);
					gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
				}
			`,
			fragmentShader: `
				uniform vec3 uColor;
				uniform float uTime;
				varying vec3 vNormal;
				
				void main() {
					float intensity = pow(0.8 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
					float pulse = sin(uTime * 3.0) * 0.2 + 0.8;
					gl_FragColor = vec4(uColor, intensity * pulse);
				}
			`,
			side: THREE.BackSide,
			blending: THREE.AdditiveBlending,
			transparent: true
		});
		const glow = new THREE.Mesh(glowGeometry, glowMaterial);
		orbGroup.add(glow);
		
		// Position orb
		const angle = (i / orbCount) * Math.PI * 2;
		const radius = 12 + Math.random() * 8;
		orbGroup.position.set(
			Math.cos(angle) * radius,
			(Math.random() - 0.5) * 10,
			Math.sin(angle) * radius
		);
		
		orbs.push({
			group: orbGroup,
			angle: angle,
			radius: radius,
			speed: Math.random() * 0.5 + 0.5,
			yOffset: orbGroup.position.y,
			glowMaterial: glowMaterial
		});
		
		scene.add(orbGroup);
	}

	// Particle Trails
	const trailCount = isMobile ? 3 : 5;
	const trails = [];
	
	for (let i = 0; i < trailCount; i++) {
		const trailCurve = new THREE.CatmullRomCurve3([
			new THREE.Vector3(-20, 0, 0),
			new THREE.Vector3(-10, 10, 5),
			new THREE.Vector3(0, 0, 0),
			new THREE.Vector3(10, -10, -5),
			new THREE.Vector3(20, 0, 0)
		], true);
		
		const trailPoints = trailCurve.getPoints(100);
		const trailGeometry = new THREE.BufferGeometry().setFromPoints(trailPoints);
		
		const trailMaterial = new THREE.ShaderMaterial({
			uniforms: {
				uTime: { value: 0 },
				uColor: { value: new THREE.Color(Math.random() > 0.5 ? colors.a : colors.b) }
			},
			vertexShader: `
				uniform float uTime;
				varying float vAlpha;
				
				void main() {
					vec3 pos = position;
					float offset = uTime * 10.0;
					pos.x += sin(offset + position.y * 0.1) * 2.0;
					pos.z += cos(offset + position.y * 0.1) * 2.0;
					
					vAlpha = sin((position.x + position.y + offset) * 0.1) * 0.5 + 0.5;
					
					gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
					gl_PointSize = 4.0;
				}
			`,
			fragmentShader: `
				uniform vec3 uColor;
				varying float vAlpha;
				
				void main() {
					vec2 center = gl_PointCoord - 0.5;
					float dist = length(center);
					float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
					
					gl_FragColor = vec4(uColor, alpha * vAlpha * 0.6);
				}
			`,
			transparent: true,
			blending: THREE.AdditiveBlending
		});
		
		const trail = new THREE.Points(trailGeometry, trailMaterial);
		trail.rotation.set(
			Math.random() * Math.PI,
			Math.random() * Math.PI,
			Math.random() * Math.PI
		);
		
		trails.push({
			mesh: trail,
			material: trailMaterial,
			rotationSpeed: new THREE.Vector3(
				(Math.random() - 0.5) * 0.002,
				(Math.random() - 0.5) * 0.002,
				(Math.random() - 0.5) * 0.002
			)
		});
		
		scene.add(trail);
	}

	// Lights
	const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
	scene.add(ambientLight);

	const spotLight1 = new THREE.SpotLight(colors.a, 2);
	spotLight1.position.set(10, 10, 10);
	spotLight1.castShadow = true;
	scene.add(spotLight1);

	const spotLight2 = new THREE.SpotLight(colors.b, 2);
	spotLight2.position.set(-10, -10, 10);
	spotLight2.castShadow = true;
	scene.add(spotLight2);

	const pointLight = new THREE.PointLight(0xffffff, 1);
	pointLight.position.set(0, 0, 5);
	scene.add(pointLight);

	// Mouse tracking
	const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
	window.addEventListener('mousemove', (e) => {
		const rect = canvas.getBoundingClientRect();
		mouse.targetX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
		mouse.targetY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
	}, { passive: true });

	// Touch support
	window.addEventListener('touchmove', (e) => {
		if (e.touches.length > 0) {
			const rect = canvas.getBoundingClientRect();
			mouse.targetX = ((e.touches[0].clientX - rect.left) / rect.width) * 2 - 1;
			mouse.targetY = -((e.touches[0].clientY - rect.top) / rect.height) * 2 + 1;
		}
	}, { passive: true });

	// Theme change observer
	function onThemeChange() {
		const newColors = getAccent();
		blobMaterial.color = new THREE.Color(newColors.a);
		blobMaterial.emissive = new THREE.Color(newColors.b);
		spotLight1.color = new THREE.Color(newColors.a);
		spotLight2.color = new THREE.Color(newColors.b);
		
		// Update nebula colors
		nebulaClouds.forEach(cloud => {
			cloud.mesh.material.uniforms.uColor1.value = new THREE.Color(newColors.a);
			cloud.mesh.material.uniforms.uColor2.value = new THREE.Color(newColors.b);
		});
	}
	
	const themeObserver = new MutationObserver(onThemeChange);
	themeObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });

	// Resize handler
	function handleResize() {
		const width = canvas.clientWidth;
		const height = canvas.clientHeight || window.innerHeight;
		if (canvas.width !== width || canvas.height !== height) {
			renderer.setSize(width, height, false);
			camera.aspect = width / height;
			camera.updateProjectionMatrix();
		}
	}

	// Animation loop
	const clock = new THREE.Clock();

	function animate() {
		requestAnimationFrame(animate);
		handleResize();

		const time = clock.getElapsedTime();
		const delta = clock.getDelta();

		// Smooth mouse movement
		mouse.x += (mouse.targetX - mouse.x) * 0.05;
		mouse.y += (mouse.targetY - mouse.y) * 0.05;

		// Morph the blob
		const positions = blob.geometry.attributes.position.array;
		for (let i = 0; i < positions.length; i += 3) {
			const originalX = originalPositions[i];
			const originalY = originalPositions[i + 1];
			const originalZ = originalPositions[i + 2];
			
			const waveX = Math.sin(time * 2 + originalY * 0.5) * 0.3;
			const waveY = Math.cos(time * 1.5 + originalX * 0.5) * 0.3;
			const waveZ = Math.sin(time * 1.8 + originalZ * 0.5) * 0.3;
			
			positions[i] = originalX + waveX;
			positions[i + 1] = originalY + waveY;
			positions[i + 2] = originalZ + waveZ;
		}
		blob.geometry.attributes.position.needsUpdate = true;
		blob.geometry.computeVertexNormals();
		
		// Rotate and scale blob
		blob.rotation.x += 0.005;
		blob.rotation.y += 0.007;
		const blobScale = 1 + Math.sin(time * 2) * 0.1;
		blob.scale.setScalar(blobScale);

		// Update particles
		particleMaterial.uniforms.uTime.value = time;
		particles.rotation.y += 0.001;
		particles.rotation.x = mouse.y * 0.2;
		
		// Animate particle positions
		const particlePos = particles.geometry.attributes.position.array;
		for (let i = 0; i < PARTICLE_COUNT; i++) {
			const phase = particlePhases[i];
			const radius = particleRadii[i];
			const speed = particleSpeeds[i];
			
			const angle = time * speed + phase;
			const x = radius * Math.cos(angle);
			const y = particlePos[i * 3 + 1] + Math.sin(time * 2 + phase) * 0.05;
			const z = radius * Math.sin(angle);
			
			particlePos[i * 3] = x;
			particlePos[i * 3 + 1] = y;
			particlePos[i * 3 + 2] = z;
		}
		particles.geometry.attributes.position.needsUpdate = true;

		// Update nebula clouds
		nebulaClouds.forEach(cloud => {
			cloud.mesh.rotation.x += cloud.rotationSpeed.x;
			cloud.mesh.rotation.y += cloud.rotationSpeed.y;
			cloud.mesh.rotation.z += cloud.rotationSpeed.z;
			cloud.mesh.material.uniforms.uTime.value = time;
		});

		// Update orbs
		orbs.forEach(orb => {
			orb.angle += orb.speed * 0.01;
			orb.group.position.x = Math.cos(orb.angle) * orb.radius;
			orb.group.position.z = Math.sin(orb.angle) * orb.radius;
			orb.group.position.y = orb.yOffset + Math.sin(time * orb.speed) * 2;
			orb.group.rotation.y += 0.02;
			orb.glowMaterial.uniforms.uTime.value = time;
		});

		// Update trails
		trails.forEach(trail => {
			trail.mesh.rotation.x += trail.rotationSpeed.x;
			trail.mesh.rotation.y += trail.rotationSpeed.y;
			trail.mesh.rotation.z += trail.rotationSpeed.z;
			trail.material.uniforms.uTime.value = time;
		});

		// Animate lights
		spotLight1.position.x = Math.sin(time * 0.5) * 15;
		spotLight1.position.z = Math.cos(time * 0.5) * 15;
		spotLight2.position.x = Math.cos(time * 0.6) * 15;
		spotLight2.position.z = Math.sin(time * 0.6) * 15;

		// Camera movement
		camera.position.x = mouse.x * 8;
		camera.position.y = mouse.y * 5;
		camera.position.z = 25 + Math.sin(time * 0.5) * 5;
		camera.lookAt(0, 0, 0);

		renderer.render(scene, camera);
	}

	animate();
})();