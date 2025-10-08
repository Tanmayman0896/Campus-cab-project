# Run this script as Administrator to allow Expo through Windows Firewall

Write-Host "Adding Windows Firewall rules for Expo Development Server..." -ForegroundColor Yellow

# Add firewall rule for port 8081 (Metro Bundler)
New-NetFirewallRule -DisplayName "Expo Metro Bundler (8081)" -Direction Inbound -Protocol TCP -LocalPort 8081 -Action Allow -ErrorAction SilentlyContinue

# Add firewall rule for port 19000 (Expo Dev Tools)
New-NetFirewallRule -DisplayName "Expo Dev Tools (19000)" -Direction Inbound -Protocol TCP -LocalPort 19000 -Action Allow -ErrorAction SilentlyContinue

# Add firewall rule for port 19001 (Expo)
New-NetFirewallRule -DisplayName "Expo Server (19001)" -Direction Inbound -Protocol TCP -LocalPort 19001 -Action Allow -ErrorAction SilentlyContinue

# Add firewall rule for Node.js
$nodePath = (Get-Command node).Source
New-NetFirewallRule -DisplayName "Node.js for Expo" -Direction Inbound -Program $nodePath -Action Allow -ErrorAction SilentlyContinue

Write-Host "`n✅ Firewall rules added successfully!" -ForegroundColor Green
Write-Host "Now restart your Expo server with: npx expo start" -ForegroundColor Cyan
