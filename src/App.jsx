import style from "./App.module.css";
import Select from "react-select";
import { useState } from "react";
import axios from "axios";

const selectOptions = [
  { value: "", label: "Selecione uma opção" },
  { value: "v", label: "Vídeo" },
  { value: "a", label: "Áudio" }
];

const url = "http://localhost:8000";

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

    const mediaType = selectedOption.value === "v" ? "video" : "audio";

    setIsLoading(true);

    const response = await axios.post(
      `${url}/api/${mediaType}/download/`,
      { url: downloadLink },
    );

    setIsLoading(false);

    const downloadPath = response.data.path;

    const blobResponse = await axios.get(`${url}${downloadPath}`, {responseType: 'blob'});
    const blobUrl = window.URL.createObjectURL(new Blob([blobResponse.data]));
    
    const blobLink = document.createElement('a');
    blobLink.href = blobUrl;
    blobLink.setAttribute('download', 'file.mp4');
    document.body.appendChild(blobLink);
    blobLink.click();

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
            onChange={e => setDownloadLink(e.target.value)}
          />
          <Select
            options={selectOptions}
            className={style.select}
            value={selectedOption}
            onChange={setSelectedOption}
          />
          <input className={style.submit} type="submit" value={isLoading ? "Carregando..." : "Download"} />
        </form>
      </main>
    </>
  );
}

export default App;
