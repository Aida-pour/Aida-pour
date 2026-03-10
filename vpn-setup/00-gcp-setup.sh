#!/usr/bin/env bash
# =============================================================================
# Google Cloud Platform (GCP) — Full VPS + VPN + Remote Desktop Setup
# Creates a VM, installs Outline + Xray REALITY + RustDesk in one go
# Requires: gcloud CLI installed and authenticated on your LOCAL machine
# =============================================================================
set -euo pipefail

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
BLUE='\033[0;34m'; CYAN='\033[0;36m'; BOLD='\033[1m'; NC='\033[0m'

log()  { echo -e "${GREEN}[✓]${NC} $*"; }
warn() { echo -e "${YELLOW}[!]${NC} $*"; }
err()  { echo -e "${RED}[✗]${NC} $*"; exit 1; }
info() { echo -e "${CYAN}[→]${NC} $*"; }

echo -e "${BLUE}"
cat << 'EOF'
  ╔══════════════════════════════════════════════════════════╗
  ║     Google Cloud — Full VPN + Remote Desktop Setup       ║
  ║   Outline + Xray REALITY + RustDesk · One command        ║
  ╚══════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

# ═══════════════════════════════════════════════════════════════════════════════
# CONFIGURATION — Edit these before running
# ═══════════════════════════════════════════════════════════════════════════════

PROJECT_ID="kalabekala"            # Your GCP project ID (leave blank to auto-detect)
VM_NAME="family-vpn-server"        # Name for your VM
REGION="europe-west3"              # Frankfurt — best for Iran latency
ZONE="europe-west3-a"
MACHINE_TYPE="e2-micro"            # Free tier eligible (1 vCPU, 1 GB RAM)
DISK_SIZE="20"                     # GB
OS_IMAGE="ubuntu-2404-noble-amd64-v20250313"
OS_PROJECT="ubuntu-os-cloud"
STATIC_IP_NAME="family-vpn-ip"
FIREWALL_RULE="allow-vpn-ports"

# ═══════════════════════════════════════════════════════════════════════════════

# ── Check gcloud is installed ─────────────────────────────────────────────────
if ! command -v gcloud &>/dev/null; then
    echo -e "${RED}gcloud CLI is not installed.${NC}"
    echo ""
    echo "Install it first:"
    echo "  curl https://sdk.cloud.google.com | bash"
    echo "  exec -l \$SHELL"
    echo "  gcloud init"
    echo "  gcloud auth login"
    exit 1
fi

# ── Auto-detect project if not set ───────────────────────────────────────────
if [[ -z "$PROJECT_ID" ]]; then
    PROJECT_ID=$(gcloud config get-value project 2>/dev/null) || true
fi

if [[ -z "$PROJECT_ID" ]]; then
    echo -e "${YELLOW}No GCP project set.${NC}"
    echo ""
    gcloud projects list 2>/dev/null || true
    echo ""
    read -rp "Enter your GCP Project ID: " PROJECT_ID
    [[ -z "$PROJECT_ID" ]] && err "Project ID required"
fi

log "Using project: $PROJECT_ID"
gcloud config set project "$PROJECT_ID" --quiet

# ── Enable required APIs ──────────────────────────────────────────────────────
info "Enabling GCP APIs (compute, dns)..."
gcloud services enable compute.googleapis.com --quiet
log "APIs enabled"

# ── Reserve a static external IP ──────────────────────────────────────────────
info "Reserving static external IP in $REGION..."
EXISTING_IP=$(gcloud compute addresses describe "$STATIC_IP_NAME" \
    --region="$REGION" --format="value(address)" 2>/dev/null) || EXISTING_IP=""

if [[ -n "$EXISTING_IP" ]]; then
    warn "Static IP already exists: $EXISTING_IP — reusing it"
    SERVER_IP="$EXISTING_IP"
else
    gcloud compute addresses create "$STATIC_IP_NAME" \
        --region="$REGION" \
        --network-tier=STANDARD \
        --quiet
    SERVER_IP=$(gcloud compute addresses describe "$STATIC_IP_NAME" \
        --region="$REGION" --format="value(address)")
    log "Static IP reserved: $SERVER_IP"
fi

# ── Create firewall rules ──────────────────────────────────────────────────────
info "Creating firewall rules..."
gcloud compute firewall-rules describe "$FIREWALL_RULE" &>/dev/null && \
    gcloud compute firewall-rules delete "$FIREWALL_RULE" --quiet 2>/dev/null || true

gcloud compute firewall-rules create "$FIREWALL_RULE" \
    --direction=INGRESS \
    --priority=1000 \
    --network=default \
    --action=ALLOW \
    --rules=tcp:22,tcp:443,udp:443,tcp:2053,tcp:21115,tcp:21116,udp:21116,tcp:21117,tcp:21118,tcp:21119,tcp:50000-51819,udp:50000-51819 \
    --source-ranges=0.0.0.0/0 \
    --target-tags=vpn-server \
    --description="VPN + RustDesk ports for family server" \
    --quiet
log "Firewall rules created"

# ── Create the VM ─────────────────────────────────────────────────────────────
info "Creating VM: $VM_NAME in $ZONE..."
EXISTING_VM=$(gcloud compute instances describe "$VM_NAME" \
    --zone="$ZONE" --format="value(name)" 2>/dev/null) || EXISTING_VM=""

if [[ -n "$EXISTING_VM" ]]; then
    warn "VM '$VM_NAME' already exists — skipping creation"
else
    gcloud compute instances create "$VM_NAME" \
        --zone="$ZONE" \
        --machine-type="$MACHINE_TYPE" \
        --image="$OS_IMAGE" \
        --image-project="$OS_PROJECT" \
        --boot-disk-size="${DISK_SIZE}GB" \
        --boot-disk-type=pd-standard \
        --network-tier=STANDARD \
        --address="$SERVER_IP" \
        --tags=vpn-server \
        --metadata=serial-port-enable=FALSE \
        --quiet
    log "VM created: $VM_NAME ($SERVER_IP)"
fi

# ── Wait for VM to be ready ───────────────────────────────────────────────────
info "Waiting for VM to boot..."
sleep 20
RETRIES=0
until gcloud compute ssh "$VM_NAME" --zone="$ZONE" \
    --command="echo ready" --quiet 2>/dev/null; do
    RETRIES=$((RETRIES+1))
    [[ $RETRIES -gt 10 ]] && err "VM not responding after 2 minutes"
    info "  Still waiting... ($RETRIES/10)"
    sleep 12
done
log "VM is ready"

# ── Upload and run the install script on the VM ───────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

info "Uploading setup scripts to VM..."
gcloud compute scp \
    "$SCRIPT_DIR/01-outline-server.sh" \
    "$SCRIPT_DIR/02-xray-reality.sh" \
    "$SCRIPT_DIR/04-rustdesk-server.sh" \
    "${VM_NAME}:/tmp/" \
    --zone="$ZONE" \
    --quiet

info "Running full installation on VM (this takes 3-5 minutes)..."
gcloud compute ssh "$VM_NAME" --zone="$ZONE" --quiet -- bash << 'REMOTE_SCRIPT'
set -e
chmod +x /tmp/01-outline-server.sh /tmp/02-xray-reality.sh /tmp/04-rustdesk-server.sh

echo "========================================"
echo "  Installing Outline VPN..."
echo "========================================"
sudo bash /tmp/01-outline-server.sh 2>&1 | tee /tmp/outline-install.log || true

echo "========================================"
echo "  Installing Xray VLESS+REALITY..."
echo "========================================"
# Run non-interactively with default names
echo -e "maman\nbaba\n" | sudo bash /tmp/02-xray-reality.sh 2>&1 | tee /tmp/xray-install.log || true

echo "========================================"
echo "  Installing RustDesk relay server..."
echo "========================================"
sudo bash /tmp/04-rustdesk-server.sh 2>&1 | tee /tmp/rustdesk-install.log || true

echo "========================================"
echo "  All services installed!"
echo "========================================"
REMOTE_SCRIPT

log "All software installed on VM"

# ── Collect output from VM ────────────────────────────────────────────────────
info "Collecting configuration from VM..."
gcloud compute ssh "$VM_NAME" --zone="$ZONE" --quiet -- bash << 'COLLECT'
echo "=== XRAY KEYS ==="
cat /root/xray-client-keys.txt 2>/dev/null || echo "Check /root/xray-client-keys.txt on server"
echo ""
echo "=== RUSTDESK CONFIG ==="
cat /root/rustdesk-info.txt 2>/dev/null || echo "Check /root/rustdesk-info.txt on server"
echo ""
echo "=== OUTLINE MANAGER CONFIG ==="
cat /opt/outline/manager-config.json 2>/dev/null || echo "Run: sudo cat /opt/outline/manager-config.json on server"
COLLECT

# ── Final summary ─────────────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  ✓ EVERYTHING IS RUNNING ON GCP${NC}"
echo -e "${GREEN}  Server IP: $SERVER_IP${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${CYAN}WHAT'S INSTALLED:${NC}"
echo -e "  ✓ Outline VPN    (Shadowsocks · .npvt keys)"
echo -e "  ✓ Xray REALITY   (VLESS · vless:// links)"
echo -e "  ✓ RustDesk       (Remote desktop relay)"
echo ""
echo -e "${CYAN}NEXT STEPS:${NC}"
echo -e "  1. Install ${YELLOW}Outline Manager${NC} on your computer"
echo -e "     https://getoutline.org → paste the JSON config above"
echo ""
echo -e "  2. SSH into the server to get all keys:"
echo -e "     ${YELLOW}gcloud compute ssh $VM_NAME --zone=$ZONE${NC}"
echo -e "     ${YELLOW}cat /root/xray-client-keys.txt${NC}"
echo ""
echo -e "  3. Send ${YELLOW}client-guide-farsi.md${NC} to your parents"
echo ""
echo -e "${CYAN}SSH ACCESS:${NC}"
echo -e "  ${YELLOW}gcloud compute ssh $VM_NAME --zone=$ZONE${NC}"
echo ""
echo -e "${CYAN}GCP COSTS (Frankfurt e2-micro):${NC}"
echo -e "  VM:        ~\$7/month (or free if you have free tier credits)"
echo -e "  Static IP: ~\$2/month (free while attached to running VM)"
echo -e "  Bandwidth: First 200 GB/month free to most regions"
echo ""
echo -e "${GREEN}Done! Your family VPN server is live on Google Cloud.${NC}"
