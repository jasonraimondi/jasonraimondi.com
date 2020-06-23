---
title: Terraform configuration for s3 static site with cloudfront https and cloudflare dns
description: This is my configuration for
slug: terraform-amazon-s3-static-site-with-cloudfront-https-and-cloudflare-dns
draft: true
date: 2020-06-23T03:23:28
---

In this example, I am using Cloudflare as my DNS provider, Amazon s3 for the static site hosting, and Cloudfront for our https signing and CDN.

### Create the S3 Bucket

The first thing you need to do is create an AWS s3 bucket, and a zone in Cloudflare

```terraform
resource "cloudflare_zone" "jasonraimondi_com" {
  zone = "jasonraimondi.com"
}

resource "aws_s3_bucket" "static_jasonraimondi_com" {
  bucket = "examplebucket"
  policy = file("jasonraimondi_com_bucket_policy.json")
  region = "us-east-1"

  website {
    error_document = "404.html"
    index_document = "index.html"
  }
}
```

### Add your site to the bucket

Seed a html file into your bucket

```bash
mkdir site
echo "<h1>Hello crazy world!</h1>" > site/index.html
aws s3 sync backup s3://examplebucket
``` 

### Create a cloudfront distribution for the s3 bucket

```terraform
resource "aws_cloudfront_distribution" "jasonraimondi_com" {
  aliases = [
    "jasonraimondi.com",
  ]

  comment = "jasonraimondi.com static site"

  origin {
    domain_name = aws_s3_bucket.static_jasonraimondi_com.bucket_domain_name
    origin_id   = "S3-${aws_s3_bucket.static_jasonraimondi_com.id}"

    s3_origin_config {
      origin_access_identity = "origin-access-identity/cloudfront/E32LJ9CIEPY60T"
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"

#  default_cache_behavior {
#    allowed_methods  = ["GET", "HEAD"]
#    cached_methods   = ["GET", "HEAD"]
#    target_origin_id = "S3-${aws_s3_bucket.static_jasonraimondi_com.id}"
#
#    forwarded_values {
#      query_string = false
#
#      cookies {
#        forward = "none"
#      }
#    }
#
#    viewer_protocol_policy = "redirect-to-https"
#    min_ttl                = 0
#    default_ttl            = 86400
#    max_ttl                = 31536000
#
#    lambda_function_association {
#      event_type   = "origin-request"
#      include_body = false
#      lambda_arn   = "arn:aws:lambda:us-east-1:191669008337:function:serverlessrepo-standard-r-StandardRedirectsForClou-9U6H7EG2RX95:1"
#    }
#  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
      locations        = []
    }
  }

  viewer_certificate {
    acm_certificate_arn            = aws_acm_certificate.jasonraimondi_com.arn
    cloudfront_default_certificate = false
    minimum_protocol_version       = "TLSv1.2_2018"
    ssl_support_method             = "sni-only"
  }

  custom_error_response {
    error_caching_min_ttl = 300
    error_code            = 400
    response_code         = 404
    response_page_path    = "/404.html"
  }

  custom_error_response {
    error_caching_min_ttl = 300
    error_code            = 403
    response_code         = 404
    response_page_path    = "/404.html"
  }
}
```

Add the linked cloudflare record

```terraform
resource "cloudflare_record" "jasonraimondi_com_root" {
  zone_id = cloudflare_zone.jasonraimondi_com.id
  name    = "@"
  value   = aws_acm_certificate.jasonraimondi_com.domain_name
  type    = "CNAME"
  ttl     = 1
}
```
## Enabling https on s3 hosted site with Cloudfront

### Https using Amazon Certificate Manager

We will need to create an [aws_acm_certificate](https://www.terraform.io/docs/providers/aws/r/acm_certificate.html) using the Amazon Certificate Manager provider. We are also going to need to add a [cloudflare_record](https://www.terraform.io/docs/providers/cloudflare/r/record.html) DNS record that will allow ACM to sign the certificate.

```terraform
resource "aws_acm_certificate" "jasonraimondi_com" {
  provider          = aws.east_1
  domain_name       = "jasonraimondi.com"
  validation_method = "DNS"
}

resource "cloudflare_record" "jasonraimondi_com" {
  zone_id = cloudflare_zone.jasonraimondi_com.id
  name    = aws_acm_certificate.jasonraimondi_com.domain_validation_options.0.resource_record_name
  value   = trimsuffix(aws_acm_certificate.jasonraimondi_com.domain_validation_options.0.resource_record_value, ".")
  type    = aws_acm_certificate.jasonraimondi_com.domain_validation_options.0.resource_record_type
  ttl     = 1
}
```
