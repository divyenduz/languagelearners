variable "access_key" {}
variable "secret_key" {}

variable "environment" {
  default = "explore"
}

variable "key_name" {
  default = "lingoparrot-us-east-1"
}

variable "key_path" {
  default = "/Users/divyendusingh/Documents/keys/lingoparrot-us-east-1.pem"
}

variable "region" {
  default = "us-east-1"
}

variable "amis" {
  type = "map"

  default = {
    "us-east-1" = "ami-0de53d8956e8dcf80"
  }
}

output "output" {
  value = "IP Address: ${aws_instance.instance_1.public_ip}"
}
