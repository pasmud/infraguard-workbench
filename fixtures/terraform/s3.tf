# Intentionally misconfigured: public ACL, no encryption, no versioning
resource "aws_s3_bucket" "public_bucket" {
  bucket = "public-assets-bucket"
  acl    = "public-read"

  tags = {
    Name        = "Public assets"
    Environment = "production"
  }
}

# Intentionally misconfigured: no server-side encryption
resource "aws_s3_bucket" "unencrypted_bucket" {
  bucket = "logs-bucket"
  acl    = "log-delivery-write"
}

# Compliant bucket for reference
resource "aws_s3_bucket" "secure_bucket" {
  bucket = "secure-backup-bucket"
  acl    = "private"

  versioning {
    enabled = true
  }

  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }
    }
  }
}
