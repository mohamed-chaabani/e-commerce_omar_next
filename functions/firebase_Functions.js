import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "../config/firebase";
import generateRandomId from "./generateRandomId";

export const uploadFileToFirebase = async (url, file) => {
  try {
    const fileId = generateRandomId(10);
    const fileRef = ref(storage, `${url}${file.name}-${fileId}`);

    await uploadBytes(fileRef, file);

    const downloadURL = await getDownloadURL(fileRef);

    return downloadURL;
  } catch (error) {
    console.error("Error uploading video to Firebase:", error);
    throw error;
  }
};

export const deleteFileFromFirebase = async (oldUrl) => {
  try {
    const oldFileRef = ref(storage, oldUrl);
    await deleteObject(oldFileRef);
  } catch (error) {
    return console.error(error);
  }
};
