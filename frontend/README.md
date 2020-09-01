# Serverless: What, how and why?

More people are beginning to see serverless as the future of software architecture. And why not? There is a significant amount of appeal in the idea of developing an application without having to worry about the servers.

Those of you who still have no idea what serverless is, or what it can do – don’t worry. Despite the hype, it’s still a growing trend, and there’s time to get into it via the many meetups and workshops that pop up in cities around the world.

Here’s a basic guide I’ve put together to help answer some common questions about serverless.

## What does serverless really mean?

The term “serverless” is a bit of a misnomer. Serverless isn’t 100% serverless, or even close. There are still servers, virtual machines, operating systems, containers, and runtimes, you just never have to manage them.

When people refer to serverless computing casually, most of the time they are referring to Functions as a Service (FaaS), and a handful of other 3rd party services which provide either data persistence or data transformation features.

The FaaS part of serverless computing is built on top of all existing and conventional abstraction layers. In the case of AWS Lambda (the most widely known FaaS option), it goes like this:

1. Physical hardware runs a virtual machine (EC2).
2. The virtual machine then runs an operating system (such as Linux).
3. The operating system runs a container (Firecracker). Containers are a way of standardising application packaging, making it easy to operate an application without dealing with ordinary incompatibility problems.
4. The container runs a runtime, which then starts executing your code.

During this process, a whole lot of other load-balancing and scaling magic happens in the Lambda control plane, but you never see or need to deal with those complexities.

## But wait, what about cloud computing?

You might have heard of cloud computing spoken about alongside serverless. Cloud computing isn’t the same as serverless. It is the platform and abstraction in which serverless computing is achieved.

Cloud computing is a generic term describing an abstraction over remote physical hardware that is controlled through the use of software. The term cloud computing does not describe specifically how people manage, organise, and control those remote computing resources, or even specifically what they are or do.

When people describe cloud computing, they typically refer to a common set of attributes that are easily and commonly architected for in-cloud native solutions. These include, but are not limited to:

- On-demand resources
- Pay for what is used
- Elasticity
- Economy of scale
- Software-defined infrastructure

![alt text](https://blog-production-image-bucket.s3-accelerate.amazonaws.com/lambda-logo.png "Lambda logo")

## What are the benefits of serverless computing?

Serverless maximizes all the benefits of the cloud and makes attributes that are desirable in well-architected software systems super easy to achieve.

The benefits of serverless computing are the benefits of the cloud, just without having to deal with the typical architectural challenges of designing for them. These benefits include:

- High availability
- Scalability
- No operational overhead for managing concerns below your layer
- Serverless is immutable
- Encouraged statelessness at the architectural and code level
- Cloud-native service integrations
- A completely code-defined environment
