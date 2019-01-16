import { storageAPI } from "../api/index";

export const upload = async ({
  name,
  buffer,
  folder,
  length = null,
  type = null
}) => {
  // TODO: Wrap this in try catch
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
};
