---
title: CSR generation script
customSlug: csr-generation-script
type: 'post'
description: sometimes the only option is to do SSL manually. This article is for
  those times.
pubDate: 2022-11-10
tags: ['devops']
draft: false

---
Ideally [Let's Encrypt](https://letsencrypt.org/) and [Certbot](https://certbot.eff.org/) will just ✨automagically⚡ generate all your SSL certificates, but if you're working with internal services (basically anything not exposed to the public internet), or legacy systems that are very specific about the CA / root certificate, you'll still need to generate some certificate signing requests (CSRs) and request a certificate the old-school way from someone like [GoDaddy](https://www.godaddy.com/en-ca/web-security/ssl-certificate), [NameCheap](https://www.namecheap.com/security/ssl-certificates/), or [Entrust](https://www.entrust.com/digital-security/certificate-solutions/products/digital-certificates/tls-ssl-certificates).

## My solution

`openssl` is great, but I find it really hard to remember the commands to generate the CSR goodies you need. To make things a bit easier I used a CSR generation script in my home folder.

```sh
# makecsr.sh
# if there is no argumenet error out. 
if [ -z $1 ]
then
        echo "please provide a fully qualified domain name (i.e. app.mykal.codes)"
        echo "makecsr.sh <fqdn>"
        exit 1
fi

# if there is a valid fully qualified domain name...
# generate a certificate using SSL 
openssl req -new -newkey rsa:2048 -nodes -keyout $1__private.key -out $1__csr.csr -subj "/C=CA/ST=BC/L=Vancouver/O=Tinybox Software Development/OU=Mykal Machon/CN=$1"

# output the location and filenames for the new CSR and Private key.
echo "generated a CSR and Private Key for ya!"
echo "./$1__csr.csr"
echo "./$1__private.key"
```

Then when I need a certificate it's as easy as running this in my terminal.

```bash
~/scripts/makecsr.sh app.mykal.codes
generated a CSR and Private Key for ya!
./app.mykal.codes__csr.csr
./app.mykal.codes__private.key
```

Take those newly generated CSR file off to your certificate authority of choice, and move your private key to the legacy/internal server in preparation for your new SSL certificates.