-- migrate:up

CREATE TABLE team (
  id SERIAL,
  name TEXT NOT NULL,
  created_at TIMESTAMP(3) WITHOUT TIME ZONE NOT NULL,
  deleted_at TIMESTAMP(3) WITHOUT TIME ZONE,
  PRIMARY KEY (id)
);

CREATE TABLE "user" (
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  password TEXT NOT NULL,
  team_id INTEGER NOT NULL REFERENCES team(id),
  created_at TIMESTAMP(3) WITHOUT TIME ZONE NOT NULL,
  deleted_at TIMESTAMP(3) WITHOUT TIME ZONE,
  PRIMARY KEY (email)
);

CREATE TABLE rule (
  id SERIAL,
  team_id INTEGER NOT NULL REFERENCES team(id),
  region_id TEXT,
  site_id TEXT,
  device_id TEXT,
  created_at TIMESTAMP(3) WITHOUT TIME ZONE NOT NULL,
  deleted_at TIMESTAMP(3) WITHOUT TIME ZONE,
  PRIMARY KEY (id)
);

CREATE TABLE event (
  region_id TEXT,
  event_id INTEGER,
  secret_token TEXT NOT NULL,
  site_id TEXT NOT NULL,
  device_id TEXT NOT NULL,
  created_at TIMESTAMP(3) WITHOUT TIME ZONE NOT NULL,
  rule_id INTEGER REFERENCES rule(id),
  assigned_at TIMESTAMP(3) WITHOUT TIME ZONE,
  assigned_to TEXT REFERENCES "user"(email),
  review TEXT,
  reviewed_at TIMESTAMP(3) WITHOUT TIME ZONE,
  
  PRIMARY KEY (region_id, event_id)
);

CREATE FUNCTION find_rule(p_team_id INTEGER, p_region_id TEXT, p_site_id TEXT, p_device_id TEXT)
  RETURNS INTEGER AS $$
DECLARE
  v_rule_id TEXT;
  v_team_id INTEGER;
BEGIN
  SELECT id, team_id INTO v_rule_id, v_team_id
    FROM rule r
    WHERE (r.region_id IS NULL OR r.region_id = p_region_id) AND
        (r.site_id IS NULL OR r.site_id = p_site_id) AND
        (r.device_id IS NULL OR r.device_id = p_device_id);
  RETURN CASE WHEN v_team_id IS NULL OR v_team_id = p_team_id THEN v_rule_id ELSE NULL END;
END;
$$ LANGUAGE plpgsql;

-- migrate:down

DROP TABLE event;
DROP TABLE rule;
DROP TABLE "user";
DROP TABLE team;
