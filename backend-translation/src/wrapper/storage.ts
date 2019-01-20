import { storageAPI } from "../api";

export const upload = async ({
  name,
  buffer,
  folder,
  length = null,
  type = null
}) => {
  try {
    const file = await storageAPI
      .upload({
        Key: name,
        ACL: "public-read",
        Body: buffer,
        ...(length && { ContentLength: length }),
        ...(type && { ContentType: type }),
        Bucket: `lingoparrot/${folder}/${process.env.NODE_ENV}`
      })
      .promise();
    return file.Location;
  } catch (e) {
    throw new Error(`Failed to upload the file: ${e.toString()}`);
  }
};
