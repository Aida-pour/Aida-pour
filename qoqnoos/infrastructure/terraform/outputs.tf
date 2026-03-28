output "gke_cluster_name" {
  value = google_container_cluster.qoqnoos_cluster.name
}

output "database_instance_name" {
  value = google_sql_database_instance.qoqnoos_db.name
}

output "redis_host" {
  value = google_redis_instance.qoqnoos_cache.host
}

output "media_bucket_name" {
  value = google_storage_bucket.media.name
}
