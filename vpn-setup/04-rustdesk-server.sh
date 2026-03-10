#!/usr/bin/env bash
# =============================================================================
# RustDesk Self-Hosted Relay Server — Remote Desktop for Family
# Open-source TeamViewer alternative · Works through Iran VPN
# Lets you see & control your parents' screen from anywhere
# =============================================================================
set -euo pipefail

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
BLUE='\033[0;34m'; CYAN='\033[0;36m'; BOLD='\033[1m'; NC='\033[0m'

log()  { echo -e "${GREEN}[✓]${NC} $*"; }
warn() { echo -e "${YELLOW}[!]${NC} $*"; }
err()  { echo -e "${RED}[✗]${NC} $*"; exit 1; }
info() { echo -e "${CYAN}[→]${NC} $*"; }

[[ $EUID -ne 0 ]] && err "Run as root: sudo bash $0"

echo -e "${BLUE}"
cat << 'EOF'
  ╔══════════════════════════════════════════════════╗
  ║     RustDesk Self-Hosted Relay Server            ║
  ║   Remote desktop for parents · Works in Iran     ║
  ╚══════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

# ── Ports used by RustDesk ────────────────────────────────────────────────────
# hbbs (ID/rendezvous server): TCP 21115, 21116, 21118 · UDP 21116
# hbbr (relay server):         TCP 21117, 21119
RUSTDESK_DIR="/opt/rustdesk"
KEY_FILE="/root/rustdesk-info.txt"

# ── Step 1: System prep ───────────────────────────────────────────────────────
info "Updating system..."
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get install -y -qq curl wget ufw 2>/dev/null

# ── Step 2: Firewall ──────────────────────────────────────────────────────────
info "Opening RustDesk ports..."
ufw allow 21115/tcp comment "RustDesk hbbs TCP"
ufw allow 21116/tcp comment "RustDesk hbbs TCP"
ufw allow 21116/udp comment "RustDesk hbbs UDP"
ufw allow 21117/tcp comment "RustDesk hbbr relay"
ufw allow 21118/tcp comment "RustDesk hbbs WebSocket"
ufw allow 21119/tcp comment "RustDesk hbbr WebSocket"
ufw --force enable
log "Firewall updated"

# ── Step 3: Download RustDesk server binaries ─────────────────────────────────
info "Fetching latest RustDesk server release..."
mkdir -p "$RUSTDESK_DIR"
cd "$RUSTDESK_DIR"

# Get latest release version from GitHub API
LATEST=$(curl -s https://api.github.com/repos/rustdesk/rustdesk-server/releases/latest \
    | grep '"tag_name"' | head -1 | cut -d'"' -f4)

[[ -z "$LATEST" ]] && LATEST="1.1.11"   # fallback version
info "Downloading version $LATEST..."

BASE_URL="https://github.com/rustdesk/rustdesk-server/releases/download/$LATEST"

# Detect architecture
ARCH=$(uname -m)
case "$ARCH" in
    x86_64)  ARCH_SUFFIX="x86_64"   ;;
    aarch64) ARCH_SUFFIX="aarch64"  ;;
    armv7*)  ARCH_SUFFIX="armv7"    ;;
    *)       err "Unsupported architecture: $ARCH" ;;
esac

# Download the server package
TARBALL="rustdesk-server-linux-$ARCH_SUFFIX.zip"
wget -q "$BASE_URL/$TARBALL" -O rustdesk-server.zip || \
    wget -q "$BASE_URL/rustdesk-server-linux-$ARCH_SUFFIX.zip" -O rustdesk-server.zip

apt-get install -y -qq unzip 2>/dev/null
unzip -o rustdesk-server.zip -d "$RUSTDESK_DIR" 2>/dev/null || true

# Find hbbs and hbbr binaries wherever they extracted
HBBS=$(find "$RUSTDESK_DIR" -name "hbbs" -type f 2>/dev/null | head -1)
HBBR=$(find "$RUSTDESK_DIR" -name "hbbr" -type f 2>/dev/null | head -1)

[[ -z "$HBBS" ]] && err "Could not find hbbs binary after extraction"
[[ -z "$HBBR" ]] && err "Could not find hbbr binary after extraction"

chmod +x "$HBBS" "$HBBR"

# Symlink to /usr/local/bin for convenience
ln -sf "$HBBS" /usr/local/bin/hbbs
ln -sf "$HBBR" /usr/local/bin/hbbr

log "RustDesk server binaries installed (v$LATEST)"

# ── Step 4: Create systemd service — hbbs (ID server) ────────────────────────
info "Creating hbbs service (ID/rendezvous server)..."
cat > /etc/systemd/system/rustdesk-hbbs.service << EOF
[Unit]
Description=RustDesk hbbs — ID and rendezvous server
After=network.target

[Service]
Type=simple
WorkingDirectory=$RUSTDESK_DIR
ExecStart=$HBBS -r 0.0.0.0
Restart=on-failure
RestartSec=5
LimitNOFILE=65536

[Install]
WantedBy=multi-user.target
EOF

# ── Step 5: Create systemd service — hbbr (relay server) ─────────────────────
info "Creating hbbr service (relay server)..."
cat > /etc/systemd/system/rustdesk-hbbr.service << EOF
[Unit]
Description=RustDesk hbbr — relay server
After=network.target

[Service]
Type=simple
WorkingDirectory=$RUSTDESK_DIR
ExecStart=$HBBR
Restart=on-failure
RestartSec=5
LimitNOFILE=65536

[Install]
WantedBy=multi-user.target
EOF

# ── Step 6: Start services ────────────────────────────────────────────────────
info "Starting RustDesk services..."
systemctl daemon-reload
systemctl enable rustdesk-hbbs rustdesk-hbbr
systemctl start rustdesk-hbbs rustdesk-hbbr
sleep 3

# Verify both are running
hbbs_ok=false
hbbr_ok=false
systemctl is-active --quiet rustdesk-hbbs && hbbs_ok=true
systemctl is-active --quiet rustdesk-hbbr && hbbr_ok=true

$hbbs_ok && log "hbbs (ID server) is running" || warn "hbbs may not have started — check: journalctl -u rustdesk-hbbs -n 20"
$hbbr_ok && log "hbbr (relay server) is running" || warn "hbbr may not have started — check: journalctl -u rustdesk-hbbr -n 20"

# ── Step 7: Extract the public key ───────────────────────────────────────────
info "Waiting for key generation..."
sleep 5

# RustDesk generates id_ed25519 and id_ed25519.pub in the working directory
PUB_KEY=""
KEY_SEARCH_PATHS=(
    "$RUSTDESK_DIR/id_ed25519.pub"
    "/root/id_ed25519.pub"
    "$(pwd)/id_ed25519.pub"
)

for path in "${KEY_SEARCH_PATHS[@]}"; do
    if [[ -f "$path" ]]; then
        PUB_KEY=$(cat "$path" 2>/dev/null | tr -d '\n') || true
        [[ -n "$PUB_KEY" ]] && break
    fi
done

# Also try finding it anywhere under the rustdesk dir
if [[ -z "$PUB_KEY" ]]; then
    PUB_KEY=$(find "$RUSTDESK_DIR" /root -name "id_ed25519.pub" 2>/dev/null | head -1 | xargs cat 2>/dev/null | tr -d '\n') || true
fi

# ── Step 8: Get server IP ─────────────────────────────────────────────────────
SERVER_IP=$(curl -s --max-time 5 https://api.ipify.org || \
            curl -s --max-time 5 https://ifconfig.me || \
            hostname -I | awk '{print $1}')

# ── Step 9: Save all info ─────────────────────────────────────────────────────
cat > "$KEY_FILE" << EOF
════════════════════════════════════════════════════════════════
  RustDesk Self-Hosted Server — Configuration
  Generated: $(date)
════════════════════════════════════════════════════════════════

  Server IP:   $SERVER_IP
  Public Key:  ${PUB_KEY:-"Check $RUSTDESK_DIR/id_ed25519.pub after startup"}

════════════════════════════════════════════════════════════════
  CLIENT SETUP (enter these in RustDesk app settings)
════════════════════════════════════════════════════════════════

  ID Server:    $SERVER_IP
  Relay Server: $SERVER_IP
  API Server:   (leave blank)
  Key:          ${PUB_KEY:-"See $RUSTDESK_DIR/id_ed25519.pub"}

════════════════════════════════════════════════════════════════
  HOW TO CONFIGURE THE APP:
════════════════════════════════════════════════════════════════

  RustDesk app → ⋮ menu (top right) → Network → ID/Relay Server
  Enter the values above and save.

  Your parents need to:
  1. Install RustDesk on their device
  2. Enter the server settings above
  3. Tell you their 9-digit RustDesk ID
  4. You enter their ID + they accept the connection

════════════════════════════════════════════════════════════════
  MANAGEMENT COMMANDS
════════════════════════════════════════════════════════════════

  Status:   systemctl status rustdesk-hbbs rustdesk-hbbr
  Logs:     journalctl -u rustdesk-hbbs -f
  Restart:  systemctl restart rustdesk-hbbs rustdesk-hbbr
  Key file: $RUSTDESK_DIR/id_ed25519.pub

EOF
chmod 600 "$KEY_FILE"

# ── Final output ──────────────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  ✓ RustDesk Server is LIVE on $SERVER_IP${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${CYAN}Configure the RustDesk app with these settings:${NC}"
echo ""
echo -e "  ${BOLD}ID Server:${NC}    ${YELLOW}$SERVER_IP${NC}"
echo -e "  ${BOLD}Relay Server:${NC} ${YELLOW}$SERVER_IP${NC}"
echo -e "  ${BOLD}Key:${NC}          ${YELLOW}${PUB_KEY:-"Run: cat $RUSTDESK_DIR/id_ed25519.pub"}${NC}"
echo ""
echo -e "${CYAN}CLIENT APPS (free, no account needed):${NC}"
echo -e "  • Windows: https://rustdesk.com/download"
echo -e "  • macOS:   https://rustdesk.com/download"
echo -e "  • iPhone:  Search 'RustDesk' in App Store"
echo -e "  • Android: Search 'RustDesk' in Play Store"
echo ""
echo -e "${YELLOW}Full setup guide saved to: $KEY_FILE${NC}"
echo ""
echo -e "${CYAN}HOW IT WORKS:${NC}"
echo -e "  1. Parents install RustDesk + enter server settings"
echo -e "  2. They see a 9-digit ID on their screen"
echo -e "  3. You enter their ID in your RustDesk → Connect"
echo -e "  4. They tap 'Accept' → you see their screen"
echo ""
echo -e "${GREEN}Works through the VPN you already set up!${NC}"
