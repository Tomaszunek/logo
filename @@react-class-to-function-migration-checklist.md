# React Class → Function Component Migration Progress

This index tracks the migration status of each class component in the codebase.  Update the **Status** column as you work through the migration.

| # | File | Status | Notes |
|---|------|--------|-------|
| 1 | src/components/templates/CommandDescription.tsx | DONE | Migrated to functional component
| 2 | src/components/commandList.tsx | DONE | Migrated to functional component

| 3 | src/components/helperWindow.tsx | DONE | Migrated to functional component

| 4 | src/components/commandEditor.tsx | DONE | Migrated to functional component

| 5 | src/components/helperLayer.tsx | TODO | 
| 6 | src/components/popup.tsx | TODO | 
| 7 | src/components/commandInput.tsx | TODO | 
| 8 | src/components/canvas.tsx | TODO | 
| 9 | src/components/templates/pathwayExample.tsx | TODO | 
|10 | src/components/tutorialPopup.tsx | TODO | 

---

## How to use this table
1. **Pick a component** – start with the first one that has `Status: TODO`.
2. Follow the detailed migration steps in [@react-class-to-function-migration-checklist.md](./@react-class-to-function-migration-checklist.md).
3. Once you have migrated the component, run all relevant tests and verify manually.
4. Commit your changes with a message like `feat: migrate CommandDescription to function component`.
5. Mark the component’s status as **DONE** in this table.
6. Move on to the next component.

---

### Automating the list
You can generate an updated table automatically by running:
```bash
rg "extends React.Component" -l | sed 's#^#| #g' | sed 's#$# | TODO |
#'
```
(Adjust the command for your environment.)

---

**Tip:** Keep this file in sync with your issue tracker or spreadsheet to avoid missing components.
