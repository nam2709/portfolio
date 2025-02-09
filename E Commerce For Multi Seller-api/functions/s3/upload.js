import middy from '@middy/core'
import cors from '@middy/http-cors'
import errorLogger from '@middy/error-logger'
import httpErrorHandler from '@middy/http-error-handler'
import httpPartialResponse from '@middy/http-partial-response'
import { S3Client, PutObjectCommand, ObjectCannedACL } from '@aws-sdk/client-s3'
// import { Upload } from '@aws-sdk/lib-storage'
import { v4 } from 'uuid'
import parser from 'lambda-multipart-parser'

import { DynamoDbAdapter } from 'adapters/dynamodb.adapter'

export async function uploadS3(userId, file) {
  const { filename, encoding, contentType: mimetype, content } = file
  const bucketName = process.env.STORAGE_NAME
  const imageId = v4()
  // Extract file extension from the fileName
  const fileExtension = filename.split('.').pop()
  const filePath = `public/${userId}/${imageId}.${fileExtension}`
  const url = `https://${bucketName}.s3.amazonaws.com/${filePath}`

  let params = {
    Bucket: bucketName,
    Key: filePath,
    Body: content,
    ContentType: mimetype,
    ContentDisposition: `inline; filename="${imageId}.${fileExtension}"`,
    ContentEncoding: encoding,
    ACL: ObjectCannedACL.public_read, // 'public-read'
  }

  // console.dir({ upload_s3: params })

  const s3Client = new S3Client()
  const command = new PutObjectCommand(params)

  return await await s3Client
    .send(command)
    .then(res => ({ imageId, filePath, bucketName, url }))
    .catch(error => {
      console.error({ error_upload_file: error.message })
      throw error
    })
}

export async function handleUpload(event) {
  const userId = event.requestContext.authorizer.claims.sub
  const files = await parser.parse(event)

  try {
    const result = await uploadS3(userId, files.files[0])
    console.info({
      message: 'Uploaded file successfully',
      ...result,
    })
    const adapter = new DynamoDbAdapter()
    await adapter
      .create({
        TableName: process.env.TABLE_STORAGE_NAME,
        Item: {
          PK: `USER#${userId}`,
          SK: `FILE#${result.imageId}`,
          imageId: result.imageId,
          userId,
          filePath: result.filePath,
          ACL: 'public-read',
          url: result.url,
          createdAt: new Date().toISOString(),
        },
      })
      .catch(error => {
        console.error({ error_create_db: error.message })
        throw error
      })
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'File uploaded successfully',
        ...result,
      }),
    }
  } catch (error) {
    console.error({ error: error.message })
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    }
  }
}

export const upload = middy(handleUpload)
  .use(cors())
  .use(errorLogger())
  .use(httpErrorHandler())
  .use(httpPartialResponse())
