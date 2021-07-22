import AWS from 'aws-sdk'

const storageAPI = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_KEY_ID,
  region: 'ap-southeast-1',
  // params: {
  //   Bucket: `lingoparrot/${process.env.NODE_ENV}`
  // }
})

export const upload = async ({
  name,
  buffer,
  folder,
  length = null,
  type = null,
}) => {
  try {
    const file = await storageAPI
      .upload({
        Key: name,
        ACL: 'public-read',
        Body: buffer,
        ...(length && { ContentLength: length }),
        ...(type && { ContentType: type }),
        Bucket: `lingoparrot/${folder}/${process.env.NODE_ENV}`,
      })
      .promise()
    return file.Location
  } catch (e) {
    throw new Error(`Failed to upload the file: ${e.toString()}`)
  }
}
