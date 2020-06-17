---
categories:
- ops
date: "2020-06-02T16:00:00-07:00"
description: Signing Git commits with GPG Key.
draft: true
image: /posts/_covers/under-construction.jpg
imageAlt: under construction crane
imageCredit: '@hojipago https://unsplash.com/photos/D46mXLsQRJw'
slug: create-a-bootable-usb
tags:
- linux
- ubuntu
title: How to create a bootable Ubuntu install USB from Mac OS.
---

I've been doing this for over a decade, and finally decided to document it.

### 1. Insert the USB into your machine

### 2. Find the device id

```bash
$ df -h
Filesystem      Size   Used  Avail Capacity iused      ifree %iused  Mounted on
/dev/disk1s1   466Gi   10Gi  239Gi     5%  487114 4880655046    0%   /
devfs          344Ki  344Ki    0Bi   100%    1196          0  100%   /dev
/dev/disk1s2   466Gi  214Gi  239Gi    48% 1719485 4879422675    0%   /System/Volumes/Data
/dev/disk1s5   466Gi  1.0Gi  239Gi     1%       1 4881142159    0%   /private/var/vm
map auto_home    0Bi    0Bi    0Bi   100%       0          0  100%   /System/Volumes/Data/home
/dev/disk2s2    15Gi  1.8Gi   13Gi    13%       0          0  100%   /Volumes/UNTITLED
```

Here, our disk is named UNTITLED and it has a device id of `/dev/disk2`. The trailing `s2` is the partition id.

### 3. Unmount the partition

```bash
$ diskutil umount /dev/disk2s2
Volume UNTITLED on disk2s2 unmounted
```

### 4. Download Ubuntu 20.04

```bash
$ wget https://releases.ubuntu.com/20.04/ubuntu-20.04-live-server-amd64.iso
--2020-06-02 11:49:58--  https://releases.ubuntu.com/20.04/ubuntu-20.04-live-server-amd64.iso
Resolving releases.ubuntu.com (releases.ubuntu.com)... 91.189.88.247, 91.189.91.124, 91.189.91.123, ...
Connecting to releases.ubuntu.com (releases.ubuntu.com)|91.189.88.247|:443... connected.
HTTP request sent, awaiting response... 200 OK
Length: 952107008 (908M) [application/x-iso9660-image]
Saving to: ‘ubuntu-20.04-live-server-amd64.iso’

ubuntu-20.04-live-server-amd64.iso            28%[=========================>                                                                    ] 258.45M  11.9MB/s    eta 58s
```

### 5. Flash the ISO to your USB disk

Our target in this case is `/dev/rdisk2`

```bash
$ sudo dd bs=8m if=ubuntu-20.04-live-server-amd64.iso of=/dev/rdisk2
```

### 6. Eject the disk

```bash
$ sudo diskutil eject /dev/rdisk2
Disk /dev/rdisk2 ejected
```

### 7. Remove the disk and boot into the flashable USB
