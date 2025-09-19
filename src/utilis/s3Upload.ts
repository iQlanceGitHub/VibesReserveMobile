import { RNS3 } from "react-native-aws3";
import { AWSOptions } from "./appConstant";

export const uploadImageToS3 = async (
  base64: string,
  mimeType: string
): Promise<string> => {
  const extension = mimeType.split("/")[1];
  const file = {
    uri: `data:${mimeType};base64,${base64}`,
    name: `profile_${Date.now()}.${extension}`,
    type: mimeType,
  };

  const options = {
    keyPrefix: "",
    bucket: AWSOptions.bucket,
    region: AWSOptions.region,
    accessKey: AWSOptions.accessKey,
    secretKey: AWSOptions.secretKey,
    successActionStatus: AWSOptions.successActionStatus || 201,
  };

  try {
    const response = await RNS3.put(file, options);
    if (response.status !== 201) {
      console.log("Upload failed:", response);
      throw new Error("Failed to upload image to S3");
    }

    return response.body.postResponse.location;
  } catch (error) {
    console.log("S3 Upload Error:", error);
    throw error;
  }
};

export const uploadFileToS3 = async (
  fileUri: string,
  fileName: string,
  mimeType: string
): Promise<string> => {
  const file = {
    uri: fileUri,
    name: fileName,
    type: mimeType,
  };

  const options = {
    keyPrefix: "",
    bucket: AWSOptions.bucket,
    region: AWSOptions.region,
    accessKey: AWSOptions.accessKey,
    secretKey: AWSOptions.secretKey,
    successActionStatus: AWSOptions.successActionStatus || 201,
  };

  try {
    const response = await RNS3.put(file, options);
    if (response.status !== 201) {
      console.log("Upload failed:", response);
      throw new Error("Failed to upload file to S3");
    }

    return response.body.postResponse.location;
  } catch (error) {
    console.log("S3 Upload Error:", error);
    throw error;
  }
};
