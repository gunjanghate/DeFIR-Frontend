
# DeFIR – Anonymous Corruption Reporting Platform

> 💬 “Speak up. Stay safe.” – A secure and decentralized platform to report corruption anonymously and immutably.

WhistleChain empowers citizens to report corruption without fear, leveraging **blockchain**, **IPFS**, and **encryption** to ensure anonymity, data integrity, and transparency.

---

## 🚀 Features

- 🔐 **Anonymous Complaint Filing**  
  Report incidents without revealing identity. No login required.

- 🧾 **Blockchain-based Logging**  
  All complaints are stored immutably on-chain, ensuring no deletions or tampering.

- 📁 **Encrypted Evidence Uploads**  
  Upload supporting files (images/videos) securely using [IPFS](https://ipfs.tech/). Optionally encrypted using steganography.

- 📍 **Geo-Tagging & Metadata**  
  Automatically tags location, department, and issue type using AI & GPS.

- 📊 **Public Transparency Dashboard**  
  Displays live complaint stats by region, department, and status.

- 🧬 **ZKPs (optional)**  
  Integrate Zero-Knowledge Proofs to verify authenticity without compromising identity.

---

## 📦 Tech Stack

| Layer              | Tools / Frameworks                                |
|--------------------|----------------------------------------------------|
| 🧠 Frontend         | Next.js, Tailwind CSS, Framer Motion              |
| 🔗 Blockchain       | Solidity, Ethers.js, Hardhat                      |
| ☁️ File Storage     | IPFS, web3.storage                                |
| 🛡️ Security         | AES Encryption, Steganography (optional)          |
| 🧠 Intelligence     | AI for metadata tagging (planned)                 |
| 🌍 Maps             | Leaflet.js or Google Maps API (for geo-visuals)  |

---

## 🧪 How It Works

1. **User visits app** – No login or identity required.
2. **Fills complaint form** – Describes issue, optionally uploads evidence.
3. **Location auto-tagged** – Or entered manually.
4. **Uploads sent to IPFS** – Gets CID (content identifier).
5. **Complaint stored on blockchain** – CID + metadata stored immutably.
6. **Visible on dashboard** – For transparency & reform analysis.

---

## 💻 Setup Instructions

```bash
# 1. Clone the repo
git clone https://github.com/DhruvTambekar24/HackByte_SupaStrikas.git
cd HackByte_SupaStrikas

# 2. Install dependencies
npm install

# 3. Run the development server
npm run dev
```

> 🛠️ Make sure you configure your `.env.local` file with IPFS keys, RPC URL, and smart contract address.

---

## 📷 Screenshots

| Complaint Form | Dashboard | Blockchain Explorer |
|----------------|-----------|----------------------|
| ![](screenshots/form.png) | ![](screenshots/dashboard.png) | ![](screenshots/tx.png) |

---

## 🧩 Possible Use Cases

- Government anti-corruption bodies
- NGOs working on transparency & accountability
- Citizens & whistleblower collectives
- Journalistic investigations

---

## 💰 Monetization Ideas

- B2G SaaS for Gov depts to manage citizen complaints
- Freemium API for NGOs/activists to build on top
- Smart contract audit trail subscriptions
- Partnership model with civic tech orgs

---

## 🧠 Future Enhancements

- 🔎 ZK identity proofing
- 🧠 AI-based auto-tagging & severity classification
- 📈 Integration with government CRM systems
- 🌐 Multilingual complaint form (for accessibility)
- 🤖 Voice-to-text transcription & disguise

---


---

## 📜 License

MIT License. See [`LICENSE`](LICENSE) for details.

---

## 🙌 Acknowledgements

Special thanks to **HackByte** for the platform and inspiration to build something impactful.

```
