terraform {
  required_version = ">= 1.7.0"
  required_providers {
    google = { source = "hashicorp/google", version = "~> 5.0" }
  }
  backend "gcs" {
    bucket = "qoqnoos-terraform-state"
    prefix = "terraform/state"
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

resource "google_compute_network" "qoqnoos_vpc" {
  name                    = "qoqnoos-vpc"
  auto_create_subnetworks = false
}

resource "google_compute_subnetwork" "qoqnoos_subnet" {
  name          = "qoqnoos-subnet"
  ip_cidr_range = "10.0.0.0/16"
  region        = var.region
  network       = google_compute_network.qoqnoos_vpc.id
  secondary_ip_range {
    range_name    = "pods"
    ip_cidr_range = "10.1.0.0/16"
  }
  secondary_ip_range {
    range_name    = "services"
    ip_cidr_range = "10.2.0.0/16"
  }
}

resource "google_container_cluster" "qoqnoos_cluster" {
  name             = "qoqnoos-cluster"
  location         = var.region
  enable_autopilot = true
  network          = google_compute_network.qoqnoos_vpc.name
  subnetwork       = google_compute_subnetwork.qoqnoos_subnet.name
  ip_allocation_policy {
    cluster_secondary_range_name  = "pods"
    services_secondary_range_name = "services"
  }
  release_channel { channel = "REGULAR" }
}

resource "google_sql_database_instance" "qoqnoos_db" {
  name             = "qoqnoos-postgres"
  database_version = "POSTGRES_16"
  region           = var.region
  settings {
    tier = "db-custom-4-15360"
    backup_configuration {
      enabled    = true
      start_time = "02:00"
      backup_retention_settings { retained_backups = 30 }
    }
    ip_configuration {
      ipv4_enabled    = false
      private_network = google_compute_network.qoqnoos_vpc.id
    }
    insights_config { query_insights_enabled = true }
  }
  deletion_protection = true
}

resource "google_sql_database" "qoqnoos" {
  name     = "qoqnoos"
  instance = google_sql_database_instance.qoqnoos_db.name
}

resource "google_redis_instance" "qoqnoos_cache" {
  name               = "qoqnoos-redis"
  tier               = "STANDARD_HA"
  memory_size_gb     = 4
  region             = var.region
  authorized_network = google_compute_network.qoqnoos_vpc.id
  redis_version      = "REDIS_7_0"
}

resource "google_storage_bucket" "media" {
  name          = "qoqnoos-media-${var.project_id}"
  location      = "US"
  storage_class = "STANDARD"
  versioning { enabled = true }
  cors {
    origin          = ["https://qoqnoos.com"]
    method          = ["GET", "HEAD", "PUT", "POST"]
    response_header = ["*"]
    max_age_seconds = 3600
  }
}

resource "google_artifact_registry_repository" "qoqnoos" {
  location      = var.region
  repository_id = "qoqnoos"
  description   = "Qoqnoos Docker images"
  format        = "DOCKER"
}
