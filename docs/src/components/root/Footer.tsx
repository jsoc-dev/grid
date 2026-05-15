import { Footer as NextraFooter } from "nextra-theme-docs";

export function Footer() {
  return (
    <NextraFooter className="flex-col">
      <div className="flex justify-center">
        © JSOC Dev {new Date().getFullYear()}
      </div>
    </NextraFooter>
  );
}
