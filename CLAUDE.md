## Local-model editing rules

- Read the target region immediately before editing.
- Use the shortest unique old_string, normally 1–3 lines.
- Never include Read-tool line numbers in old_string.
- Never call Edit when old_string and new_string are identical.
- Never repeat a failed Edit with the same parameters.
- After one Edit failure, reread and retry once with corrected exact text.
- After two failures, stop and report the intended change.
- Use Write for new files; do not use Edit before a file exists.
- For small Markdown files, prefer one complete Write.
- Use repository-relative paths with forward slashes.
