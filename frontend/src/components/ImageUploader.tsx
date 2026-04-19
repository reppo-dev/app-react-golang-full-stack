import axios from "axios";

const ImageUploader = (props: { uploaded: (url: string) => void }) => {
  const upload = async (files: FileList | null) => {
    if (files === null) return;

    const formData = new FormData();
    formData.append("image", files[0]);

    const { data } = await axios.post("/uploads", formData);

    props.uploaded(data.url);
  };
  return (
    <label>
      Upload
      <input type="file" hidden onChange={(e) => upload(e.target.files)} />
    </label>
  );
};

export default ImageUploader;
