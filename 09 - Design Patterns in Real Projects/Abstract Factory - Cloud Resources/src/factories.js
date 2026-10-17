'use strict';
// ABSTRACT FACTORY — cloud resource families. Each concrete factory builds ONE
// consistent family (compute + storage), so you never mix AWS compute with GCP
// storage by accident.

// ---- AWS family ----
class Ec2Instance { provision() { return 'EC2 t3.medium instance'; } }
class S3Bucket    { provision() { return 'S3 bucket'; } }

// ---- GCP family ----
class GceInstance { provision() { return 'GCE e2-medium instance'; } }
class GcsBucket   { provision() { return 'GCS bucket'; } }

// ---- Concrete factories (one consistent family each) ----
class AwsFactory {
  createCompute() { return new Ec2Instance(); }
  createStorage() { return new S3Bucket(); }
  name() { return 'AWS'; }
}
class GcpFactory {
  createCompute() { return new GceInstance(); }
  createStorage() { return new GcsBucket(); }
  name() { return 'GCP'; }
}

module.exports = { Ec2Instance, S3Bucket, GceInstance, GcsBucket, AwsFactory, GcpFactory };
