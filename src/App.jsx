import style from "./App.module.css";
import Select from "react-select";
import { useState } from "react";
import axios from "axios";

const selectOptions = [
  { value: "", label: "Selecione uma opção" },
  { value: "v", label: "Vídeo" },
  { value: "a", label: "Áudio" },
];

const apiUrl = "https://yt-downloader-online-api.onrender.com";

function App() {
  const [downloadLink, setDownloadLink] = useState("");
  const [selectedOption, setSelectedOption] = useState(selectOptions[0]);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(element) {
    element.preventDefault();

    if (!downloadLink || !selectedOption.value) {
      alert("Preencha todos os campos!");
      return;
    }

    try {
      const mediaType = selectedOption.value === "v" ? "video" : "audio";

      setIsLoading(true);

      const response = await axios.post(
        `${apiUrl}/api/${mediaType}/download/`,
        { url: downloadLink }
      );

      setIsLoading(false);
      
      const { filename, path } = response.data;

      const blobResponse = await axios.get(`${apiUrl}${path}`, {
        responseType: "blob",
      });
      const blobUrl = window.URL.createObjectURL(new Blob([blobResponse.data]));

      const downloadFileLink = document.createElement("a");
      downloadFileLink.href = blobUrl;
      downloadFileLink.download = filename;

      document.body.appendChild(downloadFileLink);
      downloadFileLink.click();
      document.body.removeChild(downloadFileLink);
    } catch (e) {
      alert(`Ocorreu um erro inesperado: ${e.stack + e.name + e.message}`);
      console.log(`Ocorreu um erro inesperado: ${e.stack + e.name + e.message}`);
    }
    setDownloadLink("");
    setSelectedOption(selectOptions[0]);
  }

  return (
    <>
      <main className={style.main}>
        <form className={style.form} onSubmit={handleSubmit}>
          <h1>YTDownloader</h1>
          <input
            className={style.link}
            type="text"
            placeholder="Digite o link para download"
            value={downloadLink}
            onChange={(e) => setDownloadLink(e.target.value)}
          />
          <Select
            options={selectOptions}
            className={style.select}
            value={selectedOption}
            onChange={setSelectedOption}
          />
          <input
            className={style.submit}
            type="submit"
            value={isLoading ? "Carregando..." : "Download"}
            disabled={ isLoading }
          />
        </form>
      </main>
    </>
  );
}

export default App;
