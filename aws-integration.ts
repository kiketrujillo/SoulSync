// src/utils/aws.ts
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { CloudWatchClient, PutMetricDataCommand } from '@aws-sdk/client-cloudwatch';
import { logger } from './logger';

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
    ? {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
      }
    : undefined // Use EC2 instance role if running on EC2
});

// Initialize CloudWatch client
const cloudWatchClient = new CloudWatchClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
    ? {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
      }
    : undefined // Use EC2 instance role if running on EC2
});

/**
 * Upload a file to S3
 */
export const uploadFileToS3 = async (
  bucketName: string,
  key: string,
  body: Buffer | string,
  contentType?: string
): Promise<string> => {
  try {
    const params = {
      Bucket: bucketName,
      Key: key,
      Body: body,
      ContentType: contentType
    };

    await s3Client.send(new PutObjectCommand(params));
    
    // Return the S3 URL
    return `https://${bucketName}.s3.amazonaws.com/${key}`;
  } catch (error) {
    logger.error('Error uploading file to S3:', error);
    throw new Error('Failed to upload file to S3');
  }
};

/**
 * Retrieve a file from S3
 */
export const getFileFromS3 = async (
  bucketName: string,
  key: string
): Promise<Buffer> => {
  try {
    const params = {
      Bucket: bucketName,
      Key: key
    };

    const response = await s3Client.send(new GetObjectCommand(params));
    
    // Convert ReadableStream to Buffer
    const chunks: Uint8Array[] = [];
    const stream = response.Body as ReadableStream<Uint8Array>;
    const reader = stream.getReader();
    
    let done = false;
    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      if (value) {
        chunks.push(value);
      }
    }
    
    return Buffer.concat(chunks);
  } catch (error) {
    logger.error('Error retrieving file from S3:', error);
    throw new Error('Failed to retrieve file from S3');
  }
};

/**
 * Send custom metrics to CloudWatch
 */
export const sendMetricToCloudWatch = async (
  metricName: string,
  value: number,
  unit: string = 'Count',
  dimensions: { Name: string; Value: string }[] = []
): Promise<void> => {
  try {
    const params = {
      MetricData: [
        {
          MetricName: metricName,
          Value: value,
          Unit: unit,
          Dimensions: dimensions,
          Timestamp: new Date()
        }
      ],
      Namespace: 'SoulSync'
    };

    await cloudWatchClient.send(new PutMetricDataCommand(params));
    logger.debug(`Metric sent to CloudWatch: ${metricName} = ${value} ${unit}`);
  } catch (error) {
    logger.error('Error sending metric to CloudWatch:', error);
    // Don't throw - metrics should not break the application
  }
};

/**
 * Send API request metrics to CloudWatch
 */
export const trackApiMetrics = async (
  endpoint: string,
  statusCode: number,
  responseTime: number
): Promise<void> => {
  try {
    // Track overall API usage
    await sendMetricToCloudWatch('APIRequestCount', 1, 'Count', [
      { Name: 'Endpoint', Value: endpoint },
      { Name: 'StatusCode', Value: statusCode.toString() }
    ]);
    
    // Track response times
    await sendMetricToCloudWatch('APIResponseTime', responseTime, 'Milliseconds', [
      { Name: 'Endpoint', Value: endpoint }
    ]);
    
    // Track errors specifically
    if (statusCode >= 400) {
      await sendMetricToCloudWatch('APIErrorCount', 1, 'Count', [
        { Name: 'Endpoint', Value: endpoint },
        { Name: 'StatusCode', Value: statusCode.toString() }
      ]);
    }
  } catch (error) {
    logger.error('Error tracking API metrics:', error);
    // Don't throw - metrics should not break the application
  }
};

/**
 * Check if the application is running on AWS (EC2)
 */
export const isRunningOnAWS = (): boolean => {
  // EC2 instances have a metadata service
  return Boolean(process.env.AWS_EXECUTION_ENV) || Boolean(process.env.ECS_CONTAINER_METADATA_URI);
};

/**
 * Get AWS deployment configuration
 */
export const getAWSConfig = (): Record<string, string> => {
  return {
    region: process.env.AWS_REGION || 'us-east-1',
    s3Bucket: process.env.S3_BUCKET || 'soulsync-assets',
    cloudwatchEnabled: process.env.CLOUDWATCH_ENABLED || 'false',
    rdsEnabled: process.env.RDS_DB_NAME ? 'true' : 'false',
    elasticacheEnabled: process.env.ELASTICACHE_PRIMARY_ENDPOINT ? 'true' : 'false'
  };
};
