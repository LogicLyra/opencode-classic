import { plugin } from "bun"

// Solid's production compiler replaces JSX. Tests use hyperscript instead; Bun 1.4's
// standalone Transpiler omits the synthetic imports for automatic JSX, so bind the
// classic factory explicitly rather than leaving generated jsx_* names unresolved.
const transpiler = new Bun.Transpiler({
  loader: "tsx",
  trimUnusedImports: true,
  tsconfig: { compilerOptions: { jsx: "react", jsxFactory: "__solidTestH", jsxFragmentFactory: "__solidTestFragment" } },
})

plugin({
  name: "solid-jsx-runtime",
  setup(build) {
    build.onLoad({ filter: /\.[jt]sx$/ }, async (args) => ({
      contents: `import __solidTestH from "solid-js/h";\nconst __solidTestFragment = (props) => props.children;\n${transpiler.transformSync(await Bun.file(args.path).text())}`,
      loader: "js",
    }))
  },
})
