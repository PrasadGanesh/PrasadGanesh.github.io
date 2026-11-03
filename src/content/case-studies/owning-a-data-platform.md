---
title: Owning a data platform end to end
summary: One owner for the full data path, from more than 100 solar plants to the dashboards customers use.
description: How I own Smart Helio's data platform end to end, handling millions of sensor readings a day from more than 100 plants with Spark and Airflow.
problem: Millions of sensor readings arrive every day from more than 100 plants. Every analysis and customer report depends on that data being complete, on time, and correct.
tried: "I built and run the whole path: ingestion, Airflow-scheduled Spark jobs, time-series storage in AWS Timestream, raw data in S3, and APIs in FastAPI and Django."
worked: One owner and one set of conventions, from the first reading to the API response, so a problem gets traced in one place.
result: More than 100 plants, millions of readings a day
metrics:
  - 100+ plants
  - Millions of sensor readings per day
  - One owner, end to end
stack:
  - Python
  - Spark
  - Airflow
  - FastAPI
  - Django
  - MongoDB
  - AWS Timestream
  - AWS S3
  - Redis
  - Docker
order: 1
---

Smart Helio is a YC-backed solar analytics SaaS company with teams in Noida and Lausanne. I'm a Data Scientist there, and I own the data platform end to end.

The domain is solar plant telemetry. The engineering problem is the same one any high-volume time-series platform has: data arrives late, out of order, or not at all, and everything built on top assumes it didn't.

I own ingestion, scheduling, processing, storage, and the APIs that serve the results. Because one person owns all of it, a gap in a chart can be traced back to its source without a handoff.
