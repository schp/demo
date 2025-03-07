-- migrate:up

INSERT INTO team (id, name, created_at)
  VALUES (1, 'Blue', NOW()),
         (2, 'Yellow', NOW()),
         (3, 'Green', NOW());

INSERT INTO "user" (email, name, password, team_id, created_at)
  VALUES ('user1@acme.com', 'John', 'encoded-pass', 1, NOW()),
         ('user2@acme.com', 'Jane', 'encoded-pass', 1, NOW()),
         ('user3@acme.com', 'Ada', 'encoded-pass', 2, NOW()),
         ('user4@acme.com', 'Albert', 'encoded-pass', 2, NOW()),
         ('user5@acme.com', 'Gabriel', 'encoded-pass', 3, NOW()),
         ('user6@acme.com', 'Giovanna', 'encoded-pass', 3, NOW());

INSERT INTO rule (id, team_id, region_id, site_id, device_id, created_at)
  VALUES (1, 1, 'DE', NULL, NULL, NOW()),
         (2, 3, 'UK', 'SITE-1', NULL, NOW()),
         (3, 2, 'UK', 'SITE-2', NULL, NOW());

-- migrate:down

DELETE FROM rule;
DELETE FROM "user";
DELETE FROM team;
