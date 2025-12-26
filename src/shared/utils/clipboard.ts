import { writeText, readText } from "@tauri-apps/plugin-clipboard-manager";

export const copyToClipboard = async (text: string): Promise<void> => {
  try {
    await writeText(text);
  } catch (error) {
    throw new Error("No se pudo copiar el texto");
  }
};

export const pasteFromClipboard = async (): Promise<string> => {
  try {
    return await readText();
  } catch (error) {
    throw new Error("No se pudo pegar el texto");
  }
};
