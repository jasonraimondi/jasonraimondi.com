+++
title = "ZFS"
slug = "zfs"
date = 2019-03-18
draft = true
description = "Yes, zfs send is faster. It doesn’t need to parse everything, it directly finds all the blocks that have changed between the snapshots."
tags = [ 
    "vue.js",
    "php",
    "javascript",
]
categories = [
    "frontend",
    "backend",
    "ops",
]
image = "https://assets.jasonraimondi.com/posts/_covers/under-construction.jpg"
imageCredit = "@hojipago https://unsplash.com/photos/D46mXLsQRJw"
imageAlt = "under construction crane"
+++ 

### Sending and Receiving Snapshot

> Yes, zfs send is faster. It doesn’t need to parse everything, it directly
finds all the blocks that have changed between the snapshots.
— [zfs-discuss Zfs send VS rsync](http://list.zfsonlinux.org/pipermail/zfs-discuss/2017-March/027765.html)

Sending and receiving zfs snapshots is very similar

```bash
$ zfs send -R storage@2018-10-05 |  zfs receive -dF coldstorage
```

### 2. Sending only a diff 

Take a diff and save it to a disk, or send just the diff over the network. Sending over the network is similar to **rsync -e ssh**, but instead of parsing all of the files, it directly syncs the blocks that have changed.

Imagine you needed to sync two disks in different machines and you wanted to use a physical disk as the mediary, not the network. Using a zfs snapshot diff, you would be able to store just the diff on the physical devices, allowing you to use a tiny disk if that is all the diff requires.

```bash
$ zfs send -Ri storage@2018-10-05 storage@2019-03-14 | zfs receive -dF coldstorage
```

The send command to update my offline **coldstorage** disk with the most recent snapshot from my storage drive.

### 3. Read Only Mode

Temporarily marking the filesystem as read only. 

This seems to effect all zfs sub-filesystems. This is confirmed only via the following.

```bash
$ zfs set readonly=on storage
```

Now if you try to write anything

```bash
$ cd /mnt/storage
$ touch foo.txt
touch: cannot touch 'foo.txt': Read-only file system
$ cd /mnt/storage/nextcloud
$ touch bar.txt
touch: cannot touch 'bar.txt': Read-only file system
```

### ZFS Property - Mount Point

```bash
$ zfs set mountpoint=/mnt/newstorage newstorage
```
