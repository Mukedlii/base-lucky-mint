# Base Lucky Lotto (Frame + Paid Mint)

What you get:
- **Base mainnet ERC-721 paid mint** (fixed price, fixed max supply)
- **On-chain SVG metadata** (no images/hosting needed)
- **Next.js site** that also renders as a **Farcaster Frame** (Frame button links to mint page)

## Parameters (already set)
- **Name/Symbol:** Base Lucky Lotto (BLL)
- **Max supply:** 3000
- **Price:** 0.00015 ETH
- **Payout receiver:** `0xa782922Ff9c54F4264FD049189eC66940f528Eb0`

---

## 1) Install
From repo root:

```bash
npm install
```

---

## 2) Deploy contract to Base mainnet

```bash
cd packages/contracts
copy .env.example .env
# edit .env and set DEPLOYER_PRIVATE_KEY
npm run build
npm run deploy
```

You’ll get a deployed address printed.

### Verify (optional)
You can verify with Hardhat verify later (not included in scripts yet) or just use Basescan “contract verification” UI.

---

## 3) Configure + deploy the Frame site to Vercel

### Local dev

```bash
cd packages/frame
copy .env.example .env.local
# set NEXT_PUBLIC_BASE_URL (http://localhost:3000) for local
# set NEXT_PUBLIC_WC_PROJECT_ID
# set NEXT_PUBLIC_CONTRACT_ADDRESS to the deployed contract
npm run dev
```

### Vercel
- Import `packages/frame` as a Vercel project
- Set these Environment Variables:
  - `NEXT_PUBLIC_BASE_URL` = your Vercel URL (no trailing slash)
  - `NEXT_PUBLIC_WC_PROJECT_ID` = WalletConnect Cloud project id
  - `NEXT_PUBLIC_CONTRACT_ADDRESS` = deployed contract address
  - `NEXT_PUBLIC_BASESCAN_URL` = `https://basescan.org/address/<contract>`

Deploy.

---

## 4) Use as a Farcaster Frame
- Post the **homepage URL** (your Vercel URL)
- It should unfurl as a Frame with a **Mint** button

---

## Notes / gotchas
- This Frame is the safe MVP: the Frame button is a **link** to the mint page (not an in-frame tx). It still monetizes cleanly.
- If you want, next iteration can be **true “tx frame”** (mint directly inside the frame).
