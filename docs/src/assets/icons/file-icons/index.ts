import type { FC, SVGProps } from "react";
import DefaultFile from "./default_file.svg";
import DefaultFolder from "./default_folder.svg";
import DefaultFolderOpened from "./default_folder_opened.svg";
import FileTypeCss from "./file_type_css.svg";
import FileTypeHtml from "./file_type_html.svg";
import FileTypeJson from "./file_type_json.svg";
import FileTypeLightJs from "./file_type_light_js.svg";
import FileTypeMarkdown from "./file_type_markdown.svg";
import FileTypeNpm from "./file_type_npm.svg";
import FileTypeReactjs from "./file_type_reactjs.svg";
import FileTypeReactts from "./file_type_reactts.svg";
import FileTypeText from "./file_type_text.svg";
import FileTypeTypescript from "./file_type_typescript.svg";
import FileTypeTypescriptdef from "./file_type_typescriptdef.svg";
import FileTypeVite from "./file_type_vite.svg";
import FileTypeVue from "./file_type_vue.svg";
import FolderTypeSrc from "./folder_type_src.svg";
import FolderTypeSrcOpened from "./folder_type_src_opened.svg";

type SvgComponent = FC<SVGProps<SVGSVGElement>>;

export const ICON_MAP: Record<string, SvgComponent> = {
  "default_file.svg": DefaultFile,
  "default_folder.svg": DefaultFolder,
  "default_folder_opened.svg": DefaultFolderOpened,
  "file_type_css.svg": FileTypeCss,
  "file_type_html.svg": FileTypeHtml,
  "file_type_json.svg": FileTypeJson,
  "file_type_light_js.svg": FileTypeLightJs,
  "file_type_markdown.svg": FileTypeMarkdown,
  "file_type_npm.svg": FileTypeNpm,
  "file_type_reactjs.svg": FileTypeReactjs,
  "file_type_reactts.svg": FileTypeReactts,
  "file_type_text.svg": FileTypeText,
  "file_type_typescript.svg": FileTypeTypescript,
  "file_type_typescriptdef.svg": FileTypeTypescriptdef,
  "file_type_vite.svg": FileTypeVite,
  "file_type_vue.svg": FileTypeVue,
  "folder_type_src.svg": FolderTypeSrc,
  "folder_type_src_opened.svg": FolderTypeSrcOpened,
};
