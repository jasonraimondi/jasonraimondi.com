---
title: "How to Configure a Schlage Encode Plus for Home Assistant, HomeKit, Apple Home, and Apple Wallet Keys"
slug: "configure-a-schlage-encode-for-home-assistant-homekit-apple-home-apple-wallet-keys"
date: 2024-10-18T11:37:00-08:00
description: "A comprehensive guide to setting up your Schlage Encode Plus lock with Home Assistant, HomeKit, and Apple Wallet for seamless smart home integration."
categories: 
- hardware
tags: 
- home-assistant
- homekit
- schlage-lock
- iot
---

## Introduction

After a year of using the Schlage Encode Plus lock with Home Assistant via the [homeassistant-schlage](https://github.com/mcnutter1/homeasssitant-schlage) custom integration, I've finally cracked the code on seamlessly integrating it with Apple Home and enabling tap-to-open functionality with Apple Watch and iPhone. This guide will walk you through the setup process, ensuring your smart lock works flawlessly across multiple platforms.

## Prerequisites

Before we begin, make sure you have the following:

- An iPhone (iPad or Mac may work, but this is unconfirmed)
- A Schlage Encode Plus lock ([Official Website](https://www.schlage.com/en/home/smart-locks/encode-plus.html))
- An [Apple Home Hub](https://support.apple.com/en-us/102557) (e.g., Apple TV 4K)
- Home Assistant with the [HomeKit Bridge integration](https://www.home-assistant.io/integrations/homekit/) configured

{{< tip "warning" " " >}}
**Important:** If you've previously set up your lock using the Schlage app, you must factory reset it (press the button on the lock for 10 seconds) and remove it from the Schlage app. We won't be using the Schlage app for this setup.

{{< /tip >}}

## Setup Process

Follow these steps to configure your Schlage Encode Plus for use with Home Assistant, HomeKit, and Apple Wallet:

1. **Add the lock to HomeKit**
   - Activate pairing mode by pressing the button on the back of the lock
   - Open the Apple Home app and select "Add an Accessory"
   - If the lock doesn't appear automatically, tap "More options..." and look for it under "Nearby devices"
   - Follow the prompts to add the lock, create an Apple Wallet key, and configure access codes

2. **Configure Home Assistant**
   Add a binary input for each lock in your Home Assistant configuration:

   ```yaml
   # configuration.yaml
   input_boolean:
     front_door_lock:
       name: Front Door Lock Status
       icon: mdi:lock
     side_door_lock:
       name: Side Door Lock Status
       icon: mdi:lock
   ```

3. **Set up Apple Home automations**
   Create the following automations in the Apple Home app:
   - When "Front Door Lock Status" turns on, set Front Door to Locked
   - When "Front Door Lock Status" turns off, set Front Door to Unlocked
   - When Front Door is Locked, set "Front Door Lock Status" to on
   - When Front Door is Unlocked, set "Front Door Lock Status" to off

   Repeat these automations for any additional locks you've set up.

You should now have a fully integrated Schlage Encode Plus lock that works seamlessly with Home Assistant, HomeKit, and Apple Wallet. 
