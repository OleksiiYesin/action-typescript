provider "aws" {
  version = "~> 2.20.0"

  region = "us-east-1"
}

provider "consul" {
  alias = "test"
}

terraform {
  required_providers {
    consul = ">= 2.5.0"
  }
}

data "aws_acm_certificate" "test-cert" {
  domain   = "test.example.com"
  statuses = ["ISSUED"]
}

data "consul_key" "test" {
  key {
    name    = "test"
    path    = "examples/test.json"
    default = "{}"
  }
}

variable "vpc_id" {
  description = "The id of the vpc"
  type        = string
}

variable "subnet_ids" {
  description = "A list of subnet ids to use"
  type        = list(string)
}

variable "instance_name" {
  description = "Instance name prefix"
  type        = string
  default     = "test-2"
}
