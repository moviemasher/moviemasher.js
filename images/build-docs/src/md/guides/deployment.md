## Deployment

### AWS Movie Masher Container 

<!-- https://moviemasher.com/mm-square.png -->
Add video editing and encoding capabilities to your application with this custom build of FFmpeg 6.0.1 and our open source web components. 

* Unleash creativity with custom fonts, vector shapes, animated fills, compositing, masking, and dynamic sizing/positioning.
* Generate and transcode media files, as well as decode metadata including dimensions, transparency, duration, audio tracks, etc.
* Easily integrate our container into your AWS workflow with support for S3, SQS, and SNS. Develop and deploy custom modules - bespoke asset types, generators, decoders, and even encoders.

The Movie Masher Container includes our suite of open source Typescript libraries that support advanced media handling and video creation. It can be launched into most container environments AWS supports, and be incorporated into a wide variety of workflows. Extensive configuration options control how tasks are discovered and processed. Custom JavaScript modules can be configured to override key processes and add bespoke asset types. 

When no configuration is provided, the container provides unauthenticated access to the Movie Masher API on port 5775. 


Movie Masher also offers an AMI on AWS Marketplace. Please contact support@moviemasher.com for a private offer if you’d like a container or AMI optimized for your particular workflow. 

As an open source project, community support is available on GitHub. Monthly support contracts are also available on our MovieMasher.com site. 


### AWS Movie Masher Container Quick Start

[Amazon ECR interface VPC endpoints](https://docs.aws.amazon.com/AmazonECR/latest/userguide/vpc-endpoints.html)

[Private repository policy examples](https://docs.aws.amazon.com/AmazonECR/latest/userguide/repository-policy-examples.html)

[Amazon ECS task execution IAM role](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_execution_IAM_role.html#task-execution-private-auth)

[AWS managed policies for Amazon Elastic Container Registry](https://docs.aws.amazon.com/AmazonECR/latest/userguide/security-iam-awsmanpol.html#security-iam-awsmanpol-AmazonEC2ContainerRegistryReadOnly)