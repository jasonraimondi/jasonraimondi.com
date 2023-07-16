---
categories:
  - ops
date: "2020-09-03T13:00:00-07:00"
description: Encrypt your zfs filesystems with an encryption key
images:
  - /covers/afonso-morais-JXgdQzexK9M-unsplash.jpg
imageCredit: "@morais_afonso https://unsplash.com/photos/JXgdQzexK9M"
slug: encrypting-zfs-filesystem
tags:
  - zfs
  - encryption
title: Encrypting ZFS Filesystem
---

Create the encryption key with random

```bash
sudo dd if=/dev/random of=/media/usb_with_keys/macbookpro.key bs=1 count=32
```

```bash
sudo zfs create timemachine/jason/macbookpro \
  -o mountpoint=/mnt/timemachine/jason/macbookpro \
  -o compression=on \
  -o quota=1T \
  -o encryption=aes-256-gcm \
  -o keyformat=raw \
  -o keylocation=file:///media/usb_with_keys/macbookpro.key
```
