import { Editor } from "@tinymce/tinymce-react";
import {
  TINYMCE_BASE_URL,
  TINYMCE_SCRIPT_SRC,
} from "../../configs/tinymce.config";
import { theme } from "../../configs/theme.config";

type Props = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  height?: number;
};

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
  height = 400,
}: Props) {
  return (
    <Editor
      tinymceScriptSrc={TINYMCE_SCRIPT_SRC}
      licenseKey="gpl"
      value={value}
      onEditorChange={onChange}
      init={{
        base_url: TINYMCE_BASE_URL,
        suffix: ".min",
        height,
        menubar: false,
        placeholder,
        plugins: [
          "lists",
          "link",
          "image",
          "table",
          "code",
          "autoresize",
          "searchreplace",
          "wordcount",
        ].join(" "),
        toolbar:
          "undo redo | blocks | bold italic underline | alignleft aligncenter alignright | bullist numlist | link image table | code",
        branding: false,
        promotion: false,
        content_style: `body { font-family: ${theme.font}; font-size: 14px; line-height: 1.6; }`,
      }}
    />
  );
}
