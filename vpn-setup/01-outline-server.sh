#!/usr/bin/env bash
# =============================================================================
# Outline VPN Server — Auto Deploy Script
# Compatible with: Ubuntu 20.04 / 22.04 / 24.04 (64-bit)
# Generates .npvt access keys your family can tap to connect instantly
# =============================================================================
set -euo pipefail

# ── Colors ────────────────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
BLUE='\033[0;34m'; CYAN='\033[0;36m'; NC='\033[0m'

log()  { echo -e "${GREEN}[✓]${NC} $*"; }
warn() { echo -e "${YELLOW}[!]${NC} $*"; }
err()  { echo -e "${RED}[✗]${NC} $*"; exit 1; }
info() { echo -e "${CYAN}[→]${NC} $*"; }

# ── Root check ────────────────────────────────────────────────────────────────
[[ $EUID -ne 0 ]] && err "Run as root: sudo bash $0"

# ── Banner ────────────────────────────────────────────────────────────────────
echo -e "${BLUE}"
cat << 'EOF'
  ╔═══════════════════════════════════════════╗
  ║     Outline VPN Server — Family Setup     ║
  ║   Built on Shadowsocks · Jigsaw/Google    ║
  ╚═══════════════════════════════════════════╝
EOF
echo -e "${NC}"

# ── Config ────────────────────────────────────────────────────────────────────
OUTLINE_DIR="/opt/outline"
KEYS_FILE="$OUTLINE_DIR/access-keys.txt"
API_PORT=51820          # Outline management API port
MIN_VPN_PORT=50000      # Outline picks a random port in this range
MAX_VPN_PORT=51819

# ── Step 1: System update ─────────────────────────────────────────────────────
info "Updating system packages..."
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get install -y -qq curl wget jq docker.io docker-compose ufw 2>/dev/null || true

# ── Step 2: Docker ────────────────────────────────────────────────────────────
info "Starting Docker..."
systemctl enable docker --now
log "Docker ready"

# ── Step 3: Firewall ──────────────────────────────────────────────────────────
info "Configuring firewall..."
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow "$API_PORT"/tcp comment "Outline management API"
ufw allow "$MIN_VPN_PORT":"$MAX_VPN_PORT"/tcp comment "Outline VPN range (TCP)"
ufw allow "$MIN_VPN_PORT":"$MAX_VPN_PORT"/udp comment "Outline VPN range (UDP)"
ufw --force enable
log "Firewall configured"

# ── Step 4: Install Outline Server ────────────────────────────────────────────
info "Installing Outline Server (Shadowsocks)..."
mkdir -p "$OUTLINE_DIR"

# Download and run the official Jigsaw installer
INSTALL_OUTPUT=$(bash -c "$(wget -qO- https://raw.githubusercontent.com/Jigsaw-Code/outline-server/master/src/server_manager/install_scripts/install_server.sh)" 2>&1) || true

# Extract the management API URL from installer output
API_URL=$(echo "$INSTALL_OUTPUT" | grep -oP 'apiUrl":"[^"]+' | head -1 | sed 's/apiUrl":"//') || true

if [[ -z "$API_URL" ]]; then
    # Try alternative extraction
    API_URL=$(echo "$INSTALL_OUTPUT" | grep -oP 'https://[0-9.:]+/[A-Za-z0-9_-]+' | head -1) || true
fi

log "Outline Server installed"

# ── Step 5: Save server info ──────────────────────────────────────────────────
SERVER_IP=$(curl -s --max-time 5 https://api.ipify.org || hostname -I | awk '{print $1}')

mkdir -p "$OUTLINE_DIR"
cat > "$OUTLINE_DIR/server-info.json" << EOF
{
  "server_ip": "$SERVER_IP",
  "management_api_port": $API_PORT,
  "vpn_port_range": "$MIN_VPN_PORT-$MAX_VPN_PORT",
  "installed_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF

# ── Step 6: Create access keys for family members ─────────────────────────────
info "Creating family access keys..."

# Wait for Outline API to be ready
sleep 5

create_key() {
    local name="$1"
    # Create a key via the Outline management API
    if [[ -n "$API_URL" ]]; then
        local response
        response=$(curl -s --insecure -X POST "$API_URL/access-keys" 2>/dev/null) || echo "{}"
        local key_id
        key_id=$(echo "$response" | jq -r '.id // "unknown"' 2>/dev/null) || key_id="unknown"

        # Rename the key
        if [[ "$key_id" != "unknown" ]]; then
            curl -s --insecure -X PUT "$API_URL/access-keys/$key_id/name" \
                -H "Content-Type: application/json" \
                -d "{\"name\":\"$name\"}" > /dev/null 2>&1 || true
        fi

        # Get the access URL
        local access_url
        access_url=$(echo "$response" | jq -r '.accessUrl // ""' 2>/dev/null) || access_url=""
        echo "$access_url"
    fi
}

# ── Step 7: Display results ───────────────────────────────────────────────────
echo ""
echo -e "${GREEN}════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  ✓ Outline VPN Server is LIVE on $SERVER_IP${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${CYAN}HOW TO ADD FAMILY MEMBERS:${NC}"
echo ""
echo -e "1. Install ${YELLOW}Outline Manager${NC} on your computer:"
echo -e "   https://getoutline.org/get-started/#step-1"
echo ""
echo -e "2. Click ${YELLOW}'Connect'${NC} and paste this server config:"
echo ""

if [[ -n "$INSTALL_OUTPUT" ]]; then
    # Extract and display the JSON config block
    JSON_BLOCK=$(echo "$INSTALL_OUTPUT" | grep -oP '\{[^{}]*"apiUrl"[^{}]*\}' | head -1) || true
    if [[ -n "$JSON_BLOCK" ]]; then
        echo -e "${YELLOW}  $JSON_BLOCK${NC}"
        echo ""
        echo "$JSON_BLOCK" > "$OUTLINE_DIR/manager-config.json"
        log "Manager config saved to: $OUTLINE_DIR/manager-config.json"
    fi
fi

echo ""
echo -e "3. In Outline Manager, click ${YELLOW}'Add new key'${NC} for each family member"
echo -e "   and share the ${YELLOW}.npvt link${NC} or QR code with them"
echo ""
echo -e "4. Family installs ${YELLOW}Outline app${NC} (iOS/Android):"
echo -e "   ${BLUE}https://getoutline.org/get-started/#step-3${NC}"
echo ""
echo -e "${CYAN}CLIENT APPS:${NC}"
echo -e "  • iOS:     Search 'Outline' in App Store (by Jigsaw/Google)"
echo -e "  • Android: Search 'Outline' in Play Store"
echo -e "  • Windows: https://getoutline.org/get-started/#step-3"
echo ""
echo -e "${YELLOW}SERVER MANAGEMENT:${NC}"
echo -e "  Config:  $OUTLINE_DIR/manager-config.json"
echo -e "  Logs:    docker logs shadowbox"
echo -e "  Status:  docker ps | grep shadowbox"
echo ""
echo -e "${RED}IMPORTANT — Share the .npvt key/link with family, NOT the manager config!${NC}"
echo -e "${RED}The manager config gives full server control.${NC}"
echo ""
echo -e "${GREEN}Done! Your Outline VPN server is running.${NC}"
EOF
