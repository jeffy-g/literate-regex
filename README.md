![LICENSE](https://img.shields.io/badge/Lisence-Apache2.0-blue.svg)
[![npm version](https://badge.fury.io/js/literate-regex.svg)](https://badge.fury.io/js/literate-regex)
![npm bundle size](https://img.shields.io/bundlephobia/min/literate-regex?style=plastic)
![npm](https://img.shields.io/npm/dm/literate-regex.svg?style=plastic)
![npms.io](https://img.shields.io/npms-io/maintenance-score/literate-regex)

# literate-regex

A literate, typed JavaScript regex toolkit — powered by TypeScript.

> Write regex like a human. Ship it like a machine.


## ✨ Motivation

Regular expressions are absurdly powerful — a tiny automaton you can carry in your pocket.  
But once a regex grows beyond “a few tokens and a prayer”, it becomes:

- hard to read
- easy to break
- painful to maintain

This library exists to keep regexes **literate**.

Write a multi-line, commented, PCRE-style regex source (with `#` notes), then normalize it into a compact JavaScript `RegExp.source` **while preserving the normalized source as a TypeScript string literal type**.

That gives you two superpowers:

1. **Human-friendly editing** (readable formatting + comments)
2. **Machine-friendly safety** (typed, normalized sources that flow through your codebase)

In short: fewer regex jump-scares, more confidence.

### Before
```ts
const re = /^(?:\s*\/\*\*\s+|\s+\*?\s+)(?:(?=@(...))|...)/gm;
```

### After
```ts
const RE_SOURCE = `
/^         # start
(?: ... )  # jsdoc start
...        # more notes
/gm` as const;

const re = compilePCREStyleRegExpLiteral(RE_SOURCE);
```

---

## ✨ Features

- **PCRE-ish style regex source**:
  - multi-line formatting
  - `# ...` line comments
  - `\#` escape for literal `#`
- **Type-level normalization**:
  - derive normalized JS `RegExp.source` as a string literal type
- **Optional global augmentation**:
  - opt-in only (`import "literate-regex/global"`)
- Designed to reduce TypeScript instantiation pain:
  - line-oriented normalization (helps avoid `ts(2589)` compared to naive full-string scanning)

---

## 📦 Install

```bash
npm i literate-regex
# or
pnpm add literate-regex
# or
yarn add literate-regex
```

---

## 🚀 Quick Start

```ts
import { PCREStyleToJsRegExpSource } from "literate-regex";

// Only those who want to expand globally
import "literate-regex/global";
```

---

## 🧠 Type-level normalization

### 1) Write a readable PCRE-style source

* `#` starts a line comment (unless escaped)
* `\#` is kept as a literal `#`
* whitespace characters are stripped during normalization

```ts
import type { PCREStyleToJsRegExpSource } from "./literate-regex";

// sample 1
const RE_SOURCE = `
^           # start
(?:\\#\\w+) # literal "#"
\\s+        # whitespace
` as const;

// type JsSource = "^(?:#\\w+)\\s+" 
type JsSource = PCREStyleToJsRegExpSource<typeof RE_SOURCE>;
```

> Tip: You must use `as const` to preserve the source as a string literal type.

---

## 🔧 Runtime normalization (optional)

`PCREStyleToJsRegExpSource<...>` is purely type-level.
If you also normalize at runtime, mirror the same rules:

```ts
import { normalizePCREStyleSource } from "literate-regex";
// import type { PCREStyleToJsRegExpSource } from "literate-regex";

// sample 2
const src = `
^        # start
\\#\\w+  # literal
` as const;

// '^#\\w+'
// const normalized: "^#\\w+"
const normalized = normalizePCREStyleSource(src);
```

## 🔧 Runtime creation Compile PCRE Style RegExpLiteral

```ts
import {
  TypedRegExp,
  // normalizePCREStyleSource,
  compilePCREStyleRegExpLiteral,
} from "literate-regex";
import type {
  RegExpLiteralParts,
  PCREStyleToJsRegExpSource,
  RegExpExecArrayFixedPretty,
  ReplacerFunctionSignature,
} from "literate-regex";

//
// sample of compilePCREStyleRegExpLiteral
//
const pcreStyledRegex = `/
(\\(\\?\#[\\s\\S]*?(?<!\\\\)\\)(?=\\s*$|.))         # multi line comment
|
(?:^(?:\\s+|))?(?<![\\\\])(\\#(?:\\s|[\\s\\S])*?$)  # single line comment
|
(?<regexFragment>
  (?:^\\s+)?(?:[^\\s]+)
)+                                                  # regex flagment
|
([\\r|\\r\\n|\\n]+|[\\x20\\t]+(?=$)?)               # whitespaces
/gm`;

const jsRegex = compilePCREStyleRegExpLiteral(pcreStyledRegex);

type TPcreStyledRegex = typeof pcreStyledRegex;
type TJsRegexSource = PCREStyleToJsRegExpSource<TPcreStyledRegex>;
type TJsRegexLiteralParts = RegExpLiteralParts<TJsRegexSource>;

type TJsRegexExecArray = RegExpExecArrayFixedPretty<
  TypedRegExp<TJsRegexLiteralParts["pattern"]>
>;
type TJsRegexStringReplacer = ReplacerFunctionSignature<
  TypedRegExp<TJsRegexLiteralParts["pattern"]>
>;
let m = jsRegex.exec(pcreStyledRegex);
type Test0 = TJsRegexExecArray extends typeof m ? true : false;
type Test1 = typeof m extends TJsRegexExecArray ? true : false;

const replacer: TJsRegexStringReplacer = (...args) => "";
pcreStyledRegex.replace(jsRegex, replacer);
pcreStyledRegex.replace(jsRegex, "");
```

---

## 🌍 Global augmentation (opt-in)

This package provides an optional global augmentation entry:

```ts
import "literate-regex/global";
```

This is intentionally **opt-in** to avoid unexpected type pollution across projects.

---

## ⚠️ Notes & limitations

* This is **not a full PCRE parser**. It focuses on:

  * line comments (`# ...`)
  * escaping `\#`
  * whitespace stripping
* Very large type-level inputs may still hit TS limits depending on your environment.
  If that happens, split your regex source into smaller pieces.

---

## 📚 References

This library’s whitespace set is based on the ECMAScript definition used by RegExp `\s`
(WhiteSpace ∪ LineTerminator).

- ECMA-262: White Space (Table 33)
  https://tc39.es/ecma262/#sec-white-space
- ECMA-262: Line Terminators (Table 34)
  https://tc39.es/ecma262/#sec-line-terminators
- MDN: RegExp character classes (`\s` equivalence)
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions/Character_classes

---

## 📜 License

Released under the `Apache-2.0` License.  
See [LICENSE](./LICENSE) for details.
