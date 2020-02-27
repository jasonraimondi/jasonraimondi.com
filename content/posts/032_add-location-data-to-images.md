+++
title = "Add location data to images"
slug = "add-location-data-to-images"
date = "2020-02-25T10:16:00-0800"
description = "When you take photos with a camera without a GPS, like say, a DSLR, the photos don't include location data. Follow this guide to bulk add location data to images using `exiftool`"
tags = [
    "bash",
]
categories = [
    "software",
]
image = "https://d265ybhz09ikd5.cloudfront.net/posts/2020/02/openstreetmaps.png"
+++ 

## Install dependencies

The only dependency required is going to be `exiftool`.

### MacOS

```bash
brew install exiftool
``` 
 
### Debian or Ubuntu

```bash
sudo apt install -y exiftool
```

## Use OpenStreetMaps to find the your location coordinates 

If you open [OpenStreetMaps](https://www.openstreetmap.org) and navigate to the location you'd like to add. I wanted to add the location of the venue for my wedding photographs. 

It landed me about here: https://www.openstreetmap.org/#map=12/34.41824/-118.79546

![OpenStreetMaps screenshot showing latitude and longitude](https://d265ybhz09ikd5.cloudfront.net/posts/2020/02/openstreetmaps-lat-long.png)

Latitude: 34.418243
Longitude: -118.795463

```bash
exiftool \
    -GPSLongitudeRef="West" \
    -XMP:GPSLongitude="-118.795463" \
    -GPSLatitudeRef="North" \
    -XMP:GPSLatitude="34.418243" \
    input-image.jpg
```

If you wanted to do an entire directory of images

```bash
exiftool \
    -GPSLongitudeRef="West" \
    -XMP:GPSLongitude="-118.795463" \
    -GPSLatitudeRef="North" \
    -XMP:GPSLatitude="34.418243" \
    /path/to/**/*.jpg
```

Exiftool adds the location data to the photo by altering the file in place while also creating a copy of the original file(s) at `{input-file-name}-original`.

## Importing into Apple Photos

Now when we import our photos into Apple Photos, the location data shows up correctly for our images.
 
![Apple Photos app showing location data](https://d265ybhz09ikd5.cloudfront.net/posts/2020/02/apple-photos-location-data.png)
