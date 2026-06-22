import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const appRoot = path.resolve(import.meta.dirname, "..", "..");
const coreRoot = path.join(appRoot, "packages", "sdkwork-mail-h5-core");

function read(relativePath: string): string {
  return readFileSync(path.join(appRoot, relativePath), "utf8");
}

function listFiles(root: string, extensions = [".ts", ".tsx"]): string[] {
  if (!existsSync(root)) {
    return [];
  }

  const files: string[] = [];
  for (const entry of readdirSync(root)) {
    const absolute = path.join(root, entry);
    const stat = statSync(absolute);
    if (stat.isDirectory()) {
      if (["node_modules", "dist", "target", "__tests__"].includes(entry)) {
        continue;
      }
      files.push(...listFiles(absolute, extensions));
      continue;
    }

    if (extensions.includes(path.extname(entry))) {
      files.push(absolute);
    }
  }
  return files;
}

function readAll(root: string): string {
  return listFiles(root)
    .map((file) => `\n// ${path.relative(appRoot, file)}\n${readFileSync(file, "utf8")}`)
    .join("\n");
}

describe("Mail h5 architecture contract", () => {
  it("keeps the root H5 app as a thin bootstrap shell", () => {
    const app = read("src/App.tsx");
    const runtime = read("src/bootstrap/runtime.ts");

    expect(app).toContain("HashRouter");
    expect(app).toContain("MailApp");
    expect(app).toContain("AdminApp");
    expect(app).toContain("AppAuthGate");
    expect(app).toContain("mail_APP_HOME_PATH");
    expect(runtime).toContain("createIamRuntime");
  });

  it("wires appbase auth runtime at the app bootstrap layer with h5 platform", () => {
    const authRuntime = read("src/bootstrap/MailAppAuthRuntime.ts");
    const iamRuntime = read("src/bootstrap/iamRuntime.ts");
    const appPackageJson = JSON.parse(readFileSync(path.join(appRoot, "package.json"), "utf8"));
    const corePackageJson = JSON.parse(readFileSync(path.join(coreRoot, "package.json"), "utf8"));

    expect(authRuntime).toContain('platform: "h5"');
    expect(authRuntime).toContain("createSdkworkAppbasePcAuthRuntime");
    expect(iamRuntime).toContain("createMailAppAuthRuntime");
    expect(appPackageJson.dependencies).toMatchObject({
      "@sdkwork/auth-runtime-pc-react": expect.any(String),
      "react-router-dom": expect.any(String),
    });
    expect(corePackageJson.dependencies).not.toHaveProperty("@sdkwork/auth-runtime-pc-react");
  });

  it("protects user Mail routes through AppAuthGate and defers auth UI until H5 auth surface exists", () => {
    const authGate = read("src/AppAuthGate.tsx");
    const loginPage = read("src/MailH5AuthLoginPage.tsx");

    expect(authGate).toContain("mail_IAM_SESSION_CHANGED_EVENT");
    expect(authGate).toContain("MailH5AuthLoginPage");
    expect(authGate).not.toContain("SdkworkIamAuthRoutes");
    expect(loginPage).toContain("buildAppbaseLoginUrl");
    expect(loginPage).not.toMatch(/\/app\/v3\/api\/auth/u);
  });

  it("keeps auth runtime packages out of Mail-h5-core", () => {
    const coreSource = readAll(coreRoot);
    expect(coreSource).not.toContain("@sdkwork/auth-pc-react");
    expect(coreSource).not.toContain("@sdkwork/auth-runtime-pc-react");
  });
});
