# Family VPN Setup — Iran Censorship Bypass

A complete, self-hosted VPN system for connecting family members in Iran.
Two layers of protection: **Outline** (easy daily use) + **Xray REALITY** (when Outline gets blocked).

---

## Architecture

```
  Family in Iran (iPhone/Android)
          │
          │  Outline app (.npvt key)  ←── Primary
          │  V2Box / v2rayNG          ←── Fallback
          │
          ▼
  Your VPS (GCP · kalabekala project)
  ├── Outline Server (Shadowsocks · port random)
  └── Xray VLESS+REALITY (masquerades as microsoft.com · port 443)
          │
          ▼
  Open Internet
```

---

## What's In This Folder

| File | What it does |
|------|-------------|
| `00-gcp-setup.sh` | **One-command GCP deploy** — creates VM + installs everything |
| `01-outline-server.sh` | Installs Outline VPN (easiest for family) |
| `02-xray-reality.sh` | Installs Xray VLESS+REALITY (hardest to block) |
| `03-xray-3xui-panel.sh` | Installs web GUI panel to manage Xray users |
| `04-rustdesk-server.sh` | Installs RustDesk self-hosted remote desktop relay |
| `client-guide-farsi.md` | Step-by-step guide in Farsi+English for parents |
| `client-guide-remote-farsi.md` | RustDesk remote desktop guide in Farsi+English |

---

## Step 1 — Deploy to GCP (One Command)

We use the **kalabekala** GCP project with an `e2-micro` VM in Frankfurt (lowest latency from Iran).

```bash
# Make sure gcloud is installed and authenticated:
gcloud auth login
gcloud config set project kalabekala

# Run the all-in-one setup:
bash vpn-setup/00-gcp-setup.sh
```

This creates the VM, reserves a static IP, installs Outline + Xray REALITY + RustDesk, and prints all keys.

**Cost:** ~$7/month for e2-micro (or free with GCP free tier credits). Static IP is free while VM runs.

---

## Step 2 — Deploy Outline (Do this first)

SSH into your VPS and run:

```bash
# Download and run
curl -O https://raw.githubusercontent.com/YOUR_REPO/vpn-setup/01-outline-server.sh
chmod +x 01-outline-server.sh
sudo bash 01-outline-server.sh
```

The script will:
- Install Docker
- Install Outline Server (official Jigsaw/Google)
- Output a JSON config block to paste into **Outline Manager** on your computer

Then:
1. Download **Outline Manager** on your computer: https://getoutline.org
2. Paste the JSON config → click **Connect**
3. Click **Add new key** for each family member
4. Share the `.npvt` link or QR code with them
5. They install the **Outline app** and tap your link — done

---

## Step 3 — Deploy Xray REALITY (Fallback when Outline is blocked)

```bash
curl -O https://raw.githubusercontent.com/YOUR_REPO/vpn-setup/02-xray-reality.sh
chmod +x 02-xray-reality.sh
sudo bash 02-xray-reality.sh
```

The script will:
- Ask you to type each family member's name
- Generate a unique `vless://` link per person
- Output all links to `/root/xray-client-keys.txt`

Send each person their `vless://...` link. They import it into:
- **iPhone:** V2Box (free, App Store)
- **Android:** v2rayNG (free, Play Store)

---

## Step 4 (Optional) — 3X-UI Web Panel

If you want a web GUI to manage users, view traffic, and generate QR codes:

```bash
sudo bash 03-xray-3xui-panel.sh
```

Access at: `http://YOUR_SERVER_IP:2053/panel`

---

## Step 5 — Send the Guide to Parents

Share `client-guide-farsi.md` with your parents.
It has step-by-step instructions in **Farsi and English** for both Outline and V2Box.

You can copy-paste it into WhatsApp, Telegram, or print it.

---

## Maintenance

```bash
# Check Outline is running
docker ps | grep shadowbox

# Check Xray is running
systemctl status xray

# View Xray logs (live)
journalctl -u xray -f

# Restart Xray
systemctl restart xray

# Renew Outline (auto-updates via Docker)
docker pull quay.io/outline/shadowbox && docker-compose up -d
```

---

## If Iran Blocks You

Iran's DPI (TSPU system) periodically blocks VPN protocols. Priority order:

1. **Outline (Shadowsocks)** — Try first, works most of the time
2. **Xray VLESS+REALITY** — Much harder to block; looks like Microsoft.com traffic
3. **Xray + Cloudflare CDN fronting** — If even REALITY gets blocked (rare)

If both get blocked, change the VPS server IP or provider — this is always an option.

---

## Privacy Notes

- Neither Outline nor Xray log user activity by default
- Your VPS provider can see that traffic goes to/from the server, but not content
- Use a VPS provider that accepts privacy-friendly payment (crypto) if needed
- Do not share your server's manager config JSON — only share the `.npvt` / `vless://` user keys
