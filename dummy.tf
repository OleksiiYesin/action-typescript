locals {
    dummy_value = upper(var.example_input)
}
output "example_output" {
    value = md5(local.dummy_value)
    description = "An example output for a Terraform module."  
}
variable "example_input" {
  type = string
  description = "An example for a terraform module's input variable."
  default = "foo bar baz"
}
terraform {
    required_version = ">=1"
    required_providers {
      null = {
          source = "hashicorp/null"
          version = "3.1.1"
      }
    }
}

resource "null_resource" "dummy_resource" {
  triggers = {
      foo = local.dummy_value
  }
}

resource "null_resource" "dummy_resource_two" {
  triggers = {
      foo = local.dummy_value
  }
}