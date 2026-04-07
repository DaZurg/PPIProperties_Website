#!/bin/bash

# Test FTP connection to cPanel
# Usage: ./test-ftp.sh

# Set your FTP credentials here
FTP_HOST="ftp.ppiproperties.co.za"
FTP_USERNAME="PPIPropertiesFTP@temp.ppiproperties.co.za"
FTP_PASSWORD="TVY-xwy_veu4xvr4pyu"  # Replace with your actual password

echo "=========================================="
echo "FTP Connection Test"
echo "=========================================="
echo ""
echo "Testing connection to: $FTP_HOST"
echo "Username: $FTP_USERNAME"
echo ""

# Test basic connection
lftp -u "$FTP_USERNAME","$FTP_PASSWORD" -e "set ssl:verify-certificate no; ls; quit" "$FTP_HOST"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ FTP connection successful!"
    echo ""
    echo "Your credentials work. The GitHub deployment should succeed."
else
    echo ""
    echo "❌ FTP connection failed"
    echo ""
    echo "Possible issues:"
    echo "1. Username or password is incorrect"
    echo "2. Your IP might be blocked by the FTP server"
    echo "3. FTP service might be down"
    echo ""
    echo "Check your FTP credentials and try again."
fi
