#!/usr/bin/env bash
# =============================================================================
# Xray VLESS + REALITY — Censorship-Resistant VPN Server
# State-of-the-art protocol · Designed to defeat Iran's DPI
# No domain or SSL cert required — steals TLS fingerprint from Microsoft.com
# =============================================================================
set -euo pipefail

# ── Colors ────────────────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
BLUE='\033[0;34m'; CYAN='\033[0;36m'; BOLD='\033[1m'; NC='\033[0m'

log()  { echo -e "${GREEN}[✓]${NC} $*"; }
warn() { echo -e "${YELLOW}[!]${NC} $*"; }
err()  { echo -e "${RED}[✗]${NC} $*"; exit 1; }
info() { echo -e "${CYAN}[→]${NC} $*"; }

# ── Root check ────────────────────────────────────────────────────────────────
[[ $EUID -ne 0 ]] && err "Run as root: sudo bash $0"

# ── Banner ────────────────────────────────────────────────────────────────────
echo -e "${BLUE}"
cat << 'EOF'
  ╔═══════════════════════════════════════════════╗
  ║     Xray VLESS + REALITY — Iran DPI Bypass    ║
  ║   Looks like Microsoft.com to any firewall    ║
  ╚═══════════════════════════════════════════════╝
EOF
echo -e "${NC}"

# ── Config defaults ───────────────────────────────────────────────────────────
XRAY_PORT=443
MASQUERADE_DOMAIN="www.microsoft.com"   # The site we impersonate
XRAY_CONFIG="/usr/local/etc/xray/config.json"
KEYS_OUTPUT="/root/xray-client-keys.txt"

# ── Collect family member names ───────────────────────────────────────────────
echo -e "${CYAN}Enter names for each family member (one per line).${NC}"
echo -e "${CYAN}Press ENTER on an empty line when done.${NC}"
echo -e "${YELLOW}Example: maman, baba, arash${NC}"
echo ""

FAMILY_MEMBERS=()
while true; do
    read -rp "  Name (or press ENTER to finish): " name
    [[ -z "$name" ]] && break
    FAMILY_MEMBERS+=("$name")
done

# Default if no names entered
[[ ${#FAMILY_MEMBERS[@]} -eq 0 ]] && FAMILY_MEMBERS=("maman" "baba" "user3")

log "Creating keys for: ${FAMILY_MEMBERS[*]}"

# ── Step 1: System prep ───────────────────────────────────────────────────────
info "Updating system..."
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get install -y -qq curl wget jq ufw unzip 2>/dev/null

# ── Step 2: Firewall ──────────────────────────────────────────────────────────
info "Configuring firewall..."
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow "$XRAY_PORT"/tcp comment "Xray VLESS+REALITY"
ufw allow "$XRAY_PORT"/udp
ufw --force enable
log "Firewall configured"

# ── Step 3: Install Xray ──────────────────────────────────────────────────────
info "Installing Xray-core..."
bash -c "$(curl -L https://github.com/XTLS/Xray-install/raw/main/install-release.sh)" @ install --without-geodata
log "Xray installed: $(xray version | head -1)"

# ── Step 4: Generate keys ─────────────────────────────────────────────────────
info "Generating REALITY key pair..."
KEY_OUTPUT=$(xray x25519)
PRIVATE_KEY=$(echo "$KEY_OUTPUT" | grep "Private key:" | awk '{print $3}')
PUBLIC_KEY=$(echo "$KEY_OUTPUT"  | grep "Public key:"  | awk '{print $3}')
log "Key pair generated"

# ── Step 5: Generate UUIDs for each family member ────────────────────────────
info "Generating UUIDs for family members..."
declare -A UUIDS
for member in "${FAMILY_MEMBERS[@]}"; do
    UUIDS["$member"]=$(xray uuid)
    log "  UUID for $member: ${UUIDS[$member]}"
done

# ── Step 6: Build client array for config ─────────────────────────────────────
CLIENT_ARRAY=""
for member in "${FAMILY_MEMBERS[@]}"; do
    CLIENT_ARRAY+=$(cat << EOF
        {
          "id": "${UUIDS[$member]}",
          "flow": "xtls-rprx-vision",
          "email": "$member@family"
        },
EOF
)
done
# Remove trailing comma from last entry
CLIENT_ARRAY="${CLIENT_ARRAY%,*}"

# ── Step 7: Write Xray server config ──────────────────────────────────────────
info "Writing Xray server config..."
mkdir -p "$(dirname "$XRAY_CONFIG")"

cat > "$XRAY_CONFIG" << EOF
{
  "log": {
    "loglevel": "warning",
    "access": "/var/log/xray/access.log",
    "error": "/var/log/xray/error.log"
  },
  "inbounds": [
    {
      "port": $XRAY_PORT,
      "protocol": "vless",
      "settings": {
        "clients": [
$CLIENT_ARRAY
        ],
        "decryption": "none"
      },
      "streamSettings": {
        "network": "tcp",
        "security": "reality",
        "realitySettings": {
          "show": false,
          "dest": "$MASQUERADE_DOMAIN:443",
          "serverNames": [
            "$MASQUERADE_DOMAIN",
            "microsoft.com"
          ],
          "privateKey": "$PRIVATE_KEY",
          "shortIds": [
            "",
            "0123456789abcdef"
          ]
        }
      },
      "sniffing": {
        "enabled": true,
        "destOverride": ["http", "tls", "quic"]
      }
    }
  ],
  "outbounds": [
    {
      "protocol": "freedom",
      "tag": "direct"
    },
    {
      "protocol": "blackhole",
      "tag": "block"
    }
  ],
  "routing": {
    "domainStrategy": "IPIfNonMatch",
    "rules": [
      {
        "type": "field",
        "ip": ["geoip:private"],
        "outboundTag": "block"
      }
    ]
  }
}
EOF
log "Config written to $XRAY_CONFIG"

# ── Step 8: Enable and start Xray ─────────────────────────────────────────────
info "Starting Xray service..."
mkdir -p /var/log/xray
systemctl enable xray
systemctl restart xray
sleep 2

if systemctl is-active --quiet xray; then
    log "Xray is running"
else
    err "Xray failed to start. Check: journalctl -u xray -n 50"
fi

# ── Step 9: Get server IP ─────────────────────────────────────────────────────
SERVER_IP=$(curl -s --max-time 5 https://api.ipify.org || \
            curl -s --max-time 5 https://ifconfig.me || \
            hostname -I | awk '{print $1}')

# ── Step 10: Generate client share links ──────────────────────────────────────
info "Generating client connection links..."

> "$KEYS_OUTPUT"
cat >> "$KEYS_OUTPUT" << EOF
════════════════════════════════════════════════════════════════
  Xray VLESS + REALITY — Client Connection Keys
  Server: $SERVER_IP:$XRAY_PORT
  Masquerade: $MASQUERADE_DOMAIN
  Generated: $(date)
════════════════════════════════════════════════════════════════

HOW TO USE:
  1. Copy the vless:// link for each person
  2. In the app, tap "+" → "Import from clipboard" or scan the QR
  3. Apps: v2rayNG (Android), V2Box (iPhone), v2rayN (Windows)

════════════════════════════════════════════════════════════════

EOF

for member in "${FAMILY_MEMBERS[@]}"; do
    UUID="${UUIDS[$member]}"
    # Build the VLESS share link
    LINK="vless://${UUID}@${SERVER_IP}:${XRAY_PORT}?type=tcp&security=reality&pbk=${PUBLIC_KEY}&fp=chrome&sni=${MASQUERADE_DOMAIN}&sid=0123456789abcdef&flow=xtls-rprx-vision#Family-${member}"

    cat >> "$KEYS_OUTPUT" << EOF
────────────────────────────────────────────────────────────────
  NAME: $member
────────────────────────────────────────────────────────────────
  UUID: $UUID

  CONNECTION LINK (copy this entire line):
  $LINK

EOF
done

cat >> "$KEYS_OUTPUT" << EOF
════════════════════════════════════════════════════════════════
  SERVER DETAILS (keep private — server admin only)
════════════════════════════════════════════════════════════════
  Public Key:  $PUBLIC_KEY
  Private Key: $PRIVATE_KEY (NEVER share this)
  Config:      $XRAY_CONFIG
  Logs:        journalctl -u xray -f
════════════════════════════════════════════════════════════════
EOF

# ── Final output ──────────────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  ✓ Xray VLESS+REALITY is LIVE on $SERVER_IP:$XRAY_PORT${NC}"
echo -e "${GREEN}  ✓ Masquerading as: $MASQUERADE_DOMAIN${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${YELLOW}All client keys saved to: $KEYS_OUTPUT${NC}"
echo ""
echo -e "${CYAN}QUICK SHARE — send each person their vless:// link:${NC}"
echo ""

for member in "${FAMILY_MEMBERS[@]}"; do
    UUID="${UUIDS[$member]}"
    LINK="vless://${UUID}@${SERVER_IP}:${XRAY_PORT}?type=tcp&security=reality&pbk=${PUBLIC_KEY}&fp=chrome&sni=${MASQUERADE_DOMAIN}&sid=0123456789abcdef&flow=xtls-rprx-vision#Family-${member}"
    echo -e "${BOLD}$member:${NC}"
    echo -e "  $LINK"
    echo ""
done

echo -e "${CYAN}CLIENT APPS:${NC}"
echo -e "  • Android: ${YELLOW}v2rayNG${NC} (Play Store)"
echo -e "  • iPhone:  ${YELLOW}V2Box${NC} (App Store, free) or ${YELLOW}Shadowrocket${NC} (\$2.99)"
echo -e "  • Windows: ${YELLOW}v2rayN${NC} (github.com/2dust/v2rayN)"
echo ""
echo -e "${RED}⚠ Iran DPI note: if port 443 gets blocked, run script 03-port-hop.sh${NC}"
echo ""
echo -e "${GREEN}Done!${NC}"
