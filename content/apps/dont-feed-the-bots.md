+++
title = "Dont Feed the Bots"
slug = "dont-feed-the-bots"
date = 2020-06-13T13:43:54-07:00
Description = ""
Tags = []
Categories = []
draft = false
toc = false
+++

The idea is that I will use the Twitter realtime API and monitor any of my tweets that contain mentions. If there is a mention, use a tool like https://botsentinel.com/ to identify if any of the users I am interacting with are a bot. If they are, bot sends a tweet in the conversation that says this user is likely a bot, and we should ignore them.  

Notes:

It should keep a local cache of what users have been looked up, and when, only recheck every day or week.
