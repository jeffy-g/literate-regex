/*!
// Copyright jeffy-g 2025
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
*/
const NORMALIZE_PCRE_STYLE_REGEX = /(?<!\\)\#\s*.*$|\s+/gm;
export const normalizePCREStyleSource = (src) => {
    return src.replace(NORMALIZE_PCRE_STYLE_REGEX, "").replace(/\\#/g, "#");
};
export const extractJsRegexPartsFromPCREStyleRegExpLiteral = (src) => {
    const normalized = normalizePCREStyleSource(src);
    if (normalized[0] !== "/")
        throw new Error("Expected regex literal to start with '/'");
    const lastSlash = normalized.lastIndexOf("/");
    if (lastSlash <= 0)
        throw new Error("Invalid regex literal: missing trailing '/'");
    const pattern = normalized.slice(1, lastSlash);
    const flags = normalized.slice(lastSlash + 1);
    return { pattern, flags };
};
export const compilePCREStyleRegExpLiteral = (src) => {
    const { pattern, flags } = extractJsRegexPartsFromPCREStyleRegExpLiteral(src);
    return new RegExp(pattern, flags);
};
export const version = "v0.6.2";
