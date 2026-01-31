/**
 * Blockchain Network Animation
 * Visualizes the difference between client-server and P2P networks
 */

const networkAnimation = {
    container: null,
    svg: null,
    tl: null,
    mode: 'client-server', // 'client-server' or 'p2p'

    init(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.createSVG();
        this.buildClientServerAnimation();
    },

    createSVG() {
        this.container.innerHTML = `
            <svg id="network-svg" width="100%" height="100%" viewBox="0 0 600 300">
                <defs>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                    <linearGradient id="nodeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#09637E;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#088395;stop-opacity:1" />
                    </linearGradient>
                </defs>
                <g id="connections"></g>
                <g id="nodes"></g>
                <g id="packets"></g>
                <text id="mode-label" x="300" y="30" text-anchor="middle" fill="#888" font-size="14"></text>
            </svg>
        `;
        this.svg = document.getElementById('network-svg');
    },

    buildClientServerAnimation() {
        this.mode = 'client-server';
        const connectionsG = document.getElementById('connections');
        const nodesG = document.getElementById('nodes');
        const packetsG = document.getElementById('packets');
        const modeLabel = document.getElementById('mode-label');

        // Clear previous
        connectionsG.innerHTML = '';
        nodesG.innerHTML = '';
        packetsG.innerHTML = '';
        modeLabel.textContent = 'Client-Server Architecture';

        // Server node (center)
        const serverX = 300, serverY = 150;

        // Client positions (around the server)
        const clients = [
            { x: 100, y: 80 },
            { x: 100, y: 220 },
            { x: 500, y: 80 },
            { x: 500, y: 220 },
            { x: 300, y: 270 }
        ];

        // Draw connections
        clients.forEach((client, i) => {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', client.x);
            line.setAttribute('y1', client.y);
            line.setAttribute('x2', serverX);
            line.setAttribute('y2', serverY);
            line.setAttribute('class', 'connection');
            line.setAttribute('stroke', 'rgba(153, 69, 255, 0.3)');
            line.setAttribute('stroke-width', '2');
            line.id = `conn-${i}`;
            connectionsG.appendChild(line);
        });

        // Draw server
        const server = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        server.innerHTML = `
            <rect x="${serverX - 30}" y="${serverY - 30}" width="60" height="60" rx="8" fill="url(#nodeGradient)" filter="url(#glow)"/>
            <text x="${serverX}" y="${serverY + 5}" text-anchor="middle" fill="white" font-size="12" font-weight="bold">SERVER</text>
        `;
        server.id = 'server-node';
        nodesG.appendChild(server);

        // Draw clients
        clients.forEach((client, i) => {
            const node = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            node.innerHTML = `
                <circle cx="${client.x}" cy="${client.y}" r="25" fill="#1a1a2e" stroke="#09637E" stroke-width="2"/>
                <text x="${client.x}" y="${client.y + 4}" text-anchor="middle" fill="#09637E" font-size="10">Client ${i + 1}</text>
            `;
            node.id = `client-${i}`;
            nodesG.appendChild(node);
        });

        // Create data packet
        const packet = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        packet.setAttribute('r', '8');
        packet.setAttribute('fill', '#088395');
        packet.setAttribute('filter', 'url(#glow)');
        packet.setAttribute('opacity', '0');
        packet.id = 'data-packet';
        packetsG.appendChild(packet);

        // Build animation
        if (this.tl) this.tl.kill();
        this.tl = gsap.timeline({ paused: true, repeat: -1 });

        // Animate data from client 0 to server and back
        clients.forEach((client, i) => {
            const delay = i * 0.8;
            this.tl
                .set('#data-packet', { attr: { cx: client.x, cy: client.y }, opacity: 1 }, delay)
                .to('#data-packet', {
                    duration: 0.4,
                    attr: { cx: serverX, cy: serverY },
                    ease: 'power2.inOut'
                }, delay)
                .to(`#conn-${i}`, {
                    duration: 0.2,
                    stroke: '#088395',
                    strokeWidth: 3
                }, delay)
                .to(`#conn-${i}`, {
                    duration: 0.2,
                    stroke: 'rgba(153, 69, 255, 0.3)',
                    strokeWidth: 2
                }, delay + 0.4)
                .to('#data-packet', {
                    duration: 0.4,
                    attr: { cx: client.x, cy: client.y },
                    ease: 'power2.inOut'
                }, delay + 0.4)
                .set('#data-packet', { opacity: 0 }, delay + 0.8);
        });
    },

    buildP2PAnimation() {
        this.mode = 'p2p';
        const connectionsG = document.getElementById('connections');
        const nodesG = document.getElementById('nodes');
        const packetsG = document.getElementById('packets');
        const modeLabel = document.getElementById('mode-label');

        // Clear previous
        connectionsG.innerHTML = '';
        nodesG.innerHTML = '';
        packetsG.innerHTML = '';
        modeLabel.textContent = 'Peer-to-Peer Network (Blockchain)';

        // Node positions in a circle
        const nodes = [];
        const centerX = 300, centerY = 150, radius = 120;
        const nodeCount = 6;

        for (let i = 0; i < nodeCount; i++) {
            const angle = (i / nodeCount) * Math.PI * 2 - Math.PI / 2;
            nodes.push({
                x: centerX + Math.cos(angle) * radius,
                y: centerY + Math.sin(angle) * radius
            });
        }

        // Draw all connections (mesh network)
        let connId = 0;
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', nodes[i].x);
                line.setAttribute('y1', nodes[i].y);
                line.setAttribute('x2', nodes[j].x);
                line.setAttribute('y2', nodes[j].y);
                line.setAttribute('stroke', 'rgba(153, 69, 255, 0.2)');
                line.setAttribute('stroke-width', '1');
                line.id = `p2p-conn-${connId++}`;
                connectionsG.appendChild(line);
            }
        }

        // Draw nodes
        nodes.forEach((node, i) => {
            const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            g.innerHTML = `
                <circle cx="${node.x}" cy="${node.y}" r="25" fill="#1a1a2e" stroke="url(#nodeGradient)" stroke-width="2"/>
                <text x="${node.x}" y="${node.y + 4}" text-anchor="middle" fill="#088395" font-size="10">Node ${i + 1}</text>
            `;
            g.id = `p2p-node-${i}`;
            nodesG.appendChild(g);
        });

        // Create multiple data packets
        for (let i = 0; i < 3; i++) {
            const packet = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            packet.setAttribute('r', '6');
            packet.setAttribute('fill', '#088395');
            packet.setAttribute('filter', 'url(#glow)');
            packet.setAttribute('opacity', '0');
            packet.id = `p2p-packet-${i}`;
            packetsG.appendChild(packet);
        }

        // Build animation
        if (this.tl) this.tl.kill();
        this.tl = gsap.timeline({ paused: true, repeat: -1 });

        // Animate packets flowing between random nodes
        const paths = [
            [0, 1, 3, 5],
            [2, 4, 5, 0],
            [1, 4, 2, 3]
        ];

        paths.forEach((path, pIdx) => {
            const delay = pIdx * 1.5;
            path.forEach((nodeIdx, step) => {
                if (step === path.length - 1) return;
                const fromNode = nodes[path[step]];
                const toNode = nodes[path[step + 1]];
                const stepDelay = delay + step * 0.5;

                this.tl
                    .set(`#p2p-packet-${pIdx}`, {
                        attr: { cx: fromNode.x, cy: fromNode.y },
                        opacity: 1
                    }, stepDelay)
                    .to(`#p2p-packet-${pIdx}`, {
                        duration: 0.4,
                        attr: { cx: toNode.x, cy: toNode.y },
                        ease: 'power2.inOut'
                    }, stepDelay);
            });
            this.tl.set(`#p2p-packet-${pIdx}`, { opacity: 0 }, delay + (path.length - 1) * 0.5 + 0.4);
        });
    },

    play() {
        if (this.tl) this.tl.play();
    },

    pause() {
        if (this.tl) this.tl.pause();
    },

    reset() {
        if (this.tl) this.tl.restart().pause();
    },

    toggle() {
        const btn = document.getElementById('toggle-btn');
        if (this.mode === 'client-server') {
            this.buildP2PAnimation();
            if (btn) btn.textContent = 'Switch to Client-Server';
        } else {
            this.buildClientServerAnimation();
            if (btn) btn.textContent = 'Switch to P2P';
        }
        this.play();
    }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('network-animation')) {
        networkAnimation.init('network-animation');
    }
});

// Export
window.networkAnimation = networkAnimation;
