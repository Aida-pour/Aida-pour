#!/usr/bin/env bash
# =============================================================================
# 3X-UI Web Panel — Xray Management Dashboard
# Gives you a GUI to manage keys, monitor traffic, add/remove users
# Access at: https://YOUR_SERVER_IP:2053/panel
# =============================================================================
set -euo pipefail

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
BLUE='\033[0;34m'; CYAN='\033[0;36m'; NC='\033[0m'

log()  { echo -e "${GREEN}[✓]${NC} $*"; }
warn() { echo -e "${YELLOW}[!]${NC} $*"; }
err()  { echo -e "${RED}[✗]${NC} $*"; exit 1; }
info() { echo -e "${CYAN}[→]${NC} $*"; }

[[ $EUID -ne 0 ]] && err "Run as root: sudo bash $0"

echo -e "${BLUE}"
cat << 'EOF'
  ╔═══════════════════════════════════════════════╗
  ║     3X-UI Web Panel — Xray Dashboard          ║
  ║   GUI for managing keys, traffic, users       ║
  ╚═══════════════════════════════════════════════╝
EOF
echo -e "${NC}"

# ── Panel credentials (change these!) ────────────────────────────────────────
PANEL_PORT=2053
PANEL_USER="admin"
PANEL_PASS="Change_me_$(openssl rand -hex 4)"   # Random password auto-generated
PANEL_PATH="/panel"

# ── Step 1: System prep ───────────────────────────────────────────────────────
info "Installing dependencies..."
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get install -y -qq curl wget jq sqlite3 ufw 2>/dev/null

# ── Step 2: Firewall ──────────────────────────────────────────────────────────
info "Opening panel port $PANEL_PORT..."
ufw allow "$PANEL_PORT"/tcp comment "3X-UI Panel"
ufw --force enable

# ── Step 3: Install 3X-UI ─────────────────────────────────────────────────────
info "Installing 3X-UI panel..."
bash <(curl -Ls https://raw.githubusercontent.com/mhsanaei/3x-ui/master/install.sh) <<< "n"
log "3X-UI installed"

# ── Step 4: Set admin credentials ────────────────────────────────────────────
info "Setting admin credentials..."
x-ui setting -username "$PANEL_USER" -password "$PANEL_PASS" -port "$PANEL_PORT" 2>/dev/null || \
x-ui setting --username "$PANEL_USER" --password "$PANEL_PASS" 2>/dev/null || true

# ── Step 5: Restart panel ────────────────────────────────────────────────────
info "Restarting 3X-UI..."
systemctl restart x-ui || x-ui restart 2>/dev/null || true
sleep 3

# ── Step 6: Get server IP ─────────────────────────────────────────────────────
SERVER_IP=$(curl -s --max-time 5 https://api.ipify.org || hostname -I | awk '{print $1}')

# ── Save credentials ──────────────────────────────────────────────────────────
CREDS_FILE="/root/3xui-credentials.txt"
cat > "$CREDS_FILE" << EOF
════════════════════════════════════════════════════
  3X-UI Panel Credentials — KEEP PRIVATE
════════════════════════════════════════════════════
  URL:      http://$SERVER_IP:$PANEL_PORT$PANEL_PATH
  Username: $PANEL_USER
  Password: $PANEL_PASS

  Change password after first login!
════════════════════════════════════════════════════
EOF
chmod 600 "$CREDS_FILE"

# ── Output ────────────────────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  ✓ 3X-UI Panel is LIVE${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "  ${CYAN}URL:${NC}      ${YELLOW}http://$SERVER_IP:$PANEL_PORT$PANEL_PATH${NC}"
echo -e "  ${CYAN}Username:${NC} ${YELLOW}$PANEL_USER${NC}"
echo -e "  ${CYAN}Password:${NC} ${YELLOW}$PANEL_PASS${NC}"
echo ""
echo -e "  Credentials saved to: $CREDS_FILE"
echo ""
echo -e "${CYAN}IN THE PANEL — Add a VLESS+REALITY inbound:${NC}"
echo -e "  1. Click ${YELLOW}Inbounds → Add Inbound${NC}"
echo -e "  2. Protocol: ${YELLOW}VLESS${NC}"
echo -e "  3. Port: ${YELLOW}443${NC}"
echo -e "  4. Security: ${YELLOW}Reality${NC}"
echo -e "  5. SNI Dest: ${YELLOW}www.microsoft.com:443${NC}"
echo -e "  6. Click ${YELLOW}Get New Cert${NC} to generate keys"
echo -e "  7. Add a client → it generates QR code automatically"
echo ""
echo -e "${RED}⚠ Change the default password immediately after login!${NC}"
echo ""
EOF
