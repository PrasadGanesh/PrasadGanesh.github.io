---
title: From manual fault testing to automated scoring
summary: A Django dashboard that scores fault-detection algorithms and cut testing from days to within a day.
description: A Django dashboard that scores fault-detection algorithms automatically and cut testing time from days to within a day.
problem: Testing a fault-detection algorithm took days of manual work, so each change waited days for an answer.
tried: I built a Django dashboard that runs each algorithm against the same data and scores its results the same way every time.
worked: With one repeatable scoring method, comparisons stopped being judgment calls, and running them no longer needed a person.
result: Days → within a day
metrics:
  - "Testing time: days → within a day"
  - Same scoring for every algorithm
stack:
  - Python
  - Django
  - MongoDB
  - Docker
order: 2
---

Fault-detection algorithms find problems in plant data. Before anyone can trust a new version, it has to be tested against known faults.

That testing was manual and took days. Each run depended on whoever ran it, and results were hard to compare.

I replaced it with a Django dashboard that scores the algorithms automatically. Testing now finishes within a day, and every version is measured against the same yardstick.
