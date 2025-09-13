import {
  Image as ImageIcon,
  Description as FileIcon,
} from "@mui/icons-material";
import type { FileDetails } from "../../types/fileDetails";

export type { FileDetails };

export const getFileIcon = (fileType: string) => {
  if (fileType.startsWith("image/")) return ImageIcon;
  return FileIcon;
};

export const isImageFile = (filename: string, type: string) => {
  return (
    type.includes("image") ||
    [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp", ".svg"].some((ext) =>
      filename.toLowerCase().endsWith(ext),
    )
  );
};
