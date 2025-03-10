#!/usr/bin/env python3

from multiprocessing import Process
import random
import requests
import time

def pump_events(base):
    for index in range(1000):
        requests.post(
            'http://localhost:8080/api/event',
            json={
              'regionId': random.choice(['DE', 'UK']),
              'eventId': base * 1000 + index,
              'secretToken': 'some-secret',
              'siteId': random.choice(['SITE-1', 'SITE-2', 'SITE-3']),
              'deviceId': 'DEVICE-1'
            })

emails = [f'user{index}@acme.com' for index in range(1, 7)]

def pump_reviews():
    for index in range(2000):
        response = requests.post(
            'http://localhost:8080/api/review',
            json={'userId': random.choice(emails)})
        events = response.json()['events']
        for event in events:
            if random.random() < 0.75:
                requests.put(
                    f'http://localhost:8080/api/review/{event['regionId']}/{event['eventId']}',
                    json={'review': random.choice(['approve', 'disapprove', 'not-sure'])})
        time.sleep(0.01)

event_pumps = [Process(target=pump_events, args=(index, )) for index in range(3)]
review_pumps = [Process(target=pump_reviews) for index in range(5)]
for process in event_pumps + review_pumps:
    process.start()
for process in event_pumps + review_pumps:
    process.join()
