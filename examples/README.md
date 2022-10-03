<!-- BEGIN_TF_DOCS -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | ~> 2.20.0 |
| <a name="requirement_consul"></a> [consul](#requirement\_consul) | >= 2.5.0 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | ~> 2.20.0 |
| <a name="provider_consul"></a> [consul](#provider\_consul) | >= 2.5.0 |

## Modules

No modules.

## Resources

| Name | Type |
|------|------|
| [aws_acm_certificate.test-cert](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/acm_certificate) | data source |
| [consul_key.test](https://registry.terraform.io/providers/hashicorp/consul/latest/docs/data-sources/key) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_instance_name"></a> [instance\_name](#input\_instance\_name) | Instance name prefix | `string` | `"test-2"` | no |
| <a name="input_subnet_ids"></a> [subnet\_ids](#input\_subnet\_ids) | A list of subnet ids to use | `list(string)` | n/a | yes |
| <a name="input_vpc_id"></a> [vpc\_id](#input\_vpc\_id) | The id of the vpc | `string` | n/a | yes |

## Outputs

No outputs.
<!-- END_TF_DOCS -->