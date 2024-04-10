import axios from "axios";

export default async function downloadFile(apiUrl, path, filename) {
  const blobResponse = await axios.get(`${apiUrl}${path}`, { responseType: "blob" });
  const blobUrl = window.URL.createObjectURL(new Blob([blobResponse.data]));

  const downloadFileLink = document.createElement("a");
  downloadFileLink.href = blobUrl;
  downloadFileLink.download = filename;

  document.body.appendChild(downloadFileLink);
  downloadFileLink.click();
  document.body.removeChild(downloadFileLink);
}
