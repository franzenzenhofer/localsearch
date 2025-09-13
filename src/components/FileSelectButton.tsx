import { useRef } from "react";
import { Button } from "@mui/material";
import { UploadFile as FileIcon } from "@mui/icons-material";

interface FileSelectButtonProps {
  onUpload: (files: File[]) => void;
}

export function FileSelectButton({ onUpload }: FileSelectButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: { target: { files: FileList | null } }) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      onUpload(files);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <Button
        variant="outlined"
        size="large"
        startIcon={<FileIcon />}
        onClick={handleClick}
        sx={{
          py: 2,
          px: 3,
          fontSize: "1rem",
          fontWeight: 600,
          color: "#000000",
          bgcolor: "#FFFFFF",
          borderColor: "#000000",
          borderWidth: 3,
          borderRadius: 0,
        }}
      >
        Select Individual Files
      </Button>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.docx,.txt,.md,.csv,.html,.xlsx,.xls,.pptx,.ppt,.rtf,.odt,.ods,.odp,.json,.xml,.yaml,.yml,.log,.js,.ts,.jsx,.tsx,.py,.java,.cpp,.c,.h,.css,.scss,.sass,.less,.sql,.sh,.bat,.ps1,.rb,.go,.php,.swift,.kt,.dart,.rs,.scala,.clj,.hs,.lua,.r,.m,.pl,.pm,.tcl,.vb,.cs,.fs,.ml,.elm,.ex,.exs,.erl,.nim,.zig,.d,.v,.jl,.cr,.pas,.dpr,.lpr,.ada,.for,.f,.f90,.f95,.cob,.cobol,.asm,.s,.makefile,.dockerfile,.gradle,.maven,.sbt,.cmake,.ninja,.bazel,.buck,.gn,.pro,.pri,.qbs,.vcxproj,.sln,.csproj,.fsproj,.vbproj,.pbxproj,.xcodeproj,.xcworkspace,.package,.cabal,.stack,.rebar,.mix,.cargo,.composer,.package-lock,.yarn,.pipfile,.requirements,.gemfile,.podfile,.cartfile,.brewfile,.zip,.7z,.tar,.gz,.bz2,.xz,.rar,.iso,.dmg,.exe,.msi,.deb,.rpm,.appimage,.flatpak,.snap,.jpg,.jpeg,.png,.gif,.bmp,.tiff,.webp,.svg,.ico,.heic,.avif,.jfif,.pjpeg,.pjp"
        onChange={handleFileSelect}
        style={{ display: "none" }}
      />
    </>
  );
}
