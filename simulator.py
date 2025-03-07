#!/usr/bin/env python3

import random
import requests

for index in range(100):
    requests.post(
        'http://localhost:8080/api/event',
        json={
          'regionId': random.choice(['DE', 'UK']),
          'eventId': index,
          'secretToken': 'some-secret',
          'siteId': random.choice(['SITE-1', 'SITE-2', 'SITE-3']),
          'deviceId': 'DEVICE-1'
        })

emails = [f'user{index}@acme.com' for index in range(1, 7)]
for index in range(100):
    response = requests.post(
        'http://localhost:8080/api/review',
        json={'userId': random.choice(emails)})
    events = response.json()['events']
    if len(events) != 0:
        event = random.choice(events)
        requests.put(
            f'http://localhost:8080/api/review/{event['regionId']}/{event['eventId']}',
            json={'review': random.choice(['approve', 'disapprove', 'not-sure'])})
