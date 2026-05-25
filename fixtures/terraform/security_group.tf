# Intentionally misconfigured: open SSH and RDP access
resource "aws_security_group" "open_ssh" {
  name        = "open-ssh-sg"
  description = "Security group with open SSH access"
  vpc_id      = "vpc-12345"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "open-ssh"
  }
}

resource "aws_security_group" "open_rdp" {
  name        = "open-rdp-sg"
  description = "Security group with open RDP access"
  vpc_id      = "vpc-12345"

  ingress {
    from_port   = 3389
    to_port     = 3389
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "open-rdp"
  }
}

# Compliant security group for reference
resource "aws_security_group" "restricted_ssh" {
  name        = "restricted-ssh-sg"
  description = "Security group with restricted SSH access"
  vpc_id      = "vpc-12345"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/8", "172.16.0.0/12"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
