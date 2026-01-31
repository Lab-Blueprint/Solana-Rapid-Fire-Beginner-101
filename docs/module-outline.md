# Solana Rapid-Fire Beginner 101 - Module Plan

This plan defines the content structure for the 7 modules. Each module includes:
- Learning objective
- What to expect (sections + interactive element)
- Short checkpoint quiz (3-4 questions)

## Part 1

### Module 1: Blockchain as a Computer
**Learning objective**
- Understand blockchain as a distributed computer (decentralized cloud) and why it exists.

**What to expect**
- Analogy: blockchain as a decentralized super-computer / special-purpose cloud
- Client-server vs P2P networking (interactive toggle)
- "Everything everywhere all at once" mental model (broadcast + replication)
- Why this model is useful: trustless coordination and no single point of failure

**Interactive element**
- Client-server vs P2P network animation (toggle + play/pause)

**Checkpoint quiz (3)**
- Which architecture is centralized?
- Why does P2P reduce single points of failure?
- What makes blockchain more than a regular distributed database?

---

### Module 2: Identity & Authentication
**Learning objective**
- Understand how public/private keys replace logins and enable proof of identity without a central server.

**What to expect**
- Keypairs (private key signs, public key verifies)
- "Login vs Sign": wallet as identity
- Off-chain key generation + on-chain verification
- RPC nodes as gateways between clients and validators

**Interactive element**
- Signing flow animation: Create -> Sign -> Submit -> Process -> Confirm

**Checkpoint quiz (3)**
- What does a signature prove?
- Which key verifies a signature?
- Why is key generation off-chain?

---

### Module 3: Consensus (Input, Not Memory)
**Learning objective**
- Understand consensus as agreement on transaction order (inputs) rather than "memory" storage.

**What to expect**
- Consensus = ordering of transactions, not storing data
- Node roles: validators, RPC nodes, light nodes
- Centralization risk when few RPCs serve most users
- Ordering game: how nodes agree on transaction order

**Interactive element**
- Transaction ordering stepper (simulate ordering inputs)

**Checkpoint quiz (3)**
- What does consensus actually agree on?
- Why can relying on few RPCs be a problem?
- What is a light node?

---

## Part 2

### Module 4: Account = File
**Learning objective**
- Understand Solana's account model as "files" that store data and lamports.

**What to expect**
- Account fields: lamports, data, owner, executable
- Ownership rules: only owner can write; anyone can read
- Rent basics and rent-exempt accounts
- Why data is separated from programs

**Interactive element**
- Account model diagram (fields + ownership)

**Checkpoint quiz (3)**
- Who can modify account data?
- What does rent-exempt mean?
- Why separate code and data?

---

### Module 5: Program = Library
**Learning objective**
- Understand programs as shared, stateless libraries and how PDAs enable program-owned data.

**What to expect**
- Programs are shared code used by many users
- Stateless execution; state lives in accounts
- PDAs are deterministic, program-owned addresses
- Use cases: config, user data, escrow

**Interactive element**
- PDA derivation diagram (seeds + program ID -> address)

**Checkpoint quiz (3)**
- What does "stateless program" mean?
- Why are PDAs useful?
- Can a PDA be generated with a private key?

---

### Module 6: Environment Setup (Minimal)
**Learning objective**
- Install the minimum toolchain needed for Solana development.

**What to expect**
- Fast path: Solana Playground (no local install)
- Local minimal: Rust -> Solana CLI -> Anchor -> Node.js
- Verify commands + expected outputs
- Quick checklist for progress

**Interactive element**
- Checklist with localStorage persistence

**Checkpoint quiz (3)**
- Which tool compiles Solana programs?
- Which network is recommended for testing?
- What is Anchor used for?

---

### Module 7: Coding with Claude
**Learning objective**
- Use Claude to scaffold and test a simple Solana program.

**What to expect**
- Prompt structure (context, goal, constraints)
- "Wall of Wishes" data model (counter + wish PDAs)
- Example prompt + implementation outline
- Test workflow (build + test)

**Interactive element**
- PDA layout diagram for the project

**Checkpoint quiz (3)**
- What should a good prompt include?
- Which account tracks total wishes?
- Why test before deploying?
