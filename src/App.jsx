import style from "./App.module.css";
import Select from "react-select";
import { useState } from "react";
import axios from "axios";
import downloadFile from "./services/downloadFileService";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const selectOptions = [
  { value: "", label: "Selecione uma opção" },
  { value: "video", label: "Vídeo" },
  { value: "audio", label: "Áudio" },
];

const apiUrl = "http://localhost:8000";

function App() {
  const [downloadLink, setDownloadLink] = useState("");
  const [selectedOption, setSelectedOption] = useState(selectOptions[0]);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(element) {
    element.preventDefault();

    if (!downloadLink || !selectedOption.value) {
      toast.error("Preencha todos os campos!", );
      return;
    }

    const mediaType = selectedOption.value;

    try {
      setIsLoading(true);

      const response = await axios.post(
        `${apiUrl}/api/${mediaType}/download/`,
        { url: downloadLink }
      );
      const { filename, path } = response.data;

      setIsLoading(false);

      await downloadFile(apiUrl, path, filename);

      toast.success("Download feito com sucesso!");
    } catch (error) {
      toast.error(`Ocorreu um erro inesperado: ${error.response.data.msg}`)
    }
  
    setDownloadLink("");
    setIsLoading(false);
    setSelectedOption(selectOptions[0]);
  }

  return (
    <>
      <ToastContainer />
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
