provider "aws" {
  access_key = "${var.access_key}"
  secret_key = "${var.secret_key}"
  region     = "${var.region}"
}

resource "aws_instance" "instance_1" {
  ami      = "${lookup(var.amis, var.region)}"
  key_name = "${var.key_name}"

  count         = 1
  instance_type = "t2.micro"

  associate_public_ip_address = true
  subnet_id                   = "subnet-9b7453b3"
  security_groups             = ["sg-055a0efa414697444"]

  root_block_device {
    delete_on_termination = true
  }

  provisioner "remote-exec" {
    connection {
      type        = "ssh"
      user        = "ubuntu"
      private_key = "${file("${var.key_path}")}"
    }

    inline = [
      #   "sudo yum update -y",
      #   "sudo yum install mysql -y",
      "curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash",

      "nvm install v10.4.0",
      "npm install -g prisma",
    ]
  }
}
