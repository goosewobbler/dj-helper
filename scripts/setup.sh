CERT=$(awk '{printf "%s\\n", $0}' /etc/pki/certificate.pem)
cat <<NPMRC > .npmrc
registry=https://npm.morph.int.tools.bbc.co.uk
cert="$CERT"
key="$CERT"
cafile=/etc/pki/tls/certs/ca-bundle.crt
NPMRC
