---
title: Making e-commerce payments add up
summary: Reconciling orders against payment records for a platform with hundreds of thousands of users.
description: How I fixed payment mismatches on an e-commerce platform with hundreds of thousands of users, using gateway reconciliation and idempotent handling.
problem: Orders and payment records didn't always match. A customer could pay and get no order, or a retry could create a second charge or a second order.
tried: I reconciled our orders against the payment gateway's records, which we treated as the source of truth, and found where they drifted apart.
worked: I made payment handling idempotent, so a retried request or a repeated callback can't double-charge a customer or create a duplicate order.
result: Orders and payments reconciled
metrics:
  - Hundreds of thousands of users
  - Gateway as source of truth
  - Retry-safe payment handling
stack:
  - Python
order: 3
---

I spent about 3.5 years building Python backends in Mohali before I moved into data. The biggest system I worked on was an e-commerce platform with hundreds of thousands of users.

Payments fail in messy ways. Networks drop, users click twice, and gateways send the same callback more than once. Each of these can leave an order and its payment record out of step.

I treated the gateway's record as the truth and reconciled orders against it. I then made the payment path idempotent, so doing the same thing twice has the same effect as doing it once.
